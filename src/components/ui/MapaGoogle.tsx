'use client';

// MAPA DE GOOGLE
// Aparece directamente si el visitante ha aceptado las cookies del banner.
// Si no (o mientras no ha decidido), se muestra un marco del mismo tamaño con el
// sello, la dirección y un botón para mostrarlo, que equivale a aceptar.
import { useTranslations } from 'next-intl';
import { negocio } from '@/content/negocio';
import { urlMapaIncrustado } from '@/lib/mapas';
import { guardarDecision, useConsentimiento } from '@/lib/consentimiento';
import styles from './MapaGoogle.module.css';

export function MapaGoogle() {
  const t = useTranslations('inicio.visitanos');
  const tC = useTranslations('consentimiento');
  const estado = useConsentimiento();

  if (estado === 'aceptado') {
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
      {estado !== 'cargando' && (
        <>
          <p className={styles.nota}>{tC('mapaBloqueado')}</p>
          <button type="button" className={styles.boton} onClick={() => guardarDecision('aceptado')}>
            {tC('activarMapa')}
          </button>
        </>
      )}
    </div>
  );
}
