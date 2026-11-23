import type { Place } from '../../models/place';
import { PlaceTable } from './PlaceTable';
import styles from './Cards.module.css';

interface Props {
  places: Place[];
  context: unknown[];
}

export function LocalityContext({ places, context }: Props) {
  return (
    <section className={styles.context} aria-label="Contexto de la localidad Suba">
      <h3>Contexto de la localidad Suba</h3>
      <p>Datos de alcance local. No forman parte del barrio La Gaitana ni se cuentan en sus indicadores.</p>
      {places.length === 0 && context.length === 0 ? (
        <p>Sin información pública disponible para la localidad.</p>
      ) : (
        <>
          <PlaceTable places={places} caption="Datos de contexto de la localidad Suba" />
          {context.length > 0 ? (
            <ul>
              {context.slice(0, 8).map((item, index) => (
                <li key={index}>{typeof item === 'string' ? item : JSON.stringify(item)}</li>
              ))}
            </ul>
          ) : null}
        </>
      )}
    </section>
  );
}
