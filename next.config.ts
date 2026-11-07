// Configuración de Next.js.
// - next-intl: conecta la configuración de idiomas (src/i18n/request.ts).
// - cacheComponents desactivado: todas las páginas son estáticas y se generan
//   en la compilación con generateStaticParams; no necesitamos renderizado parcial.
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

// CABECERAS DE SEGURIDAD (en todas las páginas).
// La política de contenido (CSP) solo permite cargar recursos de nuestro propio
// dominio, más el mapa de Google cuando el usuario lo pide. 'unsafe-inline' es
// necesario para los pequeños scripts que Next.js incrusta en las páginas estáticas.
const esDesarrollo = process.env.NODE_ENV === 'development';
const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${esDesarrollo ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  'frame-src https://www.google.com',
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ');

const CABECERAS = [
  { key: 'Content-Security-Policy', value: CSP },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: '/:path*', headers: CABECERAS }];
  },
  reactStrictMode: true,
  // Carpeta de compilación. El sufijo ".nosync" hace que iCloud Drive no la sincronice
  // (el proyecto está en el Escritorio, que se sube a iCloud, y crearía copias " 2").
  // Las pruebas e2e compilan en otra carpeta para no pisar al servidor de desarrollo.
  distDir: process.env.NEXT_DIST_DIR ?? '.next.nosync',
};

export default withNextIntl(nextConfig);
