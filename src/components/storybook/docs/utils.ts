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

export type TextStyle = { name: string; declarations: Record<string, string> };

// Same hex-escaped braces as above, for the same reason.
const textStylePattern = /:where\(\.([\w-]+)\)\s*\x7B([^\x7D]*)\x7D/g;
const declPattern = /([\w-]+):\s*([^;]+);/g;

export function getTextStyles(css: string): TextStyle[] {
  const styles: TextStyle[] = [];
  for (const [, name, body] of css.matchAll(textStylePattern)) {
    const declarations: Record<string, string> = {};
    for (const [, prop, value] of body.matchAll(declPattern)) {
      declarations[prop] = value.trim();
    }
    styles.push({ name, declarations });
  }
  return styles;
}

export type SpaceTokens = { scale: Record<string, string>; semantic: Record<string, string> };

const spacePattern = /--spacing-([\w-]+):\s*([^;]+);/g;

// Scale steps (xs, s, m, l, ...) are a single word; semantic tokens
// (column-gap, section-gap, ...) always contain a hyphen.
export function getSpaceTokens(css: string): SpaceTokens {
  const scale: Record<string, string> = {};
  const semantic: Record<string, string> = {};
  for (const [, name, value] of css.matchAll(spacePattern)) {
    const bucket = name.includes("-") ? semantic : scale;
    bucket[name] = value.trim();
  }
  return { scale, semantic };
}
