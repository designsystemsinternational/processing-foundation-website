import { defineConfig } from 'astro/config';
import type { AstroIntegration } from 'astro';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';
import UnoCSS from 'unocss/astro';
import { writeConfig } from './src/lib/cms/generate-config.ts';
import { satteri } from '@astrojs/markdown-satteri';
import { blogImageSizes, markdownClasses } from './src/lib/markdown.ts';

function decapConfigFromZod(): AstroIntegration {
  return {
    name: 'decap-config-from-zod',
    hooks: {
      'astro:config:setup': ({ config, logger }) => {
        writeConfig(config.root);
        logger.info('Generated public/config.yml from src/schemas/');
      },
    },
  };
}

const isDev = process.argv.includes('dev');

// https://astro.build/config
export default defineConfig({
  output: 'static',
  // cloudflare runs in workerd in dev, which makes sharp not accessible (for fit, etc), so we
  // actually get different experiences in build and dev. This streamlines it.
  adapter: isDev
    ? undefined
    : cloudflare({
        imageService: 'compile',
      }),
  session: {
    driver: 'fs-lite',
  },
  image: {
    layout: 'constrained',
    responsiveStyles: true,
    // This only affects images with no explicit `widths` prop
    breakpoints: [640, 1080, 1600],
  },
  markdown: {
    processor: satteri({
      hastPlugins: [blogImageSizes(), markdownClasses()],
    }),
  },
  integrations: [react(), decapConfigFromZod(), UnoCSS()],
  vite: {
    // Without this, Decap's preview has invalid-hook-call errors
    // because of multiple React versions.
    resolve: {
      dedupe: ['react', 'react-dom'],
    },
  },
});
