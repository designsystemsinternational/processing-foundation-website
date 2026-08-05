import MainNavigation from "./MainNavigation.astro";
import "./MainNavigation.module.css";

import {
  themeArgType,
  themeDefaultArgs,
  withTheme,
} from "@/components/storybook/storyDecorators.ts";

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
  argTypes: {
    theme: themeArgType,
  },
  args: {
    ...themeDefaultArgs,
    items: nestedItems,
    currentPath: "/about",
  },
  decorators: [withTheme],
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
