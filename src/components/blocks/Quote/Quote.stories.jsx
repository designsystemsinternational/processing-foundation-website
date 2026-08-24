import { renderMarkdown } from '@/lib/html.ts';
import { blockMeta } from '@/components/storybook/storyDecorators';
import Quote from './Quote.astro';

export default {
  ...blockMeta,
  title: 'Blocks/Quote',
  component: Quote,
  argTypes: { ...blockMeta.argTypes },
};

const quoteCasey = {
  quote: renderMarkdown(
    'Short testimonial. Lorem ipsum dolor sit amet consectetur. Phasellus dictum scelerisque aliquet duis. Facilisis quis scelerisque senectus ultricies quis. Cursus eget consequat amet eleifend nisl blandit dolor venenatis. Pharetra nascetur id dolor nulla in ut sem. Nec elementum tellus gravida posuere amet volutpat.',
  ),
  author: 'Casey Reas',
};

export const Default = {
  args: {
    ...quoteCasey,
  },
};

export const WithoutAuthor = {
  args: {
    ...quoteCasey,
    author: '',
  },
};
