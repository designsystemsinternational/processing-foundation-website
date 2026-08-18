import { defineConfig } from 'unocss';
import presetDesignTokens from '@designsystemsinternational/unocss-preset-design-tokens';
import { TAG_CLASSES } from './src/lib/markdown.ts';

export default defineConfig({
  presets: [
    presetDesignTokens({
      designTokenFiles: [
        './src/styles/variables.css',
        './src/styles/breakpoints.css',
      ],
    }),
  ],
  // col-span-1..12 and col-start-1..12 are bounded ranges, but are often built
  // as `col-span-${n}`/`col-start-${n}` — dynamic class names UnoCSS's static
  // source scanner can't see. Safelist them, unprefixed and at every breakpoint,
  // so the CSS still generates.
  // The markdown plugin injects TAG_CLASSES at render time, in a Node context
  // the source scanner never sees.
  safelist: [
    ...['', 'sm:', 'md:', 'lg:', 'xl:', 'max:'].flatMap((breakpoint) => [
      ...Array.from({ length: 12 }, (_, i) => `${breakpoint}col-span-${i + 1}`),
      ...Array.from({ length: 12 }, (_, i) => `${breakpoint}col-start-${i + 1}`),
    ]),
    ...Object.values(TAG_CLASSES).flatMap((names) => names.split(/\s+/)),
  ],
});
