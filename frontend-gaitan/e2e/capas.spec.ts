import { expect, test } from '@playwright/test';
import { mockApi } from './mocks';

test('activa y desactiva capas del mapa y filtros', async ({ page }) => {
  await mockApi(page);
  await page.goto('/');
  await expect(page.getByText(/1 resultado dentro del barrio La Gaitana/)).toBeVisible();

  const mapa = page.locator('section[aria-label="Mapa interactivo del barrio La Gaitana"]');
  const capa = mapa.getByRole('button', { name: /Veterinarias/ });
  const filtro = page.locator('aside').getByRole('button', { name: /Veterinarias/ });

  await expect(capa).toHaveAttribute('aria-pressed', 'true');
  await capa.click();
  await expect(capa).toHaveAttribute('aria-pressed', 'false');
  await expect(filtro).toHaveAttribute('aria-pressed', 'false');
  await expect(page.getByText('Sin información pública disponible').first()).toBeVisible();

  await filtro.click();
  await expect(filtro).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByText(/1 resultado dentro del barrio La Gaitana/)).toBeVisible();
  await expect(mapa.getByRole('heading', { name: 'Leyenda' })).toBeVisible();
});
