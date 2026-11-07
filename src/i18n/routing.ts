// Configuración de idiomas de la web.
//
// - Español es el idioma principal y va sin prefijo:  eldondelchurro.com/carta
// - Inglés va con prefijo /en y direcciones traducidas: eldondelchurro.com/en/menu
// - No se detecta el idioma del navegador: todo el mundo entra en español y
//   cambia con el selector ES/EN del encabezado (lo pidió Edu).
//
// Para añadir una página nueva, se añade aquí su dirección en cada idioma.
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  localePrefix: 'as-needed',
  localeDetection: false,
  // Sin cookie de idioma: el idioma ya va en la URL y así la web no crea ninguna cookie.
  localeCookie: false,
  pathnames: {
    '/': '/',
    '/carta': { es: '/carta', en: '/menu' },
    '/contacto': { es: '/contacto', en: '/contact' },
    '/aviso-legal': { es: '/aviso-legal', en: '/legal-notice' },
    '/privacidad': { es: '/privacidad', en: '/privacy' },
    '/cookies': { es: '/cookies', en: '/cookies' },
  },
});

export type Locale = (typeof routing.locales)[number];
export type Pagina = keyof typeof routing.pathnames;

/** Comprueba si un texto es uno de nuestros idiomas. */
export function esLocale(valor: string): valor is Locale {
  return (routing.locales as readonly string[]).includes(valor);
}
