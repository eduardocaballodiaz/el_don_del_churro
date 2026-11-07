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
