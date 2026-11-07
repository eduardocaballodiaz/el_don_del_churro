// Formulario de contacto de principio a fin (con el envío simulado: CONTACTO_SIMULADO=1).
import { expect, test } from '@playwright/test';

async function rellenar(page: import('@playwright/test').Page, mensaje = 'Quería preguntar por un pedido.') {
  await page.goto('/contacto');
  await page.getByLabel('Nombre').fill('José Núñez');
  await page.getByLabel('Correo electrónico').fill('jose@example.com');
  await page.getByLabel('Mensaje').fill(mensaje);
  await page.getByLabel(/política de privacidad/i).check();
  // La protección anti-spam rechaza envíos en menos de 3 segundos.
  await page.waitForTimeout(3100);
}

test('un envío válido muestra el mensaje de éxito', async ({ page }) => {
  await rellenar(page);
  await page.getByRole('button', { name: 'Enviar' }).click();
  await expect(page.getByRole('status')).toContainText(/mensaje enviado/i);
});

test('el doble clic solo envía una vez', async ({ page }) => {
  await rellenar(page);
  const peticiones: string[] = [];
  page.on('request', (r) => r.method() === 'POST' && peticiones.push(r.url()));
  await page.getByRole('button', { name: 'Enviar' }).dblclick();
  await expect(page.getByRole('status')).toContainText(/mensaje enviado/i);
  expect(peticiones).toHaveLength(1);
});

test('si el envío falla, ofrece escribir directamente al correo', async ({ page }) => {
  await rellenar(page, 'Prueba [simular-fallo]');
  await page.getByRole('button', { name: 'Enviar' }).click();
  await expect(page.getByRole('alert').getByRole('link', { name: 'info@eldondelchurro.com' })).toHaveAttribute(
    'href',
    'mailto:info@eldondelchurro.com',
  );
});

test('muestra los errores junto a cada campo', async ({ page }) => {
  await page.goto('/contacto');
  await page.getByLabel('Correo electrónico').fill('a@b');
  await page.waitForTimeout(3100);
  await page.getByRole('button', { name: 'Enviar' }).click();
  await expect(page.getByLabel('Correo electrónico')).toHaveAttribute('aria-invalid', 'true');
});

test('si hay un error, no se pierde lo escrito', async ({ page }) => {
  await page.goto('/contacto');
  await page.getByLabel('Nombre').fill('José Núñez');
  await page.getByLabel('Correo electrónico').fill('jose@example.com');
  await page.getByLabel('Mensaje').fill('Un mensaje largo que no quiero volver a escribir.');
  // Se olvida de aceptar la privacidad.
  await page.waitForTimeout(3100);
  await page.getByRole('button', { name: 'Enviar' }).click();
  // (Next.js tiene su propio role="alert" para anunciar cambios de página: se mira solo el formulario.)
  await expect(page.locator('form').getByRole('alert')).toBeVisible();
  await expect(page.getByLabel('Mensaje')).toHaveValue('Un mensaje largo que no quiero volver a escribir.');
  await expect(page.getByLabel('Nombre')).toHaveValue('José Núñez');
  await expect(page.getByLabel('Correo electrónico')).toHaveValue('jose@example.com');
});

test('si el envío falla, tampoco se pierde lo escrito', async ({ page }) => {
  await rellenar(page, 'Prueba [simular-fallo] con texto importante');
  await page.getByRole('button', { name: 'Enviar' }).click();
  await expect(page.locator('form').getByRole('alert')).toBeVisible();
  await expect(page.getByLabel('Mensaje')).toHaveValue('Prueba [simular-fallo] con texto importante');
});
