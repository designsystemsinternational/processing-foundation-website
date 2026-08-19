import { blockMeta } from '@/components/storybook/storyDecorators.ts';
import Numbers from './Numbers.astro';

export default {
  ...blockMeta,
  title: 'Blocks/Numbers',
  component: Numbers,
  argTypes: {
    ...blockMeta.argTypes,
  },
};

const homepageNumbers = {
  title:
    'We create impact through our tools, partnerships, and community engagements',
  numbers: [
    {
      n: 101,
      description: 'Fellowship',
      subDescription: 'Projects',
      timeSpan: 'Historical',
    },
    {
      n: 35,
      description: 'Grantees',
      subDescription: 'Awarded',
      timeSpan: '2026',
    },
    {
      n: 120,
      description: 'Global Cities',
      subDescription: 'that organized a Processing Community Day',
      timeSpan: '2026',
    },
    {
      n: 780,
      description: 'Contributors',
      subDescription: 'across projects',
      timeSpan: 'Historical',
    },
  ],
};

const suffix = {
  title:
    'We create impact through our tools, partnerships, and community engagements',
  numbers: [
    {
      n: 101,
      description: 'Fellowship',
    },
    {
      n: 35,
      suffix: '+',
      description: 'Grantees',
    },
    {
      n: 120,
      description: 'Global Cities',
    },
    {
      n: 780,
      description: 'Contributors',
    },
  ],
};

const threeNumbers = {
  title:
    'We create impact through our tools, partnerships, and community engagements',
  numbers: [
    {
      n: 101,
      description: 'Fellowship',
      subDescription: 'Projects',
      timeSpan: 'Historical',
    },
    {
      n: 35,
      description: 'Grantees',
      subDescription: 'Awarded',
      timeSpan: '2026',
    },
    {
      n: 120,
      description: 'Global Cities',
      subDescription: 'that organized a Processing Community Day',
      timeSpan: '2026',
    },
  ],
};

const sixNumbers = {
  title:
    'We create impact through our tools, partnerships, and community engagements',
  numbers: [
    {
      n: 101,
      description: 'Fellowship',
      subDescription: 'Projects',
      timeSpan: 'Historical',
    },
    {
      n: 35,
      description: 'Grantees',
      subDescription: 'Awarded',
      timeSpan: '2026',
    },
    {
      n: 120,
      description: 'Global Cities',
      subDescription: 'that organized a Processing Community Day',
      timeSpan: '2026',
    },
    {
      n: 101,
      description: 'Fellowship',
      subDescription: 'Projects',
      timeSpan: 'Historical',
    },
    {
      n: 35,
      description: 'Grantees',
      subDescription: 'Awarded',
      timeSpan: '2026',
    },
    {
      n: 120,
      description: 'Global Cities',
      subDescription: 'that organized a Processing Community Day',
      timeSpan: '2026',
    },
  ],
};

export const Default = {
  args: { ...homepageNumbers },
};

export const withThreeNumbers = {
  args: { ...threeNumbers },
};

export const withSixNumbers = {
  args: { ...sixNumbers },
};

export const withSuffix = {
  args: { ...suffix },
};
