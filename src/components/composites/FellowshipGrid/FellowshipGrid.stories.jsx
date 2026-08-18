import openCv from '@/content/fellowships/2013/opencv-library/project-image.jpg';
import screenToSoundscape from '@/content/fellowships/2024/screen-to-soundscape/project-image.jpg';
import p5Score from '@/content/fellowships/2025/p5-score/project-image.jpg';
import theFutureProtest from '@/content/fellowships/2025/the-future-protest/project-image.jpg';
import whereHasTheLakeGone from '@/content/fellowships/2025/where-has-the-lake-gone/project-image.jpg';
import FellowshipGrid from './FellowshipGrid.astro';

function fellowship(year, slug, fellows, title, image, imageCaption) {
  return {
    id: `${year}/${slug}`,
    data: { year, fellows, title, image, imageCaption },
  };
}

const FELLOWSHIPS = [
  fellowship(
    '2025',
    'p5-score',
    ['Kate Sicchio'],
    'p5.score: creative coding notation for choreography',
    p5Score,
    'This is an example of how the the image caption would look',
  ),
  fellowship(
    '2025',
    'where-has-the-lake-gone',
    ['Leonardo Aranda'],
    'Where Has the Lake Gone?',
    whereHasTheLakeGone,
  ),
  fellowship(
    '2025',
    'the-future-protest',
    ['Maryam Kazeem', 'Jubril Olambiwonnu'],
    'The Future Protest',
    theFutureProtest,
  ),
  fellowship(
    '2024',
    'screen-to-soundscape',
    ['Ahnjili ZhuParris', 'Dan Xu', 'Colette Aliman', 'Alyssa Gersony'],
    'Screen-to-Soundscape',
    screenToSoundscape,
  ),
  fellowship('2022', 'sierra-gilliam', ['Sierra Gilliam']),
  fellowship(
    '2013',
    'opencv-library',
    ['Greg Borenstein'],
    'OpenCV Library',
    openCv,
  ),
];

function mockPage(data, { currentPage = 1, lastPage = 1 } = {}) {
  const urlFor = (pageNumber) =>
    pageNumber === 1
      ? '/programs/fellowships'
      : `/programs/fellowships/${pageNumber}`;
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
        ? '/programs/fellowships'
        : `/programs/fellowships/${pageNumber}`,
    ]),
  );
}

export default {
  title: 'Composites/FellowshipGrid',
  component: FellowshipGrid,
};

export const Default = {
  args: {
    page: mockPage(FELLOWSHIPS, { currentPage: 2, lastPage: 6 }),
    pageUrls: pageUrlsFor(6),
  },
};

const WITHOUT_IMAGES = FELLOWSHIPS.map(({ id, data }) => ({
  id,
  data: { ...data, image: undefined, imageCaption: undefined },
}));

export const WithoutProjectImages = {
  args: {
    page: mockPage(WITHOUT_IMAGES),
    pageUrls: pageUrlsFor(1),
  },
};
