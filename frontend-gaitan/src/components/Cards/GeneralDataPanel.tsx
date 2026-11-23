import type { LocalityFacts } from '../../models/general';
import { formatCount } from '../../utils/format';
import styles from './Cards.module.css';

interface Props {
  facts: LocalityFacts | null;
  loading: boolean;
  error: string | null;
  territory: { code: string; cadastralSector: string; locality: string };
}

export function GeneralDataPanel({ facts, loading, error, territory }: Props) {
  if (loading) return <section className={styles.card}><p className={styles.meta}>Cargando datos generales…</p></section>;
  if (error || !facts) return (
    <section className={styles.card}>
      <p className={styles.meta}>No fue posible cargar los datos generales.</p>
    </section>
  );

  return (
    <section className={styles.context} aria-label="Datos generales">
      <h3>Datos generales</h3>
      <p><strong>Barrio:</strong> La Gaitana · SDIS {territory.code} · sector catastral {territory.cadastralSector}</p>
      <p><strong>Localidad:</strong> {facts.name} · {facts.location}</p>
      <p><strong>Extensión:</strong> {formatCount(facts.areaHa)} ha ({facts.areaPctBogota}% de Bogotá)</p>
      <p><strong>Población ({facts.populationYear}):</strong> {formatCount(facts.population)} habitantes</p>
      <p><strong>Organización:</strong> {facts.upz} UPZ · {facts.upr} UPR · {facts.cadastralSectors} sectores catastrales</p>
      <p><strong>Plan:</strong> {facts.plan}</p>
      <p className={styles.meta}>Fuente: <a className={styles.sourceLink} href={facts.sourceUrl} target="_blank" rel="noreferrer">{facts.sourceName}</a></p>
    </section>
  );
}
