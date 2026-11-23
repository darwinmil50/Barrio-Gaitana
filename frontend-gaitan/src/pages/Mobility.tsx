import { Filters } from '../components/Filters/Filters';
import { PlaceTable } from '../components/Cards/PlaceTable';
import { SourceList } from '../components/Cards/SourceList';
import { StatCard } from '../components/Cards/StatCard';
import { StatusMessage } from '../components/Cards/StatusMessage';
import { CategoryChart } from '../components/Charts/CategoryChart';
import { MapView } from '../components/Map/MapView';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { usePageData } from '../hooks/usePageData';
import type { CategoryKey } from '../models/category';
import { formatCount } from '../utils/format';
import styles from './pages.module.css';

const KEYS: CategoryKey[] = ['transport', 'streets'];

export function Mobility() {
  const { territory, categories, filtered, status, layers, includeNearby, setIncludeNearby } = usePageData(KEYS);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.kicker}>¡Misión viajera!</p>
          <h2>Movilidad</h2>
        </div>
        <p>Red de transporte y vías disponibles en el barrio La Gaitana, Suba.</p>
      </div>
      <div className={styles.grid}>
        <Sidebar title="Filtros de movilidad" subtitle="Datos del barrio">
          <Filters
            query={territory.query}
            onQueryChange={territory.setQuery}
            active={categories.active}
            onToggle={categories.toggle}
            onReset={() => categories.selectOnly(KEYS)}
            includeNearby={includeNearby}
            onNearbyChange={setIncludeNearby}
          />
          <StatCard label="Registros de movilidad" value={formatCount(filtered.total)} />
          <SourceList envelopes={territory.envelopes} keys={KEYS} />
        </Sidebar>
        <div className={styles.content}>
          <StatusMessage status={status} />
          <MapView
            boundary={territory.boundary}
            layers={layers}
            active={categories.active}
            onToggle={categories.toggle}
          />
          <div className={styles.twoColumns}>
            <CategoryChart byCategory={filtered.byCategory} title="Infraestructura por categoría" />
            <section className={styles.section} aria-label="Indicadores de movilidad">
              <h3>Indicadores</h3>
              <p>Transporte: {filtered.byCategory.transport.length}</p>
              <p>Vías: {filtered.byCategory.streets.length}</p>
            </section>
          </div>
          <PlaceTable places={filtered.neighborhoodPlaces} caption="Transporte y vías en La Gaitana" />
        </div>
      </div>
    </div>
  );
}
