import { getApiBaseUrl } from '../config/env';
import { ApiError } from './apiError';

export interface QueryParams {
  q?: string;
  limit?: number;
}

export interface ApiClient {
  get<T>(path: string, params?: QueryParams): Promise<T>;
}

export interface ApiClientOptions {
  baseUrl?: string;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
}

export function createApiClient(options: ApiClientOptions = {}): ApiClient {
  const baseUrl = (options.baseUrl ?? getApiBaseUrl()).replace(/\/+$/, '');
  const timeoutMs = options.timeoutMs ?? 10000;
  const doFetch = options.fetchImpl ?? globalThis.fetch.bind(globalThis);

  return {
    async get<T>(path: string, params: QueryParams = {}): Promise<T> {
      const url = new URL(`${baseUrl}${path}`);
      if (params.q) url.searchParams.set('q', params.q);
      if (typeof params.limit === 'number') url.searchParams.set('limit', String(params.limit));

      const controller = new AbortController();
      const timer = globalThis.setTimeout(() => controller.abort(), timeoutMs);
      try {
        const response = await doFetch(url.toString(), {
          method: 'GET',
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new ApiError(`Error ${response.status} al consultar ${path}`, response.status, path);
        }
        return (await response.json()) as T;
      } catch (error) {
        if (error instanceof ApiError) throw error;
        const detail = error instanceof Error && error.name === 'AbortError'
          ? 'Tiempo de espera agotado'
          : 'No fue posible conectar con el servidor';
        throw new ApiError(`${detail} al consultar ${path}`, 0, path);
      } finally {
        globalThis.clearTimeout(timer);
      }
    },
  };
}

export const apiClient: ApiClient = createApiClient();
