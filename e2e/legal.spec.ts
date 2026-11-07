// Páginas legales obligatorias en España (LSSI-CE y RGPD), en los dos idiomas.
import { expect, test } from '@playwright/test';

const PAGINAS = [
  '/aviso-legal',
  '/privacidad',
  '/cookies',
  '/en/legal-notice',
  '/en/privacy',
  '/en/cookies',
];

for (const ruta of PAGINAS) {
  test(`${ruta} existe, tiene título y no muestra datos rotos`, async ({ page }) => {
    expect((await page.goto(ruta))?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    const texto = await page.locator('main').innerText();
    expect(texto).not.toMatch(/\bnull\b|\bundefined\b|\{[a-z]+\}/);
  });
}

test('mientras falten los datos del titular, se avisa de forma visible', async ({ page }) => {
  await page.goto('/aviso-legal');
  await expect(page.getByRole('note')).toContainText(/datos del titular pendientes/i);
  await page.goto('/en/legal-notice');
  await expect(page.getByRole('note')).toContainText(/owner details pending/i);
});

test('la política de privacidad menciona a Resend y el derecho a reclamar ante la AEPD', async ({ page }) => {
  await page.goto('/privacidad');
  await expect(page.locator('main')).toContainText('Resend');
  await expect(page.locator('main')).toContainText('Agencia Española de Protección de Datos');
});
