import { blockMeta } from '@/components/storybook/storyDecorators.ts';
import PlaceholderBlock from './PlaceholderBlock.astro';

export default {
  ...blockMeta,
  title: 'Blocks/PlaceholderBlock',
  component: PlaceholderBlock,
};

export const Default = {
  args: { title: 'Event calendar' },
};
