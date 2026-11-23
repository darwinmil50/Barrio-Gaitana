import { useMemo, useState } from 'react';
import { useTerritory } from '../../context/TerritoryContext';
import type { PageId } from '../../hooks/useHashRoute';
import { CATEGORIES } from '../../models/category';
import { envelopeCount } from '../../models/envelope';
import styles from '../Comic/Comic.module.css';

const TIPS: Record<PageId, string> = {
  home: 'Toca los botones de colores para prender o apagar capas. ¡Tú mandas!',
  security: 'Modo detective: mira las tasas y recuerda que son de Suba, no inventamos delitos del barrio.',
  mobility: 'Aquí seguimos buses y vías. ¡No te pierdas en la aventura!',
  services: 'Colegios, parques y restaurantes: hay pistas para cada explorador.',
  territorial: 'El mapa usa el polígono oficial SDIS 110292. ¡Ese es nuestro tesoro!',
};

export function Mascot({ page }: { page: PageId }) {
  const { envelopes, live } = useTerritory();
  const [open, setOpen] = useState(true);

  const total = useMemo(() => CATEGORIES.reduce((sum, category) => {
    const envelope = envelopes[category.key];
    if (!envelope || envelope.scope !== 'neighborhood') return sum;
    if (category.key === 'cameras' || category.key === 'crimes') return sum;
    return sum + envelopeCount(envelope);
  }, 0), [envelopes]);

  const message = page === 'home'
    ? `¡Hola, explorador! Ya encontré ${total} pistas reales en La Gaitana.`
    : TIPS[page];

  return (
    <div className={`${styles.mascot} ${open ? '' : styles.collapsed}`}>
      <section className={styles.bubble} aria-label="Guía de la aventura">
        <p className={styles.bubbleTitle}>Capitán Gaitán dice</p>
        <p className={styles.bubbleText}>{message}</p>
        <p className={styles.badgeMeta}>
          {live ? 'Datos sincronizados automáticamente · ' : 'Modo pausa · '}
          {total} pistas verificadas
        </p>
      </section>
      <button
        type="button"
        className={styles.mascotButton}
        aria-expanded={open}
        aria-label={open ? 'Ocultar guía de la aventura' : 'Mostrar guía de la aventura'}
        onClick={() => setOpen(!open)}
      >
        <span aria-hidden="true">🐱</span>
      </button>
    </div>
  );
}
