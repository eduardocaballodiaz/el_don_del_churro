// Enlaces del menú principal. Se comparten entre el encabezado de escritorio,
// el menú móvil y el pie de página, para que nunca se desincronicen.
// `clave` es el texto en messages/*.json → header.<clave>.
export const ENLACES_MENU = [
  { clave: 'carta', href: { pathname: '/carta' } },
  { clave: 'latas', href: { pathname: '/', hash: 'latas' } },
  { clave: 'nosotros', href: { pathname: '/', hash: 'nosotros' } },
] as const;

export const ENLACE_CONTACTO = { clave: 'contacto', href: { pathname: '/contacto' } } as const;
