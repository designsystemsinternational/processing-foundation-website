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

/**
 * Used for gaps and spacings across different components
 */
export const spacings = [
  'none',
  'xs',
  's',
  'm',
  'l',
  'xl',
  '2xl',
  '3xl',
  '4xl',
  '5xl',
  '6xl',
] as const;

/** The accent color Divider and the Grid's data-variant share. */
export const dividerVariants = ['default', 'intersection'] as const;

/** Sizes match the `.heading-*` classes in src/styles/textStyles.css. */
export const headingSizes = ['2xs', 'xs', 's', 'm', 'l', 'xl'] as const;
export const headingTags = ['h1', 'h2', 'h3', 'h4'] as const;

export type ThreadSpan = (typeof threadSpans)[number];
export type DividerSize = (typeof dividerSizes)[number];
export type Spacing = (typeof spacings)[number];
export type DividerVariant = (typeof dividerVariants)[number];
export type HeadingSize = (typeof headingSizes)[number];
export type HeadingTag = (typeof headingTags)[number];

/** Button variants declared here for Button as props */
export const buttonVariants = [
  'primary',
  'secondary',
  'tertiary',
  'accent',
] as const;

export type ButtonVariant = (typeof buttonVariants)[number];

/** Layout variants for the Gallery block. */
export const galleryVariants = [
  'full',
  'gap',
  'offset',
  'carousel',
] as const;

export type GalleryVariant = (typeof galleryVariants)[number];

/** Roles a person in the People collection can hold. */
export const personRoles = [
  'Staff',
  'Board',
  'Advisor',
  'Mentor',
  'Alumn',
  'Fellow',
  'Grantee',
] as const;

export type PersonRole = (typeof personRoles)[number];

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

/**
 * Pages whose route lives in src/pages/ rather than in [...slug].astro, because
 * the route does something the page builder can't express (pagination, a listing
 * tied to another collection). The entry still lives in the `pages` collection
 * and is edited like any other page; its blocks render above whatever the route
 * hard-wires below them.
 *
 * Keyed by a short name for the route file to import; the value is the entry id,
 * which is the file path under src/content/pages minus the extension. Every id
 * here is skipped by [...slug].astro, so the two routes never collide. Note this
 * is the id, not the slug: renaming the entry's `slug` in the CMS can't orphan it.
 */
export const routedPages = {
  index: 'index',
  people: 'about/people',
  education: 'community/education',
  showcase: 'software/showcase',
  tools: 'software/tools',
  blog: 'blog',
  fellowships: 'programs/fellowships',
  grants: 'programs/grants',
} as const;

/*
 * Layout variants for the MediaText block. `left-to-right`, and `right to left` differ
 * only in the direction the content takes.
 */

export const mediaTextVariants = ['half', 'two-thirds'] as const;
export const mediaTextDirections = ['left-to-right', 'right-to-left'] as const;

export type MediaTextVariant = (typeof mediaTextVariants)[number];
export type MediaTextDirection = (typeof mediaTextDirections)[number];

/*
 * Layout variants for the MediaTextPair block: how the two columns are coloured.
 */

export const mediaTextPairVariants = ['default', 'contrast'] as const;

export type MediaTextPairVariant = (typeof mediaTextPairVariants)[number];

/*
 * Layout variants for the TextSection block: which grid columns the text takes,
 * and what decoration fills the columns it leaves empty.
 */

export const textSectionVariants = [
  'default',
  'centered-body',
  'weave-banner',
  'intersection-banner',
] as const;

export type TextSectionVariant = (typeof textSectionVariants)[number];

export const textSectionPairVariants = ['default', 'weave-banner'] as const;

export type TextSectionPairVariants = (typeof textSectionPairVariants)[number];

export const textHeavyGridTitleStyles = ['body', 'heading'] as const;

export type TextHeavyGridTitleStyle = (typeof textHeavyGridTitleStyles)[number];

export const highlightsGridVariants = ['offset', 'full'] as const;

export type HighlightsGridVariant = (typeof highlightsGridVariants)[number];

export const blockDefaults = {
  threadSpan: 1,
  dividerSize: 'xs',
  spacing: '6xl',
  dividerVariant: 'default',
  intro: {
    titleSize: 'l',
    titleTag: 'h2',
  },
} as const satisfies {
  threadSpan: ThreadSpan;
  dividerSize: DividerSize;
  spacing: Spacing;
  dividerVariant: DividerVariant;
  intro: { titleSize: HeadingSize; titleTag: HeadingTag };
};
