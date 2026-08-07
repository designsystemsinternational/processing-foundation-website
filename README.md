# Processing Foundation Website

An [Astro](https://astro.build) static site whose content is edited either
manually or through [Decap CMS](https://decapcms.org). It includes a **page
builder**: editors assemble pages from reusable "blocks" in any order, and Astro
renders them to static HTML.

The defining idea of this codebase: **Zod schemas are the single source of
truth.** You describe content once as a Zod schema, and both Astro's validation
_and_ the Decap CMS admin UI are derived from it.

## Requirements

- Node `>=22.12.0` (the toolchain relies on Node's native TypeScript support)

## Getting started

```bash
npm install
```

As the newest version of NPM doesn't automatically allow post install scripts,
you'll need to run this:

```bash
npm approve-scripts --allow-scripts-pending
npm install
```

Then boot up the server:

```bash
npm run dev
```

- Site: http://localhost:4321
- CMS admin: http://localhost:4321/admin

The Decap Admin commits to the real Github repo by default. To edit content
locally without creating real commits, also run the local backend proxy in a
second terminal:

```bash
npm run cms-proxy
```

With both running, `/admin` detects it's on localhost and reads/writes directly
to the local git repo instead of Github.

`astro dev` and `astro build` both regenerate `public/config.yml` automatically
(see "How the CMS config is generated" below).

## Schemas vs. component props

Zod schemas are the single source of truth for **content** — but not for
component props. The two are deliberately separate contracts:

| | Owns | Lives in |
| --- | --- | --- |
| **Schema** | What an editor fills in, and what's on disk | `src/schemas/` |
| **Props** | What a component needs in order to render | the component |

They are not the same shape, and `Image` is the clearest example. In the schema,
`image` is a **path string** — that's what Decap writes into the JSON. By the
time a component renders it, `image` is an **`ImageMetadata` object**, because
`src/content.config.ts` swaps in Astro's `image()` helper at read time. A
component that derived its props from the schema would have to `Omit` the most
important field and patch it back in.

The rule that follows:

> **Presentational components declare their own `Props`** and never import from
> `src/schemas/`.

The exceptions are the components whose whole job is to bridge content and
presentation: everything in `src/blocks/`, plus `PageTemplate.astro` and
`MainNavigation.astro`, which render a content collection directly. Those may
import content types. A leaf component like `Image`, `Block` or `Divider` may
not.

This is not a loss of type safety. Assignability is checked where the two
contracts actually meet — at the props spread inside the block:

```astro
{images.map((item) => <Image {...item} />)}
```

If the schema and the component drift apart, `npm run typecheck` fails on that
line. You get the same guarantee, at the seam where it belongs, without coupling
every component to the CMS.

The practical payoff is that a component works from any source. `Image` is
rendered from a page block (`src/blocks/Images/`), from blog frontmatter
(`src/pages/blog/[slug].astro`, which uses flat `headerImage` /
`headerImageCaption` fields and no `imageWithCaption` at all), and from Storybook
with a directly-imported `.webp`. Only the first of those involves the CMS.

## Development

### Updating the showcase

To update the showcase items, you need to run `npm run sync:showcase`. This will
download the necessary files from Arena.

See `CLAUDE.md` for dev-server conventions and links to the Astro docs.
