import { fileURLToPath } from "node:url";
import type { HastPluginDefinition } from "satteri";

const TAG_CLASSES: Record<string, string> = {
  p: "body-m",
};

export function markdownClasses(): HastPluginDefinition {
  return {
    name: "markdown-classes",
    element: {
      filter: Object.keys(TAG_CLASSES),
      visit(node, ctx) {
        const existing = node.properties?.className;
        const current = Array.isArray(existing)
          ? existing
          : existing
            ? String(existing).split(/\s+/)
            : [];
        const added = TAG_CLASSES[node.tagName]
          .split(/\s+/)
          .filter((name) => !current.includes(name));
        if (!added.length) return;
        ctx.setProperty(node, "className", [...current, ...added]);
      },
    },
  };
}

/**
 * Sets the `sizes` attribute for blog images
 * They still rely on global breakpoints for image resizing
 */
const BLOG_DIR = "src/content/blogPosts";
const BLOG_SIZES = "(max-width: 800px) 100vw, 800px";

export function blogImageSizes(): HastPluginDefinition {
  return {
    name: "blog-image-sizes",
    element: {
      filter: ["img"],
      visit(node, ctx) {
        if (!ctx.fileURL) return;
        const path = fileURLToPath(ctx.fileURL).replaceAll("\\", "/");
        if (!path.includes(BLOG_DIR)) return;
        // Respect an explicit sizes if one is ever authored inline.
        if (node.properties?.sizes) return;
        ctx.setProperty(node, "sizes", BLOG_SIZES);
      },
    },
  };
}
