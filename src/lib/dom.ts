// ClientRouter swaps in fresh DOM without re-executing an unchanged script tag,
// so component scripts must bind on every navigation, not once per document.
export function initOnPageLoad<T extends HTMLElement>(
  selector: string,
  init: (element: T) => void,
) {
  document.addEventListener('astro:page-load', () => {
    document.querySelectorAll<T>(selector).forEach(init);
  });
}
