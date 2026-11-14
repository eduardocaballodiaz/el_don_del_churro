// CATEGORÍAS DE LA CARTA INTERACTIVA ("Lo nuestro", en la página de inicio).
// Cada una agrupa los productos de una sección de src/content/carta.ts.
// Los títulos y textos están en messages/*.json → inicio.productos.categorias.
import type { ImagenId } from './imagenes';

export type CategoriaId = 'churros' | 'cafe' | 'toppings' | 'caprichos';

export const CATEGORIAS: { id: CategoriaId; seccionCarta: string; imagen: ImagenId }[] = [
  { id: 'churros', seccionCarta: 'Los de siempre', imagen: 'finos' },
  { id: 'cafe', seccionCarta: 'El momento café', imagen: 'finosCafe' },
  { id: 'toppings', seccionCarta: 'Crea tu experiencia', imagen: 'finosChocolate' },
  { id: 'caprichos', seccionCarta: 'Los caprichos del Don', imagen: 'latas' },
];
