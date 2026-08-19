import type { Block, BlockType } from '@/schemas/pages.ts';
import FeaturedBlogPost from './FeaturedBlogPost/index.ts';
import HighlightsGrid from './HighlightsGrid/index.ts';
import Images from './Images/index.ts';
import FellowshipMediaText from './MediaText/FellowshipMediaText.astro';
import LogosText from './LogosText/LogosText.astro';
import MediaText from './MediaText/MediaText.astro';
import MediaTextPair from './MediaTextPair/index.ts';
import Numbers from './Numbers/index.ts';
import PageHero from './PageHero/index.ts';
import PeopleHeader from './PeopleHeader/index.ts';
import TextHeavyGrid from './TextHeavyGrid/index.ts';
import PlaceholderBlock from './PlaceholderBlock/index.ts';
import TextSection from './TextSection/index.ts';
import StatementList from './StatementList/index.ts';
import HorizontalStatementList from './HorizontalStatementList/index.ts';

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
  horizontalStatementList: HorizontalStatementList,
  mediaText: MediaText,
  fellowshipMediaText: FellowshipMediaText,
  mediaTextPair: MediaTextPair,
  textSection: TextSection,
  featuredBlogPost: FeaturedBlogPost,
  placeholderBlock: PlaceholderBlock,
  highlightsGrid: HighlightsGrid,
  logosText: LogosText,
  textHeavyGrid: TextHeavyGrid,
  peopleHeader: PeopleHeader,
};
