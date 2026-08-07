import Button from '../Button/Button.astro';
import ButtonGroup from './ButtonGroup.astro';
// storybook-astro's SSR render doesn't deliver CSS Modules on its own;
// this import makes Storybook's Vite bundle inject the stylesheet instead.
import '../Button/Button.module.css';
import './ButtonGroup.module.css';
import {
  themeArgType,
  themeDefaultArgs,
  withTheme,
} from '@/components/storybook/storyDecorators.ts';

export default {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  subcomponents: { Button },
  argTypes: {
    theme: themeArgType,
    hasAccent: {
      control: 'boolean',
    },
  },
  args: {
    ...themeDefaultArgs,
  },
  decorators: [withTheme],
};

export const Default = {
  args: {
    hasAccent: false,
  },
  render: (args) => ({
    component: ButtonGroup,
    props: args,
    slots: {
      default: [
        { component: Button, props: { variant: 'primary', label: 'Click me' } },
        {
          component: Button,
          props: { variant: 'secondary', label: 'Click me' },
        },
      ],
    },
  }),
};

export const WithAccentButton = {
  args: {
    hasAccent: true,
  },
  render: (args) => ({
    component: ButtonGroup,
    props: args,
    slots: {
      default: [
        { component: Button, props: { variant: 'accent', label: 'Click me' } },
        {
          component: Button,
          props: { variant: 'secondary', label: 'Click me' },
        },
      ],
    },
  }),
};
