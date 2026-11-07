'use client';

// Mapa de Google que SOLO se carga si el usuario lo pide.
// Mientras no se pulsa el botón, el navegador no contacta con Google: así la web
// no instala cookies de terceros sin consentimiento y no necesita banner.
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { urlMapaIncrustado } from '@/lib/mapas';
import styles from './MapaGoogleBajoDemanda.module.css';

export function MapaGoogleBajoDemanda() {
  const t = useTranslations('inicio.visitanos');
  const tPie = useTranslations('footer');
  const [cargado, setCargado] = useState(false);

  if (cargado) {
    return (
      <iframe
        className={styles.mapa}
        src={urlMapaIncrustado()}
        title={t('mapaTitulo')}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    );
  }

  return (
    <div className={styles.aviso}>
      <button type="button" className={styles.boton} onClick={() => setCargado(true)}>
        {t('cargarMapa')}
      </button>
      <p>
        {t('avisoMapa')} <Link href="/cookies">{tPie('cookies')}</Link>
      </p>
    </div>
  );
}
