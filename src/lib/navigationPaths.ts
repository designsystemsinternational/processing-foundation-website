import type { NavigationItem } from '@/schemas/navigation.ts';

/** Strip trailing/duplicate slashes so "/about/" and "/about" compare equal. */
const normalize = (path: string) => `/${path.replace(/^\/+|\/+$/g, '')}`;

/** True when this item points at the page currently being rendered. */
export function isCurrentPage(
  itemPath: string | undefined,
  currentPath: string,
): boolean {
  // External links and bare anchors are never "the current page".
  if (!itemPath || !itemPath.startsWith('/')) return false;
  return normalize(itemPath) === normalize(currentPath);
}

/** True when this item, or anything nested under it, is the current page. */
export function isInTrail(item: NavigationItem, currentPath: string): boolean {
  return (
    isCurrentPage(item.path, currentPath) ||
    (item.children ?? []).some((child) => isInTrail(child, currentPath))
  );
}
