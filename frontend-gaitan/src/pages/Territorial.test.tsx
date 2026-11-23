import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TerritoryProvider } from '../context/TerritoryContext';
import { clearCache } from '../utils/cache';
import { boundary, envelope, mockClient, place } from '../test/fixtures';
import { Territorial } from './Territorial';

vi.mock('../components/Map/MapView', () => ({ MapView: () => <div data-testid="mapa" /> }));
vi.mock('recharts', () => {
  const Passthrough = ({ children }: { children?: ReactNode }) => <div>{children}</div>;
  return { ResponsiveContainer: Passthrough, BarChart: Passthrough, Bar: Passthrough };
});

const local = place('l1', 'Punto de localidad', 'cadastre');
const client = mockClient((path: string) => {
  if (path.includes('boundary')) return boundary;
  if (path.includes('/neighborhood')) return envelope([]);
  if (path.includes('cadastre')) return envelope([local], { scope: 'locality' });
  return envelope([]);
});

beforeEach(() => clearCache());

describe('Territorial', () => {
  it('muestra el contexto de localidad separado del barrio', async () => {
    render(<TerritoryProvider client={client}><Territorial /></TerritoryProvider>);
    expect(await screen.findByText('Contexto de la localidad Suba')).toBeInTheDocument();
    expect(await screen.findByText('Punto de localidad')).toBeInTheDocument();
    expect(screen.getAllByText('Sin información pública disponible').length).toBeGreaterThan(0);
    expect(screen.getByText(/No forman parte del barrio La Gaitana/)).toBeInTheDocument();
  });
});
