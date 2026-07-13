import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { blogPostSchema } from "./schemas/blogPosts.ts";
import { pageSchema } from "./schemas/pages.ts";
import { peopleSchema } from "./schemas/people.ts";

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

const blogPosts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "src/content/blogPosts" }),
  schema: blogPostSchema,
});

export const collections = { pages, people, blogPosts };
