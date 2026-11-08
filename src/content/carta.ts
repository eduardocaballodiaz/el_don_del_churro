// LA CARTA
// --------
// Productos sacados del boceto de carta de Edu (7-nov-2026). Los precios están
// pendientes (null) hasta que Edu los dé; mientras falte alguno,
// `npm run comprobar-lanzamiento` no deja publicar.
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

export const carta: Producto[] = [
  // --- Los de siempre ---
  {
    id: 'churros-finos',
    categoria: { es: 'Los de siempre', en: 'The classics' },
    nombre: { es: 'Ración de churros finos', en: 'Thin churros (portion)' },
    descripcion: { es: 'Dorados, crujientes y recién hechos.', en: 'Golden, crisp and freshly made.' },
    precio: null,
    imagen: 'finos',
  },
  {
    id: 'churros-rueda',
    categoria: { es: 'Los de siempre', en: 'The classics' },
    nombre: { es: 'Ración de rueda', en: 'Churro wheel (portion)' },
    descripcion: { es: 'La tradición en cada vuelta.', en: 'Tradition in every turn.' },
    precio: null,
    imagen: 'rueda',
  },

  // --- El momento café ---
  ...(
    [
      ['espresso', 'Espresso', 'Espresso'],
      ['cortado', 'Cortado', 'Cortado'],
      ['cafe-con-leche', 'Café con leche', 'Café con leche (milky coffee)'],
      ['capuchino', 'Capuchino', 'Cappuccino'],
      ['latte', 'Latte', 'Latte'],
      ['caramel-macchiato', 'Caramel macchiato', 'Caramel macchiato'],
    ] as const
  ).map(([id, es, en]) => ({
    id,
    categoria: { es: 'El momento café', en: 'Coffee time' },
    nombre: { es, en },
    descripcion: { es: '', en: '' },
    precio: null,
  })),
  {
    id: 'chocolate-caliente',
    categoria: { es: 'El momento café', en: 'Coffee time' },
    nombre: { es: 'Chocolate caliente', en: 'Hot chocolate' },
    descripcion: { es: 'Espeso, para mojar sin prisa.', en: 'Thick, for slow dipping.' },
    precio: null,
  },

  // --- Crea tu experiencia: toppings para los churros ---
  ...(
    [
      ['topping-chocolate', 'Chocolate', 'Chocolate'],
      ['topping-chocolate-blanco', 'Chocolate blanco', 'White chocolate'],
      ['topping-kinder', 'Kinder', 'Kinder'],
      ['topping-pistacho', 'Pistacho', 'Pistachio'],
      ['topping-oreo', 'Oreo', 'Oreo'],
      ['topping-lotus', 'Galleta Lotus', 'Lotus biscuit'],
    ] as const
  ).map(([id, es, en]) => ({
    id,
    categoria: { es: 'Crea tu experiencia', en: 'Make it yours' },
    nombre: { es, en },
    descripcion: { es: 'Topping para tus churros.', en: 'Topping for your churros.' },
    precio: null,
  })),

  // --- Los caprichos del Don: postres en lata transparente ---
  {
    id: 'lata-pistacho',
    categoria: { es: 'Los caprichos del Don', en: 'Los caprichos del Don' },
    nombre: { es: 'Pistacho', en: 'Pistachio' },
    descripcion: { es: 'Puro capricho verde.', en: 'A pure green indulgence.' },
    precio: null,
    imagen: 'latas',
  },
  {
    id: 'lata-chocolate',
    categoria: { es: 'Los caprichos del Don', en: 'Los caprichos del Don' },
    nombre: { es: 'Chocolate', en: 'Chocolate' },
    descripcion: { es: 'Para los que nunca tienen suficiente.', en: 'For those who never get enough.' },
    precio: null,
  },
  {
    id: 'lata-galleta',
    categoria: { es: 'Los caprichos del Don', en: 'Los caprichos del Don' },
    nombre: { es: 'Galleta', en: 'Biscuit' },
    descripcion: { es: 'Crujiente, cremosa e irresistible.', en: 'Crunchy, creamy and irresistible.' },
    precio: null,
  },
  {
    id: 'lata-tarta',
    categoria: { es: 'Los caprichos del Don', en: 'Los caprichos del Don' },
    nombre: { es: 'Tarta', en: 'Cake' },
    descripcion: {
      es: 'Nuestros sabores de tarta favoritos, en un formato original y delicioso.',
      en: 'Our favourite cake flavours, in an original and delicious format.',
    },
    precio: null,
  },
];

const FORMATOS: Record<Locale, Intl.NumberFormat> = {
  es: new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }),
  en: new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'EUR' }),
};

/** Precio en euros con el formato de cada idioma: 2,50 € (ES) o €2.50 (EN). */
export function formatearPrecio(euros: number, locale: Locale): string {
  // Intl usa un espacio irrompible antes de "€" en español: lo normalizamos a uno normal.
  return FORMATOS[locale].format(euros).replace(/ /g, ' ');
}
