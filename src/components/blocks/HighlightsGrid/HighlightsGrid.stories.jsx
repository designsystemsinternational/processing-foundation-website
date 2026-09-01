import catalogCover from '@/content/blogPosts/20th-anniversary-processing-community-catalog-out-now/QPUR1NyVbtmm1MB71IxG6A.webp';
import catalogPreview from '@/content/blogPosts/20th-anniversary-processing-community-catalog-out-now/btQ3XaQIFXnMpqakDxAMmw.webp';
import catalogSpread from '@/content/blogPosts/20th-anniversary-processing-community-catalog-out-now/CdlxQfoGC0HDr2yKmubexQ.webp';
import socHeader from '@/content/blogPosts/announcing-our-google-summer-of-code-contributors/soc-header.webp';
import { blockMeta } from '@/components/storybook/storyDecorators.ts';
import {
  highlightsGridItemColumns,
  highlightsGridVariants,
  imageFits,
} from '@/lib/constants.ts';
import HighlightsGrid from './HighlightsGrid.astro';

const highlights = [
  {
    image: catalogCover,
    imageAlt: 'The Processing Community Catalog, orange cover with white text',
    eyebrow: 'Read',
    title:
      'Easy but awesome: free and open-source creative tools for middle-school students',
    categories: ['Research', 'Fellowship'],
    link: '/blog/easy-but-awesome',
  },
  {
    image: socHeader,
    imageAlt: 'Google Summer of Code contributors',
    eyebrow: 'Share',
    title: 'Highlights from Processing Community Day Santiago',
    categories: ['Community', 'Event'],
    link: 'https://processingfoundation.org',
  },
  {
    image: catalogSpread,
    imageAlt: 'A spread showing the mission statement and table of contents',
    eyebrow: 'Apply',
    title: 'The Processing Foundation Fellowship is now live for 2027!',
    categories: ['Research', 'Fellowship'],
    link: '/fellowships',
  },
  {
    image: catalogPreview,
    imageAlt: 'The Processing Community Catalog seen from three sides',
    eyebrow: 'Join',
    title:
      'Collaborate with creative educators worldwide through our upcoming virtual summit',
    categories: ['Community', 'Event'],
    link: '/blog',
  },
];

export default {
  ...blockMeta,
  title: 'Blocks/HighlightsGrid',
  component: HighlightsGrid,
  argTypes: {
    ...blockMeta.argTypes,
    variant: {
      control: { type: 'select' },
      options: highlightsGridVariants,
    },
    itemColumns: {
      control: { type: 'select' },
      options: highlightsGridItemColumns,
    },
    imageFit: {
      control: { type: 'select' },
      options: imageFits,
    },
  },
  args: {
    ...blockMeta.args,
    variant: 'offset',
    highlights,
  },
};

/** The design: an empty slot between every card, flipping each row. */
export const Default = {};

/** Four cards per row, no empty slots. */
export const Full = {
  args: { variant: 'full' },
};

/** Three pairs per row, the InstitutionGrid width. */
export const OffsetNarrow = {
  args: { itemColumns: 2, highlights: [...highlights, ...highlights] },
};

/** One pair per row. */
export const OffsetWide = {
  args: { itemColumns: 6 },
};

/** Whole images, letterboxed against the card background. */
export const ContainImages = {
  args: { imageFit: 'contain' },
};

export const FullNarrow = {
  args: {
    variant: 'full',
    itemColumns: 2,
    highlights: [...highlights, ...highlights],
  },
};

export const FullWide = {
  args: { variant: 'full', itemColumns: 6 },
};

export const ThreeHighlights = {
  args: { highlights: highlights.slice(0, 3) },
};

export const SingleHighlight = {
  args: { highlights: highlights.slice(0, 1) },
};

export const ManyHighlights = {
  args: { highlights: [...highlights, ...highlights, ...highlights] },
};

export const ManyHighlightsFull = {
  args: { variant: 'full', highlights: [...highlights, ...highlights] },
};

export const WithoutImages = {
  args: {
    highlights: highlights.map(({ image: _image, ...rest }) => rest),
  },
};

export const WithoutLinks = {
  args: {
    highlights: highlights.map(({ link: _link, ...rest }) => rest),
  },
};

export const WithoutCategories = {
  args: {
    highlights: highlights.map(({ categories: _categories, ...rest }) => rest),
  },
};

export const WithoutEyebrows = {
  args: {
    highlights: highlights.map(({ eyebrow: _eyebrow, ...rest }) => rest),
  },
};

/** The page theme's `threadSpan`, which the Dividers inherit. */
export const ThreadSpanTwo = {
  args: { threadSpan: 2 },
};
