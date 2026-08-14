import { useState, type ReactNode } from 'react';
import cn from 'clsx';

import { slugify } from '@/lib/utils.ts';

import styles from './MainNavigation.module.css';

interface MenuItem {
  title: string;
  path?: string;
  isCurrent: boolean;
  children?: MenuItem[];
}

interface Props {
  items: MenuItem[];
  actions?: ReactNode;
}

export default function MobileMenu({ items, actions }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <>
      <div className={styles.bar}>
        <div className={styles.logo}>Logo</div>

        <button
          type="button"
          className={styles.burger}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
          aria-controls="main-navigation-menu"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg width="20" height="15" viewBox="0 0 20 15" aria-hidden="true">
            <rect className={styles.burgerBar} width="20" height="2" y="0.5" />
            <rect className={styles.burgerBar} width="20" height="2" y="6.5" />
            <rect className={styles.burgerBar} width="20" height="2" y="12.5" />
          </svg>
        </button>
      </div>

      <div
        id="main-navigation-menu"
        className={styles.collapse}
        data-open={isOpen}
      >
        <div className={styles.collapseInner}>
          <nav aria-label="Main">
            <ul className={styles.list}>
              {items.map((item) => {
                const children = item.children ?? [];
                const isExpanded = expanded === item.title;
                const sublistId = `main-navigation-${slugify(item.title)}`;

                return (
                  <li key={item.title} className={styles.item}>
                    {children.length ? (
                      <button
                        type="button"
                        className={cn(styles.row, styles.navLabel)}
                        aria-expanded={isExpanded}
                        aria-controls={sublistId}
                        onClick={() =>
                          setExpanded(isExpanded ? null : item.title)
                        }
                      >
                        {item.title}
                        <span className={styles.toggle} aria-hidden="true">
                          {isExpanded ? '–' : '+'}
                        </span>
                      </button>
                    ) : item.path ? (
                      <a
                        className={cn(styles.row, styles.navLabel)}
                        href={item.path}
                        aria-current={item.isCurrent ? 'page' : undefined}
                      >
                        {item.title}
                      </a>
                    ) : (
                      <span
                        className={cn(
                          styles.row,
                          styles.navLabel,
                          styles.staticLabel,
                        )}
                      >
                        {item.title}
                      </span>
                    )}

                    {children.length > 0 && (
                      <div
                        id={sublistId}
                        className={styles.collapse}
                        data-open={isExpanded}
                      >
                        <div className={styles.collapseInner}>
                          <ul className={styles.sublist}>
                            {children.map((child) => (
                              <li key={child.title} className={styles.item}>
                                <a
                                  className={cn(
                                    styles.row,
                                    styles.subRow,
                                    styles.subLabel,
                                  )}
                                  href={child.path}
                                  aria-current={
                                    child.isCurrent ? 'page' : undefined
                                  }
                                >
                                  {child.title}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {actions && <div className={styles.actions}>{actions}</div>}
        </div>
      </div>
    </>
  );
}
