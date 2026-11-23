import { CATEGORY_BY_KEY, type CategoryKey } from '../../models/category';
import type { EnvelopeMap } from '../../models/envelope';
import type { Place } from '../../models/place';
import { SourceNote } from './SourceNote';
import styles from './Cards.module.css';

interface Props {
  envelopes: EnvelopeMap<Place>;
  keys?: CategoryKey[];
  title?: string;
}

export function SourceList({ envelopes, keys, title = 'Fuentes y actualización' }: Props) {
  const selected = keys ?? (Object.keys(envelopes) as CategoryKey[]);
  const items = selected.filter((key) => envelopes[key] !== null && envelopes[key] !== undefined);
  return (
    <section aria-label={title}>
      <h3 className={styles.statLabel}>{title}</h3>
      <ul className={styles.sourceList}>
        {items.length === 0 ? (
          <SourceNote label="Datos" source={null} />
        ) : items.map((key) => (
          <SourceNote
            key={key}
            label={CATEGORY_BY_KEY[key].label}
            source={envelopes[key]?.source ?? null}
            note={envelopes[key]?.note}
          />
        ))}
      </ul>
    </section>
  );
}
