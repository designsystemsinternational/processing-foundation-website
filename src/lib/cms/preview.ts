import type { CollectionEntry } from "astro:content";
import { marked } from "marked";
import { blockComponents } from "@/blocks/index.ts";
import type { Block } from "@/schemas/pages.ts";
import {
  blockDefaults,
  colorThemeOptions,
  threadSpans,
  type ColorThemeName,
  type ThreadSpan,
} from "@/lib/constants.ts";

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
 * since the markdown never went through Astro's markdown pipeline. A post's
 * `headerImage` is left out because its path is relative to the post's own
 * directory, which only resolves at build time.
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
      headerImageCaption: optionalStr(data.headerImageCaption),
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
      blocks: blocks.filter(
        (b): b is Block =>
          !!b && typeof b === "object" && (b as { type?: string }).type! in blockComponents,
      ),
    },
  };
}

export async function parsePreviewPayload(payload: unknown): Promise<PreviewEntry> {
  const { collection, data } = (payload ?? {}) as {
    collection?: string;
    data?: Record<string, unknown>;
  };

  return collection === "blog-posts"
    ? { collection: "blog-posts", entry: await toBlogPostEntry(data ?? {}) }
    : { collection: "pages", entry: toPageEntry(data ?? {}) };
}
