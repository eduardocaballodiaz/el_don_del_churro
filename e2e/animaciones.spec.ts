// Las animaciones se activan con normalidad cuando el usuario no pide menos movimiento.
import { expect, test } from '@playwright/test';

test('el scroll suave está activo', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/\blenis\b/);
});

test('el contenido animado termina visible', async ({ page }) => {
  await page.goto('/');
  const primero = page.locator('[data-reveal]').first();
  await expect(primero).toHaveAttribute('data-reveal', 'visible', { timeout: 5000 });
});

test.describe('con ratón', () => {
  test.skip(({ isMobile }) => isMobile, 'solo escritorio');

  test('hay cursor dorado y las tarjetas se inclinan al pasar por encima', async ({ page }) => {
    await page.goto('/');
    await page.mouse.move(400, 400);
    await expect(page.locator('[data-cursor]')).toHaveCount(1);
    const tarjeta = page.locator('[data-inclinable]').first();
    await tarjeta.scrollIntoViewIfNeeded();
    const caja = (await tarjeta.boundingBox())!;
    await page.mouse.move(caja.x + caja.width * 0.85, caja.y + caja.height * 0.2, { steps: 5 });
    await expect.poll(() => tarjeta.evaluate((el) => (el as HTMLElement).style.transform)).toMatch(/rotate/);
  });

  test('el titular de la portada termina visible tras su animación', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    await expect.poll(() => page.locator('h1').evaluate((el) => getComputedStyle(el).visibility)).toBe('visible');
  });
});
