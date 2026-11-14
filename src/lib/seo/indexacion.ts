// ¿Pueden los buscadores indexar la web?
// Solo cuando la variable de entorno PERMITIR_INDEXAR vale "1", que se activa en
// Netlify el día del lanzamiento en eldondelchurro.com. Hasta entonces, la web de
// pruebas (*.netlify.app) no aparece en Google con datos a medias.
export function indexacionPermitida(): boolean {
  return process.env.PERMITIR_INDEXAR === '1';
}
