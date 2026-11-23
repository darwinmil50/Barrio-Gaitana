import type { ApiStatus } from '../../hooks/useApiStatus';
import styles from './Cards.module.css';

const CLASS: Record<ApiStatus['kind'], string> = {
  loading: styles.statusLoading,
  error: styles.statusError,
  empty: styles.statusEmpty,
  ready: styles.status,
};

export function StatusMessage({ status }: { status: ApiStatus }) {
  return (
    <div
      className={`${styles.status} ${CLASS[status.kind]}`}
      role={status.kind === 'error' ? 'alert' : 'status'}
      aria-live={status.kind === 'error' ? 'assertive' : 'polite'}
    >
      <p style={{ margin: 0 }}>{status.message}</p>
      {status.notes.map((note, index) => (
        <p className={styles.note} key={`${index}-${note.slice(0, 24)}`}>
          Nota del proveedor: {note}
        </p>
      ))}
    </div>
  );
}
