// Cabeceras de seguridad (las sirve Next.js, así funcionan igual en local y en Netlify).
import { expect, test } from '@playwright/test';

test('las páginas llevan cabeceras de seguridad', async ({ request }) => {
  const h = (await request.get('/')).headers();
  expect(h['x-content-type-options']).toBe('nosniff');
  expect(h['referrer-policy']).toBe('strict-origin-when-cross-origin');
  expect(h['x-frame-options']).toBe('DENY');
  expect(h['permissions-policy']).toContain('camera=()');
  const csp = h['content-security-policy'];
  expect(csp).toContain("default-src 'self'");
  expect(csp).toContain('frame-src https://www.google.com');
  expect(csp).toContain("frame-ancestors 'none'");
});

test('con la política de seguridad, la web sigue funcionando (sin errores de CSP)', async ({ page }) => {
  const errores: string[] = [];
  page.on('console', (m) => m.type() === 'error' && errores.push(m.text()));
  await page.goto('/');
  await page.getByRole('region', { name: /cookies/i }).getByRole('button', { name: 'Aceptar' }).click();
  await expect(page.locator('#visitanos iframe')).toBeVisible();
  await page.goto('/contacto');
  expect(errores.filter((e) => /Content Security Policy/i.test(e))).toEqual([]);
});
