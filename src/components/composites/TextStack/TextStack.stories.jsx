import { renderMarkdown } from '@/lib/html.ts';
import Button from '@/components/primitives/Button';
import { bodySizes, headingSizes, spacings } from '@/lib/constants.ts';
import TextStack from './TextStack.astro';

export default {
  title: 'Composites/TextStack',
  component: TextStack,
  subcomponents: { Button },
  argTypes: {
    bodyColumns: {
      control: 'boolean',
    },
    titleSize: {
      control: { type: 'select' },
      options: headingSizes,
    },
    subtitleSize: {
      control: { type: 'select' },
      options: headingSizes,
    },
    bodySize: {
      control: { type: 'select' },
      options: bodySizes,
    },
    titleSpacing: {
      control: { type: 'select' },
      options: spacings,
    },
  },
};

const pcd = {
  title: 'PCD through the years',
  subtitle: 'Subtitle',
  body: renderMarkdown(
    `The first Processing Community Day (PCD) was organized by Taeyoon Choi and the Processing Foundation in 2017. Taking place at the MIT Media Lab, PCD 2017 drew community members from all over the East Coast to get together to meet and share what they’re working on, and to learn and collaborate in person.`,
  ),
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

export const TitleOnly = {
  args: { title: pcd.title },
};

export const BodyColumns = {
  args: { ...pcd, bodyColumns: true },
};

export const CustomTextSizes = {
  args: { ...pcd, subtitleSize: 's', bodySize: 'm' },
};

export const TightTitle = {
  args: { ...pcd, titleSpacing: 's' },
};
