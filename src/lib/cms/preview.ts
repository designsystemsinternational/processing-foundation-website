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
      // it stays out of the preview rather than crashing the render.
      blocks: blocks
        .map((block) => previewBlocks.safeParse(block))
        .filter((result) => result.success)
        .map((result) => result.data),
    },
  };
}

export async function parsePreviewPayload(payload: unknown): Promise<PreviewEntry> {
  const { collection, data, assets } = (payload ?? {}) as {
    collection?: string;
    data?: Record<string, unknown>;
    assets?: Record<string, PreviewAsset>;
  };

  const resolved = resolveMediaPaths(data ?? {}, assets ?? {}) as Record<string, unknown>;

  return collection === "blog-posts"
    ? { collection: "blog-posts", entry: await toBlogPostEntry(resolved) }
    : { collection: "pages", entry: toPageEntry(resolved) };
}
