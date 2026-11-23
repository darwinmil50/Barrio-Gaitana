import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TerritoryProvider } from '../context/TerritoryContext';
import { clearCache } from '../utils/cache';
import { boundary, envelope, INSIDE, mockClient } from '../test/fixtures';
import { Home } from './Home';

vi.mock('../components/Map/MapView', () => ({
  MapView: () => <div data-testid="mapa" />,
}));

vi.mock('recharts', () => {
  const Passthrough = ({ children }: { children?: ReactNode }) => <div>{children}</div>;
  return {
    ResponsiveContainer: Passthrough, BarChart: Passthrough, Bar: Passthrough,
    LineChart: Passthrough, Line: Passthrough, XAxis: Passthrough,
    YAxis: Passthrough, Tooltip: Passthrough, CartesianGrid: Passthrough,
  };
});

const client = mockClient((path: string) => {
  if (path.includes('boundary')) return boundary;
  if (path.includes('/neighborhood')) return envelope([]);
  if (path.includes('veterinaries')) return envelope([INSIDE], { note: 'Nota de prueba' });
  return envelope([]);
});

beforeEach(() => clearCache());

describe('Home', () => {
  it('muestra resumen, mapa, nota y resultados dentro del barrio', async () => {
    render(<TerritoryProvider client={client}><Home /></TerritoryProvider>);
    expect(await screen.findByText(INSIDE.name)).toBeInTheDocument();
    expect(screen.getByTestId('mapa')).toBeInTheDocument();
    expect(screen.getByText(/1 resultado dentro del barrio La Gaitana/)).toBeInTheDocument();
    expect(screen.getByText('Nota de prueba')).toBeInTheDocument();
    expect(screen.getByText(/Barrio oficial SDIS 110292 · Sector catastral 009216/)).toBeInTheDocument();
  });
});
