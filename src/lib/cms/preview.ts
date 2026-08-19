import type { ImageMetadata } from "astro";
import type { CollectionEntry } from "astro:content";
import { marked } from "marked";
import { z } from "zod";
import {
  isImageMetadata,
  resolveMediaPaths,
  type PreviewAsset,
} from "@/lib/cms/assets.ts";
import { blockSchemasFor } from "@/schemas/pages.ts";
import { humanize } from "@/lib/utils.ts";
import { headerImagePositions } from "@/schemas/blogPosts.ts";
import {
  blockDefaults,
  colorThemeOptions,
  threadSpans,
  type ColorThemeName,
  type ThreadSpan,
} from "@/lib/constants.ts";

/**
 * The blocks union as the preview sees it: Decap sends raw form data, and
 * resolveMediaPaths has already turned every image path into ImageMetadata, so
 * this stands in for the image() a content collection would use.
 */
const previewBlocks = z.discriminatedUnion("type", [
  ...blockSchemasFor(z.custom<ImageMetadata>(isImageMetadata)),
]);

export type PreviewEntry =
  | { collection: "pages"; entry: CollectionEntry<"pages"> }
  | { collection: "blog-posts"; entry: CollectionEntry<"blogPosts"> };

/** How many field names a notice lists before it trails off. */
const MAX_LISTED_FIELDS = 4;

/** ["images", 0, "image"] -> "images[0].image" */
const issuePath = (path: readonly PropertyKey[]) =>
  path
    .map((key) => (typeof key === "number" ? `[${key}]` : `.${String(key)}`))
    .join("")
    .replace(/^\./, "");

/**
 * Stands in for a block an editor has only started filling in, so the preview
 * shows where the block will sit instead of dropping it. Preview-only: a saved
 * page never holds one of these, because a block this incomplete fails the
 * content collection schema too.
 */
function toIncompleteBlockNotice(block: unknown, error: z.ZodError) {
  const type = (block as { type?: unknown })?.type;
  const notice = (label: string) =>
    previewBlocks.parse({ type: "placeholderBlock", label });

  // An issue on the discriminator itself means no block schema matched, so
  // there are no fields to name.
  if (error.issues.some((issue) => issue.path.join() === "type")) {
    return notice(
      typeof type === "string" && type
        ? `Unknown block type "${type}".`
        : "This block has no type.",
    );
  }

  const fields = [
    ...new Set(error.issues.map((issue) => issuePath(issue.path)).filter(Boolean)),
  ];
  const listed = fields.slice(0, MAX_LISTED_FIELDS).join(", ");
  const missing = fields.length > MAX_LISTED_FIELDS ? `${listed}, …` : listed;
  const name = humanize(String(type));
  return notice(
    missing
      ? `${name}: fill in every field to see this block. Missing or invalid: ${missing}.`
      : `${name}: fill in every field to see this block.`,
  );
}

const str = (value: unknown) => (typeof value === "string" ? value : "");
const optionalStr = (value: unknown) => (typeof value === "string" ? value : undefined);
const toDate = (value: unknown) => {
  const parsed = new Date(str(value));
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
};

/**
 * Decap sends an entry as raw form data, so each of these rebuilds the shape a
 * content collection would have produced — real Dates, and a `rendered` body,
 * since the markdown never went through Astro's markdown pipeline. Image paths
 * are already ImageMetadata by this point; see resolveMediaPaths below.
 */
async function toBlogPostEntry(
  data: Record<string, unknown>,
): Promise<CollectionEntry<"blogPosts">> {
  const body = str(data.body);
  return {
    id: "preview",
    collection: "blogPosts",
    body,
    rendered: { html: await marked.parse(body) },
    data: {
      title: str(data.title),
      subtitle: optionalStr(data.subtitle),
      slug: optionalStr(data.slug),
      date: toDate(data.date),
      author: Array.isArray(data.author)
        ? data.author.filter((a): a is string => typeof a === "string")
        : [],
      category: optionalStr(data.category),
      headerImage: isImageMetadata(data.headerImage) ? data.headerImage : undefined,
      headerImageCaption: optionalStr(data.headerImageCaption),
      headerImagePosition:
        headerImagePositions.find(
          (position) => position === data.headerImagePosition,
        ) ?? "center",
    },
  };
}

function toPageEntry(data: Record<string, unknown>): CollectionEntry<"pages"> {
  const blocks = Array.isArray(data.blocks) ? data.blocks : [];
  const colorTheme: ColorThemeName =
    typeof data.colorTheme === "string" && data.colorTheme in colorThemeOptions
      ? (data.colorTheme as ColorThemeName)
      : "default";
  const threadSpan: ThreadSpan = (threadSpans as readonly number[]).includes(
    Number(data.threadSpan),
  )
    ? (Number(data.threadSpan) as ThreadSpan)
    : blockDefaults.threadSpan;
  return {
    id: "preview",
    collection: "pages",
    data: {
      title: str(data.title),
      slug: str(data.slug),
      colorTheme,
      threadSpan,
      // A block an editor has only started filling in fails its own schema, so
      // a notice takes its place rather than crashing the render.
      blocks: blocks.map((block) => {
        const result = previewBlocks.safeParse(block);
        return result.success
          ? result.data
          : toIncompleteBlockNotice(block, result.error);
      }),
    },
  };
}

/**
 * A select an editor cleared arrives as null, which every field's `.optional()`
 * rejects — so the block would render as an incomplete-block notice while the
 * editor is still working. Treat it as unset, the same way preSave does before
 * the entry reaches disk.
 */
const withoutNulls = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(withoutNulls);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, item]) => item !== null)
        .map(([key, item]) => [key, withoutNulls(item)]),
    );
  }
  return value;
};

export async function parsePreviewPayload(payload: unknown): Promise<PreviewEntry> {
  const { collection, data, assets } = (payload ?? {}) as {
    collection?: string;
    data?: Record<string, unknown>;
    assets?: Record<string, PreviewAsset>;
  };

  const resolved = resolveMediaPaths(withoutNulls(data ?? {}), assets ?? {}) as Record<
    string,
    unknown
  >;

  return collection === "blog-posts"
    ? { collection: "blog-posts", entry: await toBlogPostEntry(resolved) }
    : { collection: "pages", entry: toPageEntry(resolved) };
}
