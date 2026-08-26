/**
 * Stops a sketch that has scrolled away: an iframe set to display:none is out
 * of the render tree, so the browser stops calling its draw loop. On a page
 * with several sketches only the visible ones run.
 */
export function initSketchVisibility(iframe: HTMLIFrameElement) {
  const { IntersectionObserver } = window;
  if (!IntersectionObserver) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          iframe.style.removeProperty('display');
        } else {
          iframe.style.display = 'none';
        }
      });
    },
    { rootMargin: '20px' },
  );

  observer.observe(iframe.parentElement ?? iframe);
}
