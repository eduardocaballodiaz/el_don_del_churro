// El rótulo (public/logo/rotulo.svg) como texto, para incrustarlo en la página.
// Incrustado (y no como <img>) se pueden animar sus partes con CSS: por ejemplo,
// que "EL DON DEL" se oscurezca cuando se enciende la luz LED.
// Solo se usa en el servidor: lee el archivo al compilar.
import 'server-only';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export function leerRotuloSvg(): string {
  const svg = readFileSync(join(process.cwd(), 'public/logo/rotulo.svg'), 'utf8');
  // Lo describe el contenedor (role="img"), así que el SVG se oculta a lectores de pantalla.
  return svg.replace('<svg ', '<svg aria-hidden="true" focusable="false" ');
}
