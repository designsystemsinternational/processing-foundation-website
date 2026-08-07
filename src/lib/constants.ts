/**
 * Theme keys match the `data-theme` values defined in src/styles/variables.css;
 * labels match the comment above each theme block there (e.g. "Red and blue").
 * Rename/extend both together — "default" needs no data-theme attribute.
 */
export const themeOptions = {
  default: 'Default',
  'theme-2': 'Purple and Orange',
  'theme-3': 'Green and Pink',
  'theme-4': 'Pink and Purple',
  'theme-5': 'PF Purple',
  'theme-6': 'Orange and Blue',
} as const;

export type ThemeName = keyof typeof themeOptions;

/**
 * The Block chrome every block shares: the Divider above it, and its own
 * spacing. Values match the `data-size`/`data-spacing` selectors in
 * Divider.module.css and Block.module.css — extend both together.
 */
export const threadSpans = [1, 2, 3, 4] as const;
export const dividerSizes = ['s', 'm', 'l', 'xl'] as const;
export const blockSpacings = ['none', 'xs', 's', 'm', 'l'] as const;

export type ThreadSpan = (typeof threadSpans)[number];
export type DividerSize = (typeof dividerSizes)[number];
export type BlockSpacing = (typeof blockSpacings)[number];

/** Layout variants for the Images block. */
export const imagesVariants = ['full', 'gap', 'offset'] as const;

export type ImagesVariant = (typeof imagesVariants)[number];

export const blockDefaults = {
  threadSpan: 1,
  dividerSize: 's',
  spacing: 'm',
} as const satisfies {
  threadSpan: ThreadSpan;
  dividerSize: DividerSize;
  spacing: BlockSpacing;
};
