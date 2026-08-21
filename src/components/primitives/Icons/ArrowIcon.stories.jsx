import ArrowIcon from './ArrowIcon.astro';

export default {
  title: 'Primitives/Icons/Arrow',
  component: ArrowIcon,
};

export const Up = {
  args: {
    direction: 'up',
    size: 28,
  },
};

export const Down = {
  args: {
    direction: 'down',
    size: 28,
  },
};
