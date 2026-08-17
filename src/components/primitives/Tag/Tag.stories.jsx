import Tag from './Tag.astro';
// storybook-astro's SSR render doesn't deliver CSS Modules on its own;
// this import makes Storybook's Vite bundle inject the stylesheet instead.
import './Tag.module.css';

export default {
  title: 'Primitives/Tag',
  component: Tag,
};

export const Default = {
  args: {
    label: 'News',
  },
};

export const Small = {
  args: {
    label: 'News',
    size: 'small',
  },
};

export const WithHref = {
  args: {
    label: 'News',
    href: '/blog/category/news',
  },
};

export const LongLabel = {
  args: {
    label: 'Processing Community Day',
  },
};
