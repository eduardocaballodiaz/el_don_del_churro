// LA CASA: por qué el churro se sirve recién hecho. (Texto en borrador hasta que Edu lo apruebe.)
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Reveal } from '@/animations/Reveal';
import s from './seccion.module.css';
import styles from './Nosotros.module.css';

export function Nosotros() {
  const t = useTranslations('inicio.nosotros');
  return (
    <section id="nosotros" className={s.seccion} aria-labelledby="titulo-nosotros">
      <div className={`contenedor ${styles.centro}`}>
        <Image className={styles.sello} src="/logo/sello-color.svg" alt="" aria-hidden="true" width={96} height={96} unoptimized />
        <Reveal as="p" className={s.etiqueta}>
          {t('etiqueta')}
        </Reveal>
        <Reveal>
          <h2 id="titulo-nosotros" className={`${s.titulo} ${styles.titulo}`}>
            {t('titulo')}
          </h2>
        </Reveal>
        <Reveal as="p" className={`${s.texto} ${styles.texto}`}>
          {t('texto')}
        </Reveal>
      </div>
    </section>
  );
}
