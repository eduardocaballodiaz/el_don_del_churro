// Botón con forma de enlace, en las variantes de la marca.
// - 'oro': relleno dorado (acción principal)
// - 'contorno': borde dorado sobre fondo oscuro
// - 'oliva': relleno verde oliva sobre fondo claro
import type { ComponentProps, ReactNode } from 'react';
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
  const clases = `${styles.boton} ${styles[variante]} ${className ?? ''}`;
  if (props.externo) {
    return (
      <a href={props.href} className={clases} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={props.href} className={clases}>
      {children}
    </Link>
  );
}
