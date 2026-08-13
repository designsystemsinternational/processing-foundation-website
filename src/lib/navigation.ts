import { getEntry } from 'astro:content';
import type { NavigationItem } from '@/schemas/navigation.ts';

// The path helpers live in navigationPaths.ts, not here: this module imports
// `astro:content`, which cannot be resolved inside a client-side island bundle.

export async function getNavigation(name = 'main'): Promise<NavigationItem[]> {
  const navigation = await getEntry('navigation', name);
  return (navigation?.data.items ?? []) as NavigationItem[];
}
