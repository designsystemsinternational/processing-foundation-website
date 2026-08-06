import Button from './Divider.astro';
// storybook-astro's SSR render doesn't deliver CSS Modules on its own;
// this import makes Storybook's Vite bundle inject the stylesheet instead.
import './Divider.module.css';
import {
  themeArgType,
  themeDefaultArgs,
  withTheme,
} from '@/components/storybook/storyDecorators.ts';

export default {
  title: 'Components/Divider',
  component: Button,
  argTypes: {
    theme: themeArgType,
  },
  args: {
    ...themeDefaultArgs,
  },
  decorators: [withTheme],
};

export const SingleSmall = {
  args: {},
};

export const DoubleMedium = {
  args: {
    threadSize: 2,
    size: 'm',
  },
};

export const TripleLarge = {
  args: {
    threadSize: 3,
    size: 'l',
  },
};

export const QuadrupleXLarge = {
  args: {
    threadSize: 4,
    size: 'xl',
  },
};

export const HalfSize = {
  args: {
    threadSize: 1,
    span: 6,
    size: 'xl',
  },
};
