import Grid from "./Grid.astro";
import Row from "./Row.astro";
import Column from "./Column.astro";
// storybook-astro's SSR render doesn't deliver CSS Modules on its own;
// these imports make Storybook's Vite bundle inject the stylesheets instead.
import "./Grid.module.css";
import "./Row.module.css";
import "./Column.module.css";
import {
  themeArgType,
  themeDefaultArgs,
  withTheme,
} from "@/components/storybook/storyDecorators.ts";

// Storybook-only aid: gives columns enough height for the gutter's
// top-to-bottom gradient to read as a gradient, and a dashed outline so
// column boundaries are visible; neither is part of the real Column styles.
// `_column_` (not just "column") avoids also matching the *-column-gap
// utility classes. `[data-demo-col]` tags the utility-class examples' boxes,
// which don't have a Column class at all.
function withColumnHeight(Story) {
  if (!document.getElementById("story-column-height")) {
    const style = document.createElement("style");
    style.id = "story-column-height";
    style.textContent = `[class*="_column_"], [data-demo-col] { height: 120px; border: 1px dashed grey; }`;
    document.head.appendChild(style);
  }
  return Story();
}

// Threads the `gutter` control into every Row nested inside a story's
// slots, since Row's gutter prop lives inside the slot descriptors rather
// than as a plain top-level arg for stories that demo it through Grid.
function withGutterProp(Story, context) {
  const applyGutter = (descriptor) =>
    descriptor?.component === Row
      ? {
          ...descriptor,
          props: { ...descriptor.props, gutter: context.args.gutter },
        }
      : descriptor;

  const current = context.args.slots?.default;
  if (current !== undefined) {
    context.args.slots = {
      ...context.args.slots,
      default: Array.isArray(current)
        ? current.map(applyGutter)
        : applyGutter(current),
    };
  }

  return Story();
}

export default {
  title: "Components/Grid",
  component: Grid,
  argTypes: {
    theme: themeArgType,
    gutter: {
      control: { type: "select" },
      options: ["none", "solid", "gradient"],
    },
  },
  args: {
    ...themeDefaultArgs,
    gutter: "none",
  },
  decorators: [withTheme, withGutterProp, withColumnHeight],
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

// Utility-class equivalents of `column`/`row` above, no components involved.
// `data-demo-col` is just for withColumnHeight's Storybook styling.
const utilityColumn = (span, label) =>
  `<div class="col-span-${span}" data-demo-col>${label ?? `span ${span}`}</div>`;

const utilityRow = (gutter, ...columns) =>
  `<div class="row"${gutter && gutter !== "none" ? ` data-gutter="${gutter}"` : ""}>${columns.join("")}</div>`;

const utilityGrid = (...rows) =>
  `<div class="flex flex-col gap-column-gap">${rows.join("")}</div>`;

export const TwoColumns = {
  args: {
    slots: {
      default: row(column(8), column(4)),
    },
  },
};

export const TwoColumnsUtility = {
  name: "Two Columns (Utility Classes)",
  render: (args) =>
    utilityGrid(utilityRow(args.gutter, utilityColumn(8), utilityColumn(4))),
};

export const Thirds = {
  args: {
    slots: {
      default: row(column(4), column(4), column(4)),
    },
  },
};

export const ThirdsUtility = {
  name: "Thirds (Utility Classes)",
  render: (args) =>
    utilityGrid(
      utilityRow(
        args.gutter,
        utilityColumn(4),
        utilityColumn(4),
        utilityColumn(4),
      ),
    ),
};

export const AllTwelveColumns = {
  args: {
    slots: {
      default: row(
        ...Array.from({ length: 12 }, (_, index) => column(1, `${index + 1}`)),
      ),
    },
  },
};

export const AllTwelveColumnsUtility = {
  name: "All Twelve Columns (Utility Classes)",
  render: (args) =>
    utilityGrid(
      utilityRow(
        args.gutter,
        ...Array.from({ length: 12 }, (_, index) =>
          utilityColumn(1, `${index + 1}`),
        ),
      ),
    ),
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

export const MultipleRowsUtility = {
  name: "Multiple Rows (Utility Classes)",
  render: (args) =>
    utilityGrid(
      utilityRow(args.gutter, utilityColumn(8), utilityColumn(4)),
      utilityRow(
        args.gutter,
        utilityColumn(4),
        utilityColumn(4),
        utilityColumn(4),
      ),
      utilityRow(args.gutter, utilityColumn(6), utilityColumn(6)),
    ),
};

// Demos Row directly (rather than through Grid), defaulting `gutter` to a
// visible value. A plain `component: Row` override isn't picked up for
// rendering by this Astro renderer, so `render` forces it explicitly.
export const Gutter = {
  render: () => Row,
  args: {
    gutter: "gradient",
    slots: {
      default: [column(4), column(4), column(4)],
    },
  },
};

// Defaults `gutter` to a visible value, same as `Gutter` above.
export const GutterUtility = {
  name: "Gutter (Utility Classes)",
  args: { gutter: "gradient" },
  render: (args) =>
    utilityGrid(
      utilityRow(
        args.gutter,
        utilityColumn(4),
        utilityColumn(4),
        utilityColumn(4),
      ),
    ),
};
