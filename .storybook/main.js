import { react } from '@storybook-astro/framework/integrations';

export default {
  stories: [
    '../src/components/**/*.stories.@(js|jsx|ts|tsx)',
    '../src/components/**/*.mdx',
  ],
  addons: ['@storybook/addon-docs'],
  // Primitives/Sketch loads a real sketch folder out of public/sketches.
  staticDirs: ['../public'],
  framework: {
    name: '@storybook-astro/framework',
    // Storybook renders Astro components through its own container, which only
    // knows the renderers listed here — it does not read astro.config's.
    options: { integrations: [react()] },
  },
  // @storybook-astro prerenders stories through a Vite SSR server, then
  // rewrites the dev-only `/@fs/` image URLs to the emitted assets. It matches
  // them with `-[A-Za-z0-9]{6,12}.<ext>`, which Rolldown's default base64
  // hashes fail whenever one contains `-` or `_`. The URL then survives into
  // the built HTML and 404s on the deploy. Hex hashes always match.
  viteFinal(config) {
    const output = (config.build ??= {}).rollupOptions?.output;
    if (Array.isArray(output)) {
      output.forEach((o) => (o.hashCharacters = 'hex'));
    } else {
      config.build.rollupOptions = {
        ...config.build.rollupOptions,
        output: { ...output, hashCharacters: 'hex' },
      };
    }
    return config;
  },
};
