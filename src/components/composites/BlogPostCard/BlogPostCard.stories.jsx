import headerImage from '@/content/blogPosts/announcing-our-google-summer-of-code-contributors/soc-header.webp';
import BlogPostCard from './BlogPostCard.astro';

const ENTRY = {
  id: 'announcing-our-google-summer-of-code-contributors',
  body: 'A word '.repeat(800),
  data: {
    title: 'Announcing our Google Summer of Code Contributors',
    subtitle:
      'Processing Foundation is participating in Google Summer of Code (GSoC) for the 14th year!',
    author: ['Processing Foundation'],
    category: 'Google Summer of Code',
    date: new Date('2026-07-02'),
    headerImage,
    headerImagePosition: 'center',
  },
};

export default {
  title: 'Composites/BlogPostCard',
  component: BlogPostCard,
  args: { className: 'col-span-4' },
};

export const Default = {
  args: { entry: ENTRY },
};

export const WithoutSubtitle = {
  args: { entry: ENTRY, showSubtitle: false },
};

export const WithoutHeaderImage = {
  args: {
    entry: { ...ENTRY, data: { ...ENTRY.data, headerImage: undefined } },
  },
};

export const WithoutCategory = {
  args: {
    entry: { ...ENTRY, data: { ...ENTRY.data, category: undefined } },
  },
};
