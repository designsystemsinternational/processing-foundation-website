import catalogSpread from '@/content/blogPosts/20th-anniversary-processing-community-catalog-out-now/CdlxQfoGC0HDr2yKmubexQ.webp';
import { blockMeta } from '@/components/storybook/storyDecorators.ts';
import { mediaTextDirections } from '@/lib/constants.ts';
import LogosText from './LogosText.astro';

export default {
  ...blockMeta,
  title: 'Blocks/LogosText',
  component: LogosText,
  argTypes: {
    ...blockMeta.argTypes,
    direction: {
      control: { type: 'select' },
      options: mediaTextDirections,
    },
  },
};

const image = {
  src: catalogSpread,
  alt: 'A spread showing the mission statement and table of contents',
  caption: 'This is an example of how the the image caption would look',
};

const actionsWithImage = [
  {
    image: image,
    action: { label: 'Visit website', href: '/', variant: 'tertiary' },
  },
  {
    image: image,
    action: { label: 'Visit website', href: '/', variant: 'tertiary' },
  },
  {
    image: image,
    action: { label: 'Visit website', href: '/', variant: 'tertiary' },
  },
];

const whatIsProcessing = {
  title: 'What is Processing?',
  body: `Processing is a beginner-friendly programming language that lets you use code to sketch. From simple drawings and animations to complex interactive installations and performances, these creative tools make it easy to bring your ideas to life.`,
  textActions: [
    { label: 'Learn more', href: '/', variant: 'tertiary' },
    { label: 'See software tools', href: '/', variant: 'accent' },
  ],
  actionsWithImage: actionsWithImage.slice(0, 2),
};

const whatIsProcessing2 = {
  title: 'What is Processing?',
  body: `Processing is a beginner-friendly programming language that lets you use code to sketch. From simple drawings and animations to complex interactive installations and performances, these creative tools make it easy to bring your ideas to life.`,
  textActions: [
    { label: 'Learn more', href: '/', variant: 'tertiary' },
    { label: 'See software tools', href: '/', variant: 'accent' },
  ],
  actionsWithImage: actionsWithImage.slice(0, 1),
};

const whatIsProcessing3 = {
  title: 'What is Processing?',
  body: `Processing is a beginner-friendly programming language that lets you use code to sketch. From simple drawings and animations to complex interactive installations and performances, these creative tools make it easy to bring your ideas to life.`,
  textActions: [
    { label: 'Learn more', href: '/', variant: 'tertiary' },
    { label: 'See software tools', href: '/', variant: 'accent' },
  ],
  actionsWithImage: actionsWithImage,
};

export const Default = {
  args: { ...whatIsProcessing },
};

export const OneActionWithImage = {
  args: { ...whatIsProcessing2 },
};

export const ThreeActionsWithImage = {
  args: { ...whatIsProcessing3 },
};
