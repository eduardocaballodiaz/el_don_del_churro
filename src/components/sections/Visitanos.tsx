// VISÍTANOS: dirección, horario, "Cómo llegar" y el mapa de Google (directo si se aceptan sus cookies).
import { useLocale, useTranslations } from 'next-intl';
import { Reveal } from '@/animations/Reveal';
import { Button } from '@/components/ui/Button';
import { MapaGoogle } from '@/components/ui/MapaGoogle';
import { formatearHorario, negocio } from '@/content/negocio';
import type { Locale } from '@/i18n/routing';
import { urlComoLlegar } from '@/lib/mapas';
import s from './seccion.module.css';
import styles from './Visitanos.module.css';

export function Visitanos() {
  const t = useTranslations('inicio.visitanos');
  const tPie = useTranslations('footer');
  const locale = useLocale() as Locale;
  const { calle, codigoPostal, ciudad } = negocio.direccion;

  return (
    <section id="visitanos" className={s.seccion} aria-labelledby="titulo-visitanos">
      <div className={`contenedor ${styles.rejilla}`}>
        <div>
          <Reveal as="p" className={s.etiqueta}>
            {t('etiqueta')}
          </Reveal>
          <Reveal>
            <h2 id="titulo-visitanos" className={s.titulo}>
              {t('titulo')}
            </h2>
          </Reveal>
          <Reveal className={styles.datos}>
            <div>
              <h3 className={styles.subtitulo}>{t('direccion')}</h3>
              <address>
                {calle}
                <br />
                {[codigoPostal, ciudad].filter(Boolean).join(' ')}
              </address>
            </div>
            <div>
              <h3 className={styles.subtitulo}>{t('horario')}</h3>
              <ul>
                {!negocio.horario.dias && <li>{tPie('diasPendientes')}</li>}
                {formatearHorario(negocio.horario, locale).map((linea) => (
                  <li key={linea}>{linea}</li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal className={styles.acciones}>
            <Button href={urlComoLlegar()} externo variante="oliva">
              {t('comoLlegar')} ↗
            </Button>
          </Reveal>
        </div>

        <Reveal className={styles.mapa}>
          <MapaGoogle />
        </Reveal>
      </div>
    </section>
  );
}
