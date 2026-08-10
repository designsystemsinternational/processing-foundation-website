import "virtual:uno.css";
import "./preview.css";
import {
  pageThemeArgTypes,
  pageThemeDefaultArgs,
  withPageTheme,
} from "@/components/storybook/storyDecorators.ts";

// storybook-astro renders components server-side, so CSS Modules imported by a
// component are never seen by the browser bundle. Load them all up front.
import.meta.glob("../src/**/*.module.css", { eager: true });

const preview = {
  argTypes: { ...pageThemeArgTypes },
  args: { ...pageThemeDefaultArgs },
  decorators: [withPageTheme],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: ["Brand", "Components", ["Grid", ["Docs", "*"]]],
        includeNames: true,
      },
    },
  },
};

export default preview;
