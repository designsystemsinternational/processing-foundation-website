import catalogSpread from '@/content/blogPosts/20th-anniversary-processing-community-catalog-out-now/CdlxQfoGC0HDr2yKmubexQ.webp';
import { blockMeta } from '@/components/storybook/storyDecorators.ts';
import { mediaTextDirections, mediaTextVariants } from '@/lib/constants.ts';
import MediaText from './MediaText.astro';

export default {
  ...blockMeta,
  title: 'Blocks/MediaText',
  component: MediaText,
  argTypes: {
    ...blockMeta.argTypes,
    variant: {
      control: { type: 'select' },
      options: mediaTextVariants,
    },
    direction: {
      control: { type: 'select' },
      options: mediaTextDirections,
    },
  },
};

const image = {
  image: catalogSpread,
  alt: 'A spread showing the mission statement and table of contents',
  caption: 'This is an example of how the the image caption would look',
};

const pcd = {
  heading: 'PCD through the years',
  subheading: 'Subheading',
  body: `The first Processing Community Day (PCD) was organized by Taeyoon Choi and the Processing Foundation in 2017. Taking place at the MIT Media Lab, PCD 2017 drew community members from all over the East Coast to get together to meet and share what they’re working on, and to learn and collaborate in person.`,
  images: [image],
  actions: [
    { label: 'View PCD website', href: '/', variant: 'secondary' },
    { label: 'Read recap', href: '/', variant: 'accent' },
  ],
};

const twoImages = {
  heading: 'PCD through the years',
  subheading: 'Subheading',
  body: `The first Processing Community Day (PCD) was organized by Taeyoon Choi and the Processing Foundation in 2017. Taking place at the MIT Media Lab, PCD 2017 drew community members from all over the East Coast to get together to meet and share what they’re working on, and to learn and collaborate in person.`,
  images: [image, image],
  actions: [
    { label: 'View PCD website', href: '/', variant: 'secondary' },
    { label: 'Read recap', href: '/', variant: 'accent' },
  ],
};

export const Default = {
  args: { ...pcd, variant: 'default' },
};

export const TwoImages = {
  args: { ...twoImages, variant: 'default' },
};
