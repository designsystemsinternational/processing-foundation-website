import Pagination from './Pagination.astro';

function mockPage({ currentPage, lastPage, basePath = '/blog' }) {
  const urlFor = (pageNumber) =>
    pageNumber === 1 ? basePath : `${basePath}/${pageNumber}`;
  return {
    data: [],
    start: 0,
    end: 0,
    total: 0,
    size: 10,
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

export default {
  title: 'Primitives/Pagination',
  component: Pagination,
};

function pageUrlsFor(lastPage, basePath = '/blog') {
  return Object.fromEntries(
    Array.from({ length: lastPage }, (_, i) => i + 1).map((pageNumber) => [
      pageNumber,
      pageNumber === 1 ? basePath : `${basePath}/${pageNumber}`,
    ]),
  );
}

export const Default = {
  args: {
    page: mockPage({ currentPage: 1, lastPage: 6 }),
    pageUrls: pageUrlsFor(6),
  },
};

export const MiddlePage = {
  args: {
    page: mockPage({ currentPage: 3, lastPage: 6 }),
    pageUrls: pageUrlsFor(6),
  },
};

export const LastPage = {
  args: {
    page: mockPage({ currentPage: 6, lastPage: 6 }),
    pageUrls: pageUrlsFor(6),
  },
};

export const ManyPagesNearStart = {
  args: {
    page: mockPage({ currentPage: 1, lastPage: 20 }),
    pageUrls: pageUrlsFor(20),
  },
};

export const ManyPagesMiddle = {
  args: {
    page: mockPage({ currentPage: 10, lastPage: 20 }),
    pageUrls: pageUrlsFor(20),
  },
};

export const ManyPagesNearEnd = {
  args: {
    page: mockPage({ currentPage: 20, lastPage: 20 }),
    pageUrls: pageUrlsFor(20),
  },
};

export const SinglePage = {
  args: {
    page: mockPage({ currentPage: 1, lastPage: 1 }),
    pageUrls: pageUrlsFor(1),
  },
};
