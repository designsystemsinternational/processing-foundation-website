import { renderMarkdown } from '@/lib/html.ts';
import Block from './Block.astro';
import { blockMeta } from '@/components/storybook/storyDecorators.ts';

export default {
  ...blockMeta,
  title: 'Composites/Block',
  component: Block,
};

export const Default = {
  args: {
    slots: { default: 'Content here' },
  },
};

const intro = {
  title: 'Mission',
  description: renderMarkdown(
    'Our mission is to promote software literacy within the visual arts, and visual literacy within technology-related fields, and to celebrate the diverse communities that make these fields vibrant, liberatory, and innovative.',
  ),
};

export const WithIntro = {
  args: {
    slots: { default: 'Content here' },
    intro,
  },
};

export const IntroWithSubtitleAndActions = {
  args: {
    slots: { default: 'Content here' },
    intro: {
      ...intro,
      subtitle: 'What we work towards',
      actions: [{ label: 'Read more', href: '/', variant: 'primary' }],
    },
  },
};

/** `titleSize` and `titleTag` are set per block, and both reach TextStack. */
export const IntroSmallTitle = {
  args: {
    slots: { default: 'Content here' },
    intro: { ...intro, titleSize: 'm', titleTag: 'h3' },
  },
};

export const WithoutDivider = {
  args: {
    slots: { default: 'Content here' },
    intro,
    divider: false,
  },
};
