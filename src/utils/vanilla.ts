/**
 * Wires up `root`-scoped interactivity on every astro:page-load — fired for
 * the initial hard load and again after each ClientRouter soft navigation,
 * so this is the one place setup needs to happen; a plain top-level script
 * would only ever run once and miss every later swap.
 */
export function mount(
  rootSelector: string,
  init: (
    root: HTMLElement,
    context: {
      query: <T extends HTMLElement>(selector: string) => T | null;
      queryAll: <T extends HTMLElement>(selector: string) => T[];
    },
  ) => void,
): void {
  document.addEventListener('astro:page-load', () => {
    [...document.querySelectorAll<HTMLElement>(rootSelector)].forEach(
      (root) => {
        const query = <T extends HTMLElement>(selector: string): T | null =>
          root.querySelector<T>(selector);

        const queryAll = <T extends HTMLElement>(selector: string): T[] => [
          ...root.querySelectorAll<T>(selector),
        ];

        init(root, {
          query,
          queryAll,
        });
      },
    );
  });
}

export function on<K extends keyof HTMLElementEventMap>(
  element: HTMLElement,
  type: K,
  handler: (event: HTMLElementEventMap[K]) => void,
): () => void {
  element.addEventListener(type, handler);
  return () => element.removeEventListener(type, handler);
}
