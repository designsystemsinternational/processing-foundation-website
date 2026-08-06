import { z } from "zod";

/**
 * SINGLE SOURCE OF TRUTH for site navigation.
 *
 * A navigation is a nested tree: every item has a `title`, an optional `path`,
 * and an optional list of `children` with the same shape. One JSON file per
 * navigation lives in src/content/navigation/ (main.json is the main navigation).
 *
 * Decap widgets are declared statically in config.yml, so a *truly* recursive
 * schema is impossible — the nesting is unrolled to a fixed MAX_NAVIGATION_DEPTH
 * below. Because `children` is optional at every level, raising the depth later is
 * a one-constant change that needs no content migration.
 *
 * The unrolling is written as a loop rather than a self-recursive function so the
 * generated Zod object stays plain (no `z.lazy`, which src/lib/cms/generate-config.ts
 * can't introspect).
 */

/** How many levels deep the CMS lets editors nest items (top level counts as 1). */
export const MAX_NAVIGATION_DEPTH = 3;

const listOptions = {
  collapsed: true,
  summary: "{{fields.title}}",
  label_singular: "Item",
};

/** Empty, a site-relative path ("/about/team"), or an https URL — nothing else. */
const pathPattern =
  /^$|^(?:\/(?!\/)|https:\/\/[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+)[\w.~\-/?#[\]@:!$&'()*+,;=%]*$/;

const navigationItemBase = z.object({
  title: z.string(),
  path: z
    .string()
    .regex(
      pathPattern,
      'Must start with "/" or "https://" (e.g. "/about/team") and contain no spaces or unusual characters',
    )
    .optional()
    .meta({ label: 'Link (e.g. "/about" or "https://processing.org")' }),
});

function navigationItem(maxDepth: number): z.ZodObject {
  let item: z.ZodObject = navigationItemBase;
  for (let level = 1; level < maxDepth; level++) {
    item = navigationItemBase.extend({
      children: z
        .array(item)
        .optional()
        .meta({ ...listOptions, label: "Sub-items" }),
    });
  }
  return item;
}

export const navigationSchema = z.object({
  items: z
    .array(navigationItem(MAX_NAVIGATION_DEPTH))
    .optional()
    .meta({ ...listOptions, label: "Items" }),
});

export type NavigationItem = {
  title: string;
  path?: string;
  children?: NavigationItem[];
};

export const navigationCms = {
  name: "navigation",
  label: "Navigation",
  files: [
    {
      name: "main",
      label: "Main navigation",
      path: "src/content/navigation/main.json",
    },
  ],
  schema: navigationSchema,
};
