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
