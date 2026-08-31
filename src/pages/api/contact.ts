import type { APIRoute } from 'astro';
import { json } from '@/lib/api.ts';
import { contactSubmission, sendContactMessage } from '@/lib/contact.ts';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let fields: FormData;
  try {
    fields = await request.formData();
  } catch {
    return json({ error: 'Send the form as form data.' }, 400);
  }

  // A field the stylesheet hides, so only a bot fills it in. Answer as if the
  // message went out, to teach the bot nothing.
  if (fields.get('company')) return json({ ok: true });

  const submission = contactSubmission.safeParse(Object.fromEntries(fields));
  if (!submission.success) {
    return json({ error: 'Check the form, then send it again.' }, 400);
  }

  try {
    await sendContactMessage(submission.data);
  } catch (error) {
    console.error('[contact] send failed:', error);
    return json({ error: 'The message did not go out. Try again later.' }, 502);
  }

  return json({ ok: true });
};
