import Block from './Block.astro';
import { blockMeta } from '@/components/storybook/storyDecorators.ts';

export default {
  ...blockMeta,
  title: 'Composites/Block',
  component: Block,
};

export const Default = {
  args: {
    slots: { default: 'Content here' },
  },
};
