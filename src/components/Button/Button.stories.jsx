import Button from "./Button.astro";

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
    action: "log-click",
  },
  play: async () => {
    if (window.__buttonActionAlertAttached) return;
    window.__buttonActionAlertAttached = true;
    document.addEventListener("button-action", (event) => {
      alert(`button-action: ${event.detail.action}`);
    });
  },
};
