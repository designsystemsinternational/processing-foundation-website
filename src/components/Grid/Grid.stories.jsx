import {
  themeArgType,
  themeDefaultArgs,
  withTheme,
} from "@/components/storybook/storyDecorators.ts";

// Storybook-only aid: gives columns enough height for the gutter's
// top-to-bottom gradient to read as a gradient, and a dashed outline so
// column boundaries are visible; not part of the real utility classes.
function withColumnHeight(Story) {
  if (!document.getElementById("story-column-height")) {
    const style = document.createElement("style");
    style.id = "story-column-height";
    style.textContent = `[data-demo-col] { height: 120px; outline: 1px dashed grey; }`;
    document.head.appendChild(style);
  }
  return Story();
}

export default {
  title: "Components/Grid",
  argTypes: {
    theme: themeArgType,
    gutter: {
      control: { type: "select" },
      options: ["none", "solid", "gradient"],
    },
    dividerSize: {
      control: { type: "select" },
      options: ["xs", "s", "m", "l"],
    },
  },
  args: {
    ...themeDefaultArgs,
    gutter: "none",
    dividerSize: "m",
  },
  decorators: [withTheme, withColumnHeight],
};

// The only dynamic bits in these examples: thread the `gutter`/`filled`
// controls into the markup below.
const gutterAttr = (gutter) =>
  gutter && gutter !== "none" ? ` data-gutter="${gutter}"` : "";

// `data-filled` (utilities.css) fills an empty grid area with the themes
// accent color, solid or gradient like `data-gutter`.
const filledAttr = (filled) =>
  filled && filled !== "none" ? ` data-filled="${filled}"` : "";

// `data-divider` (utilities.css) echoes a row's own columns as a thin bar
// below it, drawn via ::after on each of the row's own cells rather than a
// separate DOM row — it always matches the row's real structure. `data-size`
// controls its thickness.
const dividerAttr = (size) =>
  size && size !== "m" ? ` data-divider data-size="${size}"` : " data-divider";

export const TwoColumns = {
  render: (args) => `
    <div class="layout-grid gap-column-gap">
      <div class="row"${gutterAttr(args.gutter)}>
        <div class="col-span-8" data-demo-col>span 8</div>
        <div class="col-span-4" data-demo-col>span 4</div>
      </div>
    </div>
  `,
};

export const Thirds = {
  render: (args) => `
    <div class="layout-grid gap-column-gap">
      <div class="row"${gutterAttr(args.gutter)}>
        <div class="col-span-4" data-demo-col>span 4</div>
        <div class="col-span-4" data-demo-col>span 4</div>
        <div class="col-span-4" data-demo-col>span 4</div>
      </div>
    </div>
  `,
};

export const AllTwelveColumns = {
  render: (args) => `
    <div class="layout-grid gap-column-gap">
      <div class="row"${gutterAttr(args.gutter)}>
        ${Array.from(
          { length: 12 },
          (_, i) => `<div class="col-span-1" data-demo-col>${i + 1}</div>`,
        ).join("\n        ")}
      </div>
    </div>
  `,
};

export const MultipleRows = {
  render: (args) => `
    <div class="layout-grid">
      <div class="row"${gutterAttr(args.gutter)}${dividerAttr(args.dividerSize)}>
        <div class="col-span-8" data-demo-col>span 8</div>
        <div class="col-span-4" data-demo-col>span 4</div>
      </div>
      <div class="row"${gutterAttr(args.gutter)}${dividerAttr(args.dividerSize)}>
        <div class="col-span-4" data-demo-col>span 4</div>
        <div class="col-span-4" data-demo-col>span 4</div>
        <div class="col-span-4" data-demo-col>span 4</div>
      </div>
      <div class="row"${gutterAttr(args.gutter)}>
        <div class="col-span-6" data-demo-col>span 6</div>
        <div class="col-span-6" data-demo-col>span 6</div>
      </div>
    </div>
  `,
};

// Three different offset patterns on a 12-column row: a centered column, two
// columns with gaps before/between/after, and a column offset flush to the
// row's right edge. The empty tracks need a real element sitting in them —
// both data-gutter and data-divider draw on each DOM sibling's own edges, so
// an unrendered gap between non-adjacent columns would otherwise go
// undecorated.
export const Offset = {
  argTypes: {
    filled: {
      control: { type: "select" },
      options: ["none", "solid", "gradient"],
    },
  },
  args: { filled: "none" },
  render: (args) => `
    <div class="layout-grid">
      <div class="row"${gutterAttr(args.gutter)}${dividerAttr(args.dividerSize)}>
        <div class="col-start-1 col-span-3"${filledAttr(args.filled)}></div>
        <div class="col-span-6 col-start-4" data-demo-col>start 4, span 6</div>
        <div class="col-start-10 col-span-3"${filledAttr(args.filled)}></div>
      </div>
      <div class="row"${gutterAttr(args.gutter)}${dividerAttr(args.dividerSize)}>
        <div class="col-start-1 col-span-1"${filledAttr(args.filled)}></div>
        <div class="col-span-3 col-start-2" data-demo-col>start 2, span 3</div>
        <div class="col-start-5 col-span-3"${filledAttr(args.filled)}></div>
        <div class="col-span-3 col-start-8" data-demo-col>start 8, span 3</div>
        <div class="col-start-11 col-span-2"${filledAttr(args.filled)}></div>
      </div>
      <div class="row"${gutterAttr(args.gutter)}>
        <div class="col-start-1 col-span-4"${filledAttr(args.filled)}></div>
        <div class="col-span-8 col-start-5" data-demo-col>start 5, span 8</div>
      </div>
    </div>
  `,
};

// Same offset layout as above, but each empty space is filled independently
// — blank, solid, or gradient — rather than one control for the whole row.
export const OffsetMixedFill = {
  args: { gutter: "gradient" },
  render: (args) => `
    <div class="layout-grid">
      <div class="row"${gutterAttr(args.gutter)}${dividerAttr(args.dividerSize)}>
        <div class="col-start-1 col-span-3"${filledAttr("gradient")}></div>
        <div class="col-span-6 col-start-4" data-demo-col>start 4, span 6</div>
        <div class="col-start-10 col-span-3"></div>
      </div>
      <div class="row"${gutterAttr(args.gutter)}${dividerAttr(args.dividerSize)}>
        <div class="col-start-1 col-span-1"></div>
        <div class="col-span-3 col-start-2" data-demo-col>start 2, span 3</div>
        <div class="col-start-5 col-span-3"${filledAttr("solid")}></div>
        <div class="col-span-3 col-start-8" data-demo-col>start 8, span 3</div>
        <div class="col-start-11 col-span-2"${filledAttr("gradient")}></div>
      </div>
      <div class="row"${gutterAttr(args.gutter)}>
        <div class="col-start-1 col-span-4"${filledAttr("solid")}></div>
        <div class="col-span-8 col-start-5" data-demo-col>start 5, span 8</div>
      </div>
    </div>
  `,
};

// Defaults `gutter` to a visible value.
export const Gutter = {
  args: { gutter: "gradient" },
  render: (args) => `
    <div class="layout-grid gap-column-gap">
      <div class="row"${gutterAttr(args.gutter)}>
        <div class="col-span-4" data-demo-col>span 4</div>
        <div class="col-span-4" data-demo-col>span 4</div>
        <div class="col-span-4" data-demo-col>span 4</div>
      </div>
    </div>
  `,
};
