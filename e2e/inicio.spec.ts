// Página de inicio: estructura, mapa bajo demanda, accesibilidad.
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

for (const ruta of ['/', '/en']) {
  test(`${ruta} tiene un único h1 y todas las imágenes con texto alternativo`, async ({ page }) => {
    await page.goto(ruta);
    await expect(page.locator('h1')).toHaveCount(1);
    // Las decorativas van marcadas con aria-hidden y alt vacío, como manda la norma.
    for (const img of await page.locator('main img:not([aria-hidden="true"])').all()) {
      expect((await img.getAttribute('alt'))?.trim()).toBeTruthy();
    }
  });

  test(`${ruta} no tiene problemas de accesibilidad graves`, async ({ page }) => {
    await page.goto(ruta);
    const { violations } = await new AxeBuilder({ page }).analyze();
    const graves = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(graves.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(' | ')}`)).toEqual([]);
  });
}

test('el mapa de Google solo se carga al pulsar', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('iframe')).toHaveCount(0);
  await page.getByRole('button', { name: /cargar mapa/i }).click();
  await expect(page.locator('iframe')).toHaveAttribute('src', /google\.com\/maps/);
});

test('"Cómo llegar" abre Google Maps con la dirección en otra pestaña', async ({ page }) => {
  await page.goto('/');
  const enlace = page.locator('#visitanos').getByRole('link', { name: /cómo llegar/i });
  await expect(enlace).toHaveAttribute('href', /Corredur%C3%ADa/);
  await expect(enlace).toHaveAttribute('target', '_blank');
});

test('existen las secciones a las que enlaza el menú', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#latas')).toBeVisible();
  await expect(page.locator('#nosotros')).toBeVisible();
});
