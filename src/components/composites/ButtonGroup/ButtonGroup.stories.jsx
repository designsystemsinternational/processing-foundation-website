import { buttonGroupVariants } from '@/lib/constants';
import Button from '@/components/primitives/Button';
import ButtonGroup from './ButtonGroup.astro';

export default {
  title: 'Composites/ButtonGroup',
  component: ButtonGroup,
  subcomponents: { Button },
  argTypes: {
    hasAccent: {
      control: 'boolean',
    },
    variant: {
      control: { type: 'select' },
      options: buttonGroupVariants,
    },
  },
  args: {
    variant: 'default',
  },
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

export const Stretch = {
  args: {
    hasAccent: true,
    variant: 'stretch',
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
