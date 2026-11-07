// EL DON DE LATAS: los postres en lata. (La foto que crece con el scroll llega en la Tarea 13.)
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Reveal } from '@/animations/Reveal';
import { imagenes } from '@/content/imagenes';
import type { Locale } from '@/i18n/routing';
import s from './seccion.module.css';
import styles from './Latas.module.css';

export function Latas() {
  const t = useTranslations('inicio.latas');
  const locale = useLocale() as Locale;
  const foto = imagenes.latas;
  return (
    <section id="latas" className={`${s.seccion} ${s.oliva}`} aria-labelledby="titulo-latas">
      <div className={`contenedor ${styles.rejilla}`}>
        <div className={styles.foto} data-latas-foto>
          <Image
            src={foto.src}
            alt={foto.alt[locale]}
            width={foto.ancho}
            height={foto.alto}
            sizes="(max-width: 900px) 100vw, 680px"
          />
        </div>
        <div>
          <Reveal as="p" className={s.etiqueta}>
            {t('etiqueta')}
          </Reveal>
          <Reveal>
            <h2 id="titulo-latas" className={s.titulo}>
              {t('titulo')}
            </h2>
          </Reveal>
          <Reveal as="p" className={s.texto}>
            {t('texto')}
          </Reveal>
          <Reveal as="p" className={styles.nota}>
            {t('nota')}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
