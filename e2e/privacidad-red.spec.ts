// Privacidad (RGPD y guía de cookies de la AEPD):
// la web no puede conectar con terceros ni guardar cookies sin que el usuario
// lo pida. Si esta prueba falla, probablemente alguien ha añadido una fuente
// remota, una analítica o un iframe que obligaría a poner un banner de cookies.
import { expect, test } from '@playwright/test';

const PAGINAS = ['/', '/en', '/carta', '/contacto'];
const DOMINIOS_PROHIBIDOS = [
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'google-analytics.com',
  'googletagmanager.com',
];

for (const ruta of PAGINAS) {
  test(`${ruta} no conecta con terceros ni crea cookies`, async ({ page, context, baseURL }) => {
    const origenPropio = new URL(baseURL!).host;
    const ajenas: string[] = [];
    page.on('request', (req) => {
      const url = new URL(req.url());
      if (url.protocol.startsWith('http') && url.host !== origenPropio) ajenas.push(url.host);
    });

    const respuesta = await page.goto(ruta);
    expect(respuesta?.status()).toBe(200);
    await page.waitForLoadState('networkidle');

    expect(ajenas).toEqual([]);
    for (const dominio of DOMINIOS_PROHIBIDOS) expect(ajenas).not.toContain(dominio);
    expect(await context.cookies()).toEqual([]);
  });
}
