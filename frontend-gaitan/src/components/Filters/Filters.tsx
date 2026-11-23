import { CATEGORIES, categoryColor, type CategoryKey } from '../../models/category';
import styles from './Filters.module.css';

interface Props {
  query: string;
  onQueryChange: (value: string) => void;
  active: CategoryKey[];
  onToggle: (key: CategoryKey) => void;
  onReset: () => void;
  includeNearby: boolean;
  onNearbyChange: (value: boolean) => void;
}

export function Filters({
  query, onQueryChange, active, onToggle, onReset, includeNearby, onNearbyChange,
}: Props) {
  return (
    <div className={styles.filters}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="filter-query">Buscar establecimientos</label>
        <input
          id="filter-query"
          className={styles.input}
          type="search"
          value={query}
          placeholder="Nombre o palabra clave"
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </div>
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Filtrar por categoría</legend>
        <div className={styles.chips}>
          {CATEGORIES.map((category) => (
            <button
              type="button"
              key={category.key}
              className={`${styles.chip} ${active.includes(category.key) ? styles.chipActive : ''}`}
              aria-pressed={active.includes(category.key)}
              onClick={() => onToggle(category.key)}
            >
              <span className={styles.dot} style={{ backgroundColor: categoryColor(category.key) }} aria-hidden="true" />
              {category.label}
            </button>
          ))}
        </div>
      </fieldset>
      <label className={styles.nearby}>
        <input
          type="checkbox"
          checked={includeNearby}
          onChange={(event) => onNearbyChange(event.target.checked)}
        />
        Incluir alrededores (barrios vecinos)
      </label>
      <button type="button" className={styles.reset} onClick={onReset}>Restablecer filtros</button>
    </div>
  );
}
