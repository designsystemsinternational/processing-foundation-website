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

/** Sizes match the `.body-*` classes in src/styles/textStyles.css. */
export const bodySizes = ['l', 'm', 's', 'xs', '2xs'] as const;

export type ThreadSpan = (typeof threadSpans)[number];
export type DividerSize = (typeof dividerSizes)[number];
export type Spacing = (typeof spacings)[number];
export type DividerVariant = (typeof dividerVariants)[number];
export type HeadingSize = (typeof headingSizes)[number];
export type BodySize = (typeof bodySizes)[number];
export type HeadingTag = (typeof headingTags)[number];

/** Button variants declared here for Button as props */
export const buttonVariants = [
  'primary',
  'secondary',
  'tertiary',
  'accent',
] as const;

export type ButtonVariant = (typeof buttonVariants)[number];

/** Layout variants for the ButtonGroup composite. */
export const buttonGroupVariants = ['default', 'stretch'] as const;

export type ButtonGroupVariant = (typeof buttonGroupVariants)[number];
/** Optional leading icons for Button. */
export const buttonIcons = ['heart'] as const;

export type ButtonIcon = (typeof buttonIcons)[number];

/** Layout variants for the Gallery block. */
export const galleryVariants = ['full', 'carousel'] as const;

export type GalleryVariant = (typeof galleryVariants)[number];

/** Roles a person in the People collection can hold. */
export const personRoles = [
  'Staff',
  'Board',
  'Advisor',
  'Resident Developer',
  'Resident Designer',
  'Mentor',
  'Fellow',
  'Grantee',
  'Alumn',
  'Contributor',
] as const;

export type PersonRole = (typeof personRoles)[number];

/** Types of student body an institution in the Institutions collection can have. */
export const studentBodies = [
  'University',
  'K-12',
  'Community College',
  'Nonprofit',
] as const;

export type StudentBody = (typeof studentBodies)[number];

/**
 * Caption text sizes an Image can render. Each one names a --text-size-body-*
 * token and matches a `data-caption-size` selector in Image.module.css —
 * extend all three together.
 */
export const captionSizes = ['s', 'xs', '2xs'] as const;

export type CaptionSize = (typeof captionSizes)[number];

/**
 * Aspect ratios a placeholder can reserve. Each one names an --aspect-* token
 * in src/styles/variables.css and matches a `data-aspect-ratio` selector in
 * ImagePlaceholder.module.css — extend all three together.
 */
export const aspectRatios = ['square', 'landscape', 'wide'] as const;

export type AspectRatio = (typeof aspectRatios)[number];

/**
 * Social platforms the Footer can link to. Each one needs a matching
 * src/assets/social/<platform>.svg whose paths use `fill="currentColor"`, so
 * the icon follows the active colour theme.
 */
export const socialPlatforms = [
  'github',
  'instagram',
  'linkedin',
  'youtube',
  'vimeo',
  'x',
  'discord',
] as const;

export type SocialPlatform = (typeof socialPlatforms)[number];

/**
 * Layout variants for the PageHero block. `default`, `medium` and `wide` differ
 * only in how many columns the image takes; `accent` is `default` plus an inner
 * divider, a wider text column, and accent gradients.
 */
export const pageHeroVariants = [
  'default',
  'accent',
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
  blogSearch: 'blog/search',
  fellowships: 'programs/fellowships',
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

export const quoteVariants = ['default', 'hero'] as const;

export type QuoteVariant = (typeof quoteVariants)[number];

export const accordionOpenModes = ['closed', 'first', 'all'] as const;

export type AccordionOpenMode = (typeof accordionOpenModes)[number];

export const highlightsGridVariants = ['offset', 'full'] as const;

export type HighlightsGridVariant = (typeof highlightsGridVariants)[number];

/*
 * How many of the 12 grid columns one HighlightsGrid item spans. The `offset`
 * variant pairs an item with an equally wide empty slot, so only values whose
 * double divides 12 are offered.
 */

export const highlightsGridItemColumns = [2, 3, 6] as const;

export type HighlightsGridItemColumns =
  (typeof highlightsGridItemColumns)[number];

export const employmentStatusModes = [
  'full-time',
  'part-time',
  'freelance',
] as const;

export type EmploymentStatusModes = (typeof employmentStatusModes)[number];

export const Labels = ['Full-time', 'Part-time', 'Freelance'] as const;
export type LabelsType = (typeof Labels)[number];

export const contactTopics = [
  'Fellowships',
  'PCD',
  'Employment',
  'Give',
  'Education',
  'General',
] as const;

export type ContactTopic = (typeof contactTopics)[number];

export interface IconProps {
  size: number;
  className?: string;
}

export const textHeavyGridLinkVariants = ['button', 'link'] as const;

export type TextHeavyGridLinkVariant =
  (typeof textHeavyGridLinkVariants)[number];

export const blockDefaults = {
  threadSpan: 1,
  dividerSize: 'xs',
  dividerVariant: 'default',
  spacing: '6xl',
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

/**
 * The p5 build every sketch iframe loads. Pinned: a sketch is authored against
 * one major version, and the CDN serves the frame directly, so a floating tag
 * would change every sketch at once.
 */
export const P5_CDN_URL = 'https://cdn.jsdelivr.net/npm/p5@2.0.3/lib/p5.min.js';
