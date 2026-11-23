import { expect, test } from '@playwright/test';
import { mockApi } from './mocks';

test('muestra tasas y totales de criminalidad de Suba', async ({ page }) => {
  await mockApi(page);
  await page.goto('/#/security');

  await expect(page.getByRole('heading', { name: 'Seguridad', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Tasas de criminalidad — Suba' })).toBeVisible();
  await expect(page.getByText('Delitos por 100.000 habitantes (población Suba 2019)')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Delitos por tipo · Suba' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Homicidios' })).toBeVisible();
});
