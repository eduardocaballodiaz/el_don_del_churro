'use client';

// Botón con forma de enlace, en las variantes de la marca.
// - 'oro': relleno dorado (acción principal)
// - 'contorno': borde dorado sobre fondo oscuro
// - 'oliva': relleno verde oliva sobre fondo claro
// Con ratón, el botón es "magnético": se acerca un poco al cursor.
import { useRef, type ComponentProps, type ReactNode } from 'react';
import { useMagnetic } from '@/animations/useMagnetic';
import { Link } from '@/i18n/navigation';
import styles from './Button.module.css';

type Variante = 'oro' | 'contorno' | 'oliva';

type PropsInterno = { href: ComponentProps<typeof Link>['href']; externo?: false };
type PropsExterno = { href: string; externo: true };

type Props = (PropsInterno | PropsExterno) & {
  variante?: Variante;
  children: ReactNode;
  className?: string;
};

export function Button({ variante = 'oro', children, className, ...props }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  useMagnetic(ref);
  const clases = `${styles.boton} ${styles[variante]} ${className ?? ''}`;
  if (props.externo) {
    return (
      <a ref={ref} href={props.href} className={clases} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link ref={ref} href={props.href} className={clases}>
      {children}
    </Link>
  );
}
