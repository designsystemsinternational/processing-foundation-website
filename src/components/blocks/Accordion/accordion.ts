export function initAccordion(root: Element) {
  const toggles = Array.from(
    root.querySelectorAll<HTMLElement>('[data-accordion-toggle]'),
  );

  const setExpanded = (toggle: HTMLElement, isOpen: boolean) => {
    toggle.setAttribute('aria-expanded', String(isOpen));

    const id = toggle.getAttribute('aria-controls');
    const collapse = id ? document.getElementById(id) : null;
    collapse?.setAttribute('data-open', String(isOpen));
  };

  toggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') !== 'true';
      toggles.forEach((other) => setExpanded(other, false));
      setExpanded(toggle, isOpen);
    });
  });
}
