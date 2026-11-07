// Encabezado: selector de idioma, logo y menú móvil accesible.
import { expect, test } from '@playwright/test';

test('el selector de idioma conserva la página equivalente', async ({ page, isMobile }) => {
  await page.goto('/carta');
  if (isMobile) await page.getByRole('button', { name: /menú/i }).click();
  await page.getByRole('link', { name: 'English' }).first().click();
  await expect(page).toHaveURL(/\/en\/menu$/);

  await page.goto('/en/contact');
  if (isMobile) await page.getByRole('button', { name: /menu/i }).click();
  await page.getByRole('link', { name: 'Español' }).first().click();
  await expect(page).toHaveURL(/\/contacto$/);
});

test('el logo enlaza al inicio con nombre accesible', async ({ page }) => {
  await page.goto('/carta');
  const logo = page.getByRole('banner').getByRole('link', { name: 'El Don del Churro' });
  await expect(logo).toHaveAttribute('href', '/');
});

test('el rótulo se ilumina sin parpadeo y crece al pasar el cursor', async ({ page, isMobile }) => {
  test.skip(isMobile, 'el hover solo existe con ratón');
  await page.goto('/');
  const logo = page.getByRole('banner').getByRole('link', { name: 'El Don del Churro' });
  // Es el rótulo horizontal, no el sello circular.
  await expect(logo.locator('img')).toHaveAttribute('src', /rotulo\.svg/);
  await logo.hover();
  await page.waitForTimeout(800);
  const estado = await logo.evaluate((el) => ({
    animacion: getComputedStyle(el, '::before').animationName,
    opacidad: getComputedStyle(el, '::before').opacity,
    escala: new DOMMatrix(getComputedStyle(el).transform).a,
  }));
  expect(estado.animacion).toBe('none');
  expect(estado.opacidad).toBe('1');
  expect(estado.escala).toBeGreaterThan(1.05);
});

test('el rótulo tiene un tamaño generoso en escritorio', async ({ page, isMobile }) => {
  test.skip(isMobile, 'medida de escritorio');
  await page.goto('/');
  const caja = await page.getByRole('banner').getByRole('link', { name: 'El Don del Churro' }).boundingBox();
  expect(caja!.width).toBeGreaterThanOrEqual(240);
});

test.describe('menú móvil', () => {
  test.skip(({ isMobile }) => !isMobile, 'solo en móvil');

  test('se abre, atrapa el foco y se cierra con Escape', async ({ page }) => {
    await page.goto('/');
    const boton = page.getByRole('button', { name: /menú/i });
    await expect(boton).toHaveAttribute('aria-expanded', 'false');
    await boton.click();
    await expect(boton).toHaveAttribute('aria-expanded', 'true');

    const panel = page.getByRole('dialog');
    await expect(panel).toBeVisible();
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press('Tab');
      const dentro = await panel.evaluate((el) => el.contains(document.activeElement));
      expect(dentro).toBe(true);
    }

    await page.keyboard.press('Escape');
    await expect(panel).toBeHidden();
    await expect(boton).toBeFocused();
  });
});
