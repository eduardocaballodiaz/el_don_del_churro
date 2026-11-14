// LOS CAPRICHOS DEL DON: los postres en lata transparente.
// Texto arriba y las cuatro latas en fila, que crecen a medida que se baja por la página.
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { CreceConScroll } from '@/animations/CreceConScroll';
import { Reveal } from '@/animations/Reveal';
import { carta } from '@/content/carta';
import { imagenes } from '@/content/imagenes';
import type { Locale } from '@/i18n/routing';
import s from './seccion.module.css';
import styles from './Latas.module.css';

export function Latas() {
  const t = useTranslations('inicio.latas');
  const locale = useLocale() as Locale;
  // Las latas salen de la carta: si se añade una, aparece aquí sola.
  const latas = carta.filter((p) => p.categoria.es === 'Los caprichos del Don' && p.imagen);

  return (
    <section id="latas" className={`${s.seccion} ${s.oliva}`} aria-labelledby="titulo-latas">
      <div className={`contenedor ${styles.cabecera}`}>
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
      </div>

      <CreceConScroll className={`contenedor ${styles.latas}`}>
        {latas.map((p) => {
          const img = imagenes[p.imagen!];
          return (
            <figure key={p.id} className={styles.lata}>
              <Image
                src={img.src}
                alt={img.alt[locale]}
                width={img.ancho}
                height={img.alto}
                sizes="(max-width: 700px) 50vw, 280px"
              />
              <figcaption>{p.nombre[locale]}</figcaption>
            </figure>
          );
        })}
      </CreceConScroll>

      <Reveal as="p" className={`contenedor ${styles.nota}`}>
        {t('nota')}
      </Reveal>
    </section>
  );
}
