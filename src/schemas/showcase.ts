import { z } from 'zod';

/**
 * SINGLE SOURCE OF TRUTH for the Showcase collection.
 *
 * Unlike the other collections, Showcase is NOT editable in Decap CMS. Its
 * content is synced from Are.na by `scripts/sync-showcase.ts` (run manually via
 * `npm run sync:showcase`), which writes ONE DIRECTORY PER CHANNEL:
 *
 *   src/content/showcase/{channel-slug}/index.json     <- channel + its blocks
 *   src/content/showcase/{channel-slug}/{block-id}.jpg <- co-located block image
 *
 * One collection entry === one Are.na channel, with its blocks inline, so no
 * grouping is needed at read time:
 *
 *   const channels = await getCollection("showcase");
 *   channels.map((c) => c.data.name);   // every channel name
 *   channels[0].data.blocks;            // that channel's blocks, newest first
 *
 * It is registered in src/lib/cms/generate-config.ts, but only so the Showcase
 * Channel block's relation widget can read it — see `showcaseCms` below.
 *
 * Each block's `image` is a co-located relative path; src/content.config.ts
 * overrides it with Astro's image() helper so it gets optimized (same trick as
 * the People collection).
 */
export const showcaseBlockSchema = z.object({
  /** Are.na block id. */
  id: z.number(),
  /** Block title, as shown on the Are.na grid. */
  title: z.string().optional(),
  /** Permalink to the block on Are.na: https://www.are.na/block/{id}. */
  blockUrl: z.string(),
  /** The block's external source URL, if any (block.source.url). */
  sourceUrl: z.string().optional(),
  /** Block description (markdown). */
  description: z.string().optional(),
  /** Co-located image path (e.g. "./123.jpg"); overridden with image() in content.config.ts. */
  image: z.string().optional(),
});

export const showcaseSchema = z.object({
  /** Channel title as shown on Are.na. */
  name: z.string(),
  /** Are.na channel slug; matches the directory name. */
  slug: z.string(),
  /** Permalink to the channel on Are.na: https://www.are.na/{slug}. */
  channelUrl: z.string(),
  /** The channel's blocks, newest connection to the channel first. */
  blocks: z.array(showcaseBlockSchema),
});

export type ShowcaseBlock = z.infer<typeof showcaseBlockSchema>;
export type Showcase = z.infer<typeof showcaseSchema>;

/**
 * Decap CMS collection definition. Synced content, so editors never touch it:
 * `hide` keeps it out of the sidebar (Decap filters it there and when picking a
 * landing collection), while a relation widget still queries it by name. With
 * create and delete off too, no UI path reaches an entry.
 */
export const showcaseCms = {
  name: 'showcase',
  label: 'Showcase',
  label_singular: 'Channel',
  folder: 'src/content/showcase',
  hide: true,
  create: false,
  delete: false,
  identifier_field: 'name',
  extension: 'json',
  format: 'json',
  summary: '{{name}}',
  // Each channel gets its own directory, so its block images sit beside it.
  path: '{{slug}}/index',
  media_folder: '',
  public_folder: '',
  schema: showcaseSchema,
};
