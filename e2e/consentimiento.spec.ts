// Banner de cookies (guía de la AEPD): el mapa de Google solo se carga con permiso.
// "Aceptar" y "Rechazar" tienen el mismo peso, y la decisión se puede cambiar después.
import { expect, test } from '@playwright/test';

test('primera visita: aparece el banner y no se carga nada de Google', async ({ page }) => {
  const aGoogle: string[] = [];
  page.on('request', (r) => /google\./.test(new URL(r.url()).host) && aGoogle.push(r.url()));
  await page.goto('/');
  const banner = page.getByRole('region', { name: /cookies/i });
  await expect(banner).toBeVisible();
  await expect(banner.getByRole('button', { name: 'Aceptar' })).toBeVisible();
  await expect(banner.getByRole('button', { name: 'Rechazar' })).toBeVisible();
  await expect(page.locator('iframe')).toHaveCount(0);
  expect(aGoogle).toEqual([]);
});

test('al aceptar, el mapa aparece directamente y se recuerda en la siguiente visita', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('region', { name: /cookies/i }).getByRole('button', { name: 'Aceptar' }).click();
  await expect(page.getByRole('region', { name: /cookies/i })).toHaveCount(0);
  await expect(page.locator('#visitanos iframe')).toHaveAttribute('src', /google\.com\/maps/);
  await page.reload();
  await expect(page.getByRole('region', { name: /cookies/i })).toHaveCount(0);
  await expect(page.locator('#visitanos iframe')).toHaveAttribute('src', /google\.com\/maps/);
});

test('al rechazar, no hay mapa de Google pero sí la dirección y "Cómo llegar"', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('region', { name: /cookies/i }).getByRole('button', { name: 'Rechazar' }).click();
  await expect(page.locator('iframe')).toHaveCount(0);
  await expect(page.locator('#visitanos')).toContainText('Calle Correduría, 42');
  await expect(page.locator('#visitanos').getByRole('link', { name: /cómo llegar/i })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('region', { name: /cookies/i })).toHaveCount(0);
  await expect(page.locator('iframe')).toHaveCount(0);
});

test('desde el pie se puede cambiar la decisión', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('region', { name: /cookies/i }).getByRole('button', { name: 'Rechazar' }).click();
  await page.getByRole('contentinfo').getByRole('button', { name: /configurar cookies/i }).click();
  await page.getByRole('region', { name: /cookies/i }).getByRole('button', { name: 'Aceptar' }).click();
  await expect(page.locator('#visitanos iframe')).toHaveAttribute('src', /google\.com\/maps/);
});
