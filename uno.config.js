import { defineConfig } from "unocss";
import presetDesignTokens from "@designsystemsinternational/unocss-preset-design-tokens";

export default defineConfig({
  presets: [
    presetDesignTokens({
      designTokenFiles: ["./src/styles/variables.css", "./src/styles/breakpoints.css"],
    }),
  ],
  // col-span-1..12 is a bounded range, but is often built as `col-span-${n}` —
  // a dynamic class name UnoCSS's static source scanner can't see. Safelist it
  // so the CSS still generates.
  safelist: Array.from({ length: 12 }, (_, i) => `col-span-${i + 1}`),
});
