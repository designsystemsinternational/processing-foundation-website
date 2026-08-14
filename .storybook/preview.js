import "virtual:uno.css";
import "./preview.css";
import {
  pageThemeArgTypes,
  pageThemeDefaultArgs,
  withPageTheme,
} from "@/components/storybook/storyDecorators.ts";

// storybook-astro renders components server-side, so CSS Modules imported by a
// component are never seen by the browser bundle. Load them all up front.
// The result must stay referenced, or the production build tree-shakes the
// whole glob away and every component ships unstyled.
const cssModules = import.meta.glob("../src/**/*.module.css", { eager: true });
if (Object.keys(cssModules).length === 0) {
  throw new Error("No CSS Modules matched: component styles would be missing.");
}

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
        order: [
          "Brand",
          "Primitives",
          ["Grid", ["Docs", "*"]],
          "Composites",
          "Blocks",
        ],
        includeNames: true,
      },
    },
  },
};

export default preview;
