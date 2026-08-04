import { defineConfig } from "unocss";
import presetDesignTokens from "@designsystemsinternational/unocss-preset-design-tokens";

export default defineConfig({
  presets: [
    presetDesignTokens({
      designTokenFiles: ["./src/styles/variables.css", "./src/styles/breakpoints.css"],
    }),
  ],
  // col-span-1..12 and col-start-1..12 are bounded ranges, but are often built
  // as `col-span-${n}`/`col-start-${n}` — dynamic class names UnoCSS's static
  // source scanner can't see. Safelist them so the CSS still generates.
  safelist: [
    ...Array.from({ length: 12 }, (_, i) => `col-span-${i + 1}`),
    ...Array.from({ length: 12 }, (_, i) => `col-start-${i + 1}`),
  ],
});
