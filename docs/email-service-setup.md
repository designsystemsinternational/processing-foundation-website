# Onboard the sender domain

The contact form sends mail with the Cloudflare Email Service binding.
Cloudflare refuses a send until the sender domain is onboarded. Do this once, in
the Cloudflare account that holds the site.

## Before you start

- The domain must use Cloudflare DNS.
- Email Sending is in beta, on the Workers Paid plan.
- You need access to the Cloudflare account and to the DNS zone.

## Onboard the domain

1. Open the Cloudflare dashboard.
2. Go to **Compute** > **Email Service** > **Email Sending**.
3. Select **Onboard Domain**.
4. Pick `processingfoundation.org`.
5. Look at the DNS records Cloudflare adds:
   - MX records on the `cf-bounce` subdomain, for bounce messages.
   - An SPF TXT record, to authorize the sends.
   - A DKIM TXT record, to sign the messages.
   - A DMARC TXT record on `_dmarc.processingfoundation.org`.
6. Select **Done**.

The records go live in 5 to 15 minutes on Cloudflare DNS. Full propagation can
take 24 hours.

> **Caution:** a DMARC record already in the zone controls how other systems
> treat your mail. Read it before you replace it.

## Check the result

Go to **Compute** > **Email Service** > **Email Sending** > **Settings**. Each
record shows as `Locked` or `Unlocked`. Both mean the record is correct.

From a terminal:

```bash
dig +short TXT cf-bounce.processingfoundation.org
dig +short TXT _dmarc.processingfoundation.org
```

## Match the code to the domain

The sender address is in `src/lib/contact.ts`:

```ts
const sender = { email: 'website@processingfoundation.org', name: 'Website' };
```

The address must sit on the onboarded domain. The mailbox itself does not have
to exist, but replies go nowhere, so each message carries a `replyTo` with the
address of the person who filled in the form.

Recipients need no onboarding. They are the six addresses in
`contactRecipients`, which are also allowlisted on the `send_email` binding in
`wrangler.jsonc`.

## Test the first real send

1. Put your own address in `contactRecipients` for one topic, and in
   `allowed_destination_addresses` in `wrangler.jsonc`.
2. Add `"remote": true` to the `send_email` binding.
3. Run `npm run build`, then `npx wrangler dev -c dist/server/wrangler.json`.
4. Send one message through the form.
5. Undo all three changes.

A send that fails on verification returns a sender error, and the route
answers 502. Check the dashboard records first.
