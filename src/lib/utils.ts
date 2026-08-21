import type { ImageMetadata } from 'astro';
import { personRoles, type PersonRole } from './constants.ts';

const WORDS_PER_MINUTE = 200;

/** Estimated minutes to read a markdown body, rounded up */
export function readingTime(markdown: string): number {
  const prose = markdown
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^\s*[-*+>#]+\s*/gm, '');
  const words = prose.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

/** "block1" -> "Block 1", "heroTitle" -> "Hero Title", "call_to_action" -> "Call To Action". */
export function humanize(name: string): string {
  return name
    .replace(/([a-zA-Z])(\d)/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Turns a plain string into a valid slug */
export function slugify(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function blogPostSlug(post: { title: string; slug?: string }): string {
  return post.slug || slugify(post.title);
}

export function blogPostPath(post: { title: string; slug?: string }): string {
  return `/blog/${blogPostSlug(post)}`;
}

export function blogCategorySlug(category: {
  name: string;
  slug?: string;
}): string {
  return category.slug || slugify(category.name);
}

/** A person's collection id is their content directory, which is the slug. */
export function personPath(id: string): string {
  return `/people/${id}`;
}

export function fellowshipPath(id: string): string {
  return `/programs/fellowships/${id}`;
}

/**
 * The fellowships collection id behind a CMS relation value. Decap can only
 * offer its own entry slug, which is the entry's directory plus the "index" file
 * name ("2025/p5-score/index"); Astro's id is the directory alone.
 */
export function fellowshipRefToId(ref: string): string {
  return ref.replace(/\/index$/, '');
}

export function fellowshipTitle(fellowship: {
  title?: string;
  fellows: string[];
}): string {
  return fellowship.title || fellowship.fellows.join(', ');
}

export function fellowshipSubtitle(fellowship: {
  title?: string;
  fellows: string[];
}): string | undefined {
  return fellowship.title ? fellowship.fellows.join(', ') : undefined;
}

/**
 * An optional image field, narrowed to what the Image primitive needs. The
 * schema leaves `src` optional so Decap can save a half-filled object, so even
 * a field an editor did fill in has to be narrowed before it renders.
 */
export function imageIfSet<T extends { src?: ImageMetadata }>(
  field: T | undefined,
): (Omit<T, 'src'> & { src: ImageMetadata }) | undefined {
  return field?.src ? { ...field, src: field.src } : undefined;
}

/** Sorts people by their most senior role (personRoles order), then name. */
export function personSortOrder(
  a: { name: string; roles: PersonRole[] },
  b: { name: string; roles: PersonRole[] },
): number {
  const rolePriority = (roles: PersonRole[]) =>
    Math.min(...roles.map((role) => personRoles.indexOf(role)));
  const roleDiff = rolePriority(a.roles) - rolePriority(b.roles);
  return roleDiff !== 0 ? roleDiff : a.name.localeCompare(b.name);
}
