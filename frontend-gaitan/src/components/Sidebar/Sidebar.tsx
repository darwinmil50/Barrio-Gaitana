import type { ReactNode } from 'react';
import styles from './Sidebar.module.css';

interface Props {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function Sidebar({ title, subtitle, children }: Props) {
  return (
    <aside className={styles.sidebar} aria-label={title}>
      <div className={styles.header}>
        <h2>{title}</h2>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      <div className={styles.body}>{children}</div>
    </aside>
  );
}
