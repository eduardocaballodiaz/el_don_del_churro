// PRESENTACIÓN DE PRODUCTOS DEL INICIO (decidido por Edu, 14-nov-2026):
// primero Churros y, debajo, Los caprichos del Don. Cada uno es una tarjeta que
// al pulsarla despliega sus productos. El resto de la carta está en /carta.
// Los títulos y textos están en messages/*.json → inicio.productos.categorias.
import type { ImagenId } from './imagenes';

export type CategoriaId = 'churros' | 'caprichos';

export const CATEGORIAS: {
  id: CategoriaId;
  /** Ancla para enlazar desde el menú (#latas lleva a Los caprichos del Don). */
  ancla: string;
  /** Sección de src/content/carta.ts cuyos productos se despliegan. */
  seccionCarta: string;
  imagen: ImagenId;
}[] = [
  { id: 'churros', ancla: 'churros', seccionCarta: 'Churros', imagen: 'finos' },
  { id: 'caprichos', ancla: 'latas', seccionCarta: 'Los caprichos del Don', imagen: 'latasTodas' },
];
