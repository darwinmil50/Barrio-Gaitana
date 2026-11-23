import { expect, test } from '@playwright/test';
import { mockApi } from './mocks';

test('muestra un mensaje claro cuando el backend falla', async ({ page }) => {
  await mockApi(page, { error: true });
  await page.goto('/');

  await expect(page.getByRole('alert')).toContainText('Error 500');
  await expect(page.getByRole('heading', { name: 'Resumen territorial' })).toBeVisible();
  await expect(page.getByText('Sin información pública disponible').first()).toBeVisible();
});
