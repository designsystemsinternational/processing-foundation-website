import { renderMarkdown } from '@/lib/html.ts';
import { blockMeta } from '@/components/storybook/storyDecorators';
import { accordionOpenModes } from '@/lib/constants.ts';
import Accordion from './Accordion.astro';

export default {
  ...blockMeta,
  title: 'Blocks/Accordion',
  component: Accordion,
  argTypes: {
    ...blockMeta.argTypes,
    openMode: {
      control: { type: 'select' },
      options: accordionOpenModes,
    },
  },
};

const question =
  'Besides these programs, are there any other Processing Foundation programs I could get involved with?';

const answer = renderMarkdown(
  'Item description. Lorem ipsum dolor sit amet consectetur. Phasellus dictum scelerisque aliquet duis. Facilisis quis scelerisque senectus ultricies quis. Cursus eget consequat amet eleifend nisl blandit dolor venenatis.',
);

const items = [
  { title: question, body: answer },
  { title: question, body: answer },
  { title: question, body: answer },
];

export const Default = {
  args: {
    intro: { title: 'FAQ' },
    items,
    openMode: 'closed',
  },
};

export const FirstOpen = {
  args: {
    ...Default.args,
    openMode: 'first',
  },
};

export const AllOpen = {
  args: {
    ...Default.args,
    openMode: 'all',
  },
};
