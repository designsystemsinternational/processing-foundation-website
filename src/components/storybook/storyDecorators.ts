import { themeOptions } from "@/lib/constants.ts";

/** Spread into a story's `argTypes` to add the theme control. */
export const themeArgType = {
  control: { type: "select", labels: themeOptions },
  options: Object.keys(themeOptions),
};

/** Spread into a story's `args` so the control defaults to "Default". */
export const themeDefaultArgs = { theme: "default" };

/**
 * Add to a story's `decorators` alongside `themeArgType`/`themeDefaultArgs`.
 * variables.css scopes each theme to `:root[data-theme="…"]`, which only
 * ever matches the document's actual root element — set it there (the
 * preview iframe's <html>) rather than on a wrapper element.
 */
export function withTheme(
  Story: () => unknown,
  context: { args: { theme?: string } },
) {
  document.documentElement.dataset.theme =
    context.args.theme === "default" ? "" : context.args.theme;
  return Story();
}
