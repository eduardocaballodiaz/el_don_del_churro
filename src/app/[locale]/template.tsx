// TRANSICIÓN ENTRE PÁGINAS
// Next.js vuelve a montar este "template" en cada navegación: el contenido entra
// con un fundido suave. El encabezado y el pie (en el layout) no se mueven.
import type { ReactNode } from 'react';

export default function Transicion({ children }: { children: ReactNode }) {
  return <div className="transicion-pagina">{children}</div>;
}
