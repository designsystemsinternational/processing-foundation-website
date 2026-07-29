/**
 * Theme keys match the `data-theme` values defined in src/styles/variables.css;
 * labels match the comment above each theme block there (e.g. "Red and blue").
 * Rename/extend both together — "default" needs no data-theme attribute.
 */
export const themeOptions = {
  default: "Default",
  "theme-2": "Red and Blue",
  "theme-3": "Orange and Purple",
  "theme-4": "Pink and Green",
  "theme-5": "PF Purple",
  "theme-6": "Blue and Orange",
} as const;

export type ThemeName = keyof typeof themeOptions;
