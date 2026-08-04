import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "zod";
import { pageSchema } from "./schemas/pages.ts";
import { peopleSchema } from "./schemas/people.ts";
import { showcaseBlockSchema, showcaseSchema } from "./schemas/showcase.ts";

const pages = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "src/content/pages" }),
  schema: pageSchema,
});

const people = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "src/content/people" }),
  // Override peopleSchema's image (originally a plain string)
  // with image() so Astro resolves/optimizes it automatically.
  schema: ({ image }) => peopleSchema.extend({ image: image().optional() }),
});

// Synced from Are.na by `npm run sync:showcase` (see scripts/sync-showcase.ts).
// Not a Decap collection — deliberately absent from src/lib/generate-config.ts.
// One entry per channel: {channel-slug}/index.json with the channel's blocks
// inline and their images co-located, so image() resolves/optimizes each block
// image (same approach as `people`).
const showcase = defineCollection({
  loader: glob({ pattern: "**/index.json", base: "src/content/showcase" }),
  schema: ({ image }) =>
    showcaseSchema.extend({
      blocks: z.array(showcaseBlockSchema.extend({ image: image().optional() })),
    }),
});

export const collections = { pages, people, showcase };
