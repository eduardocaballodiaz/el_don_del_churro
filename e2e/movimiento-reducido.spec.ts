// Quien pide menos movimiento en su sistema no debe ver parpadeos ni animaciones grandes.
import { expect, test } from '@playwright/test';

test.use({ reducedMotion: 'reduce' });

test('el halo del logo se enciende sin parpadeo', async ({ page, isMobile }) => {
  test.skip(isMobile, 'el hover solo existe con ratón');
  await page.goto('/');
  const logo = page.getByRole('banner').getByRole('link', { name: 'El Don del Churro' });
  await logo.hover();
  const halo = await logo.evaluate((el) => {
    const s = getComputedStyle(el, '::before');
    return { animacion: s.animationName, opacidad: s.opacity };
  });
  expect(halo.animacion).toBe('none');
  expect(halo.opacidad).toBe('1');
});

test('no se activa el scroll suave', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  // Lenis añade la clase "lenis" a <html> cuando está activo.
  await expect(page.locator('html')).not.toHaveClass(/\blenis\b/);
});

test('sin cursor personalizado y con el titular visible desde el principio', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-cursor]')).toHaveCount(0);
  const h1 = page.locator('h1');
  const estilo = await h1.evaluate((el) => ({ v: getComputedStyle(el).visibility, o: getComputedStyle(el).opacity }));
  expect(estilo).toEqual({ v: 'visible', o: '1' });
});
