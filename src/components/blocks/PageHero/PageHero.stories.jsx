import catalogSpread from '@/content/blogPosts/20th-anniversary-processing-community-catalog-out-now/CdlxQfoGC0HDr2yKmubexQ.webp';
import { blockMeta } from '@/components/storybook/storyDecorators.ts';
import { pageHeroVariants } from '@/lib/constants.ts';
import PageHero from './PageHero.astro';

export default {
  ...blockMeta,
  title: 'Blocks/PageHero',
  component: PageHero,
  argTypes: {
    ...blockMeta.argTypes,
    variant: {
      control: { type: 'select' },
      options: pageHeroVariants,
    },
  },
};

const image = {
  src: catalogSpread,
  alt: 'A spread showing the mission statement and table of contents',
  caption: 'This is an example of how the the image caption would look',
};

const people = {
  eyebrow: 'About / People',
  title: 'People',
  text: `Processing Java and p5.js would not be possible without the hundreds of active contributors from around the world over the past quarter-century.

Learn more about the people who have been building Processing Java and p5.js behind the scenes, as well as dedicated efforts taking place in the Open Source Software Microgrants and the Developers in Residence programs.`,
  image,
};

const communityDay = {
  eyebrow: 'Community / Processing Community Day / 2026',
  title: 'PCD 2021 @ Worldwide',
  text: 'With COVID-19 requiring continued social distancing Processing Community Day, events are virtual. Here are some of the PCD @ Worldwide events in 2021.',
  image,
};

const whatIsProcessing = {
  eyebrow: 'Software / What is Processing?',
  title: 'What is Processing?',
  text: 'Processing is an accessible, open-source, artist-friendly programming language that lets you use code to sketch interactive audio and visual works.',
};

export const Default = {
  args: { ...people, variant: 'default' },
};

export const Accent = {
  args: { ...people, variant: 'accent' },
};

export const HalfAccent = {
  args: { ...communityDay, variant: 'half-accent' },
};

export const Medium = {
  args: {
    ...communityDay,
    title: 'Processing Community Day',
    variant: 'medium',
  },
};

export const Wide = {
  args: { ...communityDay, variant: 'wide' },
};

export const HalfAccentNoImage = {
  args: {
    eyebrow: 'Software / Showcase',
    title: 'Showcase',
    variant: 'half-accent',
  },
};

export const DefaultNoImage = {
  args: { ...whatIsProcessing, variant: 'default' },
};

export const WithSubtitle = {
  args: {
    eyebrow: 'Programs / Fellowships / Screen-to-Soundscape',
    title: 'Screen-to-Soundscape',
    subtitle: 'Ahnjili ZhuParris, Dan Xu, Colette Aliman, Alyssa Gersony',
    text: '‘Screen-to-Soundscape’ adopts a creative and experimental approach to reimagining screen reader voices. The project aims to develop a speculative design prototype that transforms a browser or screen into an immersive soundscape.',
    image,
    variant: 'default',
  },
};
