import { renderMarkdownInline } from '@/lib/html.ts';
import { captionSizes } from '@/lib/constants.ts';
import Vimeo from './Vimeo.astro';

export default {
  title: 'Primitives/Vimeo',
  component: Vimeo,
  argTypes: {
    captionSize: { control: { type: 'select' }, options: captionSizes },
  },
};

export const Default = {
  args: {
    url: 'https://vimeo.com/76281265',
    title: 'Hello Processing',
    caption: renderMarkdownInline('A video with a caption below it'),
  },
};
