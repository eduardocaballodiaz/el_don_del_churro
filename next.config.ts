// Configuración de Next.js.
// - next-intl: conecta la configuración de idiomas (src/i18n/request.ts).
// - cacheComponents desactivado: todas las páginas son estáticas y se generan
//   en la compilación con generateStaticParams; no necesitamos renderizado parcial.
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default withNextIntl(nextConfig);
