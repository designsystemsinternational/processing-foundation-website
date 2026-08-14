export function initSelector(root: HTMLElement) {
  const button = root.querySelector<HTMLButtonElement>(
    '[data-selector-button]',
  );
  const label = button?.querySelector<HTMLElement>('[data-selector-label]');
  const listbox = root.querySelector<HTMLUListElement>(
    '[data-selector-listbox]',
  );
  const options = Array.from(
    root.querySelectorAll<HTMLLIElement>('[data-selector-option]'),
  );
  const hiddenInput = root.querySelector<HTMLInputElement>(
    '[data-selector-input]',
  );

  if (!button || !label || !listbox || options.length === 0) return;

  let activeIndex = 0;

  const isOpen = () => listbox.dataset.open === 'true';

  const setActive = (index: number) => {
    activeIndex = Math.max(0, Math.min(index, options.length - 1));
    listbox.setAttribute('aria-activedescendant', options[activeIndex].id);
  };

  const open = () => {
    if (button.disabled) return;
    const selectedIndex = options.findIndex(
      (option) => option.getAttribute('aria-selected') === 'true',
    );
    setActive(selectedIndex >= 0 ? selectedIndex : 0);
    listbox.dataset.open = 'true';
    button.setAttribute('aria-expanded', 'true');
    listbox.focus();
  };

  const close = (refocus = false) => {
    listbox.dataset.open = 'false';
    button.setAttribute('aria-expanded', 'false');
    if (refocus) button.focus();
  };

  const select = (index: number) => {
    const option = options[index];
    if (!option) return;

    options.forEach((el) =>
      el.setAttribute('aria-selected', String(el === option)),
    );
    label.textContent = option.textContent;
    root.dataset.value = option.dataset.value ?? '';
    if (hiddenInput) hiddenInput.value = option.dataset.value ?? '';

    close(true);

    root.dispatchEvent(
      new CustomEvent('selector:change', {
        detail: { value: option.dataset.value },
        bubbles: true,
      }),
    );
  };

  button.addEventListener('click', () => (isOpen() ? close() : open()));

  button.addEventListener('keydown', (event) => {
    if (
      event.key === 'ArrowDown' ||
      event.key === 'ArrowUp' ||
      event.key === 'Enter' ||
      event.key === ' '
    ) {
      event.preventDefault();
      open();
    }
  });

  listbox.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setActive(activeIndex + 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActive(activeIndex - 1);
        break;
      case 'Home':
        event.preventDefault();
        setActive(0);
        break;
      case 'End':
        event.preventDefault();
        setActive(options.length - 1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        select(activeIndex);
        break;
      case 'Escape':
        event.preventDefault();
        close(true);
        break;
      case 'Tab':
        close();
        break;
      default:
        break;
    }
  });

  options.forEach((option, index) => {
    option.addEventListener('mouseenter', () => setActive(index));
    option.addEventListener('click', () => select(index));
  });

  document.addEventListener('pointerdown', (event) => {
    if (isOpen() && !root.contains(event.target as Node)) close();
  });
}
