import Block from './Block.astro';
// storybook-astro's SSR render doesn't deliver CSS Modules on its own;
// this import makes Storybook's Vite bundle inject the stylesheet instead.
import './Block.module.css';
import {
  themeArgType,
  themeDefaultArgs,
  withTheme,
} from '@/components/storybook/storyDecorators.ts';

export default {
  title: 'Components/Block',
  component: Block,
  argTypes: {
    theme: themeArgType,
    threadSize: {
      control: { type: 'select' },
      options: [1, 2, 3, 4],
    },
    dividerSize: {
      control: { type: 'select' },
      options: ['s', 'm', 'l', 'xl'],
    },
    spacing: {
      control: { type: 'select' },
      options: ['none', 'xs', 's', 'm', 'l'],
    },
  },
  args: {
    ...themeDefaultArgs,
  },
  decorators: [withTheme],
};

export const Default = {
  args: {
    threadSize: 1,
    dividerSize: 's',
    spacing: 'm',
    slots: { default: 'Content here' },
  },
};

export const Stacked = {
  parameters: { controls: { include: ['theme'] } },
  render: () =>
    [
      { threadSize: 1, dividerSize: 's' },
      { threadSize: 2, dividerSize: 'm', spacing: 'none' },
      { threadSize: 4, dividerSize: 'xl' },
    ].map((props) => ({
      component: Block,
      props,
      slots: { default: 'Content here' },
    })),
};
