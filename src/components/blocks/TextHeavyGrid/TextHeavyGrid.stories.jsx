import { blockMeta } from '@/components/storybook/storyDecorators.ts';
import TextHeavyGrid from './TextHeavyGrid.astro';

const paper = {
  title:
    'GujiBERT and GujiGPT: Construction of Intelligent Information Processing Foundation Language Models for Ancient Texts',
  subtitle:
    'by Dongbo Wang, Chang Liu, Zhixiao Zhao, Si Shen, Liu Liu, Bin Li, Haotian Hu, Mengcheng Wu, Litao Lin, Xue Zhao, Xiyu Wang',
  link: 'https://processingfoundation.org',
};

const items = [
  paper,
  { ...paper, title: 'Teaching Creative Coding Without a Computer Lab' },
  { ...paper, title: 'p5.js Accessibility: A Five-Year Retrospective' },
  { ...paper, title: 'Software as a Medium for Community Archives' },
  {
    ...paper,
    title: 'Processing Community Day: Ten Years of Local Organising',
  },
];

export default {
  ...blockMeta,
  title: 'Blocks/TextHeavyGrid',
  component: TextHeavyGrid,
  args: {
    ...blockMeta.args,
    dividerSize: 'm',
    items,
  },
};

/** The design: five items, so the rows fill 2, 1, 2 of their three slots. */
export const Default = {};

export const TwoItems = {
  args: { items: items.slice(0, 2) },
};

export const ThreeItems = {
  args: { items: items.slice(0, 3) },
};

export const SingleItem = {
  args: { items: items.slice(0, 1) },
};

export const ManyItems = {
  args: { items: [...items, ...items] },
};

export const WithoutLinks = {
  args: { items: items.map(({ link: _link, ...rest }) => rest) },
};

export const WithoutSubtitles = {
  args: { items: items.map(({ subtitle: _subtitle, ...rest }) => rest) },
};

export const CustomLinkLabels = {
  args: { items: items.map((item) => ({ ...item, linkLabel: 'Read paper' })) },
};

export const ShortTitles = {
  args: {
    items: items.map((item, index) => ({
      ...item,
      title: `Paper ${index + 1}`,
      subtitle: 'by Processing Foundation',
    })),
  },
};
