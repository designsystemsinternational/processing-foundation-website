## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Linting

- `npm run lint` — runs all three checks below in sequence; CI
  (`.github/workflows/lint.yml`) runs this on every PR.
- `npm run lint:js` / `npm run lint:js:fix` — ESLint over `.ts`/`.astro` files
  (`eslint.config.mjs`).
- `npm run lint:css` / `npm run lint:css:fix` — Stylelint over `.css` files
  and `.astro` `<style>` blocks (`.stylelintrc.json`).
- `npm run typecheck` — `astro check`, not `tsc`: plain `tsc` cannot resolve
  `.astro` imports. Requires Node `>=22.12.0` to run at all.

## Architecture

This is an Astro static site edited through Decap CMS, with a block-based page
builder. The README has the full walkthrough; the rules below are what you must
follow when changing content structure.

**Zod schemas in `src/schemas/` are the single source of truth.** Define content
once as a Zod schema; both Astro validation and the Decap CMS UI are derived from
it. Never duplicate field definitions.

- `src/schemas/*.ts` — Zod schemas + a `…Cms` collection-meta object per collection.
- `src/lib/generate-config.ts` — introspects the Zod schemas (`schema._zod.def`,
  Zod 4) and generates the Decap config.
- `src/content.config.ts` — registers the schemas as Astro content collections.
- `src/blocks/` — Astro components that render blocks + `index.ts` registry
  (maps each block `type` → its component).
- `src/pages/[...slug].astro` — renders one static page per `pages` entry.

**`public/config.yml` is GENERATED — never edit it by hand.** It is rewritten
from the Zod schemas on every `astro dev` / `astro build` (via an Astro
integration in `astro.config.mjs`). To change the CMS UI, edit the schemas.

### Rules when editing schemas

- Adding a field to an existing block/collection: make it `.optional()` (or
  backfill every existing content entry). A required field breaks validation on
  content saved before the field existed.
- Need a richer CMS widget than the data type implies (e.g. markdown): use
  `z.string().meta({ widget: "markdown" })`. `.meta()` also overrides `label`
  and `options`.
- Something Zod can't express for a collection (e.g. a markdown body, which is
  file content not frontmatter): add it via `extraFields` on the `…Cms` object
  (see `peopleCms`).
- Adding a new block type: add its schema to `blocksUnion` in
  `src/schemas/pages.ts`, create `src/blocks/BlockN.astro`, and register it in
  `src/blocks/index.ts`.
- Adding a new collection: create the schema + `…Cms` meta, register it in
  `src/content.config.ts`, and add it to `collectionDefs` in
  `src/lib/generate-config.ts`.

After changing schemas, run `astro build` (or `astro dev`) to regenerate
`public/config.yml` and verify content still validates.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
