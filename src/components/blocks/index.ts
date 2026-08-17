import type { Block, BlockType } from '@/schemas/pages.ts';
import FeaturedBlogPost from './FeaturedBlogPost/index.ts';
import Images from './Images/index.ts';
import MediaText from './MediaText/MediaText.astro';
import Numbers from './Numbers/index.ts';
import PageHero from './PageHero/index.ts';
import StatementList from './StatementList/index.ts';

/**
 * Maps each block `type` (the discriminator from schema.ts) to the Astro
 * component that renders it. Add a new block here alongside its schema.
 */
export const blockComponents: {
  [K in BlockType]: (props: Extract<Block, { type: K }>) => unknown;
} = {
  pageHero: PageHero,
  images: Images,
  numbers: Numbers,
  statementList: StatementList,
  mediaText: MediaText,
  featuredBlogPost: FeaturedBlogPost,
};
