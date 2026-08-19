import Selector from './Selector.astro';
import { initSelector } from './selector.ts';

const options = [
  { label: 'Newest first', value: 'newest' },
  { label: 'Oldest first', value: 'oldest' },
  { label: 'Alphabetical', value: 'alphabetical' },
];

export default {
  title: 'Primitives/Selector',
  component: Selector,
  args: {
    label: 'Sort by',
    options,
  },
  // Storybook's Astro renderer never runs the component's own hoisted <script>.
  play: async ({ canvasElement }) => {
    canvasElement.querySelectorAll('[data-selector]').forEach(initSelector);
  },
};

export const Default = {};

/** The form field pairing: a visible label and the compact surface. */
export const WithVisibleLabel = {
  args: { showLabel: true },
};

export const Small = {
  args: { showLabel: true, size: 'small' },
};

/** How ContactForm uses it: compact, and white against the form's panel. */
export const SmallOnPanel = {
  args: { showLabel: true, size: 'small', surface: 'default' },
};

export const WithPlaceholder = {
  args: {
    placeholder: 'Choose an option',
  },
};

export const WithDefaultValue = {
  args: {
    defaultValue: 'oldest',
  },
};

export const Disabled = {
  args: {
    disabled: true,
  },
};

// Shows the integration a consuming page would write: listen for the
// `selector:change` event the component dispatches and react to it.
export const WithChangeListener = {
  args: {
    defaultValue: 'newest',
  },
  play: async ({ canvasElement, args }) => {
    canvasElement.querySelectorAll('[data-selector]').forEach((root) => {
      initSelector(root);

      const output = document.createElement('p');
      output.textContent = `Selected: ${args.defaultValue}`;
      root.after(output);

      root.addEventListener('selector:change', (event) => {
        output.textContent = `Selected: ${event.detail.value}`;
      });
    });
  },
};
