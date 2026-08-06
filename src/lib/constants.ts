/**
 * Theme keys match the `data-theme` values defined in src/styles/variables.css;
 * labels match the comment above each theme block there (e.g. "Red and blue").
 * Rename/extend both together — "default" needs no data-theme attribute.
 */
export const themeOptions = {
  default: "Default",
  "theme-2": "Purple and Orange",
  "theme-3": "Green and Pink",
  "theme-4": "Pink and Purple",
  "theme-5": "PF Purple",
  "theme-6": "Orange and Blue",
} as const;

export type ThemeName = keyof typeof themeOptions;
