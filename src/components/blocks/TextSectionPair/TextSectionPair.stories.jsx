import { renderMarkdown } from '@/lib/html.ts';
import { blockMeta } from '@/components/storybook/storyDecorators.ts';
import { textSectionPairVariants } from '@/lib/constants.ts';
import TextSectionPair from './TextSectionPair.astro';

export default {
  ...blockMeta,
  title: 'Blocks/TextSectionPair',
  component: TextSectionPair,
  argTypes: {
    ...blockMeta.argTypes,
    variant: {
      control: { type: 'select' },
      options: textSectionPairVariants,
    },
    imageFirst: { control: 'boolean' },
  },
};

const pcd = {
  title: 'Processing 2025 Impact Report',
  body: renderMarkdown(
    `Lorem ipsum dolor sit amet consectetur. Ipsum tellus ullamcorper fermentum ante nisi condimentum vitae. Ut orci semper ipsum vitae justo ac auctor pulvinar et. `,
  ),
  actions: [{ label: 'Read more', href: '/', variant: 'tertiary' }],
};

export const Default = {
  args: {
    variant: 'default',
    title: 'Impact Report Through the Years',
    items: [{ ...pcd }, { ...pcd, title: 'Processing 2024 Impact Report' }],
  },
};

export const Weave = {
  args: {
    variant: 'weave-banner',
    title: 'Impact Report Through the Years',
    items: [{ ...pcd }, { ...pcd, title: 'Processing 2024 Impact Report' }],
  },
};
