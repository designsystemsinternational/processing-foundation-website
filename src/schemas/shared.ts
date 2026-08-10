import type { ImageMetadata } from 'astro';
import { z } from 'zod';

export const cmsImage = z.string().meta({ widget: 'image' });

export const imageWithCaption = z.object({
  image: cmsImage,
  alt: z.string().optional().meta({ label: 'Alt text' }),
  caption: z.string().optional().meta({ widget: 'markdown' }),
});

// `image` is a path string in the schema (that's what Decap writes) but an
// ImageMetadata object at read time, once content.config.ts swaps in image().
export type ImageWithCaption = Omit<z.infer<typeof imageWithCaption>, 'image'> & {
  image: ImageMetadata;
};
