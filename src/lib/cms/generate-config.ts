import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dump } from 'js-yaml';
import { humanize } from '../utils.ts';
import { blogCategoriesCms } from '../../schemas/blogCategories.ts';
import { blogPostsCms } from '../../schemas/blogPosts.ts';
import { footerCms } from '../../schemas/footer.ts';
import { institutionsCms } from '../../schemas/institutions.ts';
import { navigationCms } from '../../schemas/navigation.ts';
import { pagesCms } from '../../schemas/pages.ts';
import { peopleCms } from '../../schemas/people.ts';
import { toolsCms } from '../../schemas/tools.ts';
import {
  fellowshipYearsCms,
  fellowshipsCms,
} from '../../schemas/fellowships.ts';

/**
 * Generates public/config.yml for Decap CMS by introspecting the Zod schemas in
 * src/schemas/*. Those schemas are the single source of truth; DO NOT hand-edit
 * the generated config.yml — edit the schemas (or `baseConfig` below) instead.
 *
 * Zod 4 exposes a schema's internal definition at `schema._zod.def`, with:
 *   - object   -> { type: "object", shape: { key: schema } }
 *   - union    -> { type: "union", discriminator, options: [objectSchema] }  (discriminatedUnion)
 *   - array    -> { type: "array", element: schema }
 *   - enum     -> { type: "enum", entries: { key: value } }
 *   - literal  -> { type: "literal", values: [value] }
 *   - optional -> { type: "optional", innerType: schema }  (also nullable/default)
 *   - string/number/boolean -> { type: "string" | "number" | "boolean" }
 *
 * A field can override its widget/label with Zod metadata, e.g.
 *   z.string().meta({ widget: "markdown", label: "Body copy" })
 */

type ZodAny = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- `_zod.def` is Zod 4's untyped internal schema representation, see comment above.
  _zod: { def: any };
  meta?: () => Record<string, unknown> | null;
};
const def = (schema: ZodAny) => schema._zod.def;
const readMeta = (schema: ZodAny): Record<string, unknown> =>
  (typeof schema.meta === 'function' ? schema.meta() : null) ?? {};

/** Unwrap optional/nullable/default wrappers, tracking whether the field is required. */
function unwrap(schema: ZodAny): {
  inner: ZodAny;
  required: boolean;
  defaultValue?: unknown;
} {
  let inner = schema;
  let required = true;
  let defaultValue: unknown;
  let d = def(inner);
  while (
    d.type === 'optional' ||
    d.type === 'nullable' ||
    d.type === 'default'
  ) {
    if (d.type === 'default') {
      defaultValue = d.defaultValue;
    } else {
      required = false;
    }
    inner = d.innerType;
    d = def(inner);
  }
  return { inner, required, defaultValue };
}

/** Extract a Decap `pattern: [regex, hint]` tuple from a Zod `.regex()` check, if present. */
function stringPattern(d: { checks?: ZodAny[] }): [string, string] | undefined {
  for (const check of d.checks ?? []) {
    const checkDef = def(check);
    if (
      checkDef.check === 'string_format' &&
      checkDef.pattern instanceof RegExp
    ) {
      const message =
        typeof checkDef.error === 'function'
          ? checkDef.error()
          : checkDef.error;
      return [checkDef.pattern.source, String(message ?? 'Invalid format')];
    }
  }
  return undefined;
}

/** Map a single Zod scalar type to a Decap widget name. */
function scalarWidget(zodType: string): string {
  switch (zodType) {
    case 'string':
      return 'string';
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    default:
      console.warn(
        `[generate-config] No Decap widget mapping for Zod type "${zodType}"; falling back to "string".`,
      );
      return 'string';
  }
}

/** Read a `max_length` check off a Zod schema's `checks`, if present. */
function maxLengthCheck(d: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- `_zod.def` is Zod 4's untyped internal schema representation, see comment above.
  checks?: Array<{ _zod: { def: any } }>;
}): number | undefined {
  const check = d.checks?.find((c) => c._zod.def.check === 'max_length');
  return check?._zod.def.maximum;
}

/** Build the Decap field entry for a named object property. */
function fieldFromSchema(
  name: string,
  schema: ZodAny,
): Record<string, unknown> {
  const { inner, required, defaultValue } = unwrap(schema);
  const meta = { ...readMeta(inner), ...readMeta(schema) };
  const d = def(inner);
  const base: Record<string, unknown> = {
    name,
    label: (meta.label as string) ?? humanize(name),
  };
  if (!required) base.required = false;
  if (defaultValue !== undefined) base.default = defaultValue;

  // A Zod `.max(n)` on a string becomes a Decap `pattern` validation. Arrays
  // also produce a "max_length" check, so this must stay string-only.
  if (d.type === 'string') {
    const maxLength = maxLengthCheck(d);
    if (maxLength !== undefined) {
      base.pattern = [
        `^.{0,${maxLength}}$`,
        `Must be ${maxLength} characters or less`,
      ];
    }
    // Set here, not with the other widgets, so it survives the meta passthrough below.
    const pattern = stringPattern(d);
    if (pattern) base.pattern = pattern;
  }

  // Everything in meta besides `label` (already applied above) and `widget`
  // (handled below) passes through verbatim, so widget-specific options
  // (relation's `collection`, a list's `collapsed`/`summary`, etc.) can be set
  // without generator changes for every new widget. Applied last, so an explicit
  // meta value always wins over a derived one.
  const { label: _label, widget: metaWidget, ...extra } = meta;

  const derived = (): Record<string, unknown> => {
    // Explicit widget override via .meta({ widget: "..." }).
    if (typeof metaWidget === 'string') {
      return { ...base, widget: metaWidget };
    }

    if (d.type === 'enum') {
      return { ...base, widget: 'select', options: Object.values(d.entries) };
    }

    if (d.type === 'array') {
      const element = d.element as ZodAny;
      const ed = def(element);
      if (ed.type === 'union') {
        return { ...base, widget: 'list', types: variableTypes(element) };
      }
      if (ed.type === 'enum') {
        return {
          ...base,
          widget: 'select',
          multiple: true,
          options: Object.values(ed.entries),
        };
      }
      if (ed.type === 'object') {
        return { ...base, widget: 'list', fields: fieldsFromObject(element) };
      }
      return { ...base, widget: 'list' }; // list of scalars
    }

    if (d.type === 'object') {
      return { ...base, widget: 'object', fields: fieldsFromObject(inner) };
    }

    return { ...base, widget: scalarWidget(d.type) };
  };

  const field = derived();

  // Astro processes every asset at build time, so an image has to live in the
  // repo. Drop Decap's "Insert from URL" button, which stores a remote URL.
  if (field.widget === 'image' || field.widget === 'file') {
    field.choose_url = false;
  }

  return { ...field, ...extra };
}

/** Build Decap `fields` from a Zod object's shape. */
function fieldsFromObject(
  objectSchema: ZodAny,
): Array<Record<string, unknown>> {
  const shape = def(objectSchema).shape as Record<string, ZodAny>;
  return Object.entries(shape).map(([name, schema]) =>
    fieldFromSchema(name, schema),
  );
}

/**
 * Build Decap variable `types` from a discriminated union. Each option is an
 * object whose discriminator literal becomes the type name; that discriminator
 * field is omitted from the fields (Decap stores it automatically as `typeKey`).
 */
function variableTypes(union: ZodAny): Array<Record<string, unknown>> {
  const { discriminator, options } = def(union) as {
    discriminator: string;
    options: ZodAny[];
  };
  return options.map((option) => {
    const shape = def(option).shape as Record<string, ZodAny>;
    const typeName = def(shape[discriminator]).values[0] as string;
    const fields = Object.entries(shape)
      .filter(([name]) => name !== discriminator)
      .map(([name, schema]) => fieldFromSchema(name, schema));
    return {
      name: typeName,
      label: humanize(typeName),
      widget: 'object',
      fields,
    };
  });
}

/** One fixed entry of a Decap `files` collection (see CollectionDef.files). */
type FileDef = { name: string; label: string; path: string };

/**
 * A collection definition as exported from src/schemas/*: Decap collection-level
 * config, a `schema` (Zod) that drives the fields, optional `extraFields` (Decap
 * fields that can't be expressed as frontmatter Zod, e.g. a markdown body), and
 * optional `files` (making it a `files` collection instead of a `folder` one).
 */
type CollectionDef = {
  schema: ZodAny;
  extraFields?: Array<Record<string, unknown>>;
  files?: FileDef[];
  [key: string]: unknown;
};

/** Turn a schema-backed collection definition into a Decap collection object. */
function buildCollection(
  collectionDef: CollectionDef,
): Record<string, unknown> {
  const { schema, extraFields = [], files, ...meta } = collectionDef;
  const fields = [...fieldsFromObject(schema), ...extraFields];
  // A `files` collection: singleton entries at known paths that editors can edit
  // but not create or delete (e.g. navigation). Every entry shares the same fields.
  if (files) {
    return {
      ...meta,
      files: files.map(({ name, label, path }) => ({
        name,
        label,
        file: path,
        fields,
      })),
    };
  }
  return { ...meta, fields };
}

/** Static parts of the Decap config that aren't tied to a collection schema. */
const baseConfig = {
  backend: {
    name: 'github',
    repo: 'designsystemsinternational/processing-foundation-website',
    branch: 'main',
  },
  // Lets the CMS admin use a local decap-server proxy
  // instead of commiting to Github when it detects it's running localhost.
  local_backend: true,
  // Must start with "/": a relative path here nests uploads inside
  // src/content/<collection>/ instead of src/assets/media/ for fields
  // without their own media_folder (e.g. images in a markdown body).
  media_folder: '/src/assets/media',
  public_folder: '/src/assets/media',
};

/** Every schema-backed collection, in CMS display order. */
const collectionDefs: CollectionDef[] = [
  peopleCms as unknown as CollectionDef,
  institutionsCms as unknown as CollectionDef,
  toolsCms as unknown as CollectionDef,
  pagesCms as unknown as CollectionDef,
  blogPostsCms as unknown as CollectionDef,
  blogCategoriesCms as unknown as CollectionDef,
  fellowshipsCms as unknown as CollectionDef,
  fellowshipYearsCms as unknown as CollectionDef,
  navigationCms as unknown as CollectionDef,
  footerCms as unknown as CollectionDef,
];

/** Build the full Decap config object. */
export function buildConfig() {
  return {
    ...baseConfig,
    collections: collectionDefs.map(buildCollection),
  };
}

/** Serialize the config to YAML with an auto-generated header. */
export function renderConfigYaml(): string {
  const header =
    '# AUTO-GENERATED FROM src/schemas/*.ts — DO NOT EDIT BY HAND.\n' +
    '# Regenerated on every `astro dev` / `astro build`.\n' +
    '# Edit the Zod schemas in src/schemas/ (or baseConfig in\n' +
    '# src/lib/cms/generate-config.ts) instead.\n\n';
  return header + dump(buildConfig(), { lineWidth: -1, noRefs: true });
}

/**
 * Write config.yml. Pass the project root as a file:// URL (Astro integrations
 * get this as `config.root`); when omitted it resolves relative to this file for
 * standalone/CLI use.
 */
export function writeConfig(root?: URL) {
  const outUrl = root
    ? new URL('public/config.yml', root)
    : new URL('../../../public/config.yml', import.meta.url);
  writeFileSync(fileURLToPath(outUrl), renderConfigYaml());
}
