import Grid from "./Grid.astro";
import Row from "./Row.astro";
import Column from "./Column.astro";
// storybook-astro's SSR render doesn't deliver CSS Modules on its own;
// these imports make Storybook's Vite bundle inject the stylesheets instead.
import "./Grid.module.css";
import "./Row.module.css";
import "./Column.module.css";

// Storybook-only aid so the grid, row, and column boundaries are visible;
// not part of the actual Grid/Row/Column styles.
function withGridOutlines(Story) {
  if (!document.getElementById("story-grid-outline")) {
    const style = document.createElement("style");
    style.id = "story-grid-outline";
    style.textContent = `
      [class*="grid"] { outline: 1px dashed black; }
      [class*="row"] { outline: 1px dashed blue; }
      [class*="column"] { outline: 2px dashed red; }
    `;
    document.head.appendChild(style);
  }
  return Story();
}

export default {
  title: "Components/Grid",
  component: Grid,
  decorators: [withGridOutlines],
};

const column = (span, label) => ({
  component: Column,
  props: { span },
  slots: { default: label ?? `span ${span}` },
});

const row = (...columns) => ({
  component: Row,
  slots: { default: columns },
});

export const TwoColumns = {
  args: {
    slots: {
      default: row(column(8), column(4)),
    },
  },
};

export const Thirds = {
  args: {
    slots: {
      default: row(column(4), column(4), column(4)),
    },
  },
};

export const AllTwelveColumns = {
  args: {
    slots: {
      default: row(
        ...Array.from({ length: 23 }, (_, index) => column(1, `${index + 1}`)),
      ),
    },
  },
};

export const MultipleRows = {
  args: {
    slots: {
      default: [
        row(column(8), column(4)),
        row(column(4), column(4), column(4)),
        row(column(6), column(6)),
      ],
    },
  },
};
