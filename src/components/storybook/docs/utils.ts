export type Swatches = Record<string, string>;

const swatchPattern = /--base-color-([a-z]+)(?:-(\d+))?:\s*([^;]+);/g;

export function getColorFamilies(css: string): Record<string, Swatches> {
  const families: Record<string, Swatches> = {};
  for (const match of css.matchAll(swatchPattern)) {
    const [, family, index, value] = match;
    const name = index !== undefined ? family + "-" + index : family;
    const bucket = (families[family] ??= {});
    bucket[name] = "rgb(" + value.trim() + ")";
  }
  return families;
}

// Hex-escaped braces (\x7B / \x7D) instead of literal { } to match a CSS
// rule's braces, since a regex containing literal { } breaks Storybook's
// MDX indexing when this pattern is inlined directly in a .mdx file.
const themeBlockPattern =
  /:root(?:\[data-theme="([\w-]+)"\])?\s*\x7B([^\x7D]*)\x7D/g;
const colorDeclPattern = /(--color-[\w-]+):\s*([^;]+);/g;

export function getThemeTokens(css: string): Record<string, Swatches> {
  const themes: Record<string, Swatches> = {};
  for (const [, themeKey, body] of css.matchAll(themeBlockPattern)) {
    const tokens: Swatches = {};
    for (const [, prop, value] of body.matchAll(colorDeclPattern)) {
      tokens[prop] = value.trim();
    }
    themes[themeKey ?? "default"] = tokens;
  }
  return themes;
}
