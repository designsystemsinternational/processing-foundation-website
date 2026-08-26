import { z } from 'zod';

/**
 * SINGLE SOURCE OF TRUTH for the Sketches collection.
 *
 * A sketch is a p5 program that any media field can point at — see `media` in
 * ./shared.ts and components/composites/Media. This schema describes the
 * markdown *frontmatter*; the JavaScript is the file body, so it sits on real
 * lines and a diff stays readable. The body is declared to Decap via
 * `extraFields` in `sketchesCms` below, and read raw off `entry.body` — it
 * never goes through the markdown pipeline.
 */
export const sketchSchema = z.object({
  title: z.string(),
  // The exact createCanvas() size. primitives/Sketch reserves this ratio around
  // the iframe; the canvas inside then scales to fill it.
  width: z.coerce
    .number()
    .positive()
    .meta({ value_type: 'int', hint: 'Must match createCanvas().' }),
  height: z.coerce.number().positive().meta({ value_type: 'int' }),
  css: z.string().optional().meta({
    label: 'CSS',
    widget: 'code',
    default_language: 'css',
    output_code_only: true,
  }),
  htmlBody: z.string().optional().meta({
    label: 'Extra HTML',
    widget: 'code',
    default_language: 'html',
    output_code_only: true,
  }),
  // Loaded after p5 itself, for an addon like p5.sound.
  scripts: z.array(z.string()).optional().meta({
    label: 'Extra script URLs',
    label_singular: 'Script URL',
  }),
});

export type Sketch = z.infer<typeof sketchSchema>;

/**
 * Decap CMS collection definition. `output_code_only` makes the code widget
 * store a plain string rather than its `{ code, lang }` map, so `body` is the
 * JavaScript and nothing else.
 */
export const sketchesCms = {
  name: 'sketches',
  label: 'Sketches',
  label_singular: 'Sketch',
  folder: 'src/content/sketches',
  create: true,
  delete: true,
  identifier_field: 'title',
  summary: '{{title}} ({{width}}×{{height}})',
  schema: sketchSchema,
  extraFields: [
    {
      name: 'body',
      label: 'Sketch code',
      widget: 'code',
      default_language: 'javascript',
      output_code_only: true,
    },
  ],
};
