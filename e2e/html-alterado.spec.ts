// Netlify (y algunas extensiones) alteran el HTML: un comentario dentro de <head>
// y un script después de </html>.
// React lo detecta como "el HTML no coincide" y vuelve a pintar la página, borrando
// la clase "js" que puso el script inicial. La web tiene que seguir funcionando.
import { expect, test } from '@playwright/test';

test.skip(({ isMobile }) => !isMobile, 'el botón de menú solo existe en móvil');

test('con un script inyectado al final del HTML, el menú móvil sigue funcionando', async ({ page }) => {
  await page.route(
    (url) => url.pathname === '/carta',
    async (ruta) => {
      const respuesta = await ruta.fetch();
      const html =
        (await respuesta.text()).replace(
          '<meta charSet="utf-8"/>',
          '<meta charSet="utf-8"/>\n<!-- Comentario inyectado por el alojamiento -->\n',
        ) + '<script async src="/inyectado-por-terceros.js"></script>';
      await ruta.fulfill({ response: respuesta, body: html });
    },
  );
  await page.goto('/carta');
  const boton = page.getByRole('button', { name: /menú/i });
  await expect(boton).toBeVisible();
  await expect(page.locator('html')).toHaveClass(/\bjs\b/);
  await boton.click();
  await expect(boton).toHaveAttribute('aria-expanded', 'true');
});
