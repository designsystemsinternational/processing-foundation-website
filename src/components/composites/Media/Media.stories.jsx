import { renderMarkdownInline } from '@/lib/html.ts';
import catalogSpread from '@/content/blogPosts/20th-anniversary-processing-community-catalog-out-now/7cgehyDeyHp9YetzGljxSw.webp';
import { captionSizes } from '@/lib/constants.ts';
import Media from './Media.astro';

export default {
  title: 'Composites/Media',
  component: Media,
  argTypes: {
    captionSize: { control: { type: 'select' }, options: captionSizes },
  },
};

export const AnImage = {
  args: {
    src: catalogSpread,
    alt: 'A spread from the Processing Community Catalog',
    caption: renderMarkdownInline(
      'The Processing Community Catalog, designed by [New Info Studio](https://newinfo.studio/)',
    ),
  },
};

export const AYouTubeVideo = {
  args: {
    videoUrl: 'https://www.youtube.com/watch?v=2VLaIr5Ckbs',
    alt: 'Hello Processing',
    caption: renderMarkdownInline('A YouTube video'),
  },
};

export const AVimeoVideo = {
  args: {
    videoUrl: 'https://vimeo.com/76281265',
    alt: 'Hello Processing',
    caption: renderMarkdownInline('A Vimeo video'),
  },
};

export const Empty = {
  args: {},
};

// No sketch story here: a sketch is looked up in the content collection, which
// Storybook's container cannot query. Primitives/Sketch covers it.
