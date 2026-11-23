import { Filters } from '../components/Filters/Filters';
import { PlaceTable } from '../components/Cards/PlaceTable';
import { SourceList } from '../components/Cards/SourceList';
import { StatCard } from '../components/Cards/StatCard';
import { StatusMessage } from '../components/Cards/StatusMessage';
import { CrimeTotals } from '../components/Cards/CrimeTotals';
import { CrimeRatesChart } from '../components/Charts/CrimeRatesChart';
import { MapView } from '../components/Map/MapView';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { usePageData } from '../hooks/usePageData';
import type { CategoryKey } from '../models/category';
import { extractCrimeRates } from '../utils/crimeRates';
import { formatCount } from '../utils/format';
import styles from './pages.module.css';

const KEYS: CategoryKey[] = ['cameras', 'police', 'crimes'];

export function Security() {
  const { territory, categories, filtered, status, layers, includeNearby, setIncludeNearby } = usePageData(KEYS);
  const crimes = territory.envelopes.crimes;
  const rates = extractCrimeRates(crimes?.context ?? []);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.kicker}>¡Misión detective!</p>
          <h2>Seguridad</h2>
        </div>
        <p>Puntos de policía y tasas oficiales de criminalidad de la localidad de Suba. No hay serie por barrio.</p>
      </div>
      <div className={styles.grid}>
        <Sidebar title="Filtros de seguridad" subtitle="Contexto de localidad">
          <Filters
            query={territory.query}
            onQueryChange={territory.setQuery}
            active={categories.active}
            onToggle={categories.toggle}
            onReset={() => categories.selectOnly(KEYS)}
            includeNearby={includeNearby}
            onNearbyChange={setIncludeNearby}
          />
          <StatCard label="Registros en el barrio" value={formatCount(filtered.total)} />
          <section className={styles.section} aria-label="Indicadores de seguridad">
            <h3>Indicadores</h3>
            <p>Cámaras: {filtered.byCategory.cameras.length}</p>
            <p>CAI y policía: {filtered.byCategory.police.length}</p>
            <p>Población Suba: {formatCount(rates?.population ?? 0)} hab. ({rates?.populationYear})</p>
          </section>
          <SourceList envelopes={territory.envelopes} keys={KEYS} />
        </Sidebar>
        <div className={styles.content}>
          <StatusMessage status={status} />
          <MapView boundary={territory.boundary} layers={layers}
            active={categories.active} onToggle={categories.toggle} />
          <CrimeRatesChart rates={rates} note={crimes?.note} />
          <CrimeTotals rates={rates} />
          <PlaceTable places={filtered.neighborhoodPlaces} caption="Registros de seguridad en La Gaitana" />
        </div>
      </div>
    </div>
  );
}
