import Block from './Block.astro';
import { blockMeta } from '@/components/storybook/storyDecorators.ts';

export default {
  ...blockMeta,
  title: 'Components/Block',
  component: Block,
};

export const Default = {
  args: {
    slots: { default: 'Content here' },
  },
};
