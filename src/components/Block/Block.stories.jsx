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

export const Stacked = {
  parameters: { controls: { include: ['colorTheme'] } },
  render: () =>
    [
      { threadSpan: 1, dividerSize: 's' },
      { threadSpan: 2, dividerSize: 'm', spacing: 'none' },
      { threadSpan: 4, dividerSize: 'xl' },
    ].map((props) => ({
      component: Block,
      props,
      slots: { default: 'Content here' },
    })),
};
