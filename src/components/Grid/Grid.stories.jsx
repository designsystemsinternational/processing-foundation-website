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
    gutterStyle: {
      control: { type: "select" },
      options: ["none", "solid", "gradient"],
    },
    dividerSize: {
      control: { type: "select" },
      options: ["none", "xs", "s", "m", "l"],
    },
  },
  args: {
    ...themeDefaultArgs,
    gutterStyle: "none",
    dividerSize: "m",
  },
  decorators: [withTheme, withColumnHeight],
};

// The only dynamic bits in these examples: thread the `gutterStyle`/`filled`
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
// controls its thickness; "none" leaves the divider off entirely.
const dividerAttr = (size) => {
  if (!size || size === "none") return "";
  return size === "m" ? " data-divider" : ` data-divider data-size="${size}"`;
};

// `data-divider-top` (utilities.css) mirrors data-divider above the row
// instead of below it; combine both to bracket a row on both edges.
const dividerTopAttr = (size) => {
  if (!size || size === "none") return "";
  return size === "m"
    ? " data-divider-top"
    : ` data-divider-top data-size="${size}"`;
};

// `data-fill` (utilities.css) paints a row's own background with the same
// gutter-stripe + solid/gradient pattern `data-filled` draws per cell, so
// empty offset tracks need no placeholder element — content cells punch a
// hole in it automatically.
const rowFillAttr = (fill) =>
  fill && fill !== "none" ? ` data-fill="${fill}"` : "";

export const TwoColumns = {
  render: (args) => `
    <div class="layout-grid gap-column-gap">
      <div class="row"${gutterAttr(args.gutterStyle)}${dividerAttr(args.dividerSize)}>
        <div class="col-span-8" data-demo-col>span 8</div>
        <div class="col-span-4" data-demo-col>span 4</div>
      </div>
    </div>
  `,
};

export const Thirds = {
  render: (args) => `
    <div class="layout-grid gap-column-gap">
      <div class="row"${gutterAttr(args.gutterStyle)}${dividerAttr(args.dividerSize)}>
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
      <div class="row"${gutterAttr(args.gutterStyle)}${dividerAttr(args.dividerSize)}>
        ${Array.from(
          { length: 12 },
          (_, i) => `<div class="col-span-1" data-demo-col>${i + 1}</div>`,
        ).join("\n        ")}
      </div>
    </div>
  `,
};

// The columns respond, not the grid: col-span-6 (mobile-first default) wraps
// into two 6/6 lines below `sm`; sm:col-span-3 collapses them into one
// 3/3/3/3 line at `sm` and up. Resize the preview to see it.
export const Responsive = {
  render: (args) => `
    <div class="layout-grid gap-column-gap">
      <div class="row"${gutterAttr(args.gutterStyle)}${dividerAttr(args.dividerSize)}${dividerTopAttr(args.dividerSize)}>
        <div class="col-span-6 sm:col-span-3" data-demo-col>1</div>
        <div class="col-span-6 sm:col-span-3" data-demo-col>2</div>
        <div class="col-span-6 sm:col-span-3" data-demo-col>3</div>
        <div class="col-span-6 sm:col-span-3" data-demo-col>4</div>
      </div>
    </div>
  `,
};

export const MultipleRows = {
  render: (args) => `
    <div class="layout-grid">
      <div class="row"${gutterAttr(args.gutterStyle)}${dividerAttr(args.dividerSize)}>
        <div class="col-span-8" data-demo-col>span 8</div>
        <div class="col-span-4" data-demo-col>span 4</div>
      </div>
      <div class="row"${gutterAttr(args.gutterStyle)}${dividerAttr(args.dividerSize)}>
        <div class="col-span-4" data-demo-col>span 4</div>
        <div class="col-span-4" data-demo-col>span 4</div>
        <div class="col-span-4" data-demo-col>span 4</div>
      </div>
      <div class="row"${gutterAttr(args.gutterStyle)}>
        <div class="col-span-6" data-demo-col>span 6</div>
        <div class="col-span-6" data-demo-col>span 6</div>
      </div>
    </div>
  `,
};

// A checkerboard of alternating content/blank cells across a 12-column row
// (span 2/2/2/2/2/2), flipping which slots hold content each row.
// `data-fill` paints the blank slots as the row's own background, so they
// need no placeholder element at all — only the real content cells are
// real DOM.
export const Offset = {
  argTypes: {
    filled: {
      control: { type: "select" },
      options: ["none", "solid", "gradient"],
    },
  },
  args: { filled: "gradient", gutterStyle: "solid" },
  render: (args) => `
    <div class="layout-grid">
      <div class="row"${gutterAttr(args.gutterStyle)}${dividerAttr(args.dividerSize)}${rowFillAttr(args.filled)}>
        <div class="col-start-1 col-span-2" data-demo-col>Content</div>
        <div class="col-start-5 col-span-2" data-demo-col>Content</div>
        <div class="col-start-9 col-span-2" data-demo-col>Content</div>
      </div>
      <div class="row"${gutterAttr(args.gutterStyle)}${dividerAttr(args.dividerSize)}${rowFillAttr(args.filled)}>
        <div class="col-start-3 col-span-2" data-demo-col>Content</div>
        <div class="col-start-7 col-span-2" data-demo-col>Content</div>
        <div class="col-start-11 col-span-2" data-demo-col>Content</div>
      </div>
      <div class="row"${gutterAttr(args.gutterStyle)}${rowFillAttr(args.filled)}>
        <div class="col-start-1 col-span-2" data-demo-col>Content</div>
        <div class="col-start-5 col-span-2" data-demo-col>Content</div>
        <div class="col-start-9 col-span-2" data-demo-col>Content</div>
      </div>
    </div>
  `,
};

// Same checkerboard layout as above, but each blank slot is filled
// independently — blank, solid, or gradient — rather than one control for
// the whole row. Needs the old per-cell data-filled placeholders, since a
// row's data-fill background is one pattern for the whole row and can't
// vary slot by slot.
export const OffsetMixedFill = {
  args: { gutterStyle: "gradient" },
  render: (args) => `
    <div class="layout-grid">
      <div class="row"${gutterAttr(args.gutterStyle)}${dividerAttr(args.dividerSize)}>
        <div class="col-start-1 col-span-2" data-demo-col>Content</div>
        <div class="col-start-3 col-span-2"${filledAttr("gradient")} data-divider-blank></div>
        <div class="col-start-5 col-span-2" data-demo-col>Content</div>
        <div class="col-start-7 col-span-2"${filledAttr("solid")}></div>
        <div class="col-start-9 col-span-2" data-demo-col>Content</div>
        <div class="col-start-11 col-span-2"${filledAttr("solid")}></div>
      </div>
      <div class="row"${gutterAttr(args.gutterStyle)}${dividerAttr(args.dividerSize)}>
        <div class="col-start-1 col-span-2"></div>
        <div class="col-start-3 col-span-2" data-demo-col>Content</div>
        <div class="col-start-5 col-span-2"${filledAttr("gradient")} data-divider-blank></div>
        <div class="col-start-7 col-span-2" data-demo-col>Content</div>
        <div class="col-start-9 col-span-2"${filledAttr("gradient")}></div>
        <div class="col-start-11 col-span-2" data-demo-col>Content</div>
      </div>
      <div class="row"${gutterAttr(args.gutterStyle)}>
        <div class="col-start-1 col-span-2" data-demo-col>Content</div>
        <div class="col-start-3 col-span-2"${filledAttr("solid")}></div>
        <div class="col-start-5 col-span-2" data-demo-col>Content</div>
        <div class="col-start-7 col-span-2"${filledAttr("solid")}></div>
        <div class="col-start-9 col-span-2" data-demo-col>Content</div>
        <div class="col-start-11 col-span-2"${filledAttr("solid")}></div>
      </div>
    </div>
  `,
};
