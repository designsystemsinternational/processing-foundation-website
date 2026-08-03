import { z } from "zod";

/**
 * SINGLE SOURCE OF TRUTH for the Showcase collection.
 *
 * Unlike the other collections, Showcase is NOT editable in Decap CMS. Its
 * content is synced from Are.na by `scripts/sync-showcase.ts` (run manually via
 * `npm run sync:showcase`), which writes one directory per block:
 *
 *   src/content/showcase/{block-id}/index.json   <- the fields below
 *   src/content/showcase/{block-id}/image.jpg    <- co-located grid image
 *
 * Because it isn't a CMS collection, this file intentionally exports NO
 * `showcaseCms` object and is NOT registered in src/lib/generate-config.ts —
 * that's what keeps it out of public/config.yml.
 *
 * The `image` field is a bare co-located filename; src/content.config.ts
 * overrides it with Astro's image() helper so it gets optimized (same trick as
 * the People collection).
 */
export const showcaseSchema = z.object({
  /** Are.na block id. */
  id: z.number(),
  /** Block title, as shown on the Are.na grid. */
  title: z.string().optional(),
  /** Name of the channel this block belongs to (group name for top-level blocks). */
  channelName: z.string(),
  /** Slug of the containing channel, if the block lives in a nested channel. */
  channelSlug: z.string().optional(),
  /** Permalink to the block on Are.na: https://www.are.na/block/{id}. */
  blockUrl: z.string(),
  /** The block's external source URL, if any (block.source.url). */
  sourceUrl: z.string().optional(),
  /** Block description (markdown). */
  description: z.string().optional(),
  /** Co-located image filename (e.g. "image.jpg"); overridden with image() in content.config.ts. */
  image: z.string().optional(),
});

export type Showcase = z.infer<typeof showcaseSchema>;
