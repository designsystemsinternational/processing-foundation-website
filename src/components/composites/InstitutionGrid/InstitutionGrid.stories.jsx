import collectiveActionSchool from '@/content/institutions/collective-action-school/logo.png';
import nycDepartmentOfEducation from '@/content/institutions/nyc-department-of-education/logo.jpg';
import nyuItp from '@/content/institutions/nyu-itp/logo.jpg';
import nyuTandon from '@/content/institutions/nyu-tandon/logo.jpg';
import studioForCreativeInquiry from '@/content/institutions/studio-for-creative-inquiry/logo.jpg';
import uclaDesignMediaArts from '@/content/institutions/ucla-design-media-arts/logo.jpg';
import InstitutionGrid from './InstitutionGrid.astro';

function institution(name, department, url, logo) {
  return { id: name, data: { name, department, url, logo } };
}

const INSTITUTIONS = [
  institution(
    'New York University',
    'Interactive Telecommunications Program (ITP)',
    'https://itp.nyu.edu',
    nyuItp,
  ),
  institution(
    'New York University',
    'Tandon School of Engineering',
    'https://engineering.nyu.edu',
    nyuTandon,
  ),
  institution(
    'NYC Department of Education',
    'Computer Science for All',
    'https://cs4all.nyc',
    nycDepartmentOfEducation,
  ),
  institution(
    'UCLA',
    'Design Media Arts',
    'https://dma.ucla.edu',
    uclaDesignMediaArts,
  ),
  institution(
    'Carnegie Mellon University',
    'Studio for Creative Inquiry',
    'https://studioforcreativeinquiry.org',
    studioForCreativeInquiry,
  ),
  institution(
    'Collective Action School',
    undefined,
    'https://collectiveaction.school',
    collectiveActionSchool,
  ),
  institution('School for Poetic Computation', undefined, 'https://sfpc.io'),
];

function mockPage(data, { currentPage = 1, lastPage = 1 } = {}) {
  const urlFor = (pageNumber) =>
    pageNumber === 1
      ? '/community/education'
      : `/community/education/${pageNumber}`;
  return {
    data,
    start: 0,
    end: data.length - 1,
    total: data.length,
    size: data.length,
    currentPage,
    lastPage,
    url: {
      current: urlFor(currentPage),
      prev: currentPage > 1 ? urlFor(currentPage - 1) : undefined,
      next: currentPage < lastPage ? urlFor(currentPage + 1) : undefined,
      first: currentPage > 1 ? urlFor(1) : undefined,
      last: currentPage < lastPage ? urlFor(lastPage) : undefined,
    },
  };
}

function pageUrlsFor(lastPage) {
  return Object.fromEntries(
    Array.from({ length: lastPage }, (_, i) => i + 1).map((pageNumber) => [
      pageNumber,
      pageNumber === 1
        ? '/community/education'
        : `/community/education/${pageNumber}`,
    ]),
  );
}

export default {
  title: 'Composites/InstitutionGrid',
  component: InstitutionGrid,
};

export const Default = {
  args: {
    page: mockPage(INSTITUTIONS, { currentPage: 2, lastPage: 4 }),
    pageUrls: pageUrlsFor(4),
  },
};

export const WithoutLogos = {
  args: {
    page: mockPage(
      INSTITUTIONS.map(({ id, data }) => ({
        id,
        data: { ...data, logo: undefined },
      })),
    ),
    pageUrls: pageUrlsFor(1),
  },
};
