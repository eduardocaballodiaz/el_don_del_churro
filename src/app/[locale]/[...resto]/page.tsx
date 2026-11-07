// Cualquier dirección que no coincide con una página real cae aquí y muestra el 404
// del idioma correspondiente (src/app/[locale]/not-found.tsx).
import { notFound } from 'next/navigation';

export default function RutaDesconocida() {
  notFound();
}
