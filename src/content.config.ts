import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { pageSchema } from "./schemas/pages.ts";
import { peopleSchema } from "./schemas/people.ts";
import { showcaseSchema } from "./schemas/showcase.ts";

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
// Each block is a directory ({block-id}/index.json) with a co-located image, so
// image() resolves/optimizes the grid image (same approach as `people`).
const showcase = defineCollection({
  loader: glob({ pattern: "**/index.json", base: "src/content/showcase" }),
  schema: ({ image }) => showcaseSchema.extend({ image: image().optional() }),
});

export const collections = { pages, people, showcase };
