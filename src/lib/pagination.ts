export type PageItem = number | "ellipsis";

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
