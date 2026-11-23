import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PlaceTable } from './PlaceTable';
import { INSIDE } from '../../test/fixtures';

describe('PlaceTable', () => {
  it('muestra registros y su fuente', () => {
    render(<PlaceTable places={[INSIDE]} caption="Prueba" />);
    expect(screen.getByText('Prueba')).toBeInTheDocument();
    expect(screen.getByText(INSIDE.name)).toBeInTheDocument();
    expect(screen.getByText(/Datos Abiertos Suba/)).toBeInTheDocument();
  });

  it('informa cuando no hay datos', () => {
    render(<PlaceTable places={[]} />);
    expect(screen.getByText('Sin información pública disponible')).toBeInTheDocument();
  });
});
