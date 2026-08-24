import { z } from 'zod';
import { contactTopics, type ContactTopic } from './constants.ts';

/**
 * Server only. The submit endpoint resolves the recipient from the posted
 * topic name — never import this from a client script, and never let a
 * request carry an address. The same addresses are allowlisted on the
 * `send_email` binding in wrangler.jsonc.
 */
export const contactRecipients: Record<ContactTopic, string> = {
  Fellowships: 'fellowship@processingfoundation.org',
  PCD: 'day@processing.org',
  Employment: 'employment@processingfoundation.org',
  Give: 'give@processingfoundation.org',
  Education: 'education@processingfoundation.org',
  General: 'foundation@processingfoundation.org',
};

/** The domain must be onboarded to Cloudflare Email Service, or a send fails. */
const sender = { email: 'website@processingfoundation.org', name: 'Website' };

const singleLine = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .regex(/^[^\r\n]*$/, 'Must be a single line');

export const contactSubmission = z.object({
  firstName: singleLine(80).min(1),
  lastName: singleLine(80).default(''),
  email: z.email().max(254),
  topic: z.enum(contactTopics),
  message: z.string().trim().max(4000).default(''),
});

export type ContactSubmission = z.infer<typeof contactSubmission>;

export async function sendContactMessage({
  firstName,
  lastName,
  email,
  topic,
  message,
}: ContactSubmission) {
  const name = [firstName, lastName].filter(Boolean).join(' ');
  const mail = {
    to: contactRecipients[topic],
    from: sender,
    replyTo: { email, name },
    subject: `${topic}: message from ${name}`,
    text: [`From: ${name} <${email}>`, `Topic: ${topic}`, '', message].join(
      '\n',
    ),
  };

  // astro.config.ts drops the Cloudflare adapter in dev, so the binding module
  // resolves in a Worker build only.
  if (import.meta.env.DEV) {
    console.info('[contact] dev run, no email sent:', mail);
    return;
  }

  const { env } = await import('cloudflare:workers');
  await env.EMAIL.send(mail);
}
