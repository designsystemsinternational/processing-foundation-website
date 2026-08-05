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

## Development

### Updating the showcase

To update the showcase items, you need to run `npm run sync:showcase`. This will
download the necessary files from Arena.

See `CLAUDE.md` for dev-server conventions and links to the Astro docs.
