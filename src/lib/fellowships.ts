import { getCollection, type CollectionEntry } from 'astro:content';
import { fellowshipTitle } from './utils.ts';

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

export function fellowshipYears(
  fellowships: CollectionEntry<'fellowships'>[],
): string[] {
  return [...new Set(fellowships.map((entry) => entry.data.year))].sort(
    (a, b) => b.localeCompare(a),
  );
}
