import { expect, test } from '@playwright/test';
import { MOCK_PLACE, mockApi } from './mocks';

test('carga el resumen territorial con mocks de red', async ({ page }) => {
  await mockApi(page);
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Resumen territorial' })).toBeVisible();
  await expect(page.getByText(/1 resultado dentro del barrio La Gaitana/)).toBeVisible();
  await expect(page.getByText(MOCK_PLACE)).toBeVisible();
  await expect(page.getByText('Nota de prueba', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Leyenda' })).toBeVisible();
});
