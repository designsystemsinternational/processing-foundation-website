import { z } from "zod";

/**
 * SINGLE SOURCE OF TRUTH for the Blog Posts collection.
 *
 * This schema describes the markdown *frontmatter* only. The markdown body is
 * the file's content (not frontmatter), so it isn't part of the Zod schema —
 * it's declared to Decap via `extraFields` in `blogPostsCms` below.
 *
 * One flat markdown file per post, so the cover image
 * is uploaded to the shared src/assets/media library rather than colocated.
 */
export const blogPostSchema = z.object({
  title: z.string().max(100),
  date: z.string().meta({ widget: "datetime" }),
  // Stores the referenced person's `name`; Decap resolves it against the
  // people collection, but the frontmatter value itself is still a plain string.
  author: z.string().meta({
    widget: "relation",
    collection: "people",
    search_fields: ["name"],
    value_field: "name",
    display_fields: ["name"],
  }),
  cover: z.string().optional().meta({ widget: "image" }),
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
  schema: blogPostSchema,
  extraFields: [{ name: "body", label: "Body", widget: "markdown" }],
};
