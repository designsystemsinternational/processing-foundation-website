import type { Block, BlockType } from '@/schemas/pages.ts';
import Images from './Images/index.ts';
import FellowshipMediaText from './MediaText/FellowshipMediaText.astro';
import MediaText from './MediaText/MediaText.astro';
import MediaTextPair from './MediaTextPair/index.ts';
import PageHero from './PageHero/index.ts';
import TextSection from './TextSection/index.ts';
import StatementList from './StatementList/index.ts';
import HorizontalStatementList from './HorizontalStatementList/index.ts';
import FeaturedBlogPost from './FeaturedBlogPost/index.ts';

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
  horizontalStatementList: HorizontalStatementList,
  mediaText: MediaText,
  fellowshipMediaText: FellowshipMediaText,
  mediaTextPair: MediaTextPair,
  textSection: TextSection,
  featuredBlogPost: FeaturedBlogPost,
};
