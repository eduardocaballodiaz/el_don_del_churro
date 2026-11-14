'use client';

// BANNER DE COOKIES
// Aparece en la primera visita (y cuando se pulsa "Configurar cookies" en el pie).
// "Aceptar" y "Rechazar" tienen el mismo tamaño y estilo: así lo exige la AEPD.
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { guardarDecision, suscribirAbrir, useConsentimiento, type Decision } from '@/lib/consentimiento';
import styles from './BannerCookies.module.css';

export function BannerCookies() {
  const t = useTranslations('consentimiento');
  const estado = useConsentimiento();
  const [reabierto, setReabierto] = useState(false);

  useEffect(() => suscribirAbrir(() => setReabierto(true)), []);

  if (estado === 'cargando') return null; // en el servidor aún no se sabe
  if (estado !== 'pendiente' && !reabierto) return null;

  const decidir = (d: Decision) => {
    guardarDecision(d);
    setReabierto(false);
  };

  return (
    <section className={styles.banner} role="region" aria-label={t('titulo')}>
      <p className={styles.texto}>
        {t('texto')} <Link href="/cookies">{t('masInfo')}</Link>
      </p>
      <div className={styles.botones}>
        <button type="button" className={styles.boton} onClick={() => decidir('rechazado')}>
          {t('rechazar')}
        </button>
        <button type="button" className={styles.boton} onClick={() => decidir('aceptado')}>
          {t('aceptar')}
        </button>
      </div>
    </section>
  );
}
