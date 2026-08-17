import type { Block, BlockType } from '@/schemas/pages.ts';
import FeaturedBlogPost from './FeaturedBlogPost/index.ts';
import Images from './Images/index.ts';
import FellowshipMediaText from './MediaText/FellowshipMediaText.astro';
import MediaText from './MediaText/MediaText.astro';
import PageHero from './PageHero/index.ts';
import TextSection from './TextSection/index.ts';

/**
 * Maps each block `type` (the discriminator from schema.ts) to the Astro
 * component that renders it. Add a new block here alongside its schema.
 */
export const blockComponents: {
  [K in BlockType]: (props: Extract<Block, { type: K }>) => unknown;
} = {
  pageHero: PageHero,
  images: Images,
  mediaText: MediaText,
  fellowshipMediaText: FellowshipMediaText,
  textSection: TextSection,
  featuredBlogPost: FeaturedBlogPost,
};
