import { z } from "zod";

/**
 * SINGLE SOURCE OF TRUTH for the Blog Posts collection.
 *
 * This schema describes the markdown *frontmatter* only. The markdown body is
 * the file's content (not frontmatter), so it isn't part of the Zod schema —
 * it's declared to Decap via `extraFields` in `blogPostsCms` below.
 *
 * One flat markdown file per post, so images (header image and any embedded
 * in the body) go to their own subfolder under src/assets/media. Set at the
 * collection level (media_folder/public_folder on blogPostsCms below), since
 * a field-level override wouldn't apply to images embedded in the body.
 */
export const blogPostSchema = z.object({
  title: z.string().max(100),
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
  headerImage: z.string().optional().meta({ widget: "image" }),
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
  media_folder: "/src/assets/media/blogPosts",
  public_folder: "/src/assets/media/blogPosts",
  schema: blogPostSchema,
  extraFields: [{ name: "body", label: "Body", widget: "markdown" }],
};
