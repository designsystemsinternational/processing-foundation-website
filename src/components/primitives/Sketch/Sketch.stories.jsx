import { renderMarkdownInline } from '@/lib/html.ts';
import { captionSizes } from '@/lib/constants.ts';
import { sketchUrl } from '@/lib/sketch.ts';
import Sketch from './Sketch.astro';

export default {
  title: 'Primitives/Sketch',
  component: Sketch,
  argTypes: {
    captionSize: { control: { type: 'select' }, options: captionSizes },
  },
};

export const Default = {
  args: {
    width: 600,
    height: 400,
    src: sketchUrl('rotating-square'),
    title: 'A rotating square',
    caption: renderMarkdownInline('A p5 sketch, sized to the column width'),
  },
};
