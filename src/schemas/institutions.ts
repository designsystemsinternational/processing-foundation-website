import { z } from 'zod';
import { studentBodies } from '../lib/constants.ts';
import { imageHint } from './shared.ts';

/**
 * SINGLE SOURCE OF TRUTH for the Institutions collection.
 *
 * Zod → Decap mapping (see src/lib/cms/generate-config.ts):
 *   - z.string()               -> widget: string
 *   - .meta({ widget: "image" }) -> widget: image, stored beside the entry
 *   - z.enum([...])            -> widget: select, options: [...]
 */
export const institutionSchema = z.object({
  name: z.string(),
  department: z.string().optional(),
  url: z.string().optional().meta({ label: 'URL' }),
  logo: z.string().optional().meta({ widget: 'image', hint: imageHint }),
  studentBody: z.enum(studentBodies).optional(),
  location: z.string().optional().meta({ label: 'Location' }),
});

export type Institution = z.infer<typeof institutionSchema>;

/**
 * Decap CMS collection definition. `schema` drives the generated fields; the
 * rest is collection-level config Zod can't express.
 */
export const institutionsCms = {
  name: 'institutions',
  label: 'Institutions',
  label_singular: 'Institution',
  folder: 'src/content/institutions',
  create: true,
  delete: true,
  identifier_field: 'name',
  extension: 'json',
  format: 'json',
  summary: '{{name}}',
  // Each entry gets its own directory, so its logo sits beside it.
  path: '{{slug}}/index',
  media_folder: '',
  public_folder: '',
  schema: institutionSchema,
};
