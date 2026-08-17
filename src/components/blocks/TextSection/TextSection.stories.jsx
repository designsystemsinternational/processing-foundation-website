import { blockMeta } from '@/components/storybook/storyDecorators.ts';
import TextSection from './TextSection.astro';

export default {
  ...blockMeta,
  title: 'Blocks/TextSection',
  component: TextSection,
};

const pcd = {
  heading: 'PCD through the years',
  subheading: 'Subheading',
  body: `The first Processing Community Day (PCD) was organized by Taeyoon Choi and the Processing Foundation in 2017. Taking place at the MIT Media Lab, PCD 2017 drew community members from all over the East Coast to get together to meet and share what they’re working on, and to learn and collaborate in person.`,
};

export const Default = {
  args: {
    ...pcd,
    actions: [
      { label: 'View PCD website', href: '/', variant: 'secondary' },
      { label: 'Read recap', href: '/', variant: 'accent' },
    ],
  },
};

export const HeadingOnly = {
  args: { heading: pcd.heading, actions: [] },
};

export const NoActions = {
  args: { ...pcd, actions: [] },
};
