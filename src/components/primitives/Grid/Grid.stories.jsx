// Storybook-only aid: gives columns enough height for the gutter's
// top-to-bottom gradient to read as a gradient, and a dashed outline so
// column boundaries are visible; not part of the real utility classes.
function withColumnHeight(Story) {
  if (!document.getElementById('story-column-height')) {
    const style = document.createElement('style');
    style.id = 'story-column-height';
    style.textContent = `[data-demo-col] { height: 120px; outline: 1px dashed grey; }`;
    document.head.appendChild(style);
  }
  return Story();
}

export default {
  title: 'Primitives/Grid',
  argTypes: {
    gutterStyle: {
      control: { type: 'select' },
      options: ['none', 'solid', 'gradient'],
    },
    dividerSize: {
      control: { type: 'select' },
      options: ['none', 'xs', 's', 'm', 'l'],
    },
    divider: {
      control: { type: 'select' },
      options: ['none', 'corner', 'divider'],
    },
    cornerSize: {
      control: { type: 'select' },
      options: ['none', 'xs', 's', 'm', 'l'],
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'intersection'],
    },
  },
  args: {
    gutterStyle: 'none',
    dividerSize: 'm',
    divider: 'none',
    cornerSize: 'm',
    variant: 'default',
  },
  decorators: [withColumnHeight],
};

// The only dynamic bits in these examples: thread the `gutterStyle`/`filled`
// controls into the markup below.
const gutterAttr = (gutter) =>
  gutter && gutter !== 'none' ? ` data-gutter="${gutter}"` : '';

// `data-filled` (utilities.css) fills an empty grid area with the themes
// accent color, solid or gradient like `data-gutter`.
const filledAttr = (filled) =>
  filled && filled !== 'none' ? ` data-filled="${filled}"` : '';

// `data-size` (utilities.css) sets a row's own row-gap independent of
// data-divider, so every row needs it, not just ones with a visible bar.
const sizeAttr = (size) => (size && size !== 'm' ? ` data-size="${size}"` : '');

// `data-divider` (utilities.css) echoes a row's own columns as a styled bar
// via ::after per cell. Independent of sizeAttr, which only sets spacing.
const dividerAttr = (mode) => (mode === 'divider' ? ' data-divider' : '');

// `data-divider-top` (utilities.css) mirrors data-divider above the row
// instead of below it; combine both to bracket a row on both edges.
const dividerTopAttr = (mode) =>
  mode === 'divider' ? ' data-divider-top' : '';

// `data-corner` (utilities.css) marks each cell's own bottom corners instead
// of a full bar. Shares ::after with data-divider, so `divider` picks one.
const cornerAttr = (mode) => (mode === 'corner' ? ' data-corner' : '');

// `data-corner-size` (utilities.css) sizes data-corner's mark, independent
// of data-size — a row can zero its row-gap and still show a full-size
// corner mark.
const cornerSizeAttr = (size) =>
  size && size !== 'm' ? ` data-corner-size="${size}"` : '';

// `data-fill` (utilities.css) paints the row's own background, so empty
// offset tracks need no placeholder element — real cells punch a hole in it.
const rowFillAttr = (fill) =>
  fill && fill !== 'none' ? ` data-fill="${fill}"` : '';

// `data-variant` (utilities.css) picks --edge-marks/divider color: primary or accent.
const variantAttr = (variant) =>
  variant && variant !== 'default' ? ` data-variant="${variant}"` : '';

export const TwoColumns = {
  args: { dividerSize: 'none' },
  render: (args) => `
    <div class="layout-grid gap-column-gap">
      <div class="row"${gutterAttr(args.gutterStyle)}${variantAttr(args.variant)}${sizeAttr(args.dividerSize)}${dividerAttr(args.divider)}${cornerAttr(args.divider)}${cornerSizeAttr(args.cornerSize)}>
        <div class="col-span-8" data-demo-col>span 8</div>
        <div class="col-span-4" data-demo-col>span 4</div>
      </div>
    </div>
  `,
};

export const Thirds = {
  args: { dividerSize: 'none' },
  render: (args) => `
    <div class="layout-grid gap-column-gap">
      <div class="row"${gutterAttr(args.gutterStyle)}${variantAttr(args.variant)}${sizeAttr(args.dividerSize)}${dividerAttr(args.divider)}${cornerAttr(args.divider)}${cornerSizeAttr(args.cornerSize)}>
        <div class="col-span-4" data-demo-col>span 4</div>
        <div class="col-span-4" data-demo-col>span 4</div>
        <div class="col-span-4" data-demo-col>span 4</div>
      </div>
    </div>
  `,
};

export const AllTwelveColumns = {
  args: { dividerSize: 'none' },
  render: (args) => `
    <div class="layout-grid gap-column-gap">
      <div class="row"${gutterAttr(args.gutterStyle)}${variantAttr(args.variant)}${sizeAttr(args.dividerSize)}${dividerAttr(args.divider)}${cornerAttr(args.divider)}${cornerSizeAttr(args.cornerSize)}>
        ${Array.from(
          { length: 12 },
          (_, i) => `<div class="col-span-1" data-demo-col>${i + 1}</div>`,
        ).join('\n        ')}
      </div>
    </div>
  `,
};

// The columns respond, not the grid: col-span-6 (mobile-first default) wraps
// into two 6/6 lines below `sm`; sm:col-span-3 collapses them into one
// 3/3/3/3 line at `sm` and up. Resize the preview to see it.
export const Responsive = {
  args: { dividerSize: 'none' },
  render: (args) => `
    <div class="layout-grid">
      <div class="row"${gutterAttr(args.gutterStyle)}${variantAttr(args.variant)}${sizeAttr(args.dividerSize)}${dividerAttr(args.divider)}${cornerAttr(args.divider)}${cornerSizeAttr(args.cornerSize)}${dividerTopAttr(args.divider)}>
        <div class="col-span-6 sm:col-span-3" data-demo-col>1</div>
        <div class="col-span-6 sm:col-span-3" data-demo-col>2</div>
        <div class="col-span-6 sm:col-span-3" data-demo-col>3</div>
        <div class="col-span-6 sm:col-span-3" data-demo-col>4</div>
      </div>
    </div>
  `,
};

// No divider here, so the wrapper needs gap-column-gap itself to space the
// rows — the decorated MultipleRows below skips it, since data-divider's own
// margin already spaces its rows and adding both would double up.
export const MultipleRowsPlain = {
  args: { dividerSize: 'none' },
  render: (args) => `
    <div class="layout-grid gap-column-gap">
      <div class="row"${gutterAttr(args.gutterStyle)}${variantAttr(args.variant)}${sizeAttr(args.dividerSize)}${dividerAttr(args.divider)}${cornerAttr(args.divider)}${cornerSizeAttr(args.cornerSize)}>
        <div class="col-span-8" data-demo-col>span 8</div>
        <div class="col-span-4" data-demo-col>span 4</div>
      </div>
      <div class="row"${gutterAttr(args.gutterStyle)}${variantAttr(args.variant)}${sizeAttr(args.dividerSize)}${dividerAttr(args.divider)}${cornerAttr(args.divider)}${cornerSizeAttr(args.cornerSize)}>
        <div class="col-span-4" data-demo-col>span 4</div>
        <div class="col-span-4" data-demo-col>span 4</div>
        <div class="col-span-4" data-demo-col>span 4</div>
      </div>
      <div class="row"${gutterAttr(args.gutterStyle)}${variantAttr(args.variant)}${sizeAttr(args.dividerSize)}${dividerAttr(args.divider)}${cornerAttr(args.divider)}${cornerSizeAttr(args.cornerSize)}>
        <div class="col-span-6" data-demo-col>span 6</div>
        <div class="col-span-6" data-demo-col>span 6</div>
      </div>
    </div>
  `,
};

export const MultipleRows = {
  args: { divider: 'divider' },
  render: (args) => `
    <div class="layout-grid">
      <div class="row"${gutterAttr(args.gutterStyle)}${variantAttr(args.variant)}${sizeAttr(args.dividerSize)}${dividerAttr(args.divider)}${cornerAttr(args.divider)}${cornerSizeAttr(args.cornerSize)}>
        <div class="col-span-8" data-demo-col>span 8</div>
        <div class="col-span-4" data-demo-col>span 4</div>
      </div>
      <div class="row"${gutterAttr(args.gutterStyle)}${variantAttr(args.variant)}${sizeAttr(args.dividerSize)}${dividerAttr(args.divider)}${cornerAttr(args.divider)}${cornerSizeAttr(args.cornerSize)}>
        <div class="col-span-4" data-demo-col>span 4</div>
        <div class="col-span-4" data-demo-col>span 4</div>
        <div class="col-span-4" data-demo-col>span 4</div>
      </div>
      <div class="row"${gutterAttr(args.gutterStyle)}${variantAttr(args.variant)}>
        <div class="col-span-6" data-demo-col>span 6</div>
        <div class="col-span-6" data-demo-col>span 6</div>
      </div>
    </div>
  `,
};

// data-divider-top brackets data-divider on the same row's other edge. Three
// span-6 cells always wrap to two lines regardless of viewport, so the
// bottom bar of line one and the top bar of line two land in the same
// reserved gap and read as one bar, not two stacked ones.
export const DividerBracket = {
  args: { divider: 'divider' },
  render: (args) => `
    <div class="layout-grid gap-column-gap">
      <div class="row"${gutterAttr(args.gutterStyle)}${variantAttr(args.variant)}${sizeAttr(args.dividerSize)}data-divider${dividerTopAttr(args.divider)}>
        <div class="col-span-6" data-demo-col>1</div>
        <div class="col-span-6" data-demo-col>2</div>
      </div>
      <div class="row"${gutterAttr(args.gutterStyle)}${variantAttr(args.variant)}${sizeAttr(args.dividerSize)}data-divider-top${dividerAttr(args.divider)}>
        <div class="col-span-6" data-demo-col>1</div>
        <div class="col-span-6" data-demo-col>2</div>
      </div>

    </div>
  `,
};

// data-corner/data-corner-top mark the row's bottom/top edge. dividerSize is
// "none" while cornerSize is "l" — proof the two are independent.
export const Corners = {
  args: {
    variant: 'intersection',
    divider: 'corner',
    gutterStyle: 'gradient',
    dividerSize: 'none',
    cornerSize: 'l',
  },
  render: (args) => `
    <div class="layout-grid gap-column-gap">
      <div class="row"${gutterAttr(args.gutterStyle)}${variantAttr(args.variant)}${sizeAttr(args.dividerSize)}${dividerAttr(args.divider)}${cornerAttr(args.divider)}${cornerSizeAttr(args.cornerSize)}>
        <div class="col-span-4" data-demo-col>span 4</div>
        <div class="col-span-4" data-demo-col>span 4</div>
        <div class="col-span-4" data-demo-col>span 4</div>
      </div>
      <div class="row"${gutterAttr(args.gutterStyle)}${variantAttr(args.variant)}${sizeAttr(args.dividerSize)} data-corner-top${cornerSizeAttr(args.cornerSize)}>
        <div class="col-span-4" data-demo-col>span 4</div>
        <div class="col-span-4" data-demo-col>span 4</div>
        <div class="col-span-4" data-demo-col>span 4</div>
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
      control: { type: 'select' },
      options: ['none', 'solid', 'gradient'],
    },
  },
  args: { filled: 'gradient', gutterStyle: 'solid', divider: 'divider' },
  render: (args) => `
    <div class="layout-grid">
      <div class="row"${gutterAttr(args.gutterStyle)}${variantAttr(args.variant)}${sizeAttr(args.dividerSize)}${dividerAttr(args.divider)}${cornerAttr(args.divider)}${cornerSizeAttr(args.cornerSize)}${rowFillAttr(args.filled)}>
        <div class="col-start-1 col-span-2" data-demo-col>Content</div>
        <div class="col-start-5 col-span-2" data-demo-col>Content</div>
        <div class="col-start-9 col-span-2" data-demo-col>Content</div>
      </div>
      <div class="row"${gutterAttr(args.gutterStyle)}${variantAttr(args.variant)}${sizeAttr(args.dividerSize)}${dividerAttr(args.divider)}${cornerAttr(args.divider)}${cornerSizeAttr(args.cornerSize)}${rowFillAttr(args.filled)}>
        <div class="col-start-3 col-span-2" data-demo-col>Content</div>
        <div class="col-start-7 col-span-2" data-demo-col>Content</div>
        <div class="col-start-11 col-span-2" data-demo-col>Content</div>
      </div>
      <div class="row"${gutterAttr(args.gutterStyle)}${variantAttr(args.variant)}${rowFillAttr(args.filled)}>
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
  args: { gutterStyle: 'gradient', divider: 'divider' },
  render: (args) => `
    <div class="layout-grid">
      <div class="row"${gutterAttr(args.gutterStyle)}${variantAttr(args.variant)}${sizeAttr(args.dividerSize)}${dividerAttr(args.divider)}${cornerAttr(args.divider)}${cornerSizeAttr(args.cornerSize)}>
        <div class="col-start-1 col-span-2" data-demo-col>Content</div>
        <div class="col-start-3 col-span-2"${filledAttr('gradient')} data-divider-blank></div>
        <div class="col-start-5 col-span-2" data-demo-col>Content</div>
        <div class="col-start-7 col-span-2"${filledAttr('solid')}></div>
        <div class="col-start-9 col-span-2" data-demo-col>Content</div>
        <div class="col-start-11 col-span-2"${filledAttr('solid')}></div>
      </div>
      <div class="row"${gutterAttr(args.gutterStyle)}${variantAttr(args.variant)}${sizeAttr(args.dividerSize)}${dividerAttr(args.divider)}${cornerAttr(args.divider)}${cornerSizeAttr(args.cornerSize)}>
        <div class="col-start-1 col-span-2"></div>
        <div class="col-start-3 col-span-2" data-demo-col>Content</div>
        <div class="col-start-5 col-span-2"${filledAttr('gradient')} data-divider-blank></div>
        <div class="col-start-7 col-span-2" data-demo-col>Content</div>
        <div class="col-start-9 col-span-2"${filledAttr('gradient')}></div>
        <div class="col-start-11 col-span-2" data-demo-col>Content</div>
      </div>
      <div class="row"${gutterAttr(args.gutterStyle)}${variantAttr(args.variant)}>
        <div class="col-start-1 col-span-2" data-demo-col>Content</div>
        <div class="col-start-3 col-span-2"${filledAttr('solid')}></div>
        <div class="col-start-5 col-span-2" data-demo-col>Content</div>
        <div class="col-start-7 col-span-2"${filledAttr('solid')}></div>
        <div class="col-start-9 col-span-2" data-demo-col>Content</div>
        <div class="col-start-11 col-span-2"${filledAttr('solid')}></div>
      </div>
    </div>
  `,
};
