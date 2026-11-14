// Enlaces a Google Maps a partir de la dirección de src/content/negocio.ts.
// Son enlaces normales: no cargan nada de Google hasta que el usuario los pulsa.
import { negocio } from '@/content/negocio';

function direccionCompleta(): string {
  const { calle, codigoPostal, ciudad } = negocio.direccion;
  return [calle, codigoPostal, ciudad].filter(Boolean).join(', ');
}

/** Abre Google Maps con la dirección (en la app del móvil si está instalada). */
export function urlComoLlegar(): string {
  if (negocio.urlMaps) return negocio.urlMaps;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccionCompleta())}`;
}

/** Mapa de Google para incrustar. Solo se usa con el consentimiento del visitante (ver MapaGoogle). */
export function urlMapaIncrustado(): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(direccionCompleta())}&output=embed`;
}
