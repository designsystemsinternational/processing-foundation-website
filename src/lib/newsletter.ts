import { getSecret } from 'astro:env/server';
import { z } from 'zod';

/**
 * Server only. Flodesk authenticates with the API key as the Basic auth user
 * and an empty password, and rejects a request whose User-Agent does not name
 * the caller.
 */
const flodeskApi = 'https://api.flodesk.com/v1';
const userAgent = 'Processing Foundation (https://processingfoundation.org)';

/**
 * With double opt-in, Flodesk emails the subscriber a confirmation link and
 * holds the record as `unconfirmed` until they select it. Set this to false
 * for a single opt-in, and change the sent message in newsletterSignup.ts.
 */
const doubleOptin = true;

export const newsletterSubmission = z.object({
  email: z.email().max(254),
});

export type NewsletterSubmission = z.infer<typeof newsletterSubmission>;

const segmentIds = () =>
  (getSecret('FLODESK_SEGMENT_IDS') ?? '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);

export async function subscribeToNewsletter({ email }: NewsletterSubmission) {
  const apiKey = getSecret('FLODESK_API_KEY');
  const segments = segmentIds();

  if (!apiKey) {
    if (import.meta.env.DEV) {
      console.info('[newsletter] no FLODESK_API_KEY, no subscriber sent:', {
        email,
        segments,
      });
      return;
    }
    throw new Error('FLODESK_API_KEY is not set');
  }

  const response = await fetch(`${flodeskApi}/subscribers`, {
    method: 'POST',
    headers: {
      authorization: `Basic ${btoa(`${apiKey}:`)}`,
      'content-type': 'application/json',
      'user-agent': userAgent,
    },
    body: JSON.stringify({
      email,
      double_optin: doubleOptin,
      ...(segments.length > 0 && { segment_ids: segments }),
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Flodesk answered ${response.status}: ${await response.text()}`,
    );
  }
}
