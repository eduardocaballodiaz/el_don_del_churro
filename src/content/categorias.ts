// CATEGORÍAS DE LA CARTA INTERACTIVA ("Lo nuestro", en la página de inicio).
// Cada una agrupa los productos de una sección de src/content/carta.ts.
// Los títulos y textos están en messages/*.json → inicio.productos.categorias.
import type { ImagenId } from './imagenes';

export type CategoriaId = 'churros' | 'cafe' | 'toppings' | 'caprichos' | 'tostadas' | 'crepes';

/** `imagen: null` = aún no hay foto: la tarjeta muestra el sello de la marca. */
export const CATEGORIAS: { id: CategoriaId; seccionCarta: string; imagen: ImagenId | null }[] = [
  { id: 'churros', seccionCarta: 'Churros', imagen: 'finos' },
  { id: 'cafe', seccionCarta: 'Momento café', imagen: 'finosCafe' },
  { id: 'toppings', seccionCarta: 'Crea tu experiencia', imagen: 'finosChocolate' },
  { id: 'caprichos', seccionCarta: 'Los caprichos del Don', imagen: 'lataChocolate' },
  { id: 'tostadas', seccionCarta: 'Tostadas', imagen: null },
  { id: 'crepes', seccionCarta: 'Crepes y gofres', imagen: null },
];
