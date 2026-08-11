import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "zod";
import { blogCategorySchema } from "./schemas/blogCategories.ts";
import { blogPostSchema } from "./schemas/blogPosts.ts";
import {
  fellowshipSchema,
  fellowshipYearSchema,
} from "./schemas/fellowships.ts";
import { footerSchema } from "./schemas/footer.ts";
import { navigationSchema } from "./schemas/navigation.ts";
import { blockSchemasFor, pageSchema } from "./schemas/pages.ts";
import { peopleSchema } from "./schemas/people.ts";
import { showcaseBlockSchema, showcaseSchema } from "./schemas/showcase.ts";

const pages = defineCollection({
  loader: glob({
    pattern: "**/*.json",
    base: "src/content/pages",
    // Keep the id path-derived — Astro's default would use a `slug` data field as the whole id.
    generateId: ({ entry }) => entry.replace(/\.json$/, ""),
  }),
  // Rebuild the blocks union with image() in place of the plain path string, so
  // images nested inside a block get resolved and optimized like any other.
  schema: ({ image }) =>
    pageSchema.extend({
      blocks: z
        .array(z.discriminatedUnion("type", [...blockSchemasFor(image())]))
        .optional(),
    }),
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

// Both fellowship collections live under src/content/fellowships. The year
// files are always `<year>/index.json`; the fellowships are always
// `<year>/<slug>/index.md`, so the two globs never overlap.
const fellowshipYears = defineCollection({
  loader: glob({
    pattern: "*/index.json",
    base: "src/content/fellowships",
    // "2023/index.json" -> "2023"
    generateId: ({ entry }) => entry.replace(/\/index\.json$/, ""),
  }),
  schema: fellowshipYearSchema,
});

const fellowships = defineCollection({
  loader: glob({
    pattern: "*/*/index.md",
    base: "src/content/fellowships",
    // "2023/the-data-garden-project/index.md" -> "2023/the-data-garden-project".
    // The id is the entry's `<year>/<slug>` directory, which is the only place
    // the slug lives — it is deliberately not repeated in the frontmatter, so
    // read it off the id: `const [, slug] = entry.id.split("/")`.
    generateId: ({ entry }) => entry.replace(/\/index\.md$/, ""),
  }),
  // Override fellowshipSchema's image (originally a plain string)
  // with image() so Astro resolves/optimizes it automatically.
  schema: ({ image }) => fellowshipSchema.extend({ image: image().optional() }),
});

// A single entry, footer.json, so the entry id is "footer".
const footer = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "src/content/footer" }),
  schema: footerSchema,
});

// One entry per navigation file; the entry id is the filename, so main.json is "main".
const navigation = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "src/content/navigation" }),
  schema: navigationSchema,
});

export const collections = {
  pages,
  people,
  showcase,
  blogPosts,
  blogCategories,
  fellowships,
  fellowshipYears,
  footer,
  navigation,
};
