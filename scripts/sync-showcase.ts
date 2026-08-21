/**
 * Sync the Showcase collection from Are.na into static files.
 *
 *   npm run sync:showcase
 *
 * Run this MANUALLY, not at build time. It crawls the Are.na group's content
 * feed for channels, keeps the NEWEST NUM_ITEMS blocks of each channel (by when
 * they were connected to it), and writes ONE DIRECTORY PER CHANNEL:
 *
 *   src/content/showcase/{channel-slug}/index.json     <- validated by src/schemas/showcase.ts
 *   src/content/showcase/{channel-slug}/{block-id}.{ext} <- co-located block image
 *
 * index.json holds the channel's blocks inline, so reading the collection needs
 * no grouping: one entry per channel, `entry.data.blocks` is its blocks.
 *
 * Everything is fetched FIRST, then src/content/showcase is reconciled against
 * that result: images already on disk are reused (moved, if their block changed
 * channel), only missing ones are downloaded, and anything not in the result —
 * dropped channels, dropped blocks' images — is deleted. So no unused files are
 * left behind and no image is downloaded twice.
 *
 * Every image is capped at MAX_IMAGE_PX on its longest edge, on download and on
 * re-check of files kept from an earlier sync.
 *
 * Blocks that sit loose in the group feed (outside any channel) are ignored.
 * The collection is hidden in Decap, and read-only there (see src/schemas/showcase.ts).
 *
 * Auth is optional: public v3 endpoints work unauthenticated. Set ARENA_TOKEN
 * to raise the API rate limit from 30 req/min (anonymous) to 300 req/min.
 * Get a token at https://dev.are.na/oauth/applications.
 */
import {
  mkdir,
  writeFile,
  readFile,
  readdir,
  rename,
  rm,
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const GROUP_SLUG = "processing-foundation-huqbpzwpbqg";
const API = "https://api.are.na/v3";
const OUT_DIR = fileURLToPath(
  new URL("../src/content/showcase", import.meta.url),
);

const TOKEN = process.env.ARENA_TOKEN;

// Are.na caps anonymous requests at 30/min and authenticated at 300/min. Space
// out API calls to stay comfortably under the applicable limit (10% headroom).
// Only api.are.na calls are throttled; image downloads hit separate CDN hosts.
const RATE_PER_MIN = TOKEN ? 300 : 30;
const API_INTERVAL_MS = Math.ceil(60_000 / (RATE_PER_MIN * 0.9));

const IMAGE_CONCURRENCY = 8;

// Maximum number of blocks to keep per channel.
const NUM_ITEMS = 10;

// Longest edge, in pixels, an image on disk may have. Anything larger is
// downscaled (aspect ratio preserved); smaller images are left untouched.
const MAX_IMAGE_PX = 1200;

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
  created_at?: string;
  /** Present on channel contents: when/where this block was connected. */
  connection?: { position?: number; connected_at?: string } | null;
  source?: { url?: string | null } | null;
  description?: { markdown?: string | null; plain?: string | null } | null;
  image?: ArenaImage | null;
}
interface ContentsResponse {
  data: ArenaItem[];
  meta: { has_more_pages?: boolean; next_page?: number | null };
}

// A block staged for writing, plus the remote image still to download.
interface BlockRecord {
  data: {
    id: number;
    title?: string;
    blockUrl: string;
    sourceUrl?: string;
    description?: string;
  };
  imageUrl: string | null;
  /** Co-located image path once downloaded (e.g. "./123.jpg"). */
  image?: string;
}

// A channel staged for writing: one directory, one index.json.
interface ChannelRecord {
  name: string;
  slug: string;
  blocks: BlockRecord[];
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
      const backoff =
        Number.isFinite(retryAfter) && retryAfter > 0
          ? retryAfter * 1000
          : 2000 * (attempt + 1);
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
    const res = await apiFetch<ContentsResponse>(
      `${baseUrl}${sep}per=100&page=${page}`,
    );
    items.push(...(res.data ?? []));
    if (!res.meta?.has_more_pages || !res.meta?.next_page) break;
    page = res.meta.next_page;
  }
  return items;
}

function isChannel(item: ArenaItem): boolean {
  return item.base_type === "Channel" || item.type === "Channel";
}

// Newest first: when the block was connected to the channel, falling back to
// its connection position and then to when the block itself was created. The v3
// API already returns contents newest-connection-first, but sorting explicitly
// means the NUM_ITEMS cut never depends on that default.
function newestFirst(a: ArenaItem, b: ArenaItem): number {
  const connectedAt = (item: ArenaItem) =>
    Date.parse(item.connection?.connected_at ?? "") || 0;
  const createdAt = (item: ArenaItem) => Date.parse(item.created_at ?? "") || 0;
  return (
    connectedAt(b) - connectedAt(a) ||
    (b.connection?.position ?? 0) - (a.connection?.position ?? 0) ||
    createdAt(b) - createdAt(a)
  );
}

function toRecord(item: ArenaItem): BlockRecord {
  const data: BlockRecord["data"] = {
    id: item.id,
    blockUrl: `https://www.are.na/block/${item.id}`,
  };
  if (item.title) data.title = item.title;
  if (item.source?.url) data.sourceUrl = item.source.url;
  const description = item.description?.markdown ?? item.description?.plain;
  if (description) data.description = description;
  // Prefer the bounded `large` variant; fall back to the original.
  const imageUrl = item.image
    ? (item.image.large?.src ?? item.image.src ?? null)
    : null;
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

// Downscale a raster image so its longest edge is at most MAX_IMAGE_PX,
// re-encoding in the same format. Returns the original buffer untouched when the
// image already fits, is a vector (SVG has no pixel size to cap), or can't be
// read by sharp — the caller reports that as a failure to cap.
async function fitToMax(
  buf: Buffer,
  ext: string,
  label: string,
): Promise<Buffer> {
  if (ext === "svg") return buf;

  // Measure a single frame: `pageHeight` is one frame's height even for
  // animated input, and reading unanimated keeps a long GIF's stacked strip from
  // tripping sharp's input pixel limit.
  const meta = await sharp(buf).metadata();
  const width = meta.width ?? 0;
  const height = meta.pageHeight ?? meta.height ?? 0;
  if (!width || !height) return buf;
  if (width <= MAX_IMAGE_PX && height <= MAX_IMAGE_PX) return buf;

  // Resizing an animated GIF has to load every frame, which can exceed the
  // default pixel limit; these are our own fetched files, so lift it.
  const resized = await sharp(buf, {
    animated: ext === "gif",
    limitInputPixels: false,
  })
    .resize({
      width: MAX_IMAGE_PX,
      height: MAX_IMAGE_PX,
      fit: "inside",
      withoutEnlargement: true,
    })
    .toBuffer();
  console.log(`  resized ${label}: ${width}×${height} → max ${MAX_IMAGE_PX}px`);
  return resized;
}

interface CapResult {
  buf: Buffer;
  resized: boolean;
  /** True when the image is over the cap but sharp couldn't downscale it. */
  failed: boolean;
}

// fitToMax, but reporting failures instead of throwing — one unreadable image
// shouldn't abort a whole sync, though it must not pass silently either.
async function capImage(
  buf: Buffer,
  ext: string,
  label: string,
): Promise<CapResult> {
  try {
    const capped = await fitToMax(buf, ext, label);
    return { buf: capped, resized: capped !== buf, failed: false };
  } catch (err) {
    console.warn(
      `  ⚠ could not cap ${label} at ${MAX_IMAGE_PX}px: ${(err as Error).message}`,
    );
    return { buf, resized: false, failed: true };
  }
}

// Download a block's image into its channel directory as {block-id}.{ext},
// capped at MAX_IMAGE_PX. Returns the co-located filename plus how the cap went,
// or null if the block has no image / the download failed.
async function downloadImage(
  dir: string,
  id: number,
  url: string | null,
): Promise<{ file: string; resized: boolean; failed: boolean } | null> {
  if (!url) return null;

  const res = await fetch(url);
  if (!res.ok) {
    console.warn(`  image ${res.status} for ${url}`);
    return null;
  }
  const ct =
    res.headers.get("content-type")?.split(";")[0]?.trim().toLowerCase() ?? "";
  const ext = EXT_BY_TYPE[ct] ?? extFromUrl(url) ?? "jpg";
  const file = `${id}.${ext}`;
  const cap = await capImage(Buffer.from(await res.arrayBuffer()), ext, file);

  await writeFile(path.join(dir, file), cap.buf);
  return { file, resized: cap.resized, failed: cap.failed };
}

// Cap an image already on disk, rewriting it in place only if it was too big.
// Keeps the MAX_IMAGE_PX guarantee true for files kept from an earlier sync.
async function capFileOnDisk(
  filePath: string,
): Promise<{ resized: boolean; failed: boolean }> {
  const ext = path.extname(filePath).slice(1).toLowerCase();
  const cap = await capImage(
    await readFile(filePath),
    ext,
    path.basename(filePath),
  );
  if (cap.resized) await writeFile(filePath, cap.buf);
  return { resized: cap.resized, failed: cap.failed };
}

// Run tasks with a bounded concurrency pool.
async function pool<T>(
  items: T[],
  limit: number,
  worker: (item: T, i: number) => Promise<void>,
): Promise<void> {
  let cursor = 0;
  const runners = Array.from(
    { length: Math.min(limit, items.length) },
    async () => {
      while (cursor < items.length) {
        const i = cursor++;
        await worker(items[i], i);
      }
    },
  );
  await Promise.all(runners);
}

async function main() {
  console.log(`Syncing showcase from Are.na group "${GROUP_SLUG}"`);
  console.log(`  auth: ${TOKEN ? "yes (300 req/min)" : "no (30 req/min)"}`);

  // Crawl the group feed, recursing into every nested channel. Only blocks that
  // live inside a channel are kept — loose blocks in the group feed are skipped
  // (`channel` is undefined at that level). A block can appear in more than one
  // channel; we want the most SPECIFIC one to win, so at any level we descend
  // into nested channels first and only then let the remaining loose blocks
  // claim an id. Each channel keeps its NEWEST NUM_ITEMS blocks. Channel cycles
  // are guarded with a visited set.
  const crawled: ChannelRecord[] = [];
  const claimed = new Set<number>();
  const visitedChannels = new Set<string>();
  let duplicates = 0;
  let skippedForLimit = 0;

  async function collect(items: ArenaItem[], channel?: ChannelRecord) {
    for (const item of items.filter(isChannel)) {
      if (!item.slug || visitedChannels.has(item.slug)) continue;
      visitedChannels.add(item.slug);
      console.log(`  → channel "${item.title ?? item.slug}"`);
      const sub = await fetchAllContents(
        `${API}/channels/${item.slug}/contents`,
      );
      const record: ChannelRecord = {
        name: item.title ?? item.slug,
        slug: item.slug,
        blocks: [],
      };
      crawled.push(record);
      await collect(sub, record);
    }

    if (!channel) return;

    for (const item of items.filter((i) => !isChannel(i)).sort(newestFirst)) {
      if (claimed.has(item.id)) {
        duplicates++;
        continue;
      }
      if (channel.blocks.length >= NUM_ITEMS) {
        skippedForLimit++;
        continue;
      }
      claimed.add(item.id);
      channel.blocks.push(toRecord(item));
    }
  }

  const feed = await fetchAllContents(`${API}/groups/${GROUP_SLUG}/contents`);
  await collect(feed);

  // Channels that contributed no blocks would only produce empty entries.
  const channels = crawled.filter((c) => c.blocks.length > 0);
  console.log(
    `Found ${claimed.size} blocks across ${channels.length} channel(s), max ${NUM_ITEMS} per channel ` +
      `(${duplicates} multi-channel duplicates resolved to their most specific channel, ` +
      `${skippedForLimit} skipped over the per-channel limit, ` +
      `${crawled.length - channels.length} empty channel(s) dropped).`,
  );

  // --- Reconcile the crawl against what's already on disk. ------------------
  // Snapshot every existing channel directory, and index the block images in
  // them by block id so a block that moved between channels keeps its file.
  await mkdir(OUT_DIR, { recursive: true });
  const filesBySlug = new Map<string, string[]>();
  const imageOnDisk = new Map<number, { slug: string; file: string }>();
  for (const entry of await readdir(OUT_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const files = await readdir(path.join(OUT_DIR, entry.name));
    filesBySlug.set(entry.name, files);
    for (const file of files) {
      const id = /^(\d+)\./.exec(file);
      if (id) imageOnDisk.set(Number(id[1]), { slug: entry.name, file });
    }
  }

  for (const channel of channels) {
    await mkdir(path.join(OUT_DIR, channel.slug), { recursive: true });
  }

  // Reuse or move what we already have; whatever's left needs downloading.
  const toDownload: { channel: ChannelRecord; block: BlockRecord }[] = [];
  const toRecheck: string[] = [];
  const movedFrom = new Set<string>();
  let reused = 0;
  let moved = 0;

  for (const channel of channels) {
    for (const block of channel.blocks) {
      // No image on Are.na (any longer): leave `block.image` unset so a file
      // from an earlier sync gets pruned below.
      if (!block.imageUrl) continue;

      const existing = imageOnDisk.get(block.data.id);
      if (!existing) {
        toDownload.push({ channel, block });
        continue;
      }
      if (existing.slug !== channel.slug) {
        await rename(
          path.join(OUT_DIR, existing.slug, existing.file),
          path.join(OUT_DIR, channel.slug, existing.file),
        );
        movedFrom.add(`${existing.slug}/${existing.file}`);
        moved++;
      } else {
        reused++;
      }
      block.image = `./${existing.file}`;
      toRecheck.push(path.join(OUT_DIR, channel.slug, existing.file));
    }
  }

  let downloaded = 0;
  let resized = 0;
  let capFailed = 0;
  await pool(toDownload, IMAGE_CONCURRENCY, async ({ channel, block }) => {
    const image = await downloadImage(
      path.join(OUT_DIR, channel.slug),
      block.data.id,
      block.imageUrl,
    );
    if (image) {
      block.image = `./${image.file}`;
      downloaded++;
      if (image.resized) resized++;
      if (image.failed) capFailed++;
    }
  });

  // Images kept from an earlier sync predate this cap (or the cap changed), so
  // re-check them too — a no-op once every file already fits.
  await pool(toRecheck, IMAGE_CONCURRENCY, async (filePath) => {
    const cap = await capFileOnDisk(filePath);
    if (cap.resized) resized++;
    if (cap.failed) capFailed++;
  });

  // Write one index.json per channel.
  for (const channel of channels) {
    const json = {
      name: channel.name,
      slug: channel.slug,
      channelUrl: `https://www.are.na/channel/${channel.slug}`,
      blocks: channel.blocks.map(({ data, image }) => ({
        ...data,
        ...(image ? { image } : {}),
      })),
    };
    await writeFile(
      path.join(OUT_DIR, channel.slug, "index.json"),
      JSON.stringify(json, null, 2) + "\n",
    );
  }

  // Delete whatever the crawl didn't account for: channel directories that are
  // gone from Are.na, and files for blocks a channel no longer keeps (images
  // moved to another channel already left, so they're skipped, not "deleted").
  const kept = new Map(
    channels.map((c) => [
      c.slug,
      new Set([
        "index.json",
        ...c.blocks.flatMap((b) => (b.image ? [b.image.slice(2)] : [])),
      ]),
    ]),
  );
  let prunedDirs = 0;
  let prunedFiles = 0;
  for (const [slug, files] of filesBySlug) {
    const keep = kept.get(slug);
    if (!keep) {
      await rm(path.join(OUT_DIR, slug), { recursive: true, force: true });
      prunedDirs++;
      continue;
    }
    for (const file of files) {
      if (keep.has(file) || movedFrom.has(`${slug}/${file}`)) continue;
      await rm(path.join(OUT_DIR, slug, file), {
        recursive: true,
        force: true,
      });
      prunedFiles++;
    }
  }

  const blockCount = channels.reduce((n, c) => n + c.blocks.length, 0);
  console.log(
    `Done: ${channels.length} channel(s), ${blockCount} blocks — ` +
      `${downloaded} image(s) downloaded, ${reused} reused from disk, ${moved} moved between channels, ` +
      `${resized} downscaled to ${MAX_IMAGE_PX}px; ` +
      `deleted ${prunedDirs} stale channel dir(s) and ${prunedFiles} unused file(s).`,
  );
  if (capFailed) {
    console.warn(
      `⚠ ${capFailed} image(s) are over ${MAX_IMAGE_PX}px and could not be resized (see warnings above).`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
