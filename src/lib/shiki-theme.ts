import type { ThemeRegistrationRaw } from 'shiki';
import githubLight from 'shiki/themes/github-light.mjs';

/**
 * Shiki inlines a hex on every span, so `colorReplacements` is the only hook for
 * routing token colors through the page theme. Every color github-light can
 * emit has to appear here — an unmapped one leaks through as a literal hex that
 * ignores the theme. The 16 below are its complete palette: 12 token
 * foregrounds, 5 token backgrounds, and the editor background.
 */
export const codeTheme: ThemeRegistrationRaw = {
  ...githubLight,
  name: 'pf-code',
  colorReplacements: {
    '#fff': 'var(--color-code-bg)',
    '#fafbfc': 'var(--color-code-bg)',
    '#f6f8fa': 'var(--color-code-bg)',
    '#ffeef0': 'var(--color-code-bg)',
    '#f0fff4': 'var(--color-code-bg)',
    '#ffebda': 'var(--color-code-bg)',
    '#24292e': 'var(--color-code-plain)',
    '#586069': 'var(--color-code-plain)',
    '#6a737d': 'var(--color-code-comment)',
    '#d73a49': 'var(--color-code-keyword)',
    '#b31d28': 'var(--color-code-keyword)',
    '#005cc5': 'var(--color-code-constant)',
    '#e36209': 'var(--color-code-constant)',
    '#6f42c1': 'var(--color-code-entity)',
    '#22863a': 'var(--color-code-entity)',
    '#032f62': 'var(--color-code-string)',
  },
};
