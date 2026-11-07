// Rutas por idioma: español sin prefijo, inglés en /en con direcciones traducidas.
import { expect, test } from '@playwright/test';

test('/ está en español y /en en inglés', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await page.goto('/en');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('la carta en inglés vive en /en/menu y no en /en/carta', async ({ page }) => {
  expect((await page.goto('/en/menu'))?.status()).toBe(200);
  // /en/carta no puede mostrar la página bajo la dirección española.
  const r = await page.goto('/en/carta');
  expect(r?.status() === 404 || new URL(page.url()).pathname === '/en/menu').toBe(true);
});

test('/es redirige a /', async ({ page }) => {
  await page.goto('/es');
  expect(new URL(page.url()).pathname).toBe('/');
});
