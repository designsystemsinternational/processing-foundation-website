/**
 * Colour theme keys match the `data-color-theme` values defined in
 * src/styles/variables.css; labels match the comment above each theme block
 * there (e.g. "Red and blue"). Rename/extend both together — "default" needs
 * no data-color-theme attribute.
 */
export const colorThemeOptions = {
  default: 'Default',
  'theme-2': 'Purple and Orange',
  'theme-3': 'Green and Pink',
  'theme-4': 'Pink and Purple',
  'theme-5': 'PF Purple',
  'theme-6': 'Orange and Blue',
} as const;

export type ColorThemeName = keyof typeof colorThemeOptions;

/**
 * The Block chrome every block shares: the Divider above it, and its own
 * spacing. Values match the `data-size`/`data-spacing` selectors in
 * Divider.module.css and Block.module.css — extend both together.
 */
export const threadSpans = [1, 2, 3, 4] as const;
export const dividerSizes = ['xs', 's', 'm', 'l'] as const;
export const blockSpacings = ['none', 'xs', 's', 'm', 'l'] as const;

/** The accent color Divider and the Grid's data-variant share. */
export const dividerVariants = ['default', 'intersection'] as const;

export type ThreadSpan = (typeof threadSpans)[number];
export type DividerSize = (typeof dividerSizes)[number];
export type BlockSpacing = (typeof blockSpacings)[number];
export type DividerVariant = (typeof dividerVariants)[number];

/** Layout variants for the Images block. */
export const imagesVariants = ['full', 'gap', 'offset'] as const;

export type ImagesVariant = (typeof imagesVariants)[number];

/**
 * Caption text sizes an Image can render. Each one names a --text-size-body-*
 * token and matches a `data-caption-size` selector in Image.module.css —
 * extend all three together.
 */
export const captionSizes = ['s', 'xs', '2xs'] as const;

export type CaptionSize = (typeof captionSizes)[number];

/**
 * Social platforms the Footer can link to. Each one needs a matching
 * src/assets/social/<platform>.svg whose paths use `fill="currentColor"`, so
 * the icon follows the active colour theme.
 */
export const socialPlatforms = [
  'instagram',
  'x',
  'youtube',
  'vimeo',
  'discord',
] as const;

export type SocialPlatform = (typeof socialPlatforms)[number];

/**
 * Layout variants for the PageHero block. `default`, `medium` and `wide` differ
 * only in how many columns the image takes; `accent` and `half-accent` are
 * `default` plus an inner divider and one or two accent gradients.
 */
export const pageHeroVariants = [
  'default',
  'accent',
  'half-accent',
  'medium',
  'wide',
] as const;

export type PageHeroVariant = (typeof pageHeroVariants)[number];

export const blockDefaults = {
  threadSpan: 1,
  dividerSize: 'xs',
  spacing: 'm',
  dividerVariant: 'default',
} as const satisfies {
  threadSpan: ThreadSpan;
  dividerSize: DividerSize;
  spacing: BlockSpacing;
  dividerVariant: DividerVariant;
};
