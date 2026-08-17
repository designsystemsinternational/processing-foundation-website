import MainNavigation from './MainNavigation.astro';

const items = [
  {
    title: 'Software',
    path: '/software',
    children: [
      { title: 'What is Processing', path: '/software/what-is-processing' },
      { title: 'Showcase', path: '/software/showcase' },
      { title: 'Tools', path: '/software/tools' },
    ],
  },
  {
    title: 'Programs',
    path: '/programs',
    children: [
      { title: 'Fellowships', path: '/programs/fellowships' },
      {
        title: 'Google Summer of Code',
        path: '/programs/google-summer-of-code',
      },
    ],
  },
  {
    title: 'Community',
    path: '/community',
    children: [
      { title: 'People', path: '/people' },
      { title: 'Events', path: '/community/events' },
    ],
  },
  {
    title: 'Support',
    path: '/support',
    children: [{ title: 'Sponsors', path: '/support/sponsors' }],
  },
  {
    title: 'About',
    path: '/about',
    children: [
      { title: 'Team', path: '/about/team' },
      { title: 'Governance', path: '/about/governance' },
    ],
  },
];

export default {
  title: 'Composites/MainNavigation',
  component: MainNavigation,
  args: {
    items,
    currentPath: '/about',
  },
};

export const Default = {};

/** Items without children are plain links, with no expand toggle. */
export const FlatItems = {
  args: {
    items: items.map(({ children: _children, ...item }) => item),
  },
};

/** A nested page marks its top-level ancestor with data-current-trail. */
export const NestedItemActive = {
  args: {
    currentPath: '/about/team',
  },
};
