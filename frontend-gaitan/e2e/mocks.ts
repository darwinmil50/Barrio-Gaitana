import type { Page, Route } from '@playwright/test';

export const MOCK_PLACE = 'Clínica Gaitana';

const SOURCE = {
  name: 'Datos Abiertos Suba', url: 'https://example.test/datos',
  license: 'CC BY 4.0', updated_at: '2026-01-15T00:00:00Z',
};

const PLACE = {
  id: 'v-1', name: MOCK_PLACE, category: 'veterinaries',
  latitude: 4.7419, longitude: -74.1098, geometry: null,
  properties: {}, source: SOURCE,
};

const RATES = {
  type: 'crime_rates', scope: 'locality', locality: 'Suba',
  period: 'Ene-Sep (2018vs2026)', population: 1348372, population_year: 2019,
  rate_basis: 'Delitos por 100.000 habitantes (población Suba 2019)',
  series: [{ year: 2018, total: 15, rate_per_100k: 1.11 }],
  totals: { Homicidios: 30 }, variation_pct: { Homicidios: -20 },
};

const BOUNDARY = {
  type: 'FeatureCollection', source: 'UAECD',
  features: [{
    type: 'Feature', properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-74.113071698, 4.738453018], [-74.106561958, 4.738453018],
        [-74.106561958, 4.745420379], [-74.113071698, 4.745420379],
        [-74.113071698, 4.738453018],
      ]],
    },
  }],
};

function envelope(data: unknown[], note: string | null = null, context: unknown[] = []) {
  return {
    scope: 'neighborhood',
    neighborhood: { name: 'La Gaitana', code: '009216', locality: 'Suba', city: 'Bogotá D.C.' },
    source: SOURCE, count: data.length, data, note, context,
  };
}

async function fulfillError(route: Route) {
  await route.fulfill({
    status: 500,
    contentType: 'application/json',
    body: JSON.stringify({ detail: 'Fallo simulado' }),
  });
}

export async function mockApi(page: Page, options: { error?: boolean } = {}): Promise<void> {
  await page.route('**/*tile.openstreetmap.org/**', (route) =>
    route.fulfill({ status: 200, contentType: 'image/png', body: '' }));
  await page.route('**/api/**', async (route) => {
    if (options.error) return fulfillError(route);
    const path = new URL(route.request().url()).pathname;
    let body: unknown = envelope([]);
    if (path.includes('/boundary')) body = BOUNDARY;
    else if (path === '/api/neighborhood') body = envelope([]);
    else if (path.includes('veterinaries')) body = envelope([PLACE], 'Nota de prueba');
    else if (path.includes('/crimes')) body = envelope([], null, [RATES]);
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) });
  });
}
