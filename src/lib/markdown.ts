import { fileURLToPath } from 'node:url';
import type { HastPluginDefinition } from 'satteri';

/**
 * Adds classes to tags produced by Markdown.
 * Keys are a tag name (`p`), optionally narrowed to tags that already carry
 * given classes (`div.video`).
 */
export const TAG_CLASSES: Record<string, string> = {
  h3: 'heading-s mb-l',
  h4: 'heading-xs mb-l',
  p: 'body-m mb-l',
  ol: 'body-m mb-l',
  ul: 'body-m mb-l',
  blockquote: 'quote',
  'div.video': 'mb-l',
};

const classRules = Object.entries(TAG_CLASSES).map(([selector, classes]) => {
  const [tagName, ...required] = selector.split('.');
  return { tagName, required, added: classes.split(/\s+/) };
});

function classesToAdd(tagName: string, current: string[]) {
  const matched = classRules.filter(
    (rule) =>
      rule.tagName === tagName &&
      rule.required.every((name) => current.includes(name)),
  );
  return [...new Set(matched.flatMap((rule) => rule.added))].filter(
    (name) => !current.includes(name),
  );
}

const OPEN_TAG = /<([a-zA-Z][\w-]*)((?:"[^"]*"|'[^']*'|[^"'>])*)>/g;
const CLASS_ATTR = /\sclass\s*=\s*(?:"([^"]*)"|'([^']*)')/;

function addClassesToHtml(html: string) {
  return html.replace(OPEN_TAG, (tag, tagName: string, attributes: string) => {
    const classAttr = CLASS_ATTR.exec(attributes);
    const current = (classAttr?.[1] ?? classAttr?.[2] ?? '')
      .split(/\s+/)
      .filter(Boolean);
    const added = classesToAdd(tagName.toLowerCase(), current);
    if (!added.length) return tag;
    const value = [...current, ...added].join(' ');
    if (classAttr) {
      return `<${tagName}${attributes.replace(CLASS_ATTR, ` class="${value}"`)}>`;
    }
    const selfClosing = attributes.endsWith('/');
    const rest = selfClosing ? attributes.slice(0, -1).trimEnd() : attributes;
    return `<${tagName}${rest} class="${value}"${selfClosing ? ' /' : ''}>`;
  });
}

export function markdownClasses(): HastPluginDefinition {
  return {
    name: 'markdown-classes',
    element: {
      filter: [...new Set(classRules.map((rule) => rule.tagName))],
      visit(node, ctx) {
        const existing = node.properties?.className;
        const current = Array.isArray(existing)
          ? existing.map(String)
          : existing
            ? String(existing).split(/\s+/)
            : [];
        const added = classesToAdd(node.tagName, current);
        if (!added.length) return;
        ctx.setProperty(node, 'className', [...current, ...added]);
      },
    },
    // Markdown keeps authored HTML as an unparsed string, so it never reaches
    // the element visitor above.
    raw(node, ctx) {
      const value = addClassesToHtml(node.value);
      if (value === node.value) return;
      ctx.replaceNode(node, { ...node, value });
    },
  };
}

/**
 * Sets the `sizes` attribute for blog images
 * They still rely on global breakpoints for image resizing
 */
const BLOG_DIR = 'src/content/blogPosts';
const BLOG_SIZES = '(max-width: 800px) 100vw, 800px';

export function blogImageSizes(): HastPluginDefinition {
  return {
    name: 'blog-image-sizes',
    element: {
      filter: ['img'],
      visit(node, ctx) {
        if (!ctx.fileURL) return;
        const path = fileURLToPath(ctx.fileURL).replaceAll('\\', '/');
        if (!path.includes(BLOG_DIR)) return;
        // Respect an explicit sizes if one is ever authored inline.
        if (node.properties?.sizes) return;
        ctx.setProperty(node, 'sizes', BLOG_SIZES);
      },
    },
  };
}
