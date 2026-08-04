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
    style.textContent = `[data-demo-col] { height: 120px; border: 1px dashed grey; }`;
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
  },
  args: {
    ...themeDefaultArgs,
    gutter: "none",
  },
  decorators: [withTheme, withColumnHeight],
};

// The only dynamic bit in these examples: threads the `gutter` control into
// the markup below as a `data-gutter` attribute.
const gutterAttr = (gutter) =>
  gutter && gutter !== "none" ? ` data-gutter="${gutter}"` : "";

export const TwoColumns = {
  render: (args) => `
    <div class="flex flex-col gap-column-gap">
      <div class="row"${gutterAttr(args.gutter)}>
        <div class="col-span-8" data-demo-col>span 8</div>
        <div class="col-span-4" data-demo-col>span 4</div>
      </div>
    </div>
  `,
};

export const Thirds = {
  render: (args) => `
    <div class="flex flex-col gap-column-gap">
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
    <div class="flex flex-col gap-column-gap">
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
    <div class="flex flex-col gap-column-gap">
      <div class="row"${gutterAttr(args.gutter)}>
        <div class="col-span-8" data-demo-col>span 8</div>
        <div class="col-span-4" data-demo-col>span 4</div>
      </div>
      <div class="row"${gutterAttr(args.gutter)}>
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
// data-gutter's dividers draw on each DOM sibling's own edges, so an
// unrendered gap between non-adjacent columns would otherwise go
// undecorated.
export const Offset = {
  render: (args) => `
    <div class="flex flex-col gap-column-gap">
      <div class="row"${gutterAttr(args.gutter)}>
        <div style="grid-column: 1 / 4"></div>
        <div class="col-span-6 col-start-4" data-demo-col>start 4, span 6</div>
        <div style="grid-column: 10 / 13"></div>
      </div>
      <div class="row"${gutterAttr(args.gutter)}>
        <div style="grid-column: 1 / 2"></div>
        <div class="col-span-3 col-start-2" data-demo-col>start 2, span 3</div>
        <div style="grid-column: 5 / 8"></div>
        <div class="col-span-3 col-start-8" data-demo-col>start 8, span 3</div>
        <div style="grid-column: 11 / 13"></div>
      </div>
      <div class="row"${gutterAttr(args.gutter)}>
        <div style="grid-column: 1 / 5"></div>
        <div class="col-span-8 col-start-5" data-demo-col>start 5, span 8</div>
      </div>
    </div>
  `,
};

// Defaults `gutter` to a visible value.
export const Gutter = {
  args: { gutter: "gradient" },
  render: (args) => `
    <div class="flex flex-col gap-column-gap">
      <div class="row"${gutterAttr(args.gutter)}>
        <div class="col-span-4" data-demo-col>span 4</div>
        <div class="col-span-4" data-demo-col>span 4</div>
        <div class="col-span-4" data-demo-col>span 4</div>
      </div>
    </div>
  `,
};
