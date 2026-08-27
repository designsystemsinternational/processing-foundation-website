import { buttonIcons, buttonVariants } from '@/lib/constants';
import Button from './Button.astro';

export default {
  title: 'Primitives/Button',
  component: Button,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: buttonVariants,
    },
    icon: {
      control: { type: 'select' },
      options: [undefined, ...buttonIcons],
    },
  },
  args: {
    variant: 'primary',
  },
};

export const Default = {
  args: {
    label: 'Click me',
  },
};

export const WithIcon = {
  args: {
    label: 'Donate',
    icon: 'heart',
  },
};

export const Disabled = {
  args: {
    label: 'Disabled',
    disabled: true,
  },
};

export const WithHref = {
  args: {
    label: 'Click me',
    href: 'https://example.com',
  },
};

export const WithOnClick = {
  args: {
    label: 'Click me',
  },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button');
    button?.addEventListener('click', () => {
      alert('Button clicked');
    });
  },
};
