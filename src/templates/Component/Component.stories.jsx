import Component from "./Component.astro";

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
