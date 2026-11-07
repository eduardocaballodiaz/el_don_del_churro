// En pantallas táctiles no puede quedarse "atascado" ningún efecto de hover.
import { expect, test } from '@playwright/test';

test.skip(({ isMobile }) => !isMobile, 'solo en móvil');

test('el logo no se queda agrandado tras tocarlo', async ({ page }) => {
  await page.goto('/carta');
  const logo = page.getByRole('banner').getByRole('link', { name: 'El Don del Churro' });
  await logo.tap();
  await page.waitForURL('**/');
  await page.goBack();
  const transform = await page
    .getByRole('banner')
    .getByRole('link', { name: 'El Don del Churro' })
    .evaluate((el) => getComputedStyle(el).transform);
  expect(transform).toBe('none');
});

test('en táctil no hay cursor personalizado ni inclinación de tarjetas', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-cursor]')).toHaveCount(0);
  const tarjeta = page.locator('[data-inclinable]').first();
  await tarjeta.scrollIntoViewIfNeeded();
  await tarjeta.tap();
  expect(await tarjeta.evaluate((el) => (el as HTMLElement).style.transform)).toBe('');
});
