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

const KEYS: CategoryKey[] = ['veterinaries', 'bookstores', 'restaurants', 'education', 'sports'];

export function Services() {
  const { territory, categories, filtered, status, layers, includeNearby, setIncludeNearby } = usePageData(KEYS);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.kicker}>¡Misión servicios!</p>
          <h2>Servicios</h2>
        </div>
        <p>Comercio, educación, deporte y servicios veterinarios del barrio La Gaitana.</p>
      </div>
      <div className={styles.grid}>
        <Sidebar title="Filtros de servicios" subtitle="Establecimientos del barrio">
          <Filters
            query={territory.query}
            onQueryChange={territory.setQuery}
            active={categories.active}
            onToggle={categories.toggle}
            onReset={() => categories.selectOnly(KEYS)}
            includeNearby={includeNearby}
            onNearbyChange={setIncludeNearby}
          />
          <StatCard label="Establecimientos" value={formatCount(filtered.total)} />
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
          <CategoryChart byCategory={filtered.byCategory} title="Servicios por categoría" />
          <PlaceTable places={filtered.neighborhoodPlaces} caption="Servicios dentro de La Gaitana" />
        </div>
      </div>
    </div>
  );
}
