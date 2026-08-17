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
