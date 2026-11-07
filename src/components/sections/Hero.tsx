// PORTADA
// Titular, presentación y dos acciones, junto a una foto enmarcada con luz cálida.
// La foto se muestra a un tamaño en el que se ve nítida (las actuales son
// provisionales, de 1536 px): cuando lleguen las fotos reales se puede agrandar.
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Reveal } from '@/animations/Reveal';
import { imagenes } from '@/content/imagenes';
import type { Locale } from '@/i18n/routing';
import { urlComoLlegar } from '@/lib/mapas';
import { Button } from '@/components/ui/Button';
import styles from './Hero.module.css';

export function Hero() {
  const t = useTranslations('inicio');
  const locale = useLocale() as Locale;
  const foto = imagenes.finosChocolate;

  return (
    <section className={styles.hero} aria-labelledby="titulo-portada">
      <div className={`contenedor ${styles.rejilla}`}>
        <div className={styles.texto}>
          <Reveal as="p" className={styles.etiqueta}>
            {t('hero.etiqueta')}
          </Reveal>
          <Reveal delay={0.1}>
            <h1 id="titulo-portada" className={styles.titulo}>
              {t('titulo')}
            </h1>
          </Reveal>
          <Reveal as="p" className={styles.lede} delay={0.2}>
            {t('hero.lede')}
          </Reveal>
          <Reveal className={styles.acciones} delay={0.3}>
            <Button href="/carta" variante="oro">
              {t('hero.verCarta')}
            </Button>
            <Button href={urlComoLlegar()} externo variante="contorno">
              {t('hero.comoLlegar')}
            </Button>
          </Reveal>
        </div>

        <Reveal className={styles.foto} delay={0.15}>
          <Image
            src={foto.src}
            alt={foto.alt[locale]}
            width={foto.ancho}
            height={foto.alto}
            priority
            sizes="(max-width: 900px) 100vw, 620px"
          />
        </Reveal>
      </div>
    </section>
  );
}
