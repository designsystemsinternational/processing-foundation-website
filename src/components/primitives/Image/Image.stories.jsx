import catalogSpread from '@/content/blogPosts/20th-anniversary-processing-community-catalog-out-now/7cgehyDeyHp9YetzGljxSw.webp';
import Image from './Image.astro';

export default {
  title: 'Components/Image',
  component: Image,
  parameters: {
    viewport: {
      options: {
        frame: {
          name: '400px frame',
          styles: { width: '400px', height: '600px' },
        },
      },
    },
  },
  globals: {
    viewport: { value: 'frame' },
  },
};

export const Default = {
  args: {
    image: catalogSpread,
    alt: 'A spread from the Processing Community Catalog',
    caption:
      'The Processing Community Catalog, designed by [New Info Studio](https://newinfo.studio/)',
  },
};
