// QUÉ FALTA PARA PUBLICAR
// -----------------------
// Revisa los datos de la web y devuelve, en texto legible, todo lo que falta
// para poder publicarla en eldondelchurro.com. Lo usa
// `npm run comprobar-lanzamiento`, que se niega a dar el visto bueno mientras
// esta lista no esté vacía.
import { carta } from './carta';
import { negocio } from './negocio';

export function datosPendientes(): string[] {
  const pendientes: string[] = [];

  if (carta.length === 0) pendientes.push('La carta (productos, descripciones y precios)');
  if (!negocio.titular) pendientes.push('Datos legales del titular (nombre, NIF y domicilio)');
  if (!negocio.horario.dias) pendientes.push('Días de apertura');
  if (!negocio.direccion.codigoPostal) pendientes.push('Código postal de la dirección');

  return pendientes;
}
