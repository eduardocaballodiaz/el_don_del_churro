// Configuración de las pruebas en navegador real (Playwright).
// Se prueban dos dispositivos: un ordenador y un móvil táctil.
// Por defecto se compila la web y se arranca en local; con BASE_URL se puede
// probar contra la versión publicada (por ejemplo, la URL de Netlify).
import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.BASE_URL ?? 'http://localhost:3100';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  reporter: [['list']],
  use: { baseURL, trace: 'retain-on-failure' },
  projects: [
    {
      name: 'escritorio',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    { name: 'movil', use: { ...devices['Pixel 7'] } },
  ],
  // Solo arrancamos el servidor local cuando no se prueba una URL externa.
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: 'npm run build && npx next start -p 3100',
        url: baseURL,
        reuseExistingServer: true,
        timeout: 240_000,
        env: { CONTACTO_SIMULADO: '1', NEXT_DIST_DIR: '.next-e2e.nosync' },
      },
});
