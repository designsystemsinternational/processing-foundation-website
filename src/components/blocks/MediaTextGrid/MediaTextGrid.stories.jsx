import { renderMarkdown, renderMarkdownInline } from '@/lib/html.ts';
import catalogCover from '@/content/blogPosts/20th-anniversary-processing-community-catalog-out-now/QPUR1NyVbtmm1MB71IxG6A.webp';
import catalogPreview from '@/content/blogPosts/20th-anniversary-processing-community-catalog-out-now/btQ3XaQIFXnMpqakDxAMmw.webp';
import catalogSpread from '@/content/blogPosts/20th-anniversary-processing-community-catalog-out-now/CdlxQfoGC0HDr2yKmubexQ.webp';
import socHeader from '@/content/blogPosts/announcing-our-google-summer-of-code-contributors/soc-header.webp';
import { blockMeta } from '@/components/storybook/storyDecorators.ts';
import {
  mediaTextGridItemColumns,
  mediaTextGridLayouts,
} from '@/lib/constants.ts';
import MediaTextGrid from './MediaTextGrid.astro';

const image = (src) => ({
  src,
  alt: 'Community members sitting together at a Processing Community Day event',
  caption: renderMarkdownInline(
    'This is an example of how the the image caption would look',
  ),
});

const body = renderMarkdown(
  `The first Processing Community Day (PCD) was organized by Taeyoon Choi and the Processing Foundation in 2017. Taking place at the MIT Media Lab, PCD 2017 drew community members from all over the East Coast to get together to meet and share what they’re working on.`,
);

const items = [
  {
    title: 'PCD through the years',
    subtitle: 'Community',
    body,
    actions: [{ label: 'View PCD website', href: '/' }],
    media: image(catalogCover),
  },
  {
    title: 'Fellowships',
    subtitle: 'Programs',
    body,
    actions: [{ label: 'Read more', href: '/', variant: 'tertiary' }],
    media: image(socHeader),
  },
  {
    title: 'The Processing Community Catalog',
    subtitle: 'Publications',
    body,
    actions: [{ label: 'Order a copy', href: '/', variant: 'accent' }],
    media: image(catalogSpread),
  },
  {
    title: 'pr05',
    subtitle: 'Grants',
    body,
    actions: [{ label: 'Learn more', href: '/' }],
    media: image(catalogPreview),
  },
];

export default {
  ...blockMeta,
  title: 'Blocks/MediaTextGrid',
  component: MediaTextGrid,
  argTypes: {
    ...blockMeta.argTypes,
    layout: {
      control: { type: 'select' },
      options: mediaTextGridLayouts,
    },
    itemColumns: {
      control: { type: 'select' },
      options: mediaTextGridItemColumns,
    },
    mediaFirst: { control: 'boolean' },
  },
  args: {
    ...blockMeta.args,
    layout: 'default',
    itemColumns: 3,
    items,
  },
};

/** Four items per row, every slot filled. */
export const Default = {};

export const DefaultNarrow = {
  args: { itemColumns: 2, items: [...items, ...items] },
};

export const DefaultWide = {
  args: { itemColumns: 6 },
};

/** An empty slot beside each item, swapping sides on every second line. */
export const Zigzag = {
  args: { layout: 'zigzag' },
};

/** The InstitutionGrid layout: three pairs per row. */
export const ZigzagNarrow = {
  args: { layout: 'zigzag', itemColumns: 2, items: [...items, ...items] },
};

export const ZigzagWide = {
  args: { layout: 'zigzag', itemColumns: 6 },
};

export const TextBelowMedia = {
  args: { mediaFirst: false },
};

export const WithoutMedia = {
  args: {
    items: items.map(({ media: _media, ...rest }) => rest),
  },
};

/** An odd count, so the last line stops part way through the zig-zag. */
export const ThreeItems = {
  args: { layout: 'zigzag', items: items.slice(0, 3) },
};

export const FiveItems = {
  args: {
    layout: 'zigzag',
    itemColumns: 2,
    items: [...items, items[0]],
  },
};

export const SingleItem = {
  args: { layout: 'zigzag', items: items.slice(0, 1) },
};

/** The page theme's `threadSpan`, which the Divider inherits. */
export const ThreadSpanTwo = {
  args: { threadSpan: 2 },
};
