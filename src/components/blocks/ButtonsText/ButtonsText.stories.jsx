import { renderMarkdown } from '@/lib/html.ts';
import { blockMeta } from '@/components/storybook/storyDecorators.ts';
import ButtonsText from './ButtonsText.astro';

export default {
  ...blockMeta,
  title: 'Blocks/ButtonsText',
  component: ButtonsText,
};

const actions = [
  { label: 'Donate Now', href: '/', variant: 'accent' },
  { label: 'Donate using crypto', href: '/', variant: 'secondary' },
];

const text = renderMarkdown(
  'Your donation contributes to software development, educational resources, Fellowships, and community events. To donate using crypto, DAF, or stocks, visit the [Every.org Donation Page](https://www.every.org) instead.',
);

export const Default = {
  args: { actions, text },
};

export const SingleAction = {
  args: { actions: [actions[0]], text },
};

export const WithoutText = {
  args: { actions },
};

export const WithDivider = {
  args: { actions, text, showDivider: true },
};
