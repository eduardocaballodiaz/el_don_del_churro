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

  test('el punto dorado va pegado al ratón, sin retardo', async ({ page }) => {
    await page.goto('/');
    await page.mouse.move(200, 200);
    await page.mouse.move(640, 360);
    // Se comprueba en el siguiente fotograma, sin esperar a ninguna animación.
    const pos = await page.evaluate(
      () =>
        new Promise<{ x: number; y: number }>((ok) =>
          requestAnimationFrame(() => {
            const r = document.querySelector('[data-cursor]')!.getBoundingClientRect();
            ok({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
          }),
        ),
    );
    expect(Math.abs(pos.x - 640)).toBeLessThan(2);
    expect(Math.abs(pos.y - 360)).toBeLessThan(2);
  });

  test('la tarjeta elegida se inclina más, crece y las demás se encogen', async ({ page }) => {
    await page.goto('/');
    const tarjetas = page.locator('[data-inclinable]');
    await tarjetas.first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500); // que terminen las animaciones de entrada
    const caja = (await tarjetas.nth(1).boundingBox())!;
    await page.mouse.move(caja.x + caja.width * 0.98, caja.y + caja.height * 0.5, { steps: 6 });
    await page.waitForTimeout(900);
    const escala = (i: number) =>
      tarjetas.nth(i).locator('article').evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).a);
    expect(await escala(1)).toBeGreaterThan(1.05);
    expect(await escala(0)).toBeLessThan(0.95);
    expect(await escala(2)).toBeLessThan(0.95);
    const giro = await tarjetas.nth(1).evaluate((el) => {
      const m = (el as HTMLElement).style.transform.match(/rotateY\((-?[\d.]+)deg\)/);
      return m ? Math.abs(Number(m[1])) : 0;
    });
    expect(giro).toBeGreaterThan(9);
  });

  test('el titular de la portada termina visible tras su animación', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    await expect.poll(() => page.locator('h1').evaluate((el) => getComputedStyle(el).visibility)).toBe('visible');
  });
});
