import { describe, expect, it, vi } from 'vitest';
import { createApiClient } from './apiClient';
import { ApiError, errorMessage } from './apiError';

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

describe('apiClient', () => {
  it('construye la URL con q y limit', async () => {
    const fetchImpl = vi.fn(async () => json({ ok: true })) as unknown as typeof fetch;
    const client = createApiClient({ baseUrl: 'http://localhost:8000/', fetchImpl });
    await client.get('/api/streets', { q: 'suba', limit: 20 });
    expect(fetchImpl).toHaveBeenCalledWith(
      'http://localhost:8000/api/streets?q=suba&limit=20',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('lanza ApiError tipado para respuestas no exitosas', async () => {
    const fetchImpl = vi.fn(async () => json({ detail: 'error' }, 500)) as unknown as typeof fetch;
    const client = createApiClient({ baseUrl: 'http://api.test', fetchImpl });
    await expect(client.get('/api/crimes')).rejects.toBeInstanceOf(ApiError);
    await expect(client.get('/api/crimes')).rejects.toMatchObject({ status: 500, path: '/api/crimes' });
  });

  it('envuelve errores de red y timeouts', async () => {
    const network = vi.fn(async () => { throw new TypeError('fetch failed'); }) as unknown as typeof fetch;
    await expect(createApiClient({ baseUrl: 'http://api.test', fetchImpl: network }).get('/api/police'))
      .rejects.toMatchObject({ status: 0, message: expect.stringContaining('No fue posible conectar') });

    const timeout = vi.fn(async () => {
      const error = new Error('abortada');
      error.name = 'AbortError';
      throw error;
    }) as unknown as typeof fetch;
    await expect(createApiClient({ baseUrl: 'http://api.test', fetchImpl: timeout }).get('/api/police'))
      .rejects.toMatchObject({ message: expect.stringContaining('Tiempo de espera agotado') });
  });

  it('ofrece mensajes legibles', () => {
    expect(errorMessage(new ApiError('Fallo', 503, '/x'))).toBe('Fallo');
    expect(errorMessage(null)).toContain('No fue posible');
  });
});
