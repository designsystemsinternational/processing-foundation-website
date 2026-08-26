import { renderMarkdownInline } from '@/lib/html.ts';
import { captionSizes } from '@/lib/constants.ts';
import Figure from './Figure.astro';

function withPlaceholderStyle(Story) {
  if (!document.getElementById('story-figure-placeholder')) {
    const style = document.createElement('style');
    style.id = 'story-figure-placeholder';
    style.textContent = `.story-figure-placeholder { background: var(--color-bg-secondary); height: 100%; min-height: 120px; }`;
    document.head.appendChild(style);
  }
  return Story();
}

export default {
  title: 'Primitives/Figure',
  component: Figure,
  decorators: [withPlaceholderStyle],
  argTypes: {
    captionSize: { control: { type: 'select' }, options: captionSizes },
  },
};

const placeholder = '<div class="story-figure-placeholder"></div>';

export const Default = {
  args: {
    slots: { default: placeholder },
    caption: renderMarkdownInline('A caption with a [link](https://p5js.org)'),
  },
};

export const WithAspectRatio = {
  args: {
    slots: { default: placeholder },
    aspectRatio: '16 / 9',
    caption: renderMarkdownInline('The slot sits in a 16 / 9 box'),
  },
};
