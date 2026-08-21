import { getEntry, type CollectionEntry } from 'astro:content';
import { routedPages } from './constants.ts';

/**
 * The `pages` entry behind a route in src/pages/. Unlike getFooter, a missing
 * entry throws: the route exists either way, so a silent fallback would ship a
 * page with no content. See routedPages in constants.ts.
 */
export async function getRoutedPage(
  name: keyof typeof routedPages,
): Promise<CollectionEntry<'pages'>> {
  return getPage(routedPages[name]);
}

/** A `pages` entry a route reads by id, for a page [...slug].astro still renders. */
export async function getPage(id: string): Promise<CollectionEntry<'pages'>> {
  const entry = await getEntry('pages', id);
  if (!entry) {
    throw new Error(
      `This route needs its page content at src/content/pages/${id}.json. Restore the entry, or delete the route.`,
    );
  }
  return entry;
}
