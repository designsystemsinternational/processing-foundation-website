import { blockMeta } from '@/components/storybook/storyDecorators.ts';
import { textSectionVariants } from '@/lib/constants.ts';
import TextSection from './TextSection.astro';

export default {
  ...blockMeta,
  title: 'Blocks/TextSection',
  component: TextSection,
  argTypes: {
    ...blockMeta.argTypes,
    variant: {
      control: { type: 'select' },
      options: textSectionVariants,
    },
  },
};

const pcd = {
  title: 'PCD through the years',
  subtitle: 'Subtitle',
  body: `The first Processing Community Day (PCD) was organized by Taeyoon Choi and the Processing Foundation in 2017. Taking place at the MIT Media Lab, PCD 2017 drew community members from all over the East Coast to get together to meet and share what they’re working on, and to learn and collaborate in person.`,
};

const longBody = `The first Processing Community Day (PCD) was organized by Taeyoon Choi and the Processing Foundation in 2017. Taking place at the MIT Media Lab, PCD 2017 drew community members from all over the East Coast to get together to meet and share what they’re working on, and to learn and collaborate in person.

The following year the Foundation handed the format over to the community. Local organizers ran their own events, on their own terms, in their own languages, and the day grew from one room in Cambridge into more than a hundred gatherings across six continents.

Every PCD is put together by volunteers who decide what their community needs: a workshop for absolute beginners, a screening, a repair café, a day of quiet studio time. The Foundation supports them with small grants, printed material, and an open call, and otherwise stays out of the way.

Since 2017 the events have introduced thousands of people to Processing and p5.js, and they remain the clearest picture we have of who the community is and what it wants to make next.`;

export const Default = {
  args: {
    ...pcd,
    variant: 'default',
    actions: [
      { label: 'View PCD website', href: '/', variant: 'secondary' },
      { label: 'Read recap', href: '/', variant: 'accent' },
    ],
  },
};

export const CenteredBody = {
  args: {
    title: pcd.title,
    subtitle: pcd.subtitle,
    body: longBody,
    variant: 'centered-body',
    actions: [{ label: 'View PCD website', href: '/', variant: 'secondary' }],
  },
};

export const WeaveBanner = {
  args: {
    title: 'Processing 2025 Impact Report',
    body: `Our 2025 Impact Report marks a pivotal year of evolution for Processing Foundation, highlighting strategic program growth and deepening community engagement. Learn more about our software releases, educational initiatives, and our work building a more equitable and accessible creative coding ecosystem.`,
    variant: 'weave-banner',
    actions: [
      { label: 'Read the 2025 Impact Report', href: '/', variant: 'accent' },
      { label: 'See former years', href: '/', variant: 'tertiary' },
    ],
  },
};

export const IntersectionBanner = {
  args: {
    colorTheme: 'theme-4',
    title: 'Processing 2025 Impact Report',
    body: `Lorem ipsum dolor sit amet consectetur. Ipsum tellus ullamcorper fermentum ante nisi condimentum vitae. Ut orci semper ipsum vitae justo ac auctor pulvinar et.`,
    variant: 'intersection-banner',
    actions: [
      { label: 'Read the 2025 Impact Report', href: '/', variant: 'accent' },
      { label: 'See former years', href: '/', variant: 'tertiary' },
    ],
  },
};

export const TitleOnly = {
  args: { title: pcd.title, variant: 'default', actions: [] },
};

export const NoActions = {
  args: { ...pcd, variant: 'default', actions: [] },
};
