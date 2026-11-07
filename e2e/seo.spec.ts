// Posicionamiento: títulos únicos, versiones por idioma, sitemap, datos para Google e imagen para compartir.
import { expect, test } from '@playwright/test';

const PAGINAS = ['/', '/carta', '/contacto', '/aviso-legal', '/privacidad', '/cookies', '/en', '/en/menu'];

test('cada página tiene un título distinto', async ({ page }) => {
  const titulos = new Set<string>();
  for (const ruta of PAGINAS) {
    await page.goto(ruta);
    titulos.add(await page.title());
  }
  expect(titulos.size).toBe(PAGINAS.length);
});

test('cada página enlaza su versión en el otro idioma', async ({ page }) => {
  await page.goto('/carta');
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
    'href',
    'https://eldondelchurro.com/en/menu',
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://eldondelchurro.com/carta');
});

test('el sitemap lista las 12 direcciones con sus alternativas', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  expect(xml.match(/<loc>/g)).toHaveLength(12);
  expect(xml).toContain('hreflang="en"');
  expect(xml).toContain('https://eldondelchurro.com/en/menu');
});

test('robots.txt enlaza el sitemap', async ({ request }) => {
  expect(await (await request.get('/robots.txt')).text()).toContain('Sitemap: https://eldondelchurro.com/sitemap.xml');
});

test('el inicio incluye datos estructurados válidos', async ({ page }) => {
  await page.goto('/');
  const json = await page.locator('script[type="application/ld+json"]').first().textContent();
  expect(JSON.parse(json!)['@type']).toBe('Restaurant');
});

test('hay imagen para compartir en redes', async ({ page, request }) => {
  await page.goto('/');
  const og = await page.locator('meta[property="og:image"]').first().getAttribute('content');
  const ruta = new URL(og!).pathname + new URL(og!).search;
  const r = await request.get(ruta);
  expect(r.status()).toBe(200);
  expect(r.headers()['content-type']).toContain('image/png');
});
