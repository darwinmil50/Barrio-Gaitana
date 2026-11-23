import styles from './Cards.module.css';

interface Props {
  label: string;
  value: string | number;
  detail?: string;
}

export function StatCard({ label, value, detail }: Props) {
  return (
    <div className={`${styles.card} ${styles.stat}`}>
      <p className={styles.statLabel}>{label}</p>
      <p className={styles.statValue}>{value}</p>
      {detail ? <p className={styles.statDetail}>{detail}</p> : null}
    </div>
  );
}
