const messages = {
  sending: 'Sending…',
  sent: 'Thank you. We have your message.',
  failed: 'The message did not go out. Try again.',
};

export function initContactForm(form: HTMLFormElement) {
  const status = form.querySelector<HTMLElement>('[data-contact-status]');
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

    setStatus(messages.sent);
  });
}
