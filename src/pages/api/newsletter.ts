import type { APIRoute } from 'astro';
import { json } from '@/lib/api.ts';
import {
  newsletterSubmission,
  subscribeToNewsletter,
} from '@/lib/newsletter.ts';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let fields: FormData;
  try {
    fields = await request.formData();
  } catch {
    return json({ error: 'Send the form as form data.' }, 400);
  }

  // A field the stylesheet hides, so only a bot fills it in. Answer as if the
  // signup went through, to teach the bot nothing.
  if (fields.get('company')) return json({ ok: true });

  const submission = newsletterSubmission.safeParse(Object.fromEntries(fields));
  if (!submission.success) {
    return json({ error: 'Enter a valid email address.' }, 400);
  }

  try {
    await subscribeToNewsletter(submission.data);
  } catch (error) {
    console.error('[newsletter] signup failed:', error);
    return json({ error: 'The signup did not go through. Try again.' }, 502);
  }

  return json({ ok: true });
};
