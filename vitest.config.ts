// Configuración de las pruebas unitarias (Vitest).
// - jsdom simula un navegador para poder renderizar componentes de React.
// - El alias "@" apunta a src/, igual que en Next.js.
// - Las pruebas de navegador real (Playwright) viven en e2e/ y no se ejecutan aquí.
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.{ts,tsx}'],
    setupFiles: ['./tests/setup.ts'],
  },
});
