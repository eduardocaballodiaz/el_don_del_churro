// Tarjeta de producto: foto, nombre y descripción.
// Con ratón, se inclina siguiendo al cursor y un brillo dorado lo acompaña.
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { Inclinable } from '@/animations/Inclinable';
import { imagenes, type ImagenId } from '@/content/imagenes';
import type { Locale } from '@/i18n/routing';
import styles from './ProductCard.module.css';

type Props = {
  imagen: ImagenId;
  titulo: string;
  texto: string;
  /** Contenido extra al pie de la tarjeta (por ejemplo, el precio en la carta). */
  pie?: React.ReactNode;
};

export function ProductCard({ imagen, titulo, texto, pie }: Props) {
  const locale = useLocale() as Locale;
  const img = imagenes[imagen];
  return (
    <Inclinable className={styles.inclinable}>
      <article className={styles.tarjeta}>
        <div className={styles.foto}>
          <Image
            src={img.src}
            alt={img.alt[locale]}
            width={img.ancho}
            height={img.alto}
            sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 400px"
          />
        </div>
        <div className={styles.cuerpo}>
          <h3 className={styles.titulo}>{titulo}</h3>
          <p className={styles.texto}>{texto}</p>
          {pie}
        </div>
      </article>
    </Inclinable>
  );
}
