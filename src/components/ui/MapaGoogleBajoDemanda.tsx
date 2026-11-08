'use client';

// Mapa de Google que SOLO se carga si el usuario lo pide.
// Mientras no se pulsa el botón, el navegador no contacta con Google: así la web
// no instala cookies de terceros sin consentimiento y no necesita banner.
// Antes de cargarlo se muestra un marco del mismo tamaño que el mapa, con la
// dirección y el botón, para que la página no "salte" al aparecer.
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { negocio } from '@/content/negocio';
import { urlMapaIncrustado } from '@/lib/mapas';
import styles from './MapaGoogleBajoDemanda.module.css';

export function MapaGoogleBajoDemanda() {
  const t = useTranslations('inicio.visitanos');
  const tPie = useTranslations('footer');
  const [cargado, setCargado] = useState(false);

  if (cargado) {
    return (
      <iframe
        className={styles.marco}
        src={urlMapaIncrustado()}
        title={t('mapaTitulo')}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    );
  }

  return (
    <div className={`${styles.marco} ${styles.espera}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- icono decorativo pequeño */}
      <img src="/logo/sello-color.svg" alt="" aria-hidden="true" width={72} height={72} />
      <p className={styles.direccion}>
        {negocio.direccion.calle} · {negocio.direccion.ciudad}
      </p>
      <button type="button" className={styles.boton} onClick={() => setCargado(true)}>
        {t('cargarMapa')}
      </button>
      <p className={styles.nota}>
        {t('avisoMapa')} <Link href="/cookies">{tPie('cookies')}</Link>
      </p>
    </div>
  );
}
