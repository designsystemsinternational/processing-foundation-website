import Button from "./Button.astro";
// storybook-astro's SSR render doesn't deliver CSS Modules on its own;
// this import makes Storybook's Vite bundle inject the stylesheet instead.
import "./Button.module.css";

export default {
  title: "Components/Button",
  component: Button,
};

export const Default = {
  args: {
    label: "Click me",
  },
};

export const Disabled = {
  args: {
    label: "Disabled",
    disabled: true,
  },
};

export const WithHref = {
  args: {
    label: "Click me",
    href: "https://example.com",
  },
};

export const WithOnClick = {
  args: {
    label: "Click me",
  },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector("button");
    button?.addEventListener("click", () => {
      alert("Button clicked");
    });
  },
};
