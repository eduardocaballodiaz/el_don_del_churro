// QUÉ FALTA PARA PUBLICAR
// -----------------------
// Revisa los datos de la web y devuelve, en texto legible, todo lo que falta
// para poder publicarla en eldondelchurro.com. Lo usa
// `npm run comprobar-lanzamiento`, que se niega a dar el visto bueno mientras
// esta lista no esté vacía.
//
// Para aprobar un bloque de textos de messages/*.json, se cambia su
// "_estado" de "borrador" a "aprobado".
import { carta } from './carta';
import { negocio } from './negocio';
import mensajesEs from '../../messages/es.json';
import mensajesEn from '../../messages/en.json';

/** ¿Queda algún bloque de textos marcado con "_estado": "borrador"? */
function hayBorradores(nodo: unknown): boolean {
  if (!nodo || typeof nodo !== 'object') return false;
  const obj = nodo as Record<string, unknown>;
  if (obj._estado === 'borrador') return true;
  return Object.values(obj).some(hayBorradores);
}

export function datosPendientes(): string[] {
  const pendientes: string[] = [];

  if (carta.length === 0) pendientes.push('La carta (productos, descripciones y precios)');
  const sinPrecio = carta
    .filter((p) => p.precio === null && !p.variantes?.length)
    .map((p) => p.nombre.es);
  if (sinPrecio.length > 0) pendientes.push(`Precios pendientes en la carta: ${sinPrecio.join(', ')}`);
  const sinAlergenos = carta.filter((p) => p.alergenos === null).map((p) => p.nombre.es);
  if (sinAlergenos.length > 0)
    pendientes.push(`Alérgenos pendientes en la carta: ${sinAlergenos.join(', ')}`);
  if (!negocio.titular) pendientes.push('Datos legales del titular (nombre, NIF y domicilio)');
  if (!negocio.horario.dias) pendientes.push('Días de apertura');
  if (!negocio.direccion.codigoPostal) pendientes.push('Código postal de la dirección');
  if (hayBorradores(mensajesEs) || hayBorradores(mensajesEn))
    pendientes.push('Textos sin aprobar por Edu (bloques con "_estado": "borrador" en messages/)');

  return pendientes;
}
