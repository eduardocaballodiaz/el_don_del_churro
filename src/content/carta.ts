// LA CARTA
// --------
// Edu la está preparando aparte. Cuando la entregue, se rellena la lista
// `carta` y no hace falta tocar ningún componente.
//
// Ejemplo de producto:
// {
//   id: 'finos-racion',
//   categoria: { es: 'Churros', en: 'Churros' },
//   nombre: { es: 'Ración de finos', en: 'Thin churros' },
//   descripcion: { es: '…', en: '…' },
//   precio: 2.5,            // en euros; null si no se quiere mostrar
//   imagen: 'finos',        // opcional, un id de src/content/imagenes.ts
// }
import type { Locale } from '@/i18n/routing';
import type { ImagenId } from './imagenes';

export type Producto = {
  id: string;
  /** Sección de la carta en la que aparece (en los dos idiomas). */
  categoria: Record<Locale, string>;
  nombre: Record<Locale, string>;
  descripcion: Record<Locale, string>;
  precio: number | null;
  imagen?: ImagenId;
};

export const carta: Producto[] = [];

const FORMATOS: Record<Locale, Intl.NumberFormat> = {
  es: new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }),
  en: new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'EUR' }),
};

/** Precio en euros con el formato de cada idioma: 2,50 € (ES) o €2.50 (EN). */
export function formatearPrecio(euros: number, locale: Locale): string {
  // Intl usa un espacio irrompible antes de "€" en español: lo normalizamos a uno normal.
  return FORMATOS[locale].format(euros).replace(/ /g, ' ');
}
