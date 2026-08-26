import { renderMarkdown } from '@/lib/html.ts';
import { blockMeta } from '@/components/storybook/storyDecorators.ts';
import { initSelector } from '@/components/primitives/Selector/selector.ts';

import ContactForm from './ContactForm.astro';

export default {
  ...blockMeta,
  title: 'Blocks/ContactForm',
  component: ContactForm,
  args: {
    ...blockMeta.args,
    dividerSize: 's',
    title: 'Interested in hosting an event?',
    body: renderMarkdown(
      'text about how you can contribute by organizing a creative coding event, which can be general event concept or fit into PCD or offer a venue for hosting.',
    ),
    formTitle: 'Submit this form',
    topics: ['Organize', 'Volunteer', 'Offer a venue'],
    submitLabel: 'Send',
  },
  // Storybook's Astro renderer never runs a component's own hoisted <script>.
  play: async ({ canvasElement }) => {
    canvasElement.querySelectorAll('[data-selector]').forEach(initSelector);
  },
};

export const Default = {};

/** Preselects one of the listed topics rather than the first. */
export const WithDefaultTopic = {
  args: { defaultTopic: 'Volunteer' },
};

export const WithoutTopics = {
  args: { topics: [] },
};

export const LongBody = {
  args: {
    body: renderMarkdown(
      'text about how you can contribute by organizing a creative coding event, which can be general event concept or fit into PCD or offer a venue for hosting.\n\nA second paragraph, so the text column runs taller than the form panel beside it.',
    ),
  },
};
