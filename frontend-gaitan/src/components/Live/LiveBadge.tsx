import { useTerritory } from '../../context/TerritoryContext';
import styles from '../Comic/Comic.module.css';

function hour(value: number | null): string {
  if (value === null) return '—';
  return new Intl.DateTimeFormat('es-CO', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).format(value);
}

export function LiveBadge() {
  const { live, setLive, countdown, lastUpdated, updates, refreshNow, loading } = useTerritory();

  return (
    <div className={styles.badge} role="status" aria-live="polite" aria-label="Estado de sincronización">
      <span
        className={`${styles.pulse} ${live ? '' : styles.pulseOff}`}
        aria-hidden="true"
      />
      <span className={styles.badgeText}>{live ? 'EN VIVO' : 'PAUSADO'}</span>
      <span className={styles.badgeMeta}>
        {loading ? 'cargando…' : `actualizado ${hour(lastUpdated)} · ${updates} refrescos`}
      </span>
      <span className={styles.badgeMeta}>
        {live ? `próximo en ${countdown}s` : 'sincronización detenida'}
      </span>
      <button
        type="button"
        className={styles.badgeButton}
        onClick={() => void refreshNow()}
      >
        Actualizar ya
      </button>
      <button
        type="button"
        className={styles.badgeButton}
        aria-pressed={live}
        onClick={() => setLive(!live)}
      >
        {live ? 'Pausar' : 'Reanudar'}
      </button>
    </div>
  );
}
