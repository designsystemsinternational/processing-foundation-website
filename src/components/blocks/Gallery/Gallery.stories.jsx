import { renderMarkdownInline } from '@/lib/html.ts';
import catalogCover from '@/content/blogPosts/20th-anniversary-processing-community-catalog-out-now/QPUR1NyVbtmm1MB71IxG6A.webp';
import catalogPreview from '@/content/blogPosts/20th-anniversary-processing-community-catalog-out-now/btQ3XaQIFXnMpqakDxAMmw.webp';
import catalogSpread from '@/content/blogPosts/20th-anniversary-processing-community-catalog-out-now/CdlxQfoGC0HDr2yKmubexQ.webp';
import { blockMeta } from '@/components/storybook/storyDecorators.ts';
import { captionSizes, galleryVariants } from '@/lib/constants.ts';
import Gallery from './Gallery.astro';
import { initCarousel } from './carousel.ts';

export default {
  ...blockMeta,
  title: 'Blocks/Gallery',
  component: Gallery,
  argTypes: {
    ...blockMeta.argTypes,
    variant: {
      control: { type: 'select' },
      options: galleryVariants,
    },
    gradients: { control: { type: 'boolean' } },
    captionSize: { control: { type: 'select' }, options: captionSizes },
  },
};

const cover = {
  src: catalogCover,
  alt: 'The Processing Community Catalog, orange cover with white text',
  caption: renderMarkdownInline(
    'Processing Community Catalog, with orange cover, white text, and purple and white pages',
  ),
};

const preview = {
  src: catalogPreview,
  alt: 'The Processing Community Catalog seen from three sides',
  caption: renderMarkdownInline(
    'Preview of the Processing Community Catalog in frontal, side, and back views',
  ),
};

const spread = {
  src: catalogSpread,
  alt: 'A spread showing the mission statement and table of contents',
  caption: renderMarkdownInline(
    'A preview that shows the [Processing Foundation’s mission statement](https://processingfoundation.org), as well as a table of contents',
  ),
};

export const Default = {
  args: {
    variant: 'full',
    media: [cover, preview, spread],
  },
};

export const FullOne = {
  args: {
    variant: 'full',
    media: [spread],
  },
};

export const FullTwo = {
  args: {
    variant: 'full',
    media: [cover, preview],
  },
};

export const FullFour = {
  args: {
    variant: 'full',
    media: [cover, preview, spread, cover],
  },
};

export const FullFive = {
  args: {
    variant: 'full',
    media: [cover, preview, spread, cover, preview],
  },
};

export const FullSix = {
  args: {
    variant: 'full',
    media: [cover, preview, spread, cover, preview, spread],
  },
};

export const Gradients = {
  args: {
    variant: 'full',
    gradients: true,
    media: [cover, preview, spread, cover, preview, spread],
  },
};

// Storybook's Astro renderer never runs the component's own hoisted <script>.
const startCarousel = ({ canvasElement }) => {
  canvasElement.querySelectorAll('[data-carousel]').forEach(initCarousel);
};

export const CarouselOne = {
  args: {
    variant: 'carousel',
    media: [spread],
  },
  play: startCarousel,
};

export const CarouselMultiple = {
  args: {
    variant: 'carousel',
    media: [cover, preview, spread],
  },
  play: startCarousel,
};
