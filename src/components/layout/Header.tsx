'use client';

// ENCABEZADO (opción B de la maqueta, inspirado en el rótulo de la fachada)
// -------------------------------------------------------------------------
// - Banda verde oliva con textura y tira LED cálida en el borde inferior.
// - Rótulo "EL DON DEL / CHURRO" como en la caja de la marca, a la izquierda: al pasar el cursor
//   crece y se ilumina por detrás con luz LED, sin parpadeo (Header.module.css).
// - Menú, selector de idioma y botón de contacto a la derecha.
// - Al bajar por la página se compacta (menos alto, logo más pequeño).
// - En pantallas estrechas el menú pasa a un panel a pantalla completa (MobileMenu).
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MobileMenu } from './MobileMenu';
import { OlaDorada } from './OlaDorada';
import { ENLACE_CONTACTO, ENLACES_MENU } from './navegacion';
import styles from './Header.module.css';

/** A partir de cuántos píxeles de scroll se compacta el encabezado. */
const UMBRAL_COMPACTO = 80;

export function Header() {
  const t = useTranslations('header');
  const [compacto, setCompacto] = useState(false);

  useEffect(() => {
    // requestAnimationFrame evita recalcular más de una vez por fotograma.
    let pendiente = false;
    const actualizar = () => {
      pendiente = false;
      setCompacto(window.scrollY > UMBRAL_COMPACTO);
    };
    const alHacerScroll = () => {
      if (!pendiente) {
        pendiente = true;
        requestAnimationFrame(actualizar);
      }
    };
    actualizar();
    window.addEventListener('scroll', alHacerScroll, { passive: true });
    return () => window.removeEventListener('scroll', alHacerScroll);
  }, []);

  return (
    <header className={`${styles.rotulo} ${compacto ? styles.compacto : ''}`}>
      <div className={styles.interior}>
        {/* El rótulo de la marca: "— EL DON DEL — / CHURRO / — CHURRERÍA —".
            Vectorizado del diseño de la caja (public/logo/rotulo.svg). */}
        <Link href="/" className={styles.logo} aria-label={t('inicio')}>
          <Image src="/logo/rotulo.svg" alt="" width={2430} height={1026} priority unoptimized />
          <span className={styles.churreria} aria-hidden="true">
            Churrería
          </span>
        </Link>

        <div className={styles.derecha}>
          <nav className={styles.nav} aria-label={t('navegacion')}>
            {ENLACES_MENU.map(({ clave, href }) => (
              <Link key={clave} href={href} className={styles.enlace}>
                {t(clave)}
                <OlaDorada className={styles.ola} />
              </Link>
            ))}
          </nav>
          <LanguageSwitcher className={styles.idioma} />
          <Link href={ENLACE_CONTACTO.href} className={styles.boton}>
            {t(ENLACE_CONTACTO.clave)}
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
