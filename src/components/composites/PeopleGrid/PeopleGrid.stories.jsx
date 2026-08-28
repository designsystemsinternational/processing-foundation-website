import ariMelenciano from '@/content/people/ari-melenciano/profile.jpg';
import cassieTarakajian from '@/content/people/cassie-tarakajian/profile.jpg';
import courtneyMorgan from '@/content/people/courtney-morgan/profile.jpg';
import miriamLanger from '@/content/people/miriam-langer/profile.jpg';
import phoenixPerry from '@/content/people/phoenix-perry/profile.jpg';
import xinXin from '@/content/people/xin-xin/profile.jpg';
import { slugify } from '@/lib/utils.ts';
import PeopleGrid from './PeopleGrid.astro';

function person(name, title, roles, src) {
  return { id: slugify(name), data: { name, title, roles, image: { src } } };
}

const PEOPLE = [
  person('Ari Melenciano', 'Fellow', ['Fellow'], ariMelenciano),
  person('Cassie Tarakajian', 'Engineer', ['Staff'], cassieTarakajian),
  person('Courtney Morgan', 'Board Member', ['Board'], courtneyMorgan),
  person('Miriam Langer', 'Mentor', ['Mentor'], miriamLanger),
  person('Phoenix Perry', 'Fellow', ['Fellow'], phoenixPerry),
  person('Xin Xin', 'Co-Executive Director', ['Staff', 'Board'], xinXin),
];

function mockPage(data, { currentPage = 1, lastPage = 1 } = {}) {
  const urlFor = (pageNumber) =>
    pageNumber === 1 ? '/about/people' : `/about/people/${pageNumber}`;
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
      pageNumber === 1 ? '/about/people' : `/about/people/${pageNumber}`,
    ]),
  );
}

export default {
  title: 'Composites/PeopleGrid',
  component: PeopleGrid,
};

export const Default = {
  args: {
    page: mockPage(PEOPLE, { currentPage: 2, lastPage: 4 }),
    pageUrls: pageUrlsFor(4),
  },
};

export const WithoutPhotos = {
  args: {
    page: mockPage(
      PEOPLE.map(({ id, data }) => ({
        id,
        data: { ...data, image: undefined },
      })),
    ),
    pageUrls: pageUrlsFor(1),
  },
};
