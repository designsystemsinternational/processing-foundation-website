import { renderMarkdown } from '@/lib/html.ts';
import { blockMeta } from '@/components/storybook/storyDecorators';
import Timeline from './Timeline.astro';

export default {
  ...blockMeta,
  title: 'Blocks/Timeline',
  component: Timeline,
  argTypes: {
    ...blockMeta.argTypes,
  },
};

const items = [
  {
    year: '1975',
    title: 'The Visible Language Workshop',
    description: renderMarkdown(
      'The Visible Language Workshop (VLW) is founded at MIT, led by graphic designer Muriel Cooper. Its screen-based typography and information design lays the groundwork for what would become Processing.',
    ),
  },
  {
    year: '1999',
    title: 'Design By Numbers',
    description: renderMarkdown(
      'Design By Numbers (DBN), created by Maeda with Casey Reas and Ben Fry, is released as both a book and software.',
    ),
  },
  {
    year: '2001',
    title: 'The first workshop',
    description: renderMarkdown(
      'Processing begins as notes in a sketchbook. Ben Fry teaches the first Processing workshop at Musashino Art University in Japan using an early, minimal version of the software (Processing 0005). The project is first named Proce55ing, with a website at proce55ing.net',
    ),
  },
  {
    year: '2002',
    title: 'The first forum',
    description: renderMarkdown(
      'The first Processing Forum (Discourse) launches, becoming a hub for sharing code and ideas.',
    ),
  },
];

export const Default = {
  args: { items },
};

export const WithoutTitles = {
  args: {
    items: items.map(({ year, description }) => ({ year, description })),
  },
};

export const WithIntro = {
  args: {
    items,
    intro: {
      title: 'A history of Processing',
      description: renderMarkdown(
        'Two decades of software, teaching and community.',
      ),
    },
  },
};
