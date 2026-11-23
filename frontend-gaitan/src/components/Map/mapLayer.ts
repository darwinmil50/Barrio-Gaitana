import type { CategoryKey } from '../../models/category';
import type { Place } from '../../models/place';

export interface MapLayer {
  key: CategoryKey;
  label: string;
  color: string;
  places: Place[];
}
