import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import styles from "./PagePathWidget.module.css";

/** Custom Decap widget for the "pages" collection's `meta.path` field:
 * a combobox suggesting existing page paths, but any value can still be typed freely. */
const PAGES_FOLDER = "src/content/pages/";
const TOP_LEVEL_OPTION = { path: "/", title: "Top-level page" };

interface QueryHit {
  path: string;
  data?: { title?: string };
}

// setActiveStyle/setInactiveStyle/query/queryHits are real Decap runtime props, undocumented in its types.
interface PathControlProps {
  value?: string;
  onChange: (value: string) => void;
  forID: string;
  classNameWrapper: string;
  setActiveStyle?: () => void;
  setInactiveStyle?: () => void;
  query?: (
    forID: string,
    collection: string,
    searchFields: string[],
    term: string,
  ) => void;
  queryHits?: QueryHit[];
}

function pathFromHit(hit: QueryHit): string {
  return hit.path
    .replace(new RegExp(`^${PAGES_FOLDER}`), "")
    .replace(/\.json$/, "")
    .replace(/\/index$/, "");
}

export function PagePathControl({
  value,
  onChange,
  forID,
  classNameWrapper,
  setActiveStyle,
  setInactiveStyle,
  query,
  queryHits,
}: PathControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    query?.(forID, "pages", ["title"], "");
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen)
      optionRefs.current[highlightedIndex]?.scrollIntoView({
        block: "nearest",
      });
  }, [highlightedIndex, isOpen]);

  const options = [
    TOP_LEVEL_OPTION,
    ...(queryHits ?? [])
      .map((hit) => ({
        path: pathFromHit(hit),
        title: hit.data?.title || hit.path,
      }))
      .filter((option) => option.path && option.path !== "/"),
  ].sort((a, b) =>
    a.path === "/" ? -1 : b.path === "/" ? 1 : a.path.localeCompare(b.path),
  );

  const term = (value ?? "").toLowerCase();
  const filtered = term
    ? options.filter(
        (option) =>
          option.path.toLowerCase().includes(term) ||
          option.title.toLowerCase().includes(term),
      )
    : options;

  function selectOption(path: string) {
    onChange(path);
    setIsOpen(false);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") setIsOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      const option = filtered[highlightedIndex];
      if (option) {
        e.preventDefault();
        selectOption(option.path);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  }

  return (
    <div
      className={`${classNameWrapper} ${styles.wrapper}`}
      ref={containerRef}
    >
      <input
        id={forID}
        type="text"
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={`${forID}-listbox`}
        aria-autocomplete="list"
        autoComplete="off"
        value={value ?? ""}
        onFocus={() => {
          setActiveStyle?.();
          setIsOpen(true);
          setHighlightedIndex(0);
        }}
        onBlur={setInactiveStyle}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
          setHighlightedIndex(0);
        }}
        onKeyDown={handleKeyDown}
      />
      {isOpen && (
        <ul id={`${forID}-listbox`} role="listbox" className={styles.listbox}>
          {filtered.length === 0 ? (
            <li className={styles.empty}>
              No matching pages — you can still type a custom path
            </li>
          ) : (
            filtered.map((option, index) => (
              <li
                key={option.path}
                ref={(el) => {
                  optionRefs.current[index] = el;
                }}
                role="option"
                aria-selected={index === highlightedIndex}
                onMouseDown={(e) => {
                  e.preventDefault();
                  selectOption(option.path);
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`${styles.option} ${index === highlightedIndex ? styles.highlighted : ""}`}
              >
                <div className={styles.optionTitle}>{option.title}</div>
                <div className={styles.optionPath}>{option.path}</div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

export function PagePathPreview({ value }: { value?: string }) {
  return <span>{value ?? ""}</span>;
}
