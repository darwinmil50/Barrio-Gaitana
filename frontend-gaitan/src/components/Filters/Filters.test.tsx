import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Filters } from './Filters';

function setup() {
  const handlers = {
    onQueryChange: vi.fn(), onToggle: vi.fn(), onReset: vi.fn(),
    onNearbyChange: vi.fn(),
  };
  render(
    <Filters
      query=""
      active={['veterinaries']}
      includeNearby={true}
      {...handlers}
    />,
  );
  return handlers;
}

describe('Filters', () => {
  it('propaga la búsqueda de texto', () => {
    const handlers = setup();
    fireEvent.change(screen.getByLabelText('Buscar establecimientos'), { target: { value: 'clínica' } });
    expect(handlers.onQueryChange).toHaveBeenCalledWith('clínica');
  });

  it('permite activar capas y restablecer', () => {
    const handlers = setup();
    const button = screen.getByRole('button', { name: /Veterinarias/ });
    expect(button).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(screen.getByRole('button', { name: /Librerías/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Restablecer filtros' }));
    expect(handlers.onToggle).toHaveBeenCalledWith('bookstores');
    expect(handlers.onReset).toHaveBeenCalledOnce();
  });
});
