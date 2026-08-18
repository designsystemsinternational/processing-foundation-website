import type { Block, BlockType } from '@/schemas/pages.ts';
import Images from './Images/index.ts';
import PageHero from './PageHero/index.ts';
import StatementList from './StatementList/index.ts';
import FeaturedBlogPost from './FeaturedBlogPost/index.ts';
import HighlightsGrid from './HighlightsGrid/index.ts';
import MediaText from './MediaText/MediaText.astro';

/**
 * Maps each block `type` (the discriminator from schema.ts) to the Astro
 * component that renders it. Add a new block here alongside its schema.
 */
export const blockComponents: {
  [K in BlockType]: (props: Extract<Block, { type: K }>) => unknown;
} = {
  pageHero: PageHero,
  images: Images,
  statementList: StatementList,
  mediaText: MediaText,
  featuredBlogPost: FeaturedBlogPost,
  highlightsGrid: HighlightsGrid,
};
