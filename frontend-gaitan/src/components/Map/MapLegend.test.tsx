import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MapLegend } from './MapLegend';
import { INSIDE } from '../../test/fixtures';

describe('MapLegend', () => {
  it('enumera el límite y las capas visibles', () => {
    render(<MapLegend layers={[{
      key: 'veterinaries', label: 'Veterinarias', color: '#2f7d6b', places: [INSIDE],
    }]} />);
    expect(screen.getByText('Leyenda')).toBeInTheDocument();
    expect(screen.getByText('Límite de La Gaitana')).toBeInTheDocument();
    expect(screen.getByText('Veterinarias (1)')).toBeInTheDocument();
  });
});
