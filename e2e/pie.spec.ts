// Pie de página y página de error 404.
import { expect, test } from '@playwright/test';

test('el pie muestra dirección, horario y correo, y no inventa teléfono', async ({ page }) => {
  await page.goto('/');
  const pie = page.getByRole('contentinfo');
  await expect(pie).toContainText('Calle Correduría, 42');
  await expect(pie).toContainText('7:00 – 13:00');
  await expect(pie.getByRole('link', { name: 'info@eldondelchurro.com' })).toHaveAttribute(
    'href',
    'mailto:info@eldondelchurro.com',
  );
  await expect(pie.locator('a[href^="tel:"]')).toHaveCount(0);
});

test('una ruta inexistente da 404 con enlace al inicio en su idioma', async ({ page }) => {
  const es = await page.goto('/esto-no-existe');
  expect(es?.status()).toBe(404);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.getByRole('main').getByRole('link', { name: /inicio/i })).toHaveAttribute('href', '/');

  const en = await page.goto('/en/does-not-exist');
  expect(en?.status()).toBe(404);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('main').getByRole('link', { name: /home/i })).toHaveAttribute('href', '/en');
});
