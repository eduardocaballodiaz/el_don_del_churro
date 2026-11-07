// Configuración de Next.js.
// - next-intl: conecta la configuración de idiomas (src/i18n/request.ts).
// - cacheComponents desactivado: todas las páginas son estáticas y se generan
//   en la compilación con generateStaticParams; no necesitamos renderizado parcial.
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Carpeta de compilación. El sufijo ".nosync" hace que iCloud Drive no la sincronice
  // (el proyecto está en el Escritorio, que se sube a iCloud, y crearía copias " 2").
  // Las pruebas e2e compilan en otra carpeta para no pisar al servidor de desarrollo.
  distDir: process.env.NEXT_DIST_DIR ?? '.next.nosync',
};

export default withNextIntl(nextConfig);
