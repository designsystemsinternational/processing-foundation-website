import Divider from './Divider.astro';
import {
  dividerArgTypes,
  dividerDefaultArgs,
} from '@/components/storybook/storyDecorators.ts';

export default {
  title: 'Components/Divider',
  component: Divider,
  argTypes: { ...dividerArgTypes },
  args: { ...dividerDefaultArgs },
};

export const SingleSmall = {
  args: {},
};

export const DoubleMedium = {
  args: {
    threadSpan: 2,
    size: 'm',
  },
};

export const TripleLarge = {
  args: {
    threadSpan: 3,
    size: 'l',
  },
};

export const QuadrupleXLarge = {
  args: {
    threadSpan: 4,
    size: 'xl',
  },
};
