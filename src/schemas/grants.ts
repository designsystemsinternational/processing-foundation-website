import { z } from 'zod';

/**
 * SINGLE SOURCE OF TRUTH for the Grants collections.
 *
 * Two collections live under src/content/grants:
 *
 *   src/content/grants/pr05/index.json            <- grantSchema
 *   src/content/grants/pr05/2025/claire-peng/     <- grantProjectSchema
 *     index.md
 *     project-image.jpg
 *
 * The grant file exists so the list of grants is content rather than code; a
 * grant's description and layout live on its own hand-written page. A year is a
 * folder only, with no file of its own.
 */

export const grantSchema = z.object({
  // Duplicates the folder name, so the CMS relation widget has a value_field.
  name: z.string().meta({
    label: 'Short name',
    hint: 'Also the folder name, e.g. "pr05" or "oss-microgrants".',
  }),
  title: z.string().max(200).optional().meta({
    label: 'Full name',
    hint: 'Optional. Shown when picking a grant in the CMS.',
  }),
  years: z
    .array(
      z.object({
        year: z.string().regex(/^\d{4}$/, 'Must be a four-digit year'),
        title: z.string().max(200).optional(),
      }),
    )
    .optional()
    .meta({
      label_singular: 'year',
      collapsed: true,
      summary: '{{fields.year}} — {{fields.title}}',
      hint: "One entry per year the grant ran. Fills the year dropdown on this grant's projects.",
    }),
});

export type Grant = z.infer<typeof grantSchema>;

export type GrantYear = NonNullable<Grant['years']>[number];

export const grantProjectSchema = z.object({
  grant: z.string().meta({
    widget: 'relation',
    collection: 'grants',
    search_fields: ['name', 'title'],
    value_field: 'name',
    display_fields: ['name'],
  }),
  // Offers only the years listed on the grant picked above; see the widget.
  year: z
    .string()
    .regex(/^\d{4}$/, 'Must be a four-digit year')
    .meta({ widget: 'grant-year' }),
  title: z.string().max(200).optional().meta({
    widget: 'string',
    hint: "Optional. Falls back to the grantees' names when left blank.",
  }),
  grantees: z
    .array(z.string())
    .min(1)
    .meta({
      widget: 'relation',
      collection: 'people',
      search_fields: ['name'],
      value_field: 'name',
      display_fields: ['name'],
      multiple: true,
      min: 1,
    }),
  mentors: z
    .array(z.string())
    .optional()
    .meta({
      widget: 'relation',
      collection: 'people',
      search_fields: ['name'],
      value_field: 'name',
      display_fields: ['name'],
      multiple: true,
    }),
  image: z.string().optional().meta({ widget: 'image' }),
  imageAlt: z.string().optional().meta({ label: 'Image alt text' }),
  imageCaption: z.string().optional().meta({ widget: 'markdown' }),
  projectUrl: z.string().optional().meta({
    label: 'Project URL',
    widget: 'string',
    hint: 'The project itself — repository, website, or live sketch.',
  }),
  blogPosts: z
    .array(z.string())
    .optional()
    .meta({
      label: 'Related Blog Posts',
      widget: 'relation',
      collection: 'blog-posts',
      search_fields: ['title'],
      value_field: 'title',
      display_fields: ['title'],
      multiple: true,
    }),
});

export type GrantProject = z.infer<typeof grantProjectSchema>;

/**
 * Decap CMS collection definitions. `schema` drives the generated fields;
 * `extraFields` are appended verbatim (here, the markdown body, which can't be
 * expressed as frontmatter Zod).
 */
export const grantsCms = {
  name: 'grants',
  label: 'Grants',
  label_singular: 'Grant',
  folder: 'src/content/grants',
  create: true,
  delete: true,
  identifier_field: 'name',
  extension: 'json',
  format: 'json',
  summary: '{{name}}',
  // `path` also sets the listing depth; without it no grant is found.
  path: '{{slug}}/index',
  media_folder: '',
  public_folder: '',
  schema: grantSchema,
};

export const grantProjectsCms = {
  name: 'grant-projects',
  label: 'Grant Projects',
  label_singular: 'Grant Project',
  folder: 'src/content/grants',
  create: true,
  delete: true,
  extension: 'md',
  nested: { depth: 4 },
  meta: {
    path: {
      label: 'Folder',
      widget: 'grant-project-path',
      index_file: 'index',
    },
  },
  // Titles are optional, and Decap's summary templates can't fall back from one
  // field to another (the `default`/`ternary` filters only take literals), so
  // always show the first grantee — who is required — and append the title when
  // it is set.
  summary:
    "{{fields.grant}} {{fields.year}} — {{fields.grantees.0}}{{title | ternary(': ', '')}}{{title}}",
  media_folder: '',
  public_folder: '',
  schema: grantProjectSchema,
  extraFields: [
    { name: 'body', label: 'Project Description', widget: 'markdown' },
  ],
};
