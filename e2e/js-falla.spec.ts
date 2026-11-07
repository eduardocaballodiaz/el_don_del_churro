// Si el JavaScript no llega a cargar (red móvil inestable, extensión, error),
// el contenido no puede quedarse oculto esperando una animación que nunca llega.
import { expect, test } from '@playwright/test';

test('con los scripts bloqueados, todo acaba visible', async ({ page }) => {
  // Solo los .js: el CSS sí carga (si no, nada se ocultaría y la prueba no probaría nada).
  await page.route(/\/_next\/static\/chunks\/.*\.js/, (ruta) => ruta.abort());
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible({ timeout: 8000 });
  await expect
    .poll(() => page.locator('h1').evaluate((el) => getComputedStyle(el).visibility), { timeout: 8000 })
    .toBe('visible');
  for (const el of await page.locator('[data-reveal]').all()) {
    await expect.poll(() => el.evaluate((e) => getComputedStyle(e).opacity), { timeout: 8000 }).toBe('1');
  }
});
