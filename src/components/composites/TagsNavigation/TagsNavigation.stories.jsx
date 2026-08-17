import TagsNavigation from './TagsNavigation.astro';
import './TagsNavigation.module.css';

export default {
  title: 'Composites/TagsNavigation',
  component: TagsNavigation,
};

export const Default = {};

export const CustomLabel = {
  args: {
    label: 'Browse by category',
  },
};
