// Direcciones públicas de cada página en cada idioma, a partir de src/i18n/routing.ts.
// Las usan los metadatos (canonical y hreflang), el sitemap y los datos para Google.
import { routing, type Locale, type Pagina } from '@/i18n/routing';

/** Dominio definitivo. Todas las URL para Google y redes se construyen con él. */
export const DOMINIO = 'https://eldondelchurro.com';

/** Ruta pública de una página en un idioma: ('/carta', 'en') → '/en/menu'. */
export function rutaPublica(pagina: Pagina, locale: Locale): string {
  const definicion = routing.pathnames[pagina];
  const ruta = typeof definicion === 'string' ? definicion : definicion[locale];
  const prefijo = locale === routing.defaultLocale ? '' : `/${locale}`;
  if (ruta === '/') return prefijo || '/';
  return `${prefijo}${ruta}`;
}

/** URL absoluta (sin barra final en la raíz, como la sirve el dominio). */
export function urlAbsoluta(pagina: Pagina, locale: Locale): string {
  const ruta = rutaPublica(pagina, locale);
  return ruta === '/' ? DOMINIO : `${DOMINIO}${ruta}`;
}

/** Canonical de la página y sus versiones por idioma (para hreflang). */
export function urlsDePagina(pagina: Pagina, locale: Locale) {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = urlAbsoluta(pagina, l);
  languages['x-default'] = urlAbsoluta(pagina, routing.defaultLocale);
  return { canonical: urlAbsoluta(pagina, locale), languages };
}
