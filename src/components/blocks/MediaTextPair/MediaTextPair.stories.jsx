import catalogSpread from '@/content/blogPosts/20th-anniversary-processing-community-catalog-out-now/CdlxQfoGC0HDr2yKmubexQ.webp';
import pcdBoston from '@/assets/media/3-pcd_bos_02.jpeg';
import { blockMeta } from '@/components/storybook/storyDecorators.ts';
import { mediaTextPairVariants } from '@/lib/constants.ts';
import MediaTextPair from './MediaTextPair.astro';

export default {
  ...blockMeta,
  title: 'Blocks/MediaTextPair',
  component: MediaTextPair,
  argTypes: {
    ...blockMeta.argTypes,
    variant: {
      control: { type: 'select' },
      options: mediaTextPairVariants,
    },
    imageFirst: { control: 'boolean' },
  },
};

const pcd = {
  title: 'PCD through the years',
  body: `The first Processing Community Day (PCD) was organized by Taeyoon Choi and the Processing Foundation in 2017. Taking place at the MIT Media Lab, PCD 2017 drew community members from all over the East Coast to get together to meet and share what they’re working on, and to learn and collaborate in person.`,
  actions: [{ label: 'View PCD website', href: '/' }],
};

const pr05 = {
  title: 'PCD through the years',
  body: `pr05 (pronounced “pros”) is a grant and mentorship initiative by the Processing Foundation.`,
  actions: [{ label: 'View PCD website', href: '/' }],
};

const image = (source) => ({
  image: source,
  alt: 'Community members sitting together at a Processing Community Day event',
  caption: 'This is an example of how the the image caption would look',
});

export const Default = {
  args: {
    variant: 'default',
    items: [
      { ...pcd, image: image(catalogSpread) },
      { ...pcd, image: image(pcdBoston) },
    ],
  },
};

export const ImageFirst = {
  args: {
    variant: 'default',
    imageFirst: true,
    items: [
      {
        actions: [{ label: 'Learn More', href: '/' }],
        image: { image: pcdBoston, alt: '' },
      },
      {
        actions: [{ label: 'Learn More', href: '/' }],
        image: { image: catalogSpread, alt: '' },
      },
    ],
  },
};

export const NoImages = {
  args: {
    variant: 'default',
    items: [pr05, pcd],
  },
};

export const Contrast = {
  args: {
    variant: 'contrast',
    items: [
      {
        ...pr05,
        subtitle: 'Subtitle',
        actions: [{ label: 'View PCD website', href: '/', variant: 'primary' }],
      },
      {
        ...pr05,
        subtitle: 'Subtitle',
        actions: [
          { label: 'View PCD website', href: '/', variant: 'tertiary' },
        ],
      },
    ],
  },
};

export const WithSubtitles = {
  args: {
    variant: 'default',
    items: [
      { ...pcd, subtitle: 'Subtitle', image: image(catalogSpread) },
      { ...pcd, subtitle: 'Subtitle' },
    ],
  },
};
