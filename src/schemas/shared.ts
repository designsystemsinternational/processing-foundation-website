import type { ImageMetadata } from 'astro';
import { buttonVariants } from '../lib/constants';
import { z } from 'zod';

export const cmsImage = z.string().meta({ widget: 'image' });

/**
 * A link destination: a site-relative path ("/about/team") or an https URL —
 * nothing else. Decap sends "" for an untouched optional field, so the two
 * patterns differ only in whether they accept it.
 */
const linkPathBody = String.raw`(?:\/(?!\/)|https:\/\/[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+)[\w.~\-/?#[\]@:!$&'()*+,;=%]*`;

export const linkPathPattern = new RegExp(`^${linkPathBody}$`);
export const optionalLinkPathPattern = new RegExp(`^$|^${linkPathBody}$`);

export const linkPathMessage =
  'Must start with "/" or "https://" (e.g. "/about/team") and contain no spaces or unusual characters';

export const imageWithCaption = z.object({
  image: cmsImage,
  alt: z.string().optional().meta({ label: 'Alt text' }),
  caption: z.string().optional().meta({ widget: 'markdown' }),
});

// `image` is a path string in the schema (that's what Decap writes) but an
// ImageMetadata object at read time, once content.config.ts swaps in image().
export type ImageWithCaption = Omit<
  z.infer<typeof imageWithCaption>,
  'image'
> & {
  image: ImageMetadata;
};

export const actions = z.array(
  z.object({
    variant: z.enum(buttonVariants),
    label: z.string(),
    href: z.string(),
  }),
);
