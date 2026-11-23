import { useCallback, useState } from 'react';
import { CATEGORIES, type CategoryKey } from '../models/category';

export interface CategoryState {
  active: CategoryKey[];
  isActive: (key: CategoryKey) => boolean;
  toggle: (key: CategoryKey) => void;
  selectOnly: (keys: CategoryKey[]) => void;
  reset: () => void;
}

const ALL = CATEGORIES.map((category) => category.key);

export function useCategories(initial: CategoryKey[] = ALL): CategoryState {
  const [active, setActive] = useState<CategoryKey[]>(initial);

  const toggle = useCallback((key: CategoryKey) => {
    setActive((current) => current.includes(key)
      ? current.filter((item) => item !== key)
      : [...current, key]);
  }, []);

  const selectOnly = useCallback((keys: CategoryKey[]) => setActive(keys), []);
  const reset = useCallback(() => setActive(ALL), []);
  const isActive = useCallback((key: CategoryKey) => active.includes(key), [active]);

  return { active, isActive, toggle, selectOnly, reset };
}
