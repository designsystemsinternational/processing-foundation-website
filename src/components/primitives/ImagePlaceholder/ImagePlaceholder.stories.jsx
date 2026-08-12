import ImagePlaceholder from './ImagePlaceholder.astro';

export default {
  title: 'Components/ImagePlaceholder',
  component: ImagePlaceholder,
  argTypes: {
    patterned: {
      control: { type: 'boolean' },
    },
  },
};

export const Default = {
  args: { patterned: true },
};

export const Empty = {
  args: { patterned: false },
};
