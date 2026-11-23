import { Filters } from '../components/Filters/Filters';
import { LocalityContext } from '../components/Cards/LocalityContext';
import { PlaceTable } from '../components/Cards/PlaceTable';
import { SourceList } from '../components/Cards/SourceList';
import { StatCard } from '../components/Cards/StatCard';
import { StatusMessage } from '../components/Cards/StatusMessage';
import { MapView } from '../components/Map/MapView';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { usePageData } from '../hooks/usePageData';
import type { CategoryKey } from '../models/category';
import { GAITANA_TERRITORY } from '../models/territory';
import { formatCount } from '../utils/format';
import styles from './pages.module.css';

const KEYS: CategoryKey[] = ['cadastre', 'green-areas'];

export function Territorial() {
  const { territory, categories, filtered, status, layers, includeNearby, setIncludeNearby } = usePageData(KEYS);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.kicker}>¡Misión mapa!</p>
          <h2>Territorio</h2>
        </div>
        <p>Polígono oficial SDIS, catastro y zonas verdes de La Gaitana. El contexto de Suba se presenta por separado.</p>
      </div>
      <div className={styles.grid}>
        <Sidebar title="Datos territoriales" subtitle="Barrio oficial SDIS 110292 · Sector 009216">
          <Filters
            query={territory.query}
            onQueryChange={territory.setQuery}
            active={categories.active}
            onToggle={categories.toggle}
            onReset={() => categories.selectOnly(KEYS)}
            includeNearby={includeNearby}
            onNearbyChange={setIncludeNearby}
          />
          <StatCard label="Registros territoriales" value={formatCount(filtered.total)} />
          <div className={styles.section}>
            <h3>Delimitación</h3>
            <p>Barrio oficial: {GAITANA_TERRITORY.name} · Localidad {GAITANA_TERRITORY.locality}</p>
            <p>{GAITANA_TERRITORY.city} · Código {GAITANA_TERRITORY.code}</p>
            <p>Fuente del polígono: {territory.boundarySource || 'No reportada'}</p>
          </div>
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
          <PlaceTable places={filtered.neighborhoodPlaces} caption="Catastro y zonas verdes en La Gaitana" />
          <LocalityContext places={filtered.localityPlaces} context={filtered.context} />
        </div>
      </div>
    </div>
  );
}
