import { z } from 'zod';

/**
 * SINGLE SOURCE OF TRUTH for the Tools collection.
 *
 * Zod → Decap mapping (see src/lib/cms/generate-config.ts):
 *   - z.string()               -> widget: string
 *   - .meta({ widget: "image" }) -> widget: image, stored beside the entry
 */
export const toolSchema = z.object({
  name: z.string(),
  language: z.string().optional(),
  url: z.string().optional().meta({ label: 'URL' }),
  image: z.string().optional().meta({ widget: 'image' }),
});

export type Tool = z.infer<typeof toolSchema>;

/**
 * Decap CMS collection definition. `schema` drives the generated fields; the
 * rest is collection-level config Zod can't express.
 */
export const toolsCms = {
  name: 'tools',
  label: 'Tools',
  label_singular: 'Tool',
  folder: 'src/content/tools',
  create: true,
  delete: true,
  identifier_field: 'name',
  extension: 'json',
  format: 'json',
  summary: '{{name}}',
  // Each entry gets its own directory, so its image sits beside it.
  path: '{{slug}}/index',
  media_folder: '',
  public_folder: '',
  schema: toolSchema,
};
