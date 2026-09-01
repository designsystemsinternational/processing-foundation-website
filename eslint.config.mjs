import js from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginAstro from "eslint-plugin-astro";

export default [
  {
    ignores: [
      "dist/**",
      ".astro/**",
      "storybook-static/**",
      "worker-configuration.d.ts",
      // p5 sketches are global-mode code that runs against the p5 CDN build.
      "public/sketches/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    files: ["**/*.astro"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        extraFileExtensions: [".astro"],
      },
    },
    rules: {
      // override/add rules settings here, such as:
      // "astro/no-set-html-directive": "error"
    },
  },
];
