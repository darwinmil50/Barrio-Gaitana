import { PAGE_LABELS, PAGES, type PageId } from '../../hooks/useHashRoute';
import { APP_SUBTITLE, APP_TITLE } from '../../models/territory';
import { LiveBadge } from '../Live/LiveBadge';
import styles from './Layout.module.css';

export function Header({ current }: { current: PageId }) {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <div className={styles.brand}>
          <span className={styles.mark} aria-hidden="true">GT</span>
          <div>
            <h1>{APP_TITLE}</h1>
            <p>{APP_SUBTITLE}</p>
          </div>
        </div>
        <LiveBadge />
        <nav className={styles.nav} aria-label="Navegación principal">
          {PAGES.map((page) => (
            <a
              key={page}
              href={`#${page}`}
              className={`${styles.link} ${page === current ? styles.current : ''}`}
              aria-current={page === current ? 'page' : undefined}
            >
              {PAGE_LABELS[page]}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
