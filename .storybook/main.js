export default {
  stories: [
    '../src/components/**/*.stories.@(js|jsx|ts|tsx)',
    '../src/components/**/*.mdx',
    '../src/blocks/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: ['@storybook/addon-docs'],
  framework: {
    name: '@storybook-astro/framework',
    options: {},
  },
};
