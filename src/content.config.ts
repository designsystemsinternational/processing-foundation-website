import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "zod";
import { blogCategorySchema } from "./schemas/blogCategories.ts";
import { blogPostSchema } from "./schemas/blogPosts.ts";
import { pageSchema } from "./schemas/pages.ts";
import { peopleSchema } from "./schemas/people.ts";
import { showcaseBlockSchema, showcaseSchema } from "./schemas/showcase.ts";

const pages = defineCollection({
  loader: glob({
    pattern: "**/*.json",
    base: "src/content/pages",
    // Keep the id path-derived — Astro's default would use a `slug` data field as the whole id.
    generateId: ({ entry }) => entry.replace(/\.json$/, ""),
  }),
  schema: pageSchema,
});

const blogCategories = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "src/content/blogCategories" }),
  schema: blogCategorySchema,
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

const blogPosts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "src/content/blogPosts" }),
  // Override blogPostSchema's headerImage (originally a plain string)
  // with image() so Astro resolves/optimizes it automatically.
  schema: ({ image }) => blogPostSchema.extend({ headerImage: image().optional() }),
});

export const collections = { pages, people, showcase, blogPosts, blogCategories };
