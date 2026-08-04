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
  // Override plain string with image so Astro optimizes it automatically.
  schema: ({ image }) => peopleSchema.extend({ image: image().optional() }),
});

const showcase = defineCollection({
  loader: glob({ pattern: "**/index.json", base: "src/content/showcase" }),
  schema: ({ image }) =>
    showcaseSchema.extend({
      // Override plain string with image so Astro optimizes it automatically.
      blocks: z.array(
        showcaseBlockSchema.extend({ image: image().optional() }),
      ),
    }),
});

export const collections = { pages, people, showcase };
