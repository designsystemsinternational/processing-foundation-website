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
