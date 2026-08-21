import Input from './Input.astro';
// storybook-astro's SSR render doesn't deliver CSS Modules on its own;
// this import makes Storybook's Vite bundle inject the stylesheet instead.
import './Input.module.css';

export default {
  title: 'Primitives/Input',
  component: Input,
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'tel', 'url'],
    },
    multiline: { control: { type: 'boolean' } },
    showLabel: { control: { type: 'boolean' } },
    size: { control: { type: 'select' }, options: ['default', 'small'] },
    surface: { control: { type: 'select' }, options: ['field', 'default'] },
  },
  args: { label: 'First name', name: 'firstName' },
};

export const Default = {};

export const Email = {
  args: { label: 'Email', name: 'email', type: 'email' },
};

export const WithPlaceholder = {
  args: { placeholder: 'Ada' },
};

export const Required = {
  args: { required: true },
};

export const Multiline = {
  args: { label: 'Tell us more', name: 'message', multiline: true },
};

export const MultilineTaller = {
  args: { label: 'Tell us more', name: 'message', multiline: true, rows: 6 },
};

export const Small = {
  args: { size: 'small' },
};

export const SmallOnPanel = {
  args: { size: 'small', surface: 'default' },
};

export const WithoutVisibleLabel = {
  args: {
    label: 'Email address',
    name: 'email',
    showLabel: false,
    placeholder: 'you@example.com',
  },
};

export const LongLabel = {
  args: { label: 'What would you like to tell the Processing Foundation?' },
};

export const WithChangeListener = {
  args: { placeholder: 'Ada' },
  play: async ({ canvasElement }) => {
    canvasElement.querySelectorAll('input, textarea').forEach((control) => {
      const output = document.createElement('p');
      output.textContent = `Value: ${control.value}`;
      control.closest('div')?.after(output);

      control.addEventListener('input', (event) => {
        output.textContent = `Value: ${event.target.value}`;
      });
    });
  },
};
