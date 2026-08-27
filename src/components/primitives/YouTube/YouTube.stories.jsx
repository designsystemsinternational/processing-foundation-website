import { renderMarkdownInline } from '@/lib/html.ts';
import { captionSizes } from '@/lib/constants.ts';
import YouTube from './YouTube.astro';

export default {
  title: 'Primitives/YouTube',
  component: YouTube,
  argTypes: {
    captionSize: { control: { type: 'select' }, options: captionSizes },
  },
};

export const Default = {
  args: {
    url: 'https://www.youtube.com/watch?v=2VLaIr5Ckbs',
    title: 'Hello Processing',
    caption: renderMarkdownInline('A video with a caption below it'),
  },
};
