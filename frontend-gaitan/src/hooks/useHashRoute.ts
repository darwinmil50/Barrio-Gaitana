import { useCallback, useEffect, useState } from 'react';

export const PAGES = ['home', 'security', 'mobility', 'services', 'territorial'] as const;
export type PageId = typeof PAGES[number];

export const PAGE_LABELS: Record<PageId, string> = {
  home: 'Inicio',
  security: 'Seguridad',
  mobility: 'Movilidad',
  services: 'Servicios',
  territorial: 'Territorio',
};

function readHash(): PageId {
  const value = window.location.hash.replace(/^#\/?/, '') as PageId;
  return PAGES.includes(value) ? value : 'home';
}

export function useHashRoute(): [PageId, (page: PageId) => void] {
  const [page, setPage] = useState<PageId>(readHash);

  useEffect(() => {
    const onChange = () => setPage(readHash());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = useCallback((next: PageId) => {
    window.location.hash = next;
    setPage(next);
  }, []);

  return [page, navigate];
}
