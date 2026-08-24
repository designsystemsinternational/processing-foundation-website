const messages = {
  sending: 'Signing you up…',
  sent: 'Check your inbox to confirm the subscription.',
  failed: 'The signup did not go through. Try again.',
};

export function initNewsletterSignup(form: HTMLFormElement) {
  const status = form.querySelector<HTMLElement>('[data-newsletter-status]');
  const submit = form.querySelector<HTMLButtonElement>('[type="submit"]');

  const setStatus = (text: string) => {
    if (status) status.textContent = text;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submit) submit.disabled = true;
    setStatus(messages.sending);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { accept: 'application/json' },
        body: new FormData(form),
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        setStatus(result.error ?? messages.failed);
        if (submit) submit.disabled = false;
        return;
      }
    } catch {
      setStatus(messages.failed);
      if (submit) submit.disabled = false;
      return;
    }

    form.reset();
    setStatus(messages.sent);
  });
}
