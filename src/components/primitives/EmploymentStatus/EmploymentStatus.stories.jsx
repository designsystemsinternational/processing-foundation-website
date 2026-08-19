import { employmentStatusModes } from '@/lib/constants';
import EmploymentStatus from './EmploymentStatus.astro';

export default {
  title: 'Primitives/EmploymentStatus',
  component: EmploymentStatus,
  argTypes: {
    mode: {
      control: { type: 'select' },
      options: employmentStatusModes,
    },
  },
};

export const Default = {};
