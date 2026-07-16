// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import cloudflare from "@astrojs/cloudflare";
import UnoCSS from "unocss/astro";
import { writeConfig } from "./src/lib/generate-config.ts";

function decapConfigFromZod() {
  return {
    name: "decap-config-from-zod",
    hooks: {
      "astro:config:setup": ({ config, logger }) => {
        writeConfig(config.root);
        logger.info("Generated public/config.yml from src/schemas/");
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  output: "static",
  adapter: cloudflare({
    imageService: "compile",
  }),
  session: {
    driver: "fs-lite",
  },
  integrations: [react(), decapConfigFromZod(), UnoCSS()],
  vite: {
    // Without this, Decap's preview has invalid-hook-call errors
    // because of multiple React versions.
    resolve: {
      dedupe: ["react", "react-dom"],
    },
  },
});
