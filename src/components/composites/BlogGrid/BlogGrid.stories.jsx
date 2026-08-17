import headerImage from '@/content/blogPosts/announcing-our-google-summer-of-code-contributors/soc-header.webp';
import BlogGrid from './BlogGrid.astro';

function post(title, subtitle, author, date, category, image) {
  return {
    id: title,
    body: 'A word '.repeat(800),
    data: {
      title,
      subtitle,
      author,
      category,
      date: new Date(date),
      headerImage: image,
      headerImagePosition: 'center',
    },
  };
}

const POSTS = [
  post(
    'Announcing our Google Summer of Code Contributors',
    'Processing Foundation is participating in Google Summer of Code (GSoC) for the 14th year!',
    ['Processing Foundation'],
    '2026-07-02',
    'Google Summer of Code',
    headerImage,
  ),
  post(
    'Easy but awesome: free and open-source creative tools for middle-school students',
    'Interview with Shawn Patrick Higgins, 2021 Teaching Fellow, by Saber Khan, Education Community Director',
    ['Anna Smith'],
    '2026-08-23',
    'Education',
  ),
  post(
    'What’s New in p5.js 2.3.0!',
    'Since the last release, we’ve focused on stabilizing p5.js and creating smoother workflows.',
    ['Processing Foundation'],
    '2026-06-22',
    'Software',
  ),
  post(
    'Call / Code / Response',
    'How creative technologists and youth activists built LIVE FROM LA — Processing Foundation Fellowship Project 2025',
    ['Processing Foundation'],
    '2026-03-23',
    'Fellowships',
  ),
  post(
    'The Silence in the Glitch',
    'Reimagining the Lagos Lagoon Through Speculative Protest — Processing Foundation Fellowship Project 2025',
    ['Anna Smith', 'Amy B. Woodman'],
    '2026-03-20',
    'Fellowships',
  ),
  post('Body as Data', undefined, ['Amy B. Woodman'], '2026-03-17'),
];

function mockPage(data, { currentPage = 1, lastPage = 1 } = {}) {
  const urlFor = (pageNumber) =>
    pageNumber === 1 ? '/blog' : `/blog/${pageNumber}`;
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
      pageNumber === 1 ? '/blog' : `/blog/${pageNumber}`,
    ]),
  );
}

export default {
  title: 'Composites/BlogGrid',
  component: BlogGrid,
};

export const Default = {
  args: {
    posts: POSTS,
    page: mockPage(POSTS, { currentPage: 3, lastPage: 22 }),
    pageUrls: pageUrlsFor(22),
  },
};

const WITHOUT_IMAGES = POSTS.map(({ id, body, data }) => ({
  id,
  body,
  data: { ...data, headerImage: undefined },
}));

export const WithoutHeaderImages = {
  args: {
    posts: WITHOUT_IMAGES,
    page: mockPage(WITHOUT_IMAGES),
    pageUrls: pageUrlsFor(1),
  },
};
