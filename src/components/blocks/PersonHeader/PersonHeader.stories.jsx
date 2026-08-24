import { blockMeta } from '@/components/storybook/storyDecorators.ts';
import PersonHeader from './PersonHeader.astro';
import profileImage from '@/content/people/xin-xin/profile.jpg';

export default {
  ...blockMeta,
  title: 'Blocks/PersonHeader',
  component: PersonHeader,
};

const example = {
  name: 'Xin Xin',
  title: 'Co-Executive Director',
  eyebrow: 'About / People / Xin Xin',
  image: profileImage,
  imageCredit: 'Courtesy of photographer',
  body: 'Dan Xu (CN/NL) is a creative researcher and technologist in the fields of human-computer interaction and interactive art. Currently, she is pursuing her doctoral degree at Leiden University. Her research focuses on exploring new ways to conceptualize interaction, aiming to enhance understanding of the dynamic exchange between interacting elements and stimulate the creation of new interactive dialogues. Besides research, she enjoys creating playful interactive prototypes and experiences with code, sound, and text.',
  url: '/',
  employmentStatus: 'part-time',
  roles: ['Staff', 'Alumn', 'Fellow'],
};

const body =
  '<p>Dan Xu (CN/NL) is a creative researcher and technologist in the fields of human-computer interaction and interactive art. Currently, she is pursuing her doctoral degree at Leiden University. Her research focuses on exploring new ways to conceptualize interaction, aiming to enhance understanding of the dynamic exchange between interacting elements and stimulate the creation of new interactive dialogues. Besides research, she enjoys creating playful interactive prototypes and experiences with code, sound, and text.</p><p>Dan Xu (CN/NL) is a creative researcher and technologist in the fields of human-computer interaction and interactive art. Currently, she is pursuing her doctoral degree at Leiden University. Her research focuses on exploring new ways to conceptualize interaction, aiming to enhance understanding of the dynamic exchange between interacting elements and stimulate the creation of new interactive dialogues. Besides research, she enjoys creating playful interactive prototypes and experiences with code, sound, and text.</p>';

export const Default = {
  args: { ...example, roles: example.roles.slice(0, 1) },
};

export const MultipleRoles = {
  args: { ...example },
};

export const NoRolesNoEmploymentStatus = {
  args: { ...example, employmentStatus: undefined, roles: [] },
};

export const LongBio = {
  args: { ...example, body: body },
};

export const NoImage = {
  args: { ...example, image: '' },
};
