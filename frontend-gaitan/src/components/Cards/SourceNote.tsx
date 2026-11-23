import type { SourceInfo } from '../../models/place';
import { formatUpdated } from '../../utils/format';
import styles from './Cards.module.css';

interface Props {
  label: string;
  source: SourceInfo | null;
  note?: string | null;
}

export function SourceNote({ label, source, note }: Props) {
  return (
    <li className={styles.sourceItem}>
      <strong>{label}</strong>
      {source ? (
        <>
          {source.name} · {source.license} · {formatUpdated(source.updated_at)}
          {source.url ? (
            <> · <a className={styles.sourceLink} href={source.url} target="_blank" rel="noreferrer">Ver fuente</a></>
          ) : null}
        </>
      ) : 'Sin información pública disponible'}
      {note ? <p className={styles.note}>{note}</p> : null}
    </li>
  );
}
