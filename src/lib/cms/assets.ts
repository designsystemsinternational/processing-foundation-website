import type { ImageMetadata } from "astro";

/** Astro's default image endpoint route, where `<Image>` points every src it emits. */
const IMAGE_ENDPOINT = "/_image";

/**
 * One media file as the CMS sees it: the URL Decap resolved, and its size once
 * the browser could measure it. A markdown image needs the URL alone.
 */
export interface PreviewAsset {
  path: string;
  url: string;
  width?: number;
  height?: number;
}

const formats = ["jpeg", "jpg", "png", "tiff", "webp", "gif", "svg", "avif"] as const;
type Format = (typeof formats)[number];

/**
 * A media path is known by its extension, not by its folder: a collection with
 * its own `media_folder` (blogPosts, people, fellowships) writes a bare filename
 * beside the entry, while the rest write /src/assets/media/… A path also stops
 * at whatever closes it in markdown: `![alt](photo.jpg)`.
 */
const MEDIA_PATH = `[^\\s()"'\\[\\]<>]+\\.(?:${formats.join("|")})`;

/** Something already loadable — a remote URL, a data URI, a blob. Leave it alone. */
const HAS_SCHEME = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;

const isMediaPath = (value: string) =>
  !HAS_SCHEME.test(value) && new RegExp(`^${MEDIA_PATH}$`, "i").test(value);

const mediaPathsIn = (value: string) =>
  (value.match(new RegExp(MEDIA_PATH, "gi")) ?? []).filter((path) => !HAS_SCHEME.test(path));

/** Decap stores a media file's own path without the leading slash a field value has. */
export const normalizeMediaPath = (path: string) => path.replace(/^\/+/, "");

/** A relative path holds a filename alone, so that is all there is to match on. */
export const mediaFileName = (path: string) => path.split("/").pop() ?? path;

/** One entry of the `mediaFiles` list Decap keeps on the entry draft. */
interface DraftMediaFile {
  path: string;
  url?: string;
  draft?: boolean;
}

/**
 * The blob URL for an upload the editor has not saved yet, if the entry holds
 * one for this path. Decap's own getAsset misses those blobs twice over: its
 * media store keys a file by a path with no leading slash while our
 * public_folder gives every field value one, and a value that starts with a
 * slash is returned as-is, so it points at a file that does not exist until the
 * entry is saved. Take a blob from a draft file only: the one Decap makes for a
 * file already in the repo dies with the media library, while getAsset returns
 * that file's real path, which the dev server serves.
 */
export function draftMediaUrl(
  mediaFiles: unknown,
  path: string,
): string | undefined {
  const drafts = (Array.isArray(mediaFiles) ? mediaFiles : []).filter(
    (media: DraftMediaFile) => media?.draft && typeof media?.url === "string",
  );
  const match =
    drafts.find(
      (media) => normalizeMediaPath(media.path) === normalizeMediaPath(path),
    ) ?? drafts.find((media) => mediaFileName(media.path) === mediaFileName(path));
  return match?.url;
}

const formatFromPath = (path: string): Format => {
  const extension = path.split(".").pop()?.toLowerCase();
  return formats.includes(extension as Format) ? (extension as Format) : "jpg";
};

/**
 * Astro treats any object `src` as a built asset and only ever reads `src.src`,
 * so this hand-made ImageMetadata renders through `<Image>` exactly like an
 * imported one — no file on disk, no `fsPath`. It leaves the blob URL inside the
 * `/_image?href=` src that `<Image>` emits, which `inlinePreviewAssets` unwraps.
 */
const toImageMetadata = ({ url, path, width, height }: PreviewAsset): ImageMetadata =>
  width && height
    ? { src: url, width, height, format: formatFromPath(path) }
    : pendingImage;

/** Stands in until Decap resolves a URL for a path, so a block still renders. */
const pendingImage: ImageMetadata = {
  src: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  width: 1,
  height: 1,
  format: "gif",
};

/** Every media path anywhere in an entry, image field or markdown alike. */
export function collectMediaPaths(value: unknown, found = new Set<string>()): Set<string> {
  if (typeof value === "string") {
    mediaPathsIn(value).forEach((path) => found.add(path));
  } else if (Array.isArray(value)) {
    value.forEach((item) => collectMediaPaths(item, found));
  } else if (value && typeof value === "object") {
    Object.values(value).forEach((item) => collectMediaPaths(item, found));
  }
  return found;
}

/**
 * Resolves both ways a media path reaches a component. An image field holds the
 * path alone, and becomes an ImageMetadata, the same way image() does on build.
 * A markdown field holds it inline, and keeps a path — the URL the CMS resolved
 * — because marked turns that into the plain <img> the built page also gets.
 */
export function resolveMediaPaths(
  value: unknown,
  assets: Record<string, PreviewAsset>,
): unknown {
  if (typeof value === "string") {
    if (isMediaPath(value)) {
      const asset = assets[value];
      return asset ? toImageMetadata(asset) : pendingImage;
    }
    return value.replace(new RegExp(MEDIA_PATH, "gi"), (path) =>
      HAS_SCHEME.test(path) ? path : (assets[path]?.url ?? path),
    );
  }
  if (Array.isArray(value)) {
    return value.map((item) => resolveMediaPaths(item, assets));
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, resolveMediaPaths(item, assets)]),
    );
  }
  return value;
}

export const isImageMetadata = (value: unknown): value is ImageMetadata =>
  !!value &&
  typeof value === "object" &&
  typeof (value as ImageMetadata).src === "string" &&
  typeof (value as ImageMetadata).width === "number";

/**
 * `<Image>` wraps our src in `/_image?href=…`, an endpoint that reads files from
 * disk and so can't serve a blob. Point those srcs back at the href itself,
 * which the browser can load. Build-resolved assets keep a path-shaped href and
 * are left alone.
 */
export function inlinePreviewAssets(html: string): string {
  return html.replace(
    new RegExp(`${IMAGE_ENDPOINT}\\?[^"'\\s,]+`, "g"),
    (src) => {
      const href = new URLSearchParams(src.slice(src.indexOf("?") + 1)).get("href");
      return href && !href.startsWith("/") ? href : src;
    },
  );
}
