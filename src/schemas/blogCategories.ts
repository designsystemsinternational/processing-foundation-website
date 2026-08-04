import { z } from "zod";

/**
 * SINGLE SOURCE OF TRUTH for the Blog Categories collection.
 *
 * Flat JSON entries (no markdown body), same shape as pages.ts.
 */
export const blogCategorySchema = z.object({
  name: z.string(),
  // Left blank, it's auto-filled from the name on save.
  slug: z.string().optional().meta({ label: "Custom slug" }),
  description: z.string().optional().meta({ widget: "text" }),
});

export type BlogCategory = z.infer<typeof blogCategorySchema>;

/**
 * Decap CMS collection definition. `schema` drives the generated fields.
 */
export const blogCategoriesCms = {
  name: "blog-categories",
  label: "Blog Categories",
  folder: "src/content/blogCategories",
  create: true,
  delete: true,
  identifier_field: "name",
  extension: "json",
  format: "json",
  schema: blogCategorySchema,
};
