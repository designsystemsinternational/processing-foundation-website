import ChevronIcon from './ChevronIcon.astro';

export default {
  title: 'Primitives/Icons',
  component: ChevronIcon,
};

export const Chevron = {
  args: {
    direction: 'right',
    size: 16,
  },
};

export const ChevronLeft = {
  args: {
    direction: 'left',
    size: 16,
  },
};
