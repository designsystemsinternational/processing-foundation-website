import { z } from 'zod';
import { socialPlatforms } from '../lib/constants.ts';
import { linkPathMessage, linkPathPattern } from './shared.ts';

/**
 * SINGLE SOURCE OF TRUTH for the site footer.
 *
 * One file, one entry — the footer is the same on every page, so this is a
 * Decap file collection (like `navigation`) rather than a folder of entries.
 *
 * `platform` is an enum rather than a path to a logo file: the component
 * resolves it to an inline SVG from src/assets/social/, which an <img src>
 * can't be, because an externally-referenced SVG can't inherit the active
 * colour theme through `currentColor`.
 */

const linkPath = z
  .string()
  .regex(linkPathPattern, linkPathMessage)
  .meta({ label: 'Link (e.g. "/about" or "https://processing.org")' });

const link = z.object({
  title: z.string(),
  path: linkPath,
});

const socialLink = link.extend({
  platform: z.enum(socialPlatforms),
});

const listOptions = {
  collapsed: true,
  summary: '{{fields.title}}',
};

export const footerSchema = z.object({
  heading: z.string(),
  support: link,
  socialLinks: z.array(socialLink).meta({
    ...listOptions,
    label_singular: 'Social link',
  }),
  newsletter: z.object({
    helper: z.string(),
    placeholder: z.string(),
    label: z.string(),
    submitLabel: z.string(),
  }),
  copyright: z.string().meta({ widget: 'markdown' }),
  legalLinks: z.array(link).meta({
    ...listOptions,
    label_singular: 'Link',
  }),
});

export type Footer = z.infer<typeof footerSchema>;
export type SocialLink = z.infer<typeof socialLink>;

export const footerCms = {
  name: 'footer',
  label: 'Footer',
  files: [
    {
      name: 'footer',
      label: 'Footer',
      path: 'src/content/footer/footer.json',
    },
  ],
  schema: footerSchema,
};
