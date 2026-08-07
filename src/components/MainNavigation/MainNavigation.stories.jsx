import MainNavigation from "./MainNavigation.astro";

const nestedItems = [
  {
    title: "About",
    path: "/about",
    children: [
      { title: "Team", path: "/about/team" },
      {
        title: "Board",
        path: "/about/board",
        children: [
          { title: "Financials", path: "/about/governance/financials" },
        ],
      },
    ],
  },
  { title: "Blog", path: "/blog" },
];

export default {
  title: "Components/MainNavigation",
  component: MainNavigation,
  args: {
    items: nestedItems,
    currentPath: "/about",
  },
};

export const Default = {};

export const NestedItemActive = {
  args: {
    currentPath: "/about/governance/financials",
  },
};

export const SingleLevel = {
  args: {
    items: [
      { title: "About", path: "/about" },
      { title: "Blog", path: "/blog" },
      { title: "Donate", path: "https://example.com/donate" },
    ],
  },
};

export const LabelOnlyGroup = {
  args: {
    items: [
      {
        title: "Programs",
        children: [
          { title: "Fellowships", path: "/programs/fellowships" },
          { title: "Google Summer of Code", path: "/programs/gsoc" },
        ],
      },
    ],
    currentPath: "/programs/fellowships",
  },
};
