import type { ImageMetadata } from 'astro';
import { buttonVariants } from '../lib/constants';
import { renderMarkdown, renderMarkdownInline } from '../lib/html.ts';
import { z } from 'zod';

/**
 * A markdown field. The value arrives at a component as rendered HTML, so no
 * component parses markdown itself. `markdownInline` omits the `<p>` wrapper,
 * for a caption or another field that sits inside a block element already.
 */
export const markdown = () =>
  z.string().meta({ widget: 'markdown' }).transform(renderMarkdown);

export const markdownInline = () =>
  z.string().meta({ widget: 'markdown' }).transform(renderMarkdownInline);

export const cmsImage = z.string().meta({ widget: 'image', label: 'Image' });

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
  src: cmsImage,
  alt: z.string().optional().meta({ label: 'Alt text' }),
  caption: markdownInline().optional(),
});

/** An image field on a collection or block, with `src` resolved by `srcField`. */
export const imageWithCaptionFor = <T extends z.ZodType>(srcField: T) =>
  imageWithCaption.extend({ src: srcField });

/**
 * The same, for a field an editor may leave empty. The inner `src` is optional
 * too: Decap validates an object widget's children even when the object itself
 * is `required: false`, so a required path here would block saving.
 */
export const optionalImageWithCaptionFor = <T extends z.ZodType>(srcField: T) =>
  imageWithCaption.extend({ src: srcField.optional() }).optional();

// `src` is a path string in the schema (that's what Decap writes) but an
// ImageMetadata object at read time, once content.config.ts swaps in image().
export type ImageWithCaption = Omit<z.infer<typeof imageWithCaption>, 'src'> & {
  src: ImageMetadata;
};

/**
 * A YouTube watch, share, or embed URL. Only the 11-character video id matters
 * downstream — see youtubeId in src/lib/media.ts — but the editor pastes
 * whatever the browser or the share sheet gave them.
 */
const youtubeUrlBody = String.raw`https:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)[\w-]{11}(?:[?&][^\s]*)?`;

export const youtubeUrlPattern = new RegExp(`^$|^${youtubeUrlBody}$`);

export const youtubeUrlMessage =
  'Must be a YouTube URL (e.g. "https://www.youtube.com/watch?v=dQw4w9WgXcQ")';

/**
 * One media item: an image, a YouTube video, or a p5 sketch, with a caption.
 * Every field is optional and there is no discriminator — the editor fills in
 * the one they want, and composites/Media picks by precedence (sketch, video,
 * image, then a placeholder). `alt` doubles as the iframe title for the two
 * embed kinds.
 */
export const media = z.object({
  src: cmsImage.optional(),
  alt: z.string().optional().meta({ label: 'Alt text' }),
  youtubeUrl: z
    .string()
    .regex(youtubeUrlPattern, youtubeUrlMessage)
    .optional()
    .meta({ label: 'YouTube URL' }),
  sketch: z
    .string()
    .optional()
    .meta({
      widget: 'relation',
      collection: 'sketches',
      search_fields: ['title'],
      value_field: '{{slug}}',
      display_fields: ['title'],
      hint: 'Fill in one of Image, YouTube URL, or Sketch.',
    }),
  caption: markdownInline().optional(),
});

/** A media field on a collection or block, with `src` resolved by `srcField`. */
export const mediaFor = <T extends z.ZodType>(srcField: T) =>
  media.extend({ src: srcField.optional() });

/** The same, for a field an editor may leave empty entirely. */
export const optionalMediaFor = <T extends z.ZodType>(srcField: T) =>
  mediaFor(srcField).optional();

// `src` is a path string in the schema (that's what Decap writes) but an
// ImageMetadata object at read time, once content.config.ts swaps in image().
export type Media = Omit<z.infer<typeof media>, 'src'> & {
  src?: ImageMetadata;
};

export const number = z.object({
  n: z
    .number()
    .positive()
    .meta({ min: 0, hint: 'Only positive numbers allowed.' }),
  suffix: z.string().optional(),
  description: z.string(),
  subDescription: z.string().optional(),
  timeSpan: z.string().optional(),
});

export const action = z.object({
  variant: z.enum(buttonVariants).optional(),
  label: z.string(),
  href: z.string(),
});

export const actions = z.array(action);
