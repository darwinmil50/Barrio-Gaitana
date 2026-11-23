import { Filters } from '../components/Filters/Filters';
import { GeneralDataPanel } from '../components/Cards/GeneralDataPanel';
import { PlaceTable } from '../components/Cards/PlaceTable';
import { SourceList } from '../components/Cards/SourceList';
import { StatCard } from '../components/Cards/StatCard';
import { StatusMessage } from '../components/Cards/StatusMessage';
import { CategoryChart } from '../components/Charts/CategoryChart';
import { MapView } from '../components/Map/MapView';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { usePageData } from '../hooks/usePageData';
import { CATEGORIES, type CategoryKey } from '../models/category';
import { CADASTRAL_SECTOR, GAITANA_TERRITORY } from '../models/territory';
import { formatCount, formatCoordinate } from '../utils/format';
import styles from './pages.module.css';

const KEYS: CategoryKey[] = CATEGORIES.map((category) => category.key);

export function Home() {
  const { territory, categories, filtered, status, layers, includeNearby, setIncludeNearby } = usePageData(KEYS);
  const [minLon, minLat, maxLon, maxLat] = GAITANA_TERRITORY.bbox;

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.kicker}>¡Misión exploradora!</p>
          <h2>Resumen territorial</h2>
        </div>
        <p>Consulta integrada de información pública del barrio La Gaitana, Suba. Los resultados se validan contra el polígono oficial SDIS y se sincronizan solos.</p>
      </div>
      <div className={styles.grid}>
        <Sidebar title="Panel de consulta" subtitle={territory.neighborhoodName}>
          <Filters
            query={territory.query}
            onQueryChange={territory.setQuery}
            active={categories.active}
            onToggle={categories.toggle}
            onReset={categories.reset}
            includeNearby={includeNearby}
            onNearbyChange={setIncludeNearby}
          />
          <StatCard label="Resultados" value={formatCount(filtered.total)} detail="Dentro del barrio" />
          <StatCard label="Capas activas" value={categories.active.length} detail={`De ${CATEGORIES.length} disponibles`} />
          <section aria-label="Información territorial">
            <h3 className={styles.miniTitle}>Información territorial</h3>
            <p>Barrio oficial SDIS {GAITANA_TERRITORY.code} · Sector catastral {CADASTRAL_SECTOR} · {GAITANA_TERRITORY.locality}</p>
            <p>Límites: {formatCoordinate(minLon)}, {formatCoordinate(minLat)} a {formatCoordinate(maxLon)}, {formatCoordinate(maxLat)}</p>
          </section>
          <GeneralDataPanel
            facts={territory.general.facts}
            loading={territory.general.loading}
            error={territory.general.error}
            territory={{
              code: GAITANA_TERRITORY.code,
              cadastralSector: CADASTRAL_SECTOR,
              locality: GAITANA_TERRITORY.locality,
            }}
          />
          <SourceList envelopes={territory.envelopes} />
        </Sidebar>
        <div className={styles.content}>
          <StatusMessage status={status} />
          <MapView
            boundary={territory.boundary}
            layers={layers}
            active={categories.active}
            onToggle={categories.toggle}
          />
          <CategoryChart byCategory={filtered.byCategory} />
          <PlaceTable places={filtered.neighborhoodPlaces} caption="Establecimientos dentro de La Gaitana" />
        </div>
      </div>
    </div>
  );
}
