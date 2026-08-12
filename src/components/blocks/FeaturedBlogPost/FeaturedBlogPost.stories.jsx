import p5live from '@/content/blogPosts/p5live-walking-through-a-collaborative-p5js-environment-for-live-coding/wgEPuIaN8jJswFqc.webp';
import { blockMeta } from '@/components/storybook/storyDecorators.ts';
import FeaturedBlogPost from './FeaturedBlogPost.astro';

export default {
  ...blockMeta,
  title: 'Blocks/FeaturedBlogPost',
  component: FeaturedBlogPost,
};

const post = {
  image: p5live,
  imageAlt:
    'A billboard-sized screen on scaffolding at night, showing red p5.js code over a live performance',
  title:
    'P5LIVE: Walking through a collaborative p5.js environment for live coding',
  text: 'Interview with Ted Davis, 2021 Processing Foundation Teaching Fellow, by Saber Khan, Education…',
  link: '/blog/p5live-walking-through-a-collaborative-p5js-environment-for-live-coding',
  author: 'Anna Smith',
  date: new Date('2022-02-23T09:01:28.399Z'),
  readTime: 19,
};

export const Default = {
  args: post,
};

export const NoImage = {
  args: { ...post, image: undefined },
};

export const TitleOnly = {
  args: {
    title: post.title,
    link: post.link,
    image: post.image,
    imageAlt: post.imageAlt,
  },
};
