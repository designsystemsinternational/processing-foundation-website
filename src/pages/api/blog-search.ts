import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import Fuse from 'fuse.js';
import { json } from '@/lib/api.ts';
import {
  blogPostPath,
  dateIso,
  dateLabel,
  readingTime,
  readTimeDatetime,
  readTimeLabel,
} from '@/lib/utils.ts';

export const prerender = false;

const RESULT_LIMIT = 24;
const MIN_QUERY_LENGTH = 2;

export interface BlogSearchResult {
  title: string;
  subtitle?: string;
  href: string;
  author: string;
  category?: string;
  dateIso: string;
  dateLabel: string;
  readTimeDatetime: string;
  readTimeLabel: string;
}

export interface BlogSearchResponse {
  query: string;
  total: number;
  results: BlogSearchResult[];
}

interface IndexedPost {
  title: string;
  subtitle: string;
  result: BlogSearchResult;
}

const fuseOptions: ConstructorParameters<typeof Fuse<IndexedPost>>[1] = {
  ignoreLocation: true,
  threshold: 0.35,
  minMatchCharLength: MIN_QUERY_LENGTH,
  keys: [
    { name: 'title', weight: 5 },
    { name: 'subtitle', weight: 3 },
  ],
};

async function buildIndex(): Promise<Fuse<IndexedPost>> {
  const posts = (await getCollection('blogPosts')).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  const indexed = posts.map((entry): IndexedPost => {
    const post = entry.data;
    const readTime = readingTime(entry.body ?? '');

    return {
      title: post.title,
      subtitle: post.subtitle ?? '',
      result: {
        title: post.title,
        subtitle: post.subtitle,
        href: blogPostPath(post),
        author: post.author.join(', '),
        category: post.category,
        dateIso: dateIso(post.date),
        dateLabel: dateLabel(post.date),
        readTimeDatetime: readTimeDatetime(readTime),
        readTimeLabel: readTimeLabel(readTime),
      },
    };
  });

  return new Fuse(indexed, fuseOptions);
}

// The index outlives the request: parsing 260-odd posts per keystroke would
// dwarf the search itself.
let index: Promise<Fuse<IndexedPost>> | undefined;

export const GET: APIRoute = async ({ url }) => {
  const query = (url.searchParams.get('q') ?? '').trim();

  if (query.length < MIN_QUERY_LENGTH) {
    return json({ query, total: 0, results: [] } satisfies BlogSearchResponse);
  }

  index ??= buildIndex();
  const matches = (await index).search(query);

  return json({
    query,
    total: matches.length,
    results: matches.slice(0, RESULT_LIMIT).map(({ item }) => item.result),
  } satisfies BlogSearchResponse);
};
