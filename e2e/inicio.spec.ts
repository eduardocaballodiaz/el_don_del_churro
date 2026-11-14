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

test('sin consentimiento no hay mapa de Google ni plano ilustrado', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('iframe')).toHaveCount(0);
  await expect(page.locator('#visitanos svg[role="img"]')).toHaveCount(0);
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

test('"Lo nuestro": al pulsar Churros se despliegan Finos y Rueda', async ({ page }) => {
  await page.goto('/');
  const churros = page.locator('#lo-nuestro').getByRole('button', { name: /^Churros/ });
  await churros.scrollIntoViewIfNeeded();
  const panel = page.locator('#panel-churros');
  await expect(panel).toBeHidden();
  await churros.click();
  await expect(panel.getByRole('heading', { name: 'Finos' })).toBeVisible();
  await expect(panel.getByRole('heading', { name: 'Rueda' })).toBeVisible();
  await expect(page.locator('#lo-nuestro')).not.toContainText(/con chocolate o con café/i);
});
