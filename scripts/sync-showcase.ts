/**
 * Sync the Showcase collection from Are.na into static files.
 *
 *   npm run sync:showcase          # incremental (skips already-downloaded images)
 *   npm run sync:showcase -- --force   # re-download every image
 *
 * Run this MANUALLY, not at build time. It crawls the Are.na group's content
 * feed plus every nested channel and writes one directory per block:
 *
 *   src/content/showcase/{block-id}/index.json   <- validated by src/schemas/showcase.ts
 *   src/content/showcase/{block-id}/image.{ext}  <- co-located grid image
 *
 * Blocks that no longer exist on Are.na have their directories pruned. The
 * collection is intentionally absent from Decap (see src/schemas/showcase.ts).
 *
 * Auth is optional: public v3 endpoints work unauthenticated. Set ARENA_TOKEN
 * to raise the API rate limit from 30 req/min (anonymous) to 300 req/min.
 * Get a token at https://dev.are.na/oauth/applications.
 */
import { mkdir, writeFile, readdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const GROUP_SLUG = "processing-foundation-huqbpzwpbqg";
const API = "https://api.are.na/v3";
const OUT_DIR = fileURLToPath(new URL("../src/content/showcase", import.meta.url));

const TOKEN = process.env.ARENA_TOKEN;
const FORCE = process.argv.includes("--force");

// Are.na caps anonymous requests at 30/min and authenticated at 300/min. Space
// out API calls to stay comfortably under the applicable limit (10% headroom).
// Only api.are.na calls are throttled; image downloads hit separate CDN hosts.
const RATE_PER_MIN = TOKEN ? 300 : 30;
const API_INTERVAL_MS = Math.ceil(60_000 / (RATE_PER_MIN * 0.9));

const IMAGE_CONCURRENCY = 8;

// --- Minimal typing of the Are.na v3 shapes we consume. ---------------------
interface ArenaImageVariant {
  src?: string;
}
interface ArenaImage extends ArenaImageVariant {
  large?: ArenaImageVariant;
  filename?: string;
}
interface ArenaItem {
  id: number;
  base_type?: string;
  type?: string;
  slug?: string;
  title?: string | null;
  source?: { url?: string | null } | null;
  description?: { markdown?: string | null; plain?: string | null } | null;
  image?: ArenaImage | null;
}
interface ContentsResponse {
  data: ArenaItem[];
  meta: { has_more_pages?: boolean; next_page?: number | null };
}
interface GroupResponse {
  name: string;
}

// A block staged for writing.
interface BlockRecord {
  data: {
    id: number;
    title?: string;
    channelName: string;
    channelSlug?: string;
    blockUrl: string;
    sourceUrl?: string;
    description?: string;
  };
  imageUrl: string | null;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// --- Rate-limited API fetch with backoff on 429/5xx. ------------------------
let lastApiCall = 0;
async function apiFetch<T>(url: string): Promise<T> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const wait = Math.max(0, lastApiCall + API_INTERVAL_MS - Date.now());
    if (wait) await sleep(wait);
    lastApiCall = Date.now();

    const res = await fetch(url, {
      headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {},
    });
    if (res.ok) return (await res.json()) as T;

    if (res.status === 429 || res.status >= 500) {
      const retryAfter = Number(res.headers.get("retry-after"));
      const backoff = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 2000 * (attempt + 1);
      console.warn(`  ${res.status} on ${url} — backing off ${backoff}ms`);
      await sleep(backoff);
      continue;
    }
    throw new Error(`Are.na API ${res.status} ${res.statusText} for ${url}`);
  }
  throw new Error(`Are.na API kept failing for ${url}`);
}

// Page through a `.../contents` endpoint, returning every item.
async function fetchAllContents(baseUrl: string): Promise<ArenaItem[]> {
  const items: ArenaItem[] = [];
  let page = 1;
  for (;;) {
    const sep = baseUrl.includes("?") ? "&" : "?";
    const res = await apiFetch<ContentsResponse>(`${baseUrl}${sep}per=100&page=${page}`);
    items.push(...(res.data ?? []));
    if (!res.meta?.has_more_pages || !res.meta?.next_page) break;
    page = res.meta.next_page;
  }
  return items;
}

function isChannel(item: ArenaItem): boolean {
  return item.base_type === "Channel" || item.type === "Channel";
}

function toRecord(item: ArenaItem, channelName: string, channelSlug?: string): BlockRecord {
  const data: BlockRecord["data"] = {
    id: item.id,
    channelName,
    blockUrl: `https://www.are.na/block/${item.id}`,
  };
  if (item.title) data.title = item.title;
  if (channelSlug) data.channelSlug = channelSlug;
  if (item.source?.url) data.sourceUrl = item.source.url;
  const description = item.description?.markdown ?? item.description?.plain;
  if (description) data.description = description;
  // Prefer the bounded `large` variant; fall back to the original.
  const imageUrl = item.image ? (item.image.large?.src ?? item.image.src ?? null) : null;
  return { data, imageUrl };
}

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/svg+xml": "svg",
  "image/avif": "avif",
};

function extFromUrl(url: string): string | undefined {
  const m = /\.(jpe?g|png|gif|webp|svg|avif)(?:\?|$)/i.exec(url);
  return m ? m[1].toLowerCase().replace("jpeg", "jpg") : undefined;
}

// Download a block's grid image into its directory, reusing an existing one
// unless --force. Returns the co-located filename (or null if none/failed).
async function ensureImage(dir: string, url: string | null): Promise<string | null> {
  const existing = (await readdir(dir)).find((f) => f.startsWith("image."));
  if (!url) return existing ?? null;
  if (existing && !FORCE) return existing;

  const res = await fetch(url);
  if (!res.ok) {
    console.warn(`  image ${res.status} for ${url}`);
    return existing ?? null;
  }
  const ct = res.headers.get("content-type")?.split(";")[0]?.trim().toLowerCase() ?? "";
  const ext = EXT_BY_TYPE[ct] ?? extFromUrl(url) ?? "jpg";
  const buf = Buffer.from(await res.arrayBuffer());

  // Drop any stale image.* (e.g. extension changed under --force).
  if (existing && existing !== `image.${ext}`) await rm(path.join(dir, existing));
  await writeFile(path.join(dir, `image.${ext}`), buf);
  return `image.${ext}`;
}

// Run tasks with a bounded concurrency pool.
async function pool<T>(items: T[], limit: number, worker: (item: T, i: number) => Promise<void>): Promise<void> {
  let cursor = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const i = cursor++;
      await worker(items[i], i);
    }
  });
  await Promise.all(runners);
}

async function main() {
  console.log(`Syncing showcase from Are.na group "${GROUP_SLUG}"`);
  console.log(`  auth: ${TOKEN ? "yes (300 req/min)" : "no (30 req/min)"}, force images: ${FORCE}`);

  const group = await apiFetch<GroupResponse>(`${API}/groups/${GROUP_SLUG}`);
  const groupName = group.name;

  // Crawl the group feed, recursing into every nested channel. A block can
  // appear both loose in the group feed and inside a named channel; we want the
  // most SPECIFIC channel to win, so within any level we descend into nested
  // channels first and only then let the remaining loose blocks claim an id.
  // Blocks are deduped by id; channel cycles are guarded with a visited set.
  const blocks = new Map<number, BlockRecord>();
  const visitedChannels = new Set<string>();
  let duplicates = 0;

  async function collect(items: ArenaItem[], channelName: string, channelSlug?: string) {
    const channels = items.filter(isChannel);
    const loose = items.filter((item) => !isChannel(item));

    for (const item of channels) {
      if (!item.slug || visitedChannels.has(item.slug)) continue;
      visitedChannels.add(item.slug);
      console.log(`  → channel "${item.title ?? item.slug}"`);
      const sub = await fetchAllContents(`${API}/channels/${item.slug}/contents`);
      await collect(sub, item.title ?? item.slug, item.slug);
    }

    for (const item of loose) {
      if (blocks.has(item.id)) {
        duplicates++;
        continue;
      }
      blocks.set(item.id, toRecord(item, channelName, channelSlug));
    }
  }

  const feed = await fetchAllContents(`${API}/groups/${GROUP_SLUG}/contents`);
  await collect(feed, groupName);
  console.log(
    `Found ${blocks.size} unique blocks across ${visitedChannels.size + 1} channel(s) ` +
      `(${duplicates} multi-channel duplicates resolved to their most specific channel).`,
  );

  // Write each block: directory + index.json + image.
  await mkdir(OUT_DIR, { recursive: true });
  const records = [...blocks.values()];
  let withImage = 0;

  await pool(records, IMAGE_CONCURRENCY, async (record) => {
    const dir = path.join(OUT_DIR, String(record.data.id));
    await mkdir(dir, { recursive: true });
    const image = await ensureImage(dir, record.imageUrl);
    if (image) withImage++;
    const json = { ...record.data, ...(image ? { image } : {}) };
    await writeFile(path.join(dir, "index.json"), JSON.stringify(json, null, 2) + "\n");
  });

  // Prune directories for blocks that no longer exist on Are.na.
  const seen = new Set(records.map((r) => String(r.data.id)));
  let pruned = 0;
  for (const entry of await readdir(OUT_DIR, { withFileTypes: true })) {
    if (entry.isDirectory() && !seen.has(entry.name)) {
      await rm(path.join(OUT_DIR, entry.name), { recursive: true, force: true });
      pruned++;
    }
  }

  console.log(`Done: ${records.length} blocks (${withImage} with images), ${pruned} stale dir(s) pruned.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
