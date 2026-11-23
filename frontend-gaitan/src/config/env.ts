export const DEFAULT_API_URL = 'http://localhost:8000';

export function getApiBaseUrl(): string {
  const configured = import.meta.env.VITE_API_URL;
  const value = typeof configured === 'string' ? configured.trim() : '';
  return value.replace(/\/+$/, '') || DEFAULT_API_URL;
}
