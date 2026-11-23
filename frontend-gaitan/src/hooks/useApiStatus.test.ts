import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useApiStatus } from './useApiStatus';

describe('useApiStatus', () => {
  it('prioriza carga, error y vacío', () => {
    expect(renderHook(() => useApiStatus(true, 'fallo', 3)).result.current.kind).toBe('loading');
    expect(renderHook(() => useApiStatus(false, 'fallo', 3)).result.current.kind).toBe('error');
    expect(renderHook(() => useApiStatus(false, null, 0)).result.current.kind).toBe('empty');
    expect(renderHook(() => useApiStatus(false, null, 2)).result.current.kind).toBe('ready');
  });

  it('muestra notas y mensaje singular', () => {
    const { result } = renderHook(() => useApiStatus(false, null, 1, ['Nota del proveedor']));
    expect(result.current.message).toContain('1 resultado');
    expect(result.current.notes).toEqual(['Nota del proveedor']);
  });
});
