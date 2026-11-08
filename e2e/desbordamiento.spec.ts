// Nada puede ser más ancho que la pantalla: si algo desborda, el móvil
// encoge toda la página y deja de responder bien a los toques.
import { expect, test } from '@playwright/test';

for (const ruta of ['/', '/en', '/carta', '/contacto', '/aviso-legal']) {
  test(`${ruta} no desborda a lo ancho`, async ({ page }) => {
    await page.goto(ruta);
    const { scroll, visible } = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      visible: document.documentElement.clientWidth,
    }));
    expect(scroll).toBeLessThanOrEqual(visible);
  });
}
