import ImagePlaceholder from './ImagePlaceholder.astro';

export default {
  title: 'Components/ImagePlaceholder',
  component: ImagePlaceholder,
  argTypes: {
    patterned: {
      control: { type: 'boolean' },
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
