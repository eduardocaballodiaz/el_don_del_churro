// Se ejecuta antes de cada petición (en Next.js 16 el "middleware" se llama "proxy").
// next-intl decide aquí el idioma según la URL, redirige /es → / y traduce
// direcciones como /en/menu a la página interna /carta.
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Todo menos archivos internos de Next, la API y archivos con extensión (imágenes, sitemap…).
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
};
