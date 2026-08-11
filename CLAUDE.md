# Processing Foundation Website

An Astro static site, edited through Decap CMS, with a block-based page builder.

## Dev server

Start it in background mode:

```bash
astro dev --background
```

Manage it with `astro dev stop`, `astro dev status`, and `astro dev logs`.

Also, always remember to run the CMS proxy, so the CMS will change local files
only:

```bash
npm run cms-proxy
```

Remember to shut down all processes once testing is done.

## Code style

Write code that reads on its own. Clear names and obvious control flow carry the
intent. A comment restating it does not.

- No comments describing what the code plainly does. No file headers, no summary
  blocks above components or functions, no narrating the steps in a block.
- Keep the rare comment the code genuinely can't carry: a non-obvious _why_ — a
  workaround, a library quirk, a deliberate deviation — or an `eslint-disable`
  reason. One line. The comments in `src/schemas/` are the model.

## Linting

- `npm run lint` — runs all three below. CI runs them on every PR.
- `npm run lint:js` / `lint:js:fix` — ESLint over `.ts` and `.astro`.
- `npm run lint:css` / `lint:css:fix` — Stylelint over `.css` and `.astro`
  `<style>`.
- `npm run typecheck` — `astro check`, not `tsc`. Plain `tsc` can't resolve
  `.astro` imports.

## Architecture

**Zod schemas in `src/schemas/` are the single source of truth for content.**
Define a field once. Astro validation and the Decap CMS UI both derive from it.
Never define a field twice.

- `src/schemas/*.ts` — one Zod schema plus a `…Cms` collection-meta object per
  collection.
- `src/lib/cms/generate-config.ts` — introspects the schemas, generates the
  Decap config.
- `src/content.config.ts` — registers the schemas as Astro content collections.
- `src/pages/[...slug].astro` — renders one static page per `pages` entry.

**`public/config.yml` is generated. Never edit it by hand.** It is rewritten on
every `astro dev` and `astro build`. To change the CMS UI, edit the schemas.

### Components

Grouped by what they depend on, not by feature:

- `primitives/` hold simple, low-level components.
- `composites/` have higher-order components that use primitives
- `blocks/` are components used in the CMS page builder
- `layouts/` are full page components that can be rendered on a page or in the
  CMS preview

### Schemas are not component props

A schema describes what an editor fills in and what sits on disk. Props describe
what a component needs in order to render. They are different shapes: `image` is
a path string in the schema, but an `ImageMetadata` object by the time a
component sees it, because `content.config.ts` swaps in Astro's `image()`
helper.

**Components declare their own `Props` and never import from `src/schemas/`.**
The exceptions are the components whose job is to bridge content and
presentation: everything in `components/blocks/`, plus `layouts/PageLayout` and
`composites/MainNavigation`. Nothing in `primitives/` may.

This costs no type safety. The props spread inside a block is where the two
contracts meet:

```astro
{images.map((item) => <Image {...item} />)}
```

If schema and component drift apart, `npm run typecheck` fails on that line.

### Rules when editing schemas

- New field on an existing block or collection: make it `.optional()` or give it
  a `.default()`. A required field breaks every entry saved before it existed.
- Richer CMS widget than the type implies:
  `z.string().meta({ widget: "markdown" })`. `.meta()` also overrides `label`
  and `options`.
- Something Zod can't express, like a markdown body (file content, not
  frontmatter): add it via `extraFields` on the `…Cms` object. See `peopleCms`.
- New block type: add it to `blockSchemasFor` in `src/schemas/pages.ts` — both
  the CMS union and the resolved one derive from that list — then create
  `src/components/blocks/<Name>/` and register it in
  `components/blocks/index.ts`. A block whose fields include an image gets
  `image()` resolution for free, because `content.config.ts` rebuilds the union
  through the same factory.
- New collection: create the schema and its `…Cms` meta, register it in
  `src/content.config.ts`, and add it to `collectionDefs` in
  `src/lib/cms/generate-config.ts`.

After changing a schema, run `astro build` to regenerate `public/config.yml` and
confirm existing content still validates.

## Syncing the showcase

`npm run sync:showcase` downloads the showcase items from Are.na.

## Astro docs

https://docs.astro.build
