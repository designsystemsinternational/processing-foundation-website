const WORDS_PER_MINUTE = 200;

/** Estimated minutes to read a markdown body, rounded up */
export function readingTime(markdown: string): number {
  const prose = markdown
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^\s*[-*+>#]+\s*/gm, "");
  const words = prose.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

/** Turns a plain string into a valid slug */
export function slugify(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** A blog post's slug, falling back to one derived from its title. */
export function blogPostSlug(post: { title: string; slug?: string }): string {
  return post.slug || slugify(post.title);
}

/** Where a blog post lives on the site. */
export function blogPostPath(post: { title: string; slug?: string }): string {
  return `/blog/${blogPostSlug(post)}`;
}

/** A blog category's slug, falling back to one derived from its name, same*/
export function blogCategorySlug(category: { name: string; slug?: string }): string {
  return category.slug || slugify(category.name);
}

/**
 * Where a fellowship lives on the site. A fellowship entry's id is already its
 * "<year>/<slug>" directory — see the fellowships loader in content.config.ts.
 */
export function fellowshipPath(id: string): string {
  return `/programs/fellowships/${id}`;
}

/** A fellowship's title, falling back to its fellows' names. */
export function fellowshipTitle(fellowship: {
  title?: string;
  fellows: string[];
}): string {
  return fellowship.title || fellowship.fellows.join(", ");
}
