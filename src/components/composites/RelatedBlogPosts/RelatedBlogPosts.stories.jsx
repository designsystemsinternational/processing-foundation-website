import headerImage from '@/content/blogPosts/announcing-our-google-summer-of-code-contributors/soc-header.webp';
import RelatedBlogPosts from './RelatedBlogPosts.astro';

function post(title, author, date, category, image) {
  return {
    id: title,
    body: 'A word '.repeat(800),
    data: {
      title,
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
    ['Processing Foundation'],
    '2026-07-02',
    'Google Summer of Code',
    headerImage,
  ),
  post(
    'Call / Code / Response',
    ['Processing Foundation'],
    '2026-03-23',
    'Fellowships',
  ),
  post(
    'The Silence in the Glitch',
    ['Anna Smith', 'Amy B. Woodman'],
    '2026-03-20',
    'Fellowships',
  ),
];

export default {
  title: 'Composites/RelatedBlogPosts',
  component: RelatedBlogPosts,
};

/** A full row: the header cell plus three posts. */
export const Default = {
  args: { posts: POSTS },
};

export const TwoPosts = {
  args: { posts: POSTS.slice(0, 2) },
};

/** One post starts in the same column as the first post of three. */
export const OnePost = {
  args: { posts: POSTS.slice(0, 1) },
};

/** How a person's page uses it: its own heading, and no link to the blog. */
export const OnePostWithOwnHeading = {
  args: {
    posts: POSTS.slice(0, 1),
    title: 'Blog posts by Amy',
    showSeeAllLink: false,
  },
};
