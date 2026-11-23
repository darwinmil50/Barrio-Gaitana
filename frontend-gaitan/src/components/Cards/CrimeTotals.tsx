import type { CrimeRates } from '../../models/general';
import styles from './Cards.module.css';

export function CrimeTotals({ rates }: { rates: CrimeRates | null }) {
  if (!rates) return null;
  const rows = Object.keys(rates.totals)
    .map((key) => ({
      key,
      total: rates.totals[key],
      variation: rates.variationPct[key],
    }))
    .filter((row) => typeof row.total === 'number' && row.total > 0)
    .sort((a, b) => Number(b.total) - Number(a.total));

  return (
    <section className={styles.card} aria-label="Totales de criminalidad">
      <h3 className={styles.name}>Delitos por tipo · {rates.locality}</h3>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead><tr><th>Delito</th><th>Total</th><th>Variación %</th></tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key}>
                <td>{row.key}</td>
                <td>{Number(row.total).toLocaleString('es-CO')}</td>
                <td>{row.variation === null ? '—' : `${row.variation}%`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
