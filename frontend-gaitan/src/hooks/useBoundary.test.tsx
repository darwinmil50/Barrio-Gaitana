import { beforeEach, describe, expect, it } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useBoundary } from './useBoundary';
import { clearCache } from '../utils/cache';
import { envelope, mockClient } from '../test/fixtures';

beforeEach(() => clearCache());

describe('useBoundary', () => {
  it('carga el polígono y la información territorial', async () => {
    const client = mockClient();
    const { result } = renderHook(() => useBoundary(client));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.boundary?.features).toHaveLength(1);
    expect(result.current.boundarySource).toBe('SDIS — Barrio Común (110292)');
    expect(result.current.neighborhood.name).toBe('La Gaitana');
    expect(result.current.error).toBeNull();
  });

  it('informa errores del backend', async () => {
    const client = mockClient((path) => {
      if (path.includes('boundary')) throw new Error('sin conexión');
      return envelope([]);
    });
    const { result } = renderHook(() => useBoundary(client));
    await waitFor(() => expect(result.current.error).toContain('sin conexión'));
  });
});
