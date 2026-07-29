import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { pageSchema } from "./schemas/pages.ts";
import { peopleSchema } from "./schemas/people.ts";

const pages = defineCollection({
  loader: glob({
    pattern: "**/*.json",
    base: "src/content/pages",
    // Keep the id path-derived — Astro's default would use a `slug` data field as the whole id.
    generateId: ({ entry }) => entry.replace(/\.json$/, "").replace(/\/index$/, ""),
  }),
  schema: pageSchema,
});

const people = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "src/content/people" }),
  // Override peopleSchema's image (originally a plain string)
  // with image() so Astro resolves/optimizes it automatically.
  schema: ({ image }) => peopleSchema.extend({ image: image().optional() }),
});

export const collections = { pages, people };
