import { defineConfig } from "unocss";
import presetDesignTokens from "@designsystemsinternational/unocss-preset-design-tokens";

export default defineConfig({
  presets: [
    presetDesignTokens({
      designTokenFiles: ["./src/styles/variables.css", "./src/styles/breakpoints.css"],
    }),
  ],
});
