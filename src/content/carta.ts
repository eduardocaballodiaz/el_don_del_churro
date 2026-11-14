// LA CARTA
// --------
// Carta según el documento de Edu (Carta/Carta El Don del Churro.docx, 14-nov-2026).
// Lo que aún no sabemos vale null: precios y alérgenos. Mientras falte alguno,
// `npm run comprobar-lanzamiento` no deja publicar.
//
// Ejemplo de producto:
// {
//   id: 'finos-racion',
//   categoria: { es: 'Churros', en: 'Churros' },
//   nombre: { es: 'Ración de finos', en: 'Thin churros' },
//   descripcion: { es: '…', en: '…' },
//   precio: 2.5,            // en euros; null si aún no se sabe
//   suplemento: true,       // opcional: se muestra "+0,50 €" (toppings)
//   variantes: [...]        // opcional: tamaños con su precio (entonces precio: null)
//   alergenos: ['gluten'],  // de src/content/alergenos.ts; [] = ninguno; null = pendiente
//   imagen: 'finos',        // opcional, un id de src/content/imagenes.ts
// }
import type { Locale } from '@/i18n/routing';
import type { Alergeno } from './alergenos';
import type { ImagenId } from './imagenes';

/** Un tamaño o formato de un producto, con su precio. */
export type Variante = { nombre: Record<Locale, string>; precio: number };

export type Producto = {
  id: string;
  /** Sección de la carta en la que aparece (en los dos idiomas). */
  categoria: Record<Locale, string>;
  nombre: Record<Locale, string>;
  descripcion: Record<Locale, string>;
  precio: number | null;
  /** Se cobra como añadido a otro producto (se muestra con "+" delante). */
  suplemento?: boolean;
  /** Tamaños o formatos con su propio precio (pequeño/mediano/grande, media/entera…). */
  variantes?: Variante[];
  /** Alérgenos que contiene. [] = ninguno; null = pendiente de que Edu los confirme. */
  alergenos: Alergeno[] | null;
  imagen?: ImagenId;
};

// --- Ayudas para no repetir lo mismo en cada producto ---
const SECCION = {
  churros: { es: 'Churros', en: 'Churros' },
  cafe: { es: 'Momento café', en: 'Coffee time' },
  toppings: { es: 'Crea tu experiencia', en: 'Make it yours' },
  caprichos: { es: 'Los caprichos del Don', en: 'Los caprichos del Don' },
  tostadas: { es: 'Tostadas', en: 'Toast' },
  crepes: { es: 'Crepes y gofres', en: 'Crêpes & waffles' },
} as const;

/** Todas las bebidas de "Momento café" se venden en tres tamaños al mismo precio. */
const TAMANOS_CAFE: Variante[] = [
  { nombre: { es: 'Pequeño', en: 'Small' }, precio: 1.5 },
  { nombre: { es: 'Mediano', en: 'Medium' }, precio: 1.8 },
  { nombre: { es: 'Grande', en: 'Large' }, precio: 2.5 },
];

const media = (precio: number): Variante => ({ nombre: { es: 'Media', en: 'Half' }, precio });
const entera = (precio: number): Variante => ({ nombre: { es: 'Entera', en: 'Whole' }, precio });

const SIN_DESCRIPCION = { es: '', en: '' };

export const carta: Producto[] = [
  // --- Churros (ración de 5 o unidad) ---
  {
    id: 'churros-rueda',
    categoria: SECCION.churros,
    nombre: { es: 'De rueda (5 uds)', en: 'Churro wheel (5 pcs)' },
    descripcion: { es: 'La tradición en cada vuelta.', en: 'Tradition in every turn.' },
    precio: 3,
    alergenos: null,
    imagen: 'rueda',
  },
  {
    id: 'churros-finos',
    categoria: SECCION.churros,
    nombre: { es: 'Finos (5 uds)', en: 'Thin churros (5 pcs)' },
    descripcion: { es: 'Dorados, crujientes y recién hechos.', en: 'Golden, crisp and freshly made.' },
    precio: 3,
    alergenos: null,
    imagen: 'finos',
  },
  {
    id: 'churros-rellenos',
    categoria: SECCION.churros,
    nombre: { es: 'Rellenos (1 ud)', en: 'Filled churro (1 pc)' },
    descripcion: SIN_DESCRIPCION, // pendiente: de qué van rellenos
    precio: 3,
    alergenos: null,
  },

  // --- Momento café (tres tamaños) ---
  ...(
    [
      ['espresso', 'Espresso', 'Espresso'],
      ['cafe-con-leche', 'Café con leche', 'Café con leche (milky coffee)'],
      ['latte', 'Latte', 'Latte'],
      ['chocolate-caliente', 'Chocolate caliente', 'Hot chocolate'],
      ['cortado', 'Cortado', 'Cortado'],
      ['capuchino', 'Capuchino', 'Cappuccino'],
      ['caramel-macchiato', 'Caramel macchiato', 'Caramel macchiato'],
    ] as const
  ).map(
    ([id, es, en]): Producto => ({
      id,
      categoria: SECCION.cafe,
      nombre: { es, en },
      descripcion: SIN_DESCRIPCION,
      precio: null,
      variantes: TAMANOS_CAFE,
      alergenos: null,
    }),
  ),

  // --- Crea tu experiencia: toppings para los churros (+0,50 € cada uno) ---
  ...(
    [
      ['topping-nutella', 'Nutella', 'Nutella'],
      ['topping-pistacho', 'Pistacho', 'Pistachio'],
      ['topping-chocolate-blanco', 'Chocolate blanco', 'White chocolate'],
      ['topping-kinder', 'Kinder', 'Kinder'],
    ] as const
  ).map(
    ([id, es, en]): Producto => ({
      id,
      categoria: SECCION.toppings,
      nombre: { es, en },
      descripcion: { es: 'Topping para tus churros.', en: 'Topping for your churros.' },
      precio: 0.5,
      suplemento: true,
      alergenos: null,
    }),
  ),

  // --- Los caprichos del Don: postres en lata transparente (precios pendientes) ---
  {
    id: 'lata-pistacho',
    categoria: SECCION.caprichos,
    nombre: { es: 'Pistacho', en: 'Pistachio' },
    descripcion: { es: 'Puro capricho verde.', en: 'A pure green indulgence.' },
    precio: null,
    alergenos: null,
    imagen: 'lataPistacho',
  },
  {
    id: 'lata-tarta-abuela',
    categoria: SECCION.caprichos,
    nombre: { es: 'Tarta de la abuela', en: "Grandma's cake" },
    descripcion: { es: 'La tarta de toda la vida, por capas.', en: 'The classic Spanish layered cake.' },
    precio: null,
    alergenos: null,
    imagen: 'lataTartaAbuela',
  },
  {
    id: 'lata-chocolate',
    categoria: SECCION.caprichos,
    nombre: { es: 'Chocolate', en: 'Chocolate' },
    descripcion: { es: 'Para los que nunca tienen suficiente.', en: 'For those who never get enough.' },
    precio: null,
    alergenos: null,
    imagen: 'lataChocolate',
  },
  {
    id: 'lata-tarta-queso',
    categoria: SECCION.caprichos,
    nombre: { es: 'Tarta de queso', en: 'Cheesecake' },
    descripcion: { es: 'Cremosa, por capas.', en: 'Creamy, in layers.' },
    precio: null,
    alergenos: null,
    imagen: 'lataTartaQueso',
  },

  // --- Tostadas (media o entera) ---
  {
    id: 'tostada-simple',
    categoria: SECCION.tostadas,
    nombre: { es: 'Simple', en: 'Plain' },
    descripcion: SIN_DESCRIPCION,
    precio: null,
    variantes: [media(1.5), entera(2.5)],
    alergenos: null,
  },
  {
    id: 'tostada-jamon',
    categoria: SECCION.tostadas,
    nombre: { es: 'Jamón', en: 'Ham' },
    descripcion: SIN_DESCRIPCION,
    precio: null,
    variantes: [media(2.5), entera(3.5)],
    alergenos: null,
  },

  // --- Crepes y gofres (un topping incluido; extra +0,50 €) ---
  ...(
    [
      ['crepes', 'Crepes', 'Crêpes'],
      ['gofres', 'Gofres', 'Waffles'],
    ] as const
  ).map(
    ([id, es, en]): Producto => ({
      id,
      categoria: SECCION.crepes,
      nombre: { es, en },
      descripcion: {
        es: 'Con un topping incluido. Topping extra: +0,50 €.',
        en: 'One topping included. Extra topping: +€0.50.',
      },
      precio: 4,
      alergenos: null,
    }),
  ),
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
