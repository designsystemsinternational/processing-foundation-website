import {
  blockDefaults,
  blockSpacings,
  colorThemeOptions,
  dividerSizes,
  threadSpans,
} from "@/lib/constants.ts";

function select(
  options: readonly unknown[],
  category: string,
  control: Record<string, unknown> = {},
) {
  return {
    control: { type: "select", ...control },
    options,
    table: { category },
  };
}

/**
 * The page theme: what a page sets once and every block inherits. Wired into
 * every story project-wide from .storybook/preview.js — stories never spread
 * these themselves.
 */
export const pageThemeArgTypes = {
  colorTheme: select(Object.keys(colorThemeOptions), "Page theme", {
    labels: colorThemeOptions,
  }),
  threadSpan: select(threadSpans, "Page theme"),
};

export const pageThemeDefaultArgs = {
  colorTheme: "default",
  threadSpan: blockDefaults.threadSpan,
};

/**
 * variables.css scopes each theme to `:root[data-color-theme="…"]`, which only
 * ever matches the document's actual root element — set it there (the
 * preview iframe's <html>) rather than on a wrapper element.
 */
export function withPageTheme(
  Story: () => unknown,
  context: { args: { colorTheme?: string } },
) {
  document.documentElement.dataset.colorTheme =
    context.args.colorTheme === "default" ? "" : context.args.colorTheme;
  return Story();
}

/** What a Block adds on top of the page theme. */
export const blockArgTypes = {
  spacing: select(blockSpacings, "Block"),
  dividerSize: select(dividerSizes, "Block"),
};

export const blockDefaultArgs = {
  spacing: blockDefaults.spacing,
  dividerSize: blockDefaults.dividerSize,
};

/**
 * Spread as the first entry of a block story's default export. It must stay a
 * spread into an object literal — Storybook's CSF indexer reads the default
 * export statically and rejects anything that isn't a literal object.
 *
 *   export default { ...blockMeta, title: "Blocks/Images", component: Images };
 *
 * Adding controls of your own means re-spreading this one's:
 *
 *   argTypes: { ...blockMeta.argTypes, variant: { … } }
 */
export const blockMeta = {
  argTypes: blockArgTypes,
  args: blockDefaultArgs,
};

/** Divider names the same value `size`, so it needs its own pair. */
export const dividerArgTypes = {
  size: select(dividerSizes, "Divider"),
};

export const dividerDefaultArgs = { size: blockDefaults.dividerSize };
