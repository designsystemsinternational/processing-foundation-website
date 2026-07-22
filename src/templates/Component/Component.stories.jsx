import Component from "./Component.astro";
// storybook-astro's SSR render doesn't deliver CSS Modules on its own;
// this import makes Storybook's Vite bundle inject the stylesheet instead.
import "./Component.module.css";

export default {
  title: "Components/Component",
  component: Component,
};

export const Default = {
  args: {
    slots: {
      default: "Component content",
    },
  },
};
