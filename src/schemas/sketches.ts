import { z } from 'zod';

/**
 * SINGLE SOURCE OF TRUTH for the Sketches collection.
 *
 * A sketch is a self-contained static page at public/sketches/<slug>/, with an
 * index.html of its own, which any media field can point at — see `media` in
 * ./shared.ts and components/composites/Media. This schema describes the
 * folder's optional sketch.json, which carries only what the site needs to
 * embed the page; src/lib/sketchFolders.ts reads it. The collection is
 * deliberately absent from the CMS: a folder of code is not editable through
 * Decap, so an editor picks a sketch and nothing more.
 */
export const sketchSchema = z.object({
  title: z.string(),
  // Must be the createCanvas() size: only the ratio reaches the browser, as the
  // box primitives/Sketch reserves for the frame. See lib/sketch.ts.
  width: z.coerce.number().positive().default(800),
  height: z.coerce.number().positive().default(600),
});

export type Sketch = z.infer<typeof sketchSchema>;
