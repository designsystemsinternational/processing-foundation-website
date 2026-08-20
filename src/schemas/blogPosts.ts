import { z } from "zod";

/**
 * Which part of the header image survives a crop. These are sharp's gravity
 * names, not CSS `object-position` values — sharp rejects the CSS word order
 * ("center top"), so this can't be a free-text field.
 */
export const headerImagePositions = [
  "center",
  "top",
  "bottom",
  "left",
  "right",
  "left top",
  "right top",
  "left bottom",
  "right bottom",
] as const;

/**
 * SINGLE SOURCE OF TRUTH for the Blog Posts collection.
 *
 * This schema describes the markdown *frontmatter* only. The markdown body is
 * the file's content (not frontmatter), so it isn't part of the Zod schema —
 * it's declared to Decap via `extraFields` in `blogPostsCms` below.
 *
 * Each post is a directory holding an index.md plus its own images, the same
 * shape as the people collection. Image paths are therefore bare filenames
 * relative to index.md. Set at the collection level (path/media_folder/
 * public_folder on blogPostsCms below), since a field-level override wouldn't
 * apply to images embedded in the body.
 */
export const blogPostSchema = z.object({
  title: z.string().max(100),
  subtitle: z.string().max(200).optional(),
  // Left blank, it's auto-filled from the title on save (see the preSave
  // event listener in admin.astro); typing a value here overrides that.
  slug: z.string().optional().meta({ label: "Custom slug" }),
  date: z.coerce.date().meta({ widget: "datetime" }),
  // Stores the referenced people's `name`s; Decap resolves each against the
  // people collection, but the frontmatter value itself is still plain strings.
  author: z
    .array(z.string())
    .min(1)
    .max(2)
    .meta({
      widget: "relation",
      collection: "people",
      search_fields: ["name"],
      value_field: "name",
      display_fields: ["name"],
      multiple: true,
      min: 1,
      max: 2,
    }),
  category: z
    .string()
    .optional()
    .meta({
      widget: "relation",
      collection: "blog-categories",
      search_fields: ["name"],
      value_field: "name",
      display_fields: ["name"],
    }),
  headerImage: z.string().optional().meta({ widget: "image" }),
  // Captions routinely contain links, so this is markdown rather than plain
  // text; blog/[slug].astro renders it inline with `marked`.
  headerImageCaption: z.string().optional().meta({ widget: "markdown" }),
  // Only affects renders that crop (the /blog thumbnail), not the post's own
  // full-aspect header. Left unset unless an editor picks a crop; whatever
  // renders the thumbnail supplies "center" — see BlogPostCard.
  headerImagePosition: z
    .enum(headerImagePositions)
    .optional()
    .meta({ label: "Header image crop" }),
});

export type BlogPost = z.infer<typeof blogPostSchema>;

/**
 * Decap CMS collection definition. `schema` drives the generated frontmatter
 * fields; `extraFields` are appended verbatim (here, the markdown body, which
 * can't be expressed as frontmatter Zod).
 */
export const blogPostsCms = {
  name: "blog-posts",
  label: "Blog Posts",
  folder: "src/content/blogPosts",
  create: true,
  delete: true,
  identifier_field: "title",
  // Each entry gets its own directory, so a post's images sit beside its
  // index.md and are referenced as plain filenames.
  path: "{{slug}}/index",
  // Empty (relative) so Decap writes uploads into the entry's own directory
  // rather than the site-wide /src/assets/media.
  media_folder: "",
  public_folder: "",
  schema: blogPostSchema,
  extraFields: [{ name: "body", label: "Body", widget: "markdown" }],
};
