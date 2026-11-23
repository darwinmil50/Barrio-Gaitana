import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { GAITANA_TERRITORY, type BoundaryCollection } from '../../models/territory';
import { bboxFromBoundary, bboxToBounds } from '../../utils/geoBoundary';

export function FitBounds({ boundary }: { boundary: BoundaryCollection | null }) {
  const map = useMap();

  useEffect(() => {
    const bbox = bboxFromBoundary(boundary) ?? GAITANA_TERRITORY.bbox;
    map.fitBounds(bboxToBounds(bbox), { padding: [24, 24] });
  }, [map, boundary]);

  return null;
}
