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

export const SingleXSmall = {
  args: {},
};

export const DoubleSmall = {
  args: {
    threadSpan: 2,
    size: 's',
  },
};

export const TripleMedium = {
  args: {
    threadSpan: 3,
    size: 'm',
  },
};

export const QuadrupleLarge = {
  args: {
    threadSpan: 4,
    size: 'l',
  },
};
