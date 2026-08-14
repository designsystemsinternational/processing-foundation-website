export type PageItem = number | "ellipsis";

/**
 * Every page's URL for a paginated route, keyed by page number. Page 1 is the
 * bare path, matching what `paginate()` generates for a [...page] route. Pass a
 * `hash` to land the reader on the listing rather than the top of the page.
 */
export function paginationUrls(
  basePath: string,
  lastPage: number,
  hash = "",
): Record<number, string> {
  return Object.fromEntries(
    Array.from({ length: lastPage }, (_, i) => i + 1).map((pageNumber) => [
      pageNumber,
      (pageNumber === 1 ? basePath : `${basePath}/${pageNumber}`) + hash,
    ]),
  );
}

/** Collapses gaps into "ellipsis", but never hides just a single page behind one. */
export function getPageItems(
  currentPage: number,
  lastPage: number,
  siblingCount = 1,
): PageItem[] {
  if (lastPage <= siblingCount * 2 + 5) {
    return Array.from({ length: lastPage }, (_, i) => i + 1);
  }

  const shown = new Set([1, lastPage]);
  for (
    let pageNumber = currentPage - siblingCount;
    pageNumber <= currentPage + siblingCount;
    pageNumber++
  ) {
    if (pageNumber >= 1 && pageNumber <= lastPage) shown.add(pageNumber);
  }

  const sorted = [...shown].sort((a, b) => a - b);
  const items: PageItem[] = [];

  sorted.forEach((pageNumber, index) => {
    const previous = sorted[index - 1];
    if (previous !== undefined) {
      const gap = pageNumber - previous;
      if (gap === 2) items.push(previous + 1);
      else if (gap > 2) items.push("ellipsis");
    }
    items.push(pageNumber);
  });

  return items;
}
