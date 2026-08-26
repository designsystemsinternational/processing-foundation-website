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

## The contact form

The ContactForm block posts to `/api/contact`. The route matches the topic to a
recipient address, then sends the message with the Cloudflare Email Service
binding. The topics and their addresses are in `src/lib/contact.ts`.

### Test it

**With `npm run dev`.** The dev server runs without the Cloudflare adapter, so
no binding exists. The route logs the whole message to your terminal, sends
nothing, and answers as a success. Use this for form work.

**With the local simulator.** This runs the real code path in workerd:

```bash
npm run build
npx wrangler dev -c dist/server/wrangler.json
```

Wrangler prints the recipient, sender, and subject, and writes the body to a
file under `.wrangler/tmp/email/`. Still no email goes out. Use this after you
change the recipients or the binding.

**For real.** Add `"remote": true` to the `send_email` binding in
`wrangler.jsonc`, then run the simulator again. Point the test at your own inbox
first: every allowlisted address is a live Foundation address.

**Not in Storybook.** Storybook serves the component only. It has no
`/api/contact` route, so a submit always fails and the form shows "The message
did not go out. Try again." This is the expected result, not a fault. Storybook
is for the look of the block and for the status states. Test the submit itself
with one of the three methods above.

### Before it works in production

The sender domain must be onboarded to Cloudflare Email Service, with SPF, DKIM,
and DMARC records in place. Until then every real send fails. See
[docs/email-service-setup.md](docs/email-service-setup.md) for the steps.

Run `npm run cf-typegen` after you change the bindings in `wrangler.jsonc`.

## The newsletter form

The NewsletterSignup component posts to `/api/newsletter`. The route sends the
address to Flodesk with
[Create or update subscriber](https://developers.flodesk.com/#tag/subscriber/operation/createOrUpdateSubscriber).
The request is in `src/lib/newsletter.ts`.

### Secrets

| Name                  | Required | What it is                                                 |
| --------------------- | -------- | ---------------------------------------------------------- |
| `FLODESK_API_KEY`     | Yes      | The API key from Flodesk > Integrations > API.             |
| `FLODESK_SEGMENT_IDS` | No       | Segment IDs to add the subscriber to, separated by commas. |

### Test it

**With `npm run dev`.** Put the two names in a `.env` file. Without
`FLODESK_API_KEY` the route logs the address to your terminal, sends nothing,
and answers as a success. Use this for form work.

**With the local simulator.** This runs the real code path in workerd, and does
send to Flodesk:

```bash
npm run build
cp .env dist/server/.dev.vars
npx wrangler dev -c dist/server/wrangler.json
```

**Not in Storybook.** Storybook serves the component only. It has no
`/api/newsletter` route, so a submit always fails and the form shows "The signup
did not go through. Try again." This is the expected result, not a fault.
 