import TagsNavigation from './TagsNavigation.astro';
import './TagsNavigation.module.css';

export default {
  title: 'Components/TagsNavigation',
  component: TagsNavigation,
  args: {
    target: '[data-blog-posts]',
  },
};

export const Default = {};

export const CustomLabel = {
  args: {
    label: 'Browse by category',
  },
};
