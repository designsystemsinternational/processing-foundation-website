import { blockMeta } from '@/components/storybook/storyDecorators.ts';
import ContactForm from './ContactForm.astro';

export default {
  ...blockMeta,
  title: 'Blocks/ContactForm',
  component: ContactForm,
  args: {
    ...blockMeta.args,
    dividerSize: 's',
    title: 'Interested in hosting an event?',
    body: 'text about how you can contribute by organizing a creative coding event, which can be general event concept or fit into PCD or offer a venue for hosting.',
    formTitle: 'Submit this form',
    topics: ['Organize', 'Volunteer', 'Offer a venue'],
    submitLabel: 'Send',
    action: 'https://processingfoundation.org',
  },
};

export const Default = {};

export const WithSubtitle = {
  args: { subtitle: 'Processing Community Day' },
};

export const WithoutTopics = {
  args: { topics: [] },
};

export const LongBody = {
  args: {
    body: 'text about how you can contribute by organizing a creative coding event, which can be general event concept or fit into PCD or offer a venue for hosting.\n\nA second paragraph, so the text column runs taller than the form panel beside it.',
  },
};

export const NoEndpointYet = {
  args: { action: undefined },
};
