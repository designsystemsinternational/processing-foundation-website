import { z } from "zod";

/**
 * SINGLE SOURCE OF TRUTH for the Fellowships collections.
 *
 * Two collections live side by side under src/content/fellowships:
 *
 *   src/content/fellowships/2023/index.json           <- fellowshipYearSchema
 *   src/content/fellowships/2023/the-data-garden-project/  <- fellowshipSchema
 *     index.md
 *     project-image.jpg
 */

export const fellowshipYearSchema = z.object({
  year: z.string().regex(/^\d{4}$/, "Must be a four-digit year"),
  title: z.string().max(200).optional(),
  description: z.string().optional().meta({ widget: "markdown" }),
});

export type FellowshipYear = z.infer<typeof fellowshipYearSchema>;

export const fellowshipSchema = z.object({
  // Stores the year as a plain string; Decap resolves it against the
  // fellowship-years collection so only existing years can be picked.
  year: z
    .string()
    .regex(/^\d{4}$/, "Must be a four-digit year")
    .meta({
      widget: "relation",
      collection: "fellowship-years",
      search_fields: ["year"],
      value_field: "year",
      display_fields: ["year"],
    }),
  title: z.string().max(200).optional().meta({
    widget: "string",
    hint: "Optional. Falls back to the fellows' names when left blank.",
  }),
  // Stores the referenced people's `name`s, the same convention as
  // blogPosts.author: Decap resolves each against the people collection, but
  // the frontmatter value itself is still plain strings.
  fellows: z
    .array(z.string())
    .min(1)
    .meta({
      widget: "relation",
      collection: "people",
      search_fields: ["name"],
      value_field: "name",
      display_fields: ["name"],
      multiple: true,
      min: 1,
    }),
  mentors: z
    .array(z.string())
    .optional()
    .meta({
      widget: "relation",
      collection: "people",
      search_fields: ["name"],
      value_field: "name",
      display_fields: ["name"],
      multiple: true,
    }),
  image: z.string().optional().meta({ widget: "image" }),
  imageAlt: z.string().optional().meta({ label: "Image alt text" }),
  // Captions routinely contain links, so markdown rather than plain text; the
  // Image primitive renders it inline with `marked`.
  imageCaption: z.string().optional().meta({ widget: "markdown" }),
  projectUrl: z.string().optional().meta({
    label: "Project URL",
    widget: "string",
    hint: "The project itself — repository, website, or live sketch.",
  }),
  // Stores blog post `title`s, resolved against the blog-posts collection.
  blogPosts: z
    .array(z.string())
    .optional()
    .meta({
      label: "Related Blog Posts",
      widget: "relation",
      collection: "blog-posts",
      search_fields: ["title"],
      value_field: "title",
      display_fields: ["title"],
      multiple: true,
    }),
});

export type Fellowship = z.infer<typeof fellowshipSchema>;

/**
 * Decap CMS collection definitions. `schema` drives the generated frontmatter
 * fields; `extraFields` are appended verbatim (here, the markdown body, which
 * can't be expressed as frontmatter Zod).
 */
export const fellowshipYearsCms = {
  name: "fellowship-years",
  label: "Fellowship Years",
  folder: "src/content/fellowships",
  create: true,
  delete: true,
  identifier_field: "year",
  extension: "json",
  format: "json",
  // `path` also sets the listing depth; without it no year is found.
  path: "{{slug}}/index",
  schema: fellowshipYearSchema,
};

export const fellowshipsCms = {
  name: "fellowships",
  label: "Fellowships",
  folder: "src/content/fellowships",
  create: true,
  delete: true,
  extension: "md",
  nested: { depth: 3 },
  meta: {
    path: {
      label: "Folder",
      widget: "fellowship-path",
      index_file: "index",
      hint: "Filled in automatically. Edit only to override the folder name.",
    },
  },
  // Titles are optional, and Decap's summary templates can't fall back from one
  // field to another (the `default`/`ternary` filters only take literals), so
  // always show the first fellow — who is required — and append the title when
  // it is set: "2023 — Ari Melenciano: The Data Garden" / "2023 — DIY Girls".
  summary:
    "{{fields.year}} — {{fields.fellows.0}}{{title | ternary(': ', '')}}{{title}}",
  media_folder: "",
  public_folder: "",
  schema: fellowshipSchema,
  extraFields: [
    { name: "body", label: "Project Description", widget: "markdown" },
  ],
};
