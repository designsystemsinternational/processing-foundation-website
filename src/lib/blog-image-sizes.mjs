import { fileURLToPath } from "node:url";

/**
 * Sets the `sizes` attribute for blog images
 * They still rely on global breakpoints for image resizing
 */
const BLOG_DIR = "src/content/blogPosts";
const BLOG_SIZES = "(max-width: 800px) 100vw, 800px";

export function blogImageSizes() {
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
