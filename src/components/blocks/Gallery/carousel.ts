export function initCarousel(root: HTMLElement) {
  const viewport = root.querySelector<HTMLElement>('[data-carousel-viewport]');
  const track = root.querySelector<HTMLElement>('[data-carousel-track]');
  const slides = Array.from(
    root.querySelectorAll<HTMLElement>('[data-carousel-slide]'),
  );
  const previous = root.querySelector<HTMLButtonElement>(
    '[data-carousel-previous]',
  );
  const next = root.querySelector<HTMLButtonElement>('[data-carousel-next]');

  if (!viewport || !track || slides.length < 2 || !previous || !next) return;

  let current = 0;

  const show = (index: number) => {
    current = Math.max(0, Math.min(index, slides.length - 1));
    slides.forEach((slide, i) => {
      slide.dataset.active = String(i === current);
      slide.toggleAttribute('inert', i !== current);
    });
    previous.disabled = current === 0;
    next.disabled = current === slides.length - 1;

    const active = slides[current];
    viewport.style.height = `${active.offsetHeight}px`;
    track.style.transform = `translateY(${-active.offsetTop}px)`;
  };

  // The reversed column leaves slide 0 with a resting transform of its own, so
  // it has to arrive without a transition or it slides in unprompted. Reading
  // offsetHeight commits the jump before the transition goes back on; drop that
  // line and the suppression stops working.
  const settle = (index: number) => {
    track.style.transition = 'none';
    viewport.style.transition = 'none';
    show(index);
    void track.offsetHeight;
    track.style.transition = '';
    viewport.style.transition = '';
  };

  previous.addEventListener('click', () => show(current - 1));
  next.addEventListener('click', () => show(current + 1));

  root.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      show(current - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      show(current + 1);
    }
  });

  root.dataset.ready = '';
  settle(0);

  // Fires on viewport resizes, late image loads and font swaps alike — anything
  // that moves the offsets the transform is measured from.
  new ResizeObserver(() => settle(current)).observe(track);
}
