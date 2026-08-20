import { blockMeta } from '@/components/storybook/storyDecorators.ts';
import PeopleHeader from './PeopleHeader.astro';
import profileImage from '@/content/people/xin-xin/profile.jpg';

export default {
  ...blockMeta,
  title: 'Blocks/PeopleHeader',
  component: PeopleHeader,
};

const example = {
  name: 'Xin Xin',
  title: 'Co-Executive Director',
  image: { image: profileImage },
  body: 'The first Processing Community Day (PCD) was organized by Taeyoon Choi and the Processing Foundation in 2017. Taking place at the MIT Media Lab, PCD 2017 drew community members from all over the East Coast to get together to meet and share what they’re working on, and to learn and collaborate in person.',
  url: '/',
  employmentStatus: 'part-time',
  roles: ['Staff', 'Alumn', 'Fellow'],
};

export const Default = {
  args: { ...example, roles: example.roles.slice(0, 1) },
};

export const MultipleRoles = {
  args: { ...example },
};

export const NoRolesNoEmploymentStatus = {
  args: { ...example, employmentStatus: undefined, roles: [] },
};
