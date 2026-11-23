import type { ReactNode } from 'react';
import type { PageId } from '../../hooks/useHashRoute';
import { Header } from './Header';
import { Mascot } from '../Mascot/Mascot';
import styles from './Layout.module.css';

export function Layout({ current, children }: { current: PageId; children: ReactNode }) {
  return (
    <div className={styles.shell}>
      <a className={styles.skip} href="#contenido-principal">Ir al contenido principal</a>
      <Header current={current} />
      <main className={styles.main} id="contenido-principal">{children}</main>
      <Mascot page={current} />
      <footer className={styles.footer}>
        GAITÁN TERRITORIAL · Barrio La Gaitana, sector catastral UAECD 009216, Suba, Bogotá D.C.
      </footer>
    </div>
  );
}
