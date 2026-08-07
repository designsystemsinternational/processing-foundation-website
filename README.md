# Processing Foundation Website

An [Astro](https://astro.build) static site whose content is edited either
manually or through [Decap CMS](https://decapcms.org).

See `CLAUDE.md` for how the codebase is put together and the conventions to
follow when changing it.

## Requirements

- Node `>=24.18.0` (for native TypeScript support)

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
