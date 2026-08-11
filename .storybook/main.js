export default {
  stories: [
    '../src/components/**/*.stories.@(js|jsx|ts|tsx)',
    '../src/components/**/*.mdx',
  ],
  addons: ['@storybook/addon-docs'],
  framework: {
    name: '@storybook-astro/framework',
    options: {},
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
