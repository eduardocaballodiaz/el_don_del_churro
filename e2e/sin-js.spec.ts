// Sin JavaScript la web debe leerse entera: nada queda oculto esperando una animación.
import { expect, test } from '@playwright/test';

test.use({ javaScriptEnabled: false });

for (const ruta of ['/', '/en']) {
  test(`${ruta} se lee completa sin JavaScript`, async ({ page }) => {
    await page.goto(ruta);
    await expect(page.locator('h1')).toBeVisible();
    for (const el of await page.locator('[data-reveal]').all()) {
      await expect(el).toBeVisible();
      expect(await el.evaluate((e) => getComputedStyle(e).opacity)).toBe('1');
    }
  });
}

test('sin JavaScript, la navegación del pie lleva a la carta', async ({ page }) => {
  await page.goto('/');
  await page.locator('#navegacion-pie').getByRole('link', { name: 'La carta' }).click();
  await expect(page).toHaveURL(/\/carta$/);
});
