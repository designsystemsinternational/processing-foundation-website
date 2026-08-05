/** @type {import("prettier").Config} */
export default {
  plugins: ["prettier-plugin-astro"],
  singleQuote: true,
  trailingComma: "all",
  tabWidth: 2,
  useTabs: false,
  proseWrap: "always",
  printWidth: 80,
  overrides: [
    {
      files: ["*.css"],
      options: {
        singleQuote: false,
      },
    },
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
  ],
};
