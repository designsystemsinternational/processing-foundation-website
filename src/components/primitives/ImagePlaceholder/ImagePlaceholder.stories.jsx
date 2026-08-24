import { aspectRatios } from '@/lib/constants.ts';
import ImagePlaceholder from './ImagePlaceholder.astro';

export default {
  title: 'Primitives/ImagePlaceholder',
  component: ImagePlaceholder,
  argTypes: {
    patterned: {
      control: { type: 'boolean' },
    },
    aspectRatio: {
      control: { type: 'select' },
      options: aspectRatios,
    },
  },
  parameters: {
    viewport: {
      options: {
        frame: {
          name: '400px frame',
          styles: { width: '400px', height: '400px' },
        },
      },
    },
  },
  globals: {
    viewport: { value: 'frame' },
  },
};

export const Default = {
  args: { patterned: true },
};

export const Empty = {
  args: { patterned: false },
};

export const Landscape = {
  args: { patterned: true, aspectRatio: 'landscape' },
};
