/**
 * Imports the Processing Foundation's Medium export into the blogPosts
 * collection.
 *
 *   node scripts/import-medium.mjs [--limit N] [--no-images] [--dry-run]
 *
 * Reads   scripts/import/processing-foundation-medium-export/posts/*.html
 * Writes  src/content/blogPosts/<slug>/index.md
 *         src/content/blogPosts/<slug>/*.webp            (downloaded images)
 *         scripts/import/authors-report.json             (byline audit)
 *
 * Each post is a directory holding its index.md alongside its own images — the
 * same shape as the people collection, and what this collection's Decap
 * media_folder writes to — so image references are bare filenames.
 *
 * Category per post comes from scripts/import/categories.json, keyed by export
 * filename, so assignments can be reviewed and hand-edited. Re-running is safe:
 * markdown is rewritten from scratch and already-downloaded images are reused.
 *
 * Drafts (no <time class="dt-published">) are skipped — they have no date, and
 * `date` is a required field.
 */
import { mkdir, readFile, writeFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";
import TurndownService from "turndown";
import sharp from "sharp";
import { slugify } from "../src/lib/utils.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const POSTS_DIR = path.join(
  ROOT,
  "scripts/import/processing-foundation-medium-export/posts",
);
const OUT_CONTENT = path.join(ROOT, "src/content/blogPosts");
const CATEGORIES_FILE = path.join(ROOT, "scripts/import/categories.json");
const PEOPLE_DIR = path.join(ROOT, "src/content/people");
const AUTHORS_REPORT = path.join(ROOT, "scripts/import/authors-report.json");

const FALLBACK_AUTHOR = "Processing Foundation";
/**
 * blog/[slug].astro serves images at 800px CSS width, so 1600px covers 2x
 * retina with nothing to spare. Medium stores photographs as PNG, which makes
 * the originals ~8x larger than they need to be (~880 MB across the export);
 * re-encoding to WebP on the way in keeps the repo at ~105 MB. Astro re-encodes
 * to WebP at build time anyway, so this costs no output quality.
 */
const MAX_IMAGE_WIDTH = 1600;
const WEBP_QUALITY = 82;
/**
 * Parallel image fetches per post. Medium's CDN starts returning 429 well
 * before 12 in flight, so this stays low and leans on backoff instead.
 */
const IMAGE_CONCURRENCY = 4;
const MAX_ATTEMPTS = 6;

/** Runs `fn` over `items` with at most `limit` in flight at once. */
async function mapWithConcurrency(items, limit, fn) {
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const i = next;
      next += 1;
      await fn(items[i], i);
    }
  });
  await Promise.all(workers);
}

const argv = process.argv.slice(2);
const flag = (name) => argv.includes(name);
const DRY_RUN = flag("--dry-run");
const SKIP_IMAGES = flag("--no-images");
const LIMIT = argv.includes("--limit")
  ? Number(argv[argv.indexOf("--limit") + 1])
  : Infinity;

/* ------------------------------------------------------------------ people */

/**
 * Existing people, keyed by a normalised form of their `name` so byline
 * spellings ("aarón montoya-moraga" vs "Aarón Montoya-Moraga") still match.
 */
async function loadPeople() {
  const byKey = new Map();
  for (const entry of await readdir(PEOPLE_DIR, { withFileTypes: true })) {
    const file = entry.isDirectory()
      ? path.join(PEOPLE_DIR, entry.name, "index.md")
      : path.join(PEOPLE_DIR, entry.name);
    if (!existsSync(file)) continue;
    const name = (await readFile(file, "utf8")).match(/^name:\s*(.+)$/m)?.[1];
    if (name) byKey.set(normaliseName(name.trim()), name.trim());
  }
  return byKey;
}

function normaliseName(s) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[.’'"]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/* ----------------------------------------------------------------- bylines */

const BYLINE_RE =
  /^\s*(?:written\s+by|words\s+by|text\s+by|interview\s+with|by)\s+(.+)$/i;

/**
 * Everything from a role/affiliation marker onward is credit metadata, not a
 * name ("Tsige Tafesse, Program Manager, edited by …" -> "Tsige Tafesse").
 */
const TRAILING_NOISE_RE = new RegExp(
  String.raw`\s*(?:,|—|–|-|\(|\band\b)?\s*(?:edited\s+by|` +
    String.raw`processing\s+(?:foundation\s+)?fellow|teaching\s+fellow|` +
    String.raw`ml5\.js\s+fellow|p5\.(?:js|sound)\s+fellow|` +
    String.raw`google\s+(?:summer\s+of\s+code|season\s+of\s+docs)|` +
    String.raw`pcd@|program\s+(?:and|manager)|director|coordinator|` +
    String.raw`creator\s+and|project\s+lead|on\s+\w+\s+\d|\d{4})\b.*$`,
  "is",
);
const PARENTHETICAL_ROLE_RE =
  /\s*\((?:[^)]*(?:director|lead|coordinator|manager|program|fellow)[^)]*)\)/gi;

/** Splits a byline tail into individual person names. */
function parseNames(raw) {
  let s = raw.replace(TRAILING_NOISE_RE, "").trim();
  s = s.replace(PARENTHETICAL_ROLE_RE, "");
  s = s.replace(/\s+/g, " ").replace(/[.,;:!]+$/, "").trim();

  const out = [];
  for (let part of s.split(/,\s*and\s+|\s+and\s+|\s*&\s*|\s*\/\s*|,\s*/)) {
    part = part.trim().replace(/[.,;:]+$/, "");
    if (!part || part.length > 45) continue;
    if (/^(the\s+)?processing\s+foundation$/i.test(part)) {
      out.push(FALLBACK_AUTHOR);
      continue;
    }
    // A name is 2–5 words starting with a capital. Single words are too
    // ambiguous (they catch "Interview with Fellows", roles, etc).
    const words = part.split(" ");
    if (words.length >= 2 && words.length <= 5 && /^[\p{Lu}]/u.test(part)) {
      out.push(part);
    }
  }
  return out;
}

/**
 * Candidate author names for a post: the subtitle if it is a byline, else the
 * first few leading headings/paragraphs (Medium bylines live at the top).
 */
function extractBylineNames(subtitle, leadingTexts) {
  for (const text of [subtitle, ...leadingTexts]) {
    if (!text || text.length > 220) continue;
    const m = text.match(BYLINE_RE);
    if (!m) continue;
    const names = parseNames(m[1]);
    if (names.length) return names;
  }
  return [];
}

/* ------------------------------------------------------------------ images */

/**
 * SVG is passed through untouched (already small, and rasterising it would be a
 * downgrade). Everything else — GIFs included — becomes WebP: sharp keeps all
 * frames when told the input is animated, and Astro's image service reads
 * animated input too (`pages: -1`), so animation survives the build. That
 * matters here: the export's animated GIFs are ~300 MB raw but ~70 MB as WebP.
 *
 * The format comes from sniffing the bytes with sharp, not from the response
 * `content-type` — Medium serves a good number of images as
 * `application/octet-stream`, so the header can't be trusted.
 */
const SVG_TYPE = "image/svg+xml";
/** Animated frames multiply file size, so they get a lower quality target. */
const ANIMATED_WEBP_QUALITY = 70;
/**
 * A handful of exported GIFs are enormous once decoded (frames x dimensions),
 * past sharp's default 268 MP guard. These are trusted inputs, so lift it.
 */
const SHARP_INPUT = { limitInputPixels: false };

/**
 * Rewrites an export URL to fetch the image at its intrinsic width (capped).
 *
 * The export points at cdn-images-1.medium.com, the legacy host, which rate
 * limits to a hard 429 that then persists for a long while. miro.medium.com is
 * Medium's current host, serves the same image IDs, and is far more tolerant.
 */
function downloadUrl(src, intrinsicWidth) {
  const width = Math.min(intrinsicWidth || MAX_IMAGE_WIDTH, MAX_IMAGE_WIDTH);
  const id = src.split("/").pop();
  return `https://miro.medium.com/v2/resize:fit:${width}/${id}`;
}

/** Medium's CDN is friendlier to requests that look like a browser. */
const FETCH_HEADERS = {
  "user-agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
    "(KHTML, like Gecko) Chrome/126.0 Safari/537.36",
  accept: "image/avif,image/webp,image/png,image/*,*/*;q=0.8",
  referer: "https://medium.com/",
};

function imageBasename(src, imageId) {
  const raw = (imageId || src.split("/").pop() || "image").replace(/\.$/, "");
  const cleaned = raw
    .replace(/^\d+\*/, "")
    .replace(/\.[a-z0-9]{2,5}$/i, "")
    .replace(/[^\w-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return (cleaned || "image").slice(0, 60);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Downloads one image into the post's asset folder, reusing an existing file if
 * the basename is already present. Returns the on-disk filename.
 *
 * Throws if the image can't be fetched — the caller skips the whole post rather
 * than writing one with images silently missing. Medium's CDN rate-limits
 * aggressively (429), so 429/5xx get a long, `Retry-After`-aware backoff.
 */
async function downloadImage(src, imageId, intrinsicWidth, dir, stats) {
  const base = imageBasename(src, imageId);

  // Already fetched on a previous run?
  if (existsSync(dir)) {
    const found = (await readdir(dir)).find(
      (f) => f.replace(/\.[^.]+$/, "") === base,
    );
    if (found) {
      stats.cached += 1;
      return found;
    }
  }
  if (SKIP_IMAGES) return `${base}.webp`;

  const url = downloadUrl(src, intrinsicWidth);
  let lastError;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      // Medium 301s to a /v2/resize URL, so redirects must be followed.
      const res = await fetch(url, { redirect: "follow", headers: FETCH_HEADERS });
      if (res.status === 429 || res.status >= 500) {
        const retryAfter = Number(res.headers.get("retry-after"));
        const wait = Number.isFinite(retryAfter) && retryAfter > 0
          ? retryAfter * 1000
          : Math.min(2 ** attempt * 1000, 30_000) + Math.random() * 500;
        stats.throttled += 1;
        await sleep(wait);
        throw new Error(`HTTP ${res.status}`);
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const type = (res.headers.get("content-type") || "").split(";")[0].trim();
      const downloaded = Buffer.from(await res.arrayBuffer());
      if (!downloaded.length) throw new Error("empty body");

      let ext;
      let out;
      // Sniff the real format; `content-type` is often octet-stream.
      const meta = await sharp(downloaded, SHARP_INPUT).metadata();
      if (type === SVG_TYPE || meta.format === "svg") {
        ext = "svg";
        out = downloaded;
      } else {
        ext = "webp";
        const animated = (meta.pages ?? 1) > 1;
        out = await sharp(downloaded, { ...SHARP_INPUT, animated })
          .resize({ width: MAX_IMAGE_WIDTH, withoutEnlargement: true })
          .webp({
            quality: animated ? ANIMATED_WEBP_QUALITY : WEBP_QUALITY,
            effort: 4,
          })
          .toBuffer();
      }

      await mkdir(dir, { recursive: true });
      const filename = `${base}.${ext}`;
      await writeFile(path.join(dir, filename), out);
      stats.downloaded += 1;
      stats.bytes += out.length;
      return filename;
    } catch (err) {
      lastError = err;
      if (attempt < MAX_ATTEMPTS) await sleep(500 * attempt);
    }
  }
  throw new Error(`${url} — ${lastError?.message ?? lastError}`);
}

/* -------------------------------------------------------------- conversion */

function makeTurndown() {
  const td = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    bulletListMarker: "-",
    emDelimiter: "*",
  });

  // Embeds (YouTube/Vimeo/gist) survive as raw HTML — markdown has no
  // equivalent, and Astro passes HTML in markdown straight through.
  td.keep(["iframe"]);

  // A Medium <figure> is either an embed or an image + optional caption.
  // Captions can contain links, so they become an italic paragraph rather
  // than alt text.
  td.addRule("figure", {
    filter: "figure",
    replacement(_content, node) {
      const $ = cheerio.load(node.outerHTML ?? "", null, false);
      const iframe = $("iframe").first();
      if (iframe.length) return `\n\n${$.html(iframe)}\n\n`;

      const img = $("img").first();
      if (!img.length) return "";
      const src = img.attr("data-local-src");
      if (!src) return "";

      const caption = $("figcaption").first();
      const captionMd = caption.length
        ? td.turndown($.html(caption.contents())).replace(/\s+/g, " ").trim()
        : "";
      // Alt text is left empty: Medium's export carries none, and inventing
      // descriptions for 1,500 images would be worse than leaving it blank.
      const image = `![](${src})`;
      return captionMd ? `\n\n${image}\n\n*${captionMd}*\n\n` : `\n\n${image}\n\n`;
    },
  });

  // Medium wraps every <section> in a divider, including the first. Author
  // inserted rules are kept; the leading one is trimmed after conversion.
  td.addRule("sectionDivider", {
    filter: (node) =>
      node.nodeName === "HR" && node.className?.includes("section-divider"),
    replacement: () => "\n\n---\n\n",
  });

  return td;
}

/** True when a leading heading is the post's own title or a byline. */
function isTitleOrByline(text, title) {
  const norm = (s) => s.toLowerCase().replace(/[^\w]/g, "").slice(0, 40);
  if (!text) return true;
  if (norm(text) && norm(text) === norm(title)) return true;
  if (BYLINE_RE.test(text) && text.length < 220) return true;
  if (/^\d{4}\s+processing\s+foundation\s+(fellow|teaching)/i.test(text)) return true;
  return false;
}

function yamlString(s) {
  // Quote defensively: titles contain ':', '#', quotes and emoji.
  return `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

/* -------------------------------------------------------------------- main */

async function main() {
  const categories = JSON.parse(await readFile(CATEGORIES_FILE, "utf8"));
  const people = await loadPeople();
  const td = makeTurndown();

  const files = (await readdir(POSTS_DIR))
    .filter((f) => f.endsWith(".html"))
    .sort();

  const stats = {
    written: 0,
    skippedDrafts: 0,
    downloaded: 0,
    cached: 0,
    bytes: 0,
    throttled: 0,
    failedPosts: [],
  };
  const usedSlugs = new Map();
  const unmatchedAuthors = new Map();
  const matchedAuthors = new Map();
  const noCategory = [];
  let processed = 0;

  for (const file of files) {
    if (processed >= LIMIT) break;
    const html = await readFile(path.join(POSTS_DIR, file), "utf8");
    const $ = cheerio.load(html);

    const published = $("time.dt-published").attr("datetime");
    if (!published) {
      stats.skippedDrafts += 1;
      continue;
    }
    processed += 1;

    const title = $("title").first().text().trim();
    const rawSubtitle = $('section[data-field="subtitle"]')
      .text()
      .replace(/\s+/g, " ")
      .trim();

    // Unique slug, using the same slugify the routes use. Non-Latin titles
    // (Hindi, Chinese, Korean, Japanese) mostly slugify away, so fall back to
    // the export filename — and when even that leaves nothing usable, append
    // Medium's post hash so the URL is at least stable and unambiguous.
    // Those handful of posts are worth renaming by hand in the CMS.
    let slug = slugify(title);
    if (!slug) {
      slug = slugify(file.replace(/^\d{4}-\d{2}-\d{2}_/, "").replace(/-[0-9a-f]{8,}\.html$/, ""));
    }
    if (!slug || /^[\d-]+$/.test(slug)) {
      const hash = file.match(/-([0-9a-f]{8,})\.html$/)?.[1];
      slug = [slug, hash].filter(Boolean).join("-") || "untitled";
    }
    slug = slug || "untitled";
    const seen = (usedSlugs.get(slug) ?? 0) + 1;
    usedSlugs.set(slug, seen);
    const finalSlug = seen === 1 ? slug : `${slug}-${seen}`;

    const body = $('section[data-field="body"]');

    // Rewrite every image to its local path before Turndown runs. Downloads run
    // concurrently — sequentially, the ~1,500 images take over an hour.
    // Images live in the post's own directory, beside its index.md.
    const postDir = path.join(OUT_CONTENT, finalSlug);
    const imgNodes = body.find("img.graf-image").toArray();
    try {
      await mapWithConcurrency(imgNodes, IMAGE_CONCURRENCY, async (el) => {
        const img = $(el);
        const src = img.attr("src");
        if (!src) return;
        const filename = await downloadImage(
          src,
          img.attr("data-image-id"),
          Number(img.attr("data-width")),
          postDir,
          stats,
        );
        // A bare filename, resolved relative to index.md, so Astro's markdown
        // pipeline optimises it. Absolute /src/... paths are passed through
        // unprocessed and 404 in production.
        img.attr("data-local-src", filename);
      });
    } catch (err) {
      // Writing the post now would bake in missing images. Leave it unwritten
      // so a re-run retries it — downloaded images are cached, so that's cheap.
      stats.failedPosts.push({ file, error: String(err.message ?? err) });
      continue;
    }

    // Drop the leading title/byline headings — title and author live in
    // frontmatter, and blog/[slug].astro already renders an <h1>. A leading
    // figure (often a video embed) is skipped over rather than treated as the
    // end of the header block, since ~25 posts put the embed above the title.
    const leadingTexts = [];
    const blocks = body.find("h3.graf, h4.graf, p.graf, figure.graf").toArray();
    for (const el of blocks) {
      const node = $(el);
      const tag = el.tagName?.toUpperCase() ?? "";
      if (tag === "FIGURE") continue;
      if (!/^H[34]$/.test(tag)) break;
      const text = node.text().replace(/\s+/g, " ").trim();
      if (!isTitleOrByline(text, title)) break;
      leadingTexts.push(text);
      node.remove();
    }
    // Bylines can also sit in a paragraph right after the headings.
    const firstPara = body.find("p.graf").first();
    if (firstPara.length) {
      const text = firstPara.text().replace(/\s+/g, " ").trim();
      if (BYLINE_RE.test(text) && text.length < 220) {
        leadingTexts.push(text);
        firstPara.remove();
      }
    }

    // Promote a leading image to headerImage so it renders as the post hero.
    let headerImage = null;
    let headerImageCaption = null;
    const firstBlock = body.find("h3.graf, h4.graf, p.graf, figure.graf, blockquote, pre, ul, ol").first();
    if (firstBlock.length && firstBlock.is("figure") && !firstBlock.find("iframe").length) {
      const img = firstBlock.find("img[data-local-src]").first();
      if (img.length) {
        headerImage = img.attr("data-local-src");
        const caption = firstBlock.find("figcaption").first();
        if (caption.length) {
          headerImageCaption = td
            .turndown($.html(caption.contents()))
            .replace(/\s+/g, " ")
            .trim();
        }
        firstBlock.remove();
      }
    }

    // Authors: prefer a real person in the people collection, else the org.
    const candidates = extractBylineNames(rawSubtitle, leadingTexts);
    const authors = [];
    for (const name of candidates) {
      const match = people.get(normaliseName(name));
      if (match && !authors.includes(match)) authors.push(match);
      if (!match) {
        unmatchedAuthors.set(name, (unmatchedAuthors.get(name) ?? 0) + 1);
      } else {
        matchedAuthors.set(match, (matchedAuthors.get(match) ?? 0) + 1);
      }
    }
    if (!authors.length) authors.push(FALLBACK_AUTHOR);
    // The schema caps authors at 2.
    const finalAuthors = authors.slice(0, 2);

    // A subtitle that is really a byline is credit, not a subtitle.
    const subtitle =
      rawSubtitle && !BYLINE_RE.test(rawSubtitle) ? rawSubtitle.slice(0, 200) : null;

    const category = categories[file];
    if (!category) noCategory.push(file);

    let markdown = td
      .turndown(body.html() ?? "")
      .replace(/\n{3,}/g, "\n\n")
      .replace(/^(?:\s*---\s*\n)+/, "") // Medium's spurious first-section rule
      .trim();

    const frontmatter = [
      "---",
      `title: ${yamlString(title)}`,
      subtitle ? `subtitle: ${yamlString(subtitle)}` : null,
      // Quoted: an all-digit slug would otherwise parse as a YAML number.
      `slug: ${yamlString(finalSlug)}`,
      `date: ${published}`,
      "author:",
      ...finalAuthors.map((a) => `  - ${yamlString(a)}`),
      category ? `category: ${yamlString(category)}` : null,
      headerImage ? `headerImage: ${headerImage}` : null,
      headerImageCaption
        ? `headerImageCaption: ${yamlString(headerImageCaption)}`
        : null,
      "---",
    ]
      .filter((l) => l !== null)
      .join("\n");

    if (!DRY_RUN) {
      await mkdir(postDir, { recursive: true });
      await writeFile(
        path.join(postDir, "index.md"),
        `${frontmatter}\n\n${markdown}\n`,
        "utf8",
      );
    }
    stats.written += 1;
    if (stats.written % 25 === 0) {
      console.log(
        `  … ${stats.written} posts, ${stats.downloaded} images downloaded`,
      );
    }
  }

  if (!DRY_RUN) {
    await writeFile(
      AUTHORS_REPORT,
      `${JSON.stringify(
        {
          note:
            "Names parsed from Medium bylines. 'unmatched' have no entry in " +
            "src/content/people, so those posts fall back to Processing " +
            "Foundation. Add them to the people collection and re-run to " +
            "attribute them.",
          matched: Object.fromEntries(
            [...matchedAuthors].sort((a, b) => b[1] - a[1]),
          ),
          unmatched: Object.fromEntries(
            [...unmatchedAuthors].sort((a, b) => b[1] - a[1]),
          ),
        },
        null,
        2,
      )}\n`,
      "utf8",
    );
  }

  console.log(`\nPosts written:     ${stats.written}`);
  console.log(`Drafts skipped:    ${stats.skippedDrafts}`);
  console.log(
    `Images:            ${stats.downloaded} downloaded, ${stats.cached} cached, ` +
      `${(stats.bytes / 1e6).toFixed(1)} MB`,
  );
  console.log(`Authors matched:   ${matchedAuthors.size} distinct`);
  console.log(`Authors unmatched: ${unmatchedAuthors.size} distinct → ${FALLBACK_AUTHOR}`);
  if (noCategory.length) {
    console.log(`\nNo category for ${noCategory.length} file(s):`);
    for (const f of noCategory.slice(0, 10)) console.log(`  ${f}`);
  }
  if (stats.throttled) {
    console.log(`Rate-limit waits:  ${stats.throttled}`);
  }
  if (stats.failedPosts.length) {
    console.log(
      `\nSKIPPED ${stats.failedPosts.length} post(s) — an image could not be ` +
        `downloaded. Re-run to retry (cached images are reused):`,
    );
    for (const f of stats.failedPosts) console.log(`  ${f.file}\n    ${f.error}`);
  }
}

await main();
