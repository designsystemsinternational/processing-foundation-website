import { getCollection, type CollectionEntry } from 'astro:content';
import { fellowshipTitle } from './utils.ts';

/** Every fellowship, newest year first, then by title inside a year. */
export async function getSortedFellowships(): Promise<
  CollectionEntry<'fellowships'>[]
> {
  return (await getCollection('fellowships')).sort((a, b) => {
    const yearDiff = b.data.year.localeCompare(a.data.year);
    return yearDiff !== 0
      ? yearDiff
      : fellowshipTitle(a.data).localeCompare(fellowshipTitle(b.data));
  });
}

/**
 * The years the filter offers, newest first. Read off the fellowships rather
 * than the fellowship-years collection, so a year with no entry gets no route.
 */
export function fellowshipYears(
  fellowships: CollectionEntry<'fellowships'>[],
): string[] {
  return [...new Set(fellowships.map((entry) => entry.data.year))].sort(
    (a, b) => b.localeCompare(a),
  );
}
