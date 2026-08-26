import nycDepartmentOfEducation from '@/content/institutions/nyc-department-of-education/logo.jpg';
import nyuItp from '@/content/institutions/nyu-itp/logo.jpg';
import nyuTandon from '@/content/institutions/nyu-tandon/logo.jpg';
import uclaDesignMediaArts from '@/content/institutions/ucla-design-media-arts/logo.jpg';
import { blockMeta } from '@/components/storybook/storyDecorators.ts';
import { renderMarkdown } from '@/lib/html.ts';
import PartnershipGrid from './PartnershipGrid.astro';

const partnerships = [
  {
    image: nyuItp,
    imageAlt: 'New York University',
    eyebrow: '2026',
    title: 'Emmanuel College',
    description: renderMarkdown(
      'Processing Foundation partnered with Emmanuel College to support computer science undergraduates to contribute to Processing Java.',
    ),
    url: '/partnerships/emmanuel-college',
  },
  {
    image: uclaDesignMediaArts,
    imageAlt: 'University of Washington',
    eyebrow: '2026',
    title: 'University of Washington',
    description: renderMarkdown(
      "Processing Foundation partnered with the UW's Human Centered Design & Engineering department to conduct usability studies of the p5.js website.",
    ),
  },
  {
    image: nyuTandon,
    imageAlt: 'New York University',
    eyebrow: '2026',
    title: 'New York University',
    subtitle: 'Tandon School of Engineering',
    description: renderMarkdown(
      'Processing Foundation partnered with NYU Integrated Design and Media program, supporting graduate students to research and develop a beginner-friendly introduction to the Rust programming language.',
    ),
  },
  {
    image: nycDepartmentOfEducation,
    imageAlt: 'University of California, Santa Cruz',
    eyebrow: '2026',
    title: 'University of California, Santa Cruz',
    description: renderMarkdown(
      "Processing Foundation partnered with UCSC's Open Source Program Office to support undergraduate students from Historically Black Colleges and Universities to contribute to p5.js.",
    ),
    url: '/partnerships/uc-santa-cruz',
  },
];

export default {
  ...blockMeta,
  title: 'Blocks/PartnershipGrid',
  component: PartnershipGrid,
  args: {
    ...blockMeta.args,
    intro: { subtitle: 'Universities' },
    partnerships,
  },
};

export const Default = {};

export const SinglePartnership = {
  args: { partnerships: partnerships.slice(0, 1) },
};

export const ThreePartnerships = {
  args: { partnerships: partnerships.slice(0, 3) },
};

export const WithoutImages = {
  args: {
    partnerships: partnerships.map(({ image: _image, ...rest }) => rest),
  },
};

export const WithoutSubtitles = {
  args: {
    partnerships: partnerships.map(({ subtitle: _subtitle, ...rest }) => rest),
  },
};

export const WithoutUrls = {
  args: {
    partnerships: partnerships.map(({ url: _url, ...rest }) => rest),
  },
};

export const WithoutIntro = {
  args: { intro: undefined },
};
