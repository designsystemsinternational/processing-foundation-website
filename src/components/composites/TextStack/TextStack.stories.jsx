import Button from '@/components/primitives/Button';
import TextStack from './TextStack.astro';

export default {
  title: 'Composites/TextStack',
  component: TextStack,
  subcomponents: { Button },
  argTypes: {
    bodyColumns: {
      control: 'boolean',
    },
  },
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

export const OneAction = {
  args: {
    ...pcd,
    actions: [{ label: 'View PCD website', href: '/', variant: 'primary' }],
  },
};

export const HeadingOnly = {
  args: { heading: pcd.heading },
};

export const BodyColumns = {
  args: { ...pcd, bodyColumns: true },
};
