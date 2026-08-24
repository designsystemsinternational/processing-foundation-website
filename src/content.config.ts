import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';
import { blogCategorySchema } from './schemas/blogCategories.ts';
import { blogPostSchema } from './schemas/blogPosts.ts';
import {
  fellowshipSchema,
  fellowshipYearSchema,
} from './schemas/fellowships.ts';
import { footerSchema } from './schemas/footer.ts';
import { grantProjectSchema, grantSchema } from './schemas/grants.ts';
import { institutionSchema } from './schemas/institutions.ts';
import { navigationSchema } from './schemas/navigation.ts';
import { blockSchemasFor, pageSchema } from './schemas/pages.ts';
import { peopleSchema } from './schemas/people.ts';
import { optionalImageWithCaptionFor } from './schemas/shared.ts';
import { showcaseBlockSchema, showcaseSchema } from './schemas/showcase.ts';
import { toolSchema } from './schemas/tools.ts';

const pages = defineCollection({
  loader: glob({
    pattern: '**/*.json',
    base: 'src/content/pages',
    // "about/team/index.json" -> "about/team"
    generateId: ({ entry }) =>
      entry.replace(/\.json$/, '').replace(/\/index$/, ''),
  }),
  // Rebuild the blocks union with image() in place of the plain path string, so
  // images nested inside a block get resolved and optimized like any other.
  schema: ({ image }) =>
    pageSchema.extend({
      blocks: z
        .array(z.discriminatedUnion('type', [...blockSchemasFor(image())]))
        .optional(),
    }),
});

const blogCategories = defineCollection({
  loader: glob({ pattern: '**/*.json', base: 'src/content/blogCategories' }),
  schema: blogCategorySchema,
});

const people = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/people' }),
  // Override plain string with image so Astro optimizes it automatically.
  schema: ({ image }) =>
    peopleSchema.extend({ image: optionalImageWithCaptionFor(image()) }),
});

const institutions = defineCollection({
  loader: glob({
    pattern: '**/index.json',
    base: 'src/content/institutions',
    // "nyu-itp/index.json" -> "nyu-itp"
    generateId: ({ entry }) => entry.replace(/\/index\.json$/, ''),
  }),
  // Override plain string with image so Astro optimizes it automatically.
  schema: ({ image }) => institutionSchema.extend({ logo: image().optional() }),
});

const tools = defineCollection({
  loader: glob({
    pattern: '**/index.json',
    base: 'src/content/tools',
    // "py5/index.json" -> "py5"
    generateId: ({ entry }) => entry.replace(/\/index\.json$/, ''),
  }),
  // Override plain string with image so Astro optimizes it automatically.
  schema: ({ image }) => toolSchema.extend({ image: image().optional() }),
});

const showcase = defineCollection({
  loader: glob({ pattern: '**/index.json', base: 'src/content/showcase' }),
  schema: ({ image }) =>
    showcaseSchema.extend({
      // Override plain string with image so Astro optimizes it automatically.
      blocks: z.array(
        showcaseBlockSchema.extend({ image: image().optional() }),
      ),
    }),
});

const blogPosts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/blogPosts' }),
  // Override plain string with image so Astro optimizes it automatically.
  schema: ({ image }) =>
    blogPostSchema.extend({
      headerImage: image().optional(),
      indexImage: image().optional(),
    }),
});

const fellowshipYears = defineCollection({
  loader: glob({
    pattern: '*/index.json',
    base: 'src/content/fellowships',
    // "2023/index.json" -> "2023"
    generateId: ({ entry }) => entry.replace(/\/index\.json$/, ''),
  }),
  schema: fellowshipYearSchema,
});

const fellowships = defineCollection({
  loader: glob({
    pattern: '*/*/index.md',
    base: 'src/content/fellowships',
    // "2023/the-data-garden-project/index.md" -> "2023/the-data-garden-project".
    generateId: ({ entry }) => entry.replace(/\/index\.md$/, ''),
  }),
  // Override plain string with image so Astro optimizes it automatically.
  schema: ({ image }) =>
    fellowshipSchema.extend({ image: optionalImageWithCaptionFor(image()) }),
});

const grants = defineCollection({
  loader: glob({
    pattern: '*/index.json',
    base: 'src/content/grants',
    // "pr05/index.json" -> "pr05"
    generateId: ({ entry }) => entry.replace(/\/index\.json$/, ''),
  }),
  schema: grantSchema,
});

const grantProjects = defineCollection({
  loader: glob({
    pattern: '*/*/*/index.md',
    base: 'src/content/grants',
    // "pr05/2025/claire-peng/index.md" -> "pr05/2025/claire-peng"
    generateId: ({ entry }) => entry.replace(/\/index\.md$/, ''),
  }),
  // Override plain string with image so Astro optimizes it automatically.
  schema: ({ image }) =>
    grantProjectSchema.extend({ image: optionalImageWithCaptionFor(image()) }),
});

// A single entry, footer.json, so the entry id is "footer".
const footer = defineCollection({
  loader: glob({ pattern: '**/*.json', base: 'src/content/footer' }),
  schema: footerSchema,
});

// One entry per navigation file; the entry id is the filename, so main.json is "main".
const navigation = defineCollection({
  loader: glob({ pattern: '**/*.json', base: 'src/content/navigation' }),
  schema: navigationSchema,
});

export const collections = {
  pages,
  people,
  institutions,
  tools,
  showcase,
  blogPosts,
  blogCategories,
  fellowships,
  fellowshipYears,
  grants,
  grantProjects,
  footer,
  navigation,
};
