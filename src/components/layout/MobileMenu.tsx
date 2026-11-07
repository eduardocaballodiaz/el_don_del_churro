'use client';

// MENÚ MÓVIL
// ----------
// Botón "Menú" que abre un panel verde oliva a pantalla completa con los enlaces
// (que entran en cascada), el selector de idioma y el botón de contacto.
//
// Accesibilidad:
// - El botón indica si el panel está abierto (aria-expanded).
// - Con el panel abierto, Tab no sale de él (trampa de foco) y Escape lo cierra,
//   devolviendo el foco al botón.
// - Sin JavaScript, el botón se sustituye por un enlace a la navegación del pie.
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ENLACE_CONTACTO, ENLACES_MENU } from './navegacion';
import styles from './MobileMenu.module.css';

const ENFOCABLES = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function MobileMenu() {
  const t = useTranslations('header');
  const [abierto, setAbierto] = useState(false);
  const botonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const cerrar = useCallback((devolverFoco = true) => {
    setAbierto(false);
    if (devolverFoco) requestAnimationFrame(() => botonRef.current?.focus());
  }, []);

  // Si cambia la página (por ejemplo, con el botón "atrás"), se cierra el panel.
  // Se compara durante el render, como recomienda React, en lugar de con un efecto.
  const [paginaAnterior, setPaginaAnterior] = useState(pathname);
  if (pathname !== paginaAnterior) {
    setPaginaAnterior(pathname);
    setAbierto(false);
  }

  useEffect(() => {
    if (!abierto) return;
    const panel = panelRef.current;
    // Mientras está abierto, la página de detrás no hace scroll.
    const overflowAnterior = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    panel?.querySelector<HTMLElement>(ENFOCABLES)?.focus();

    const alPulsarTecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        cerrar();
        return;
      }
      if (e.key !== 'Tab' || !panel) return;
      // Trampa de foco: del último elemento se vuelve al primero y viceversa.
      const elementos = Array.from(panel.querySelectorAll<HTMLElement>(ENFOCABLES));
      if (elementos.length === 0) return;
      const primero = elementos[0];
      const ultimo = elementos[elementos.length - 1];
      const actual = document.activeElement;
      if (e.shiftKey && (actual === primero || !panel.contains(actual))) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && (actual === ultimo || !panel.contains(actual))) {
        e.preventDefault();
        primero.focus();
      }
    };

    document.addEventListener('keydown', alPulsarTecla);
    return () => {
      document.removeEventListener('keydown', alPulsarTecla);
      document.documentElement.style.overflow = overflowAnterior;
    };
  }, [abierto, cerrar]);

  return (
    <>
      <button
        ref={botonRef}
        type="button"
        className={styles.boton}
        aria-label={t('menu')}
        aria-expanded={abierto}
        aria-controls="menu-movil"
        onClick={() => setAbierto(true)}
      >
        <span className={styles.lineas} aria-hidden="true" />
      </button>

      {/* Sin JavaScript: enlace a la navegación del pie de página. */}
      <a className={styles.sinJs} href="#navegacion-pie">
        {t('menu')}
      </a>

      {abierto && (
        <div
          ref={panelRef}
          id="menu-movil"
          className={styles.panel}
          role="dialog"
          aria-modal="true"
          aria-label={t('menu')}
        >
          <button type="button" className={styles.cerrar} onClick={() => cerrar()}>
            {t('cerrar')}
            <span className={styles.aspa} aria-hidden="true" />
          </button>

          <nav className={styles.nav} aria-label={t('navegacion')}>
            {[...ENLACES_MENU, ENLACE_CONTACTO].map(({ clave, href }, i) => (
              <Link
                key={clave}
                href={href}
                className={styles.enlace}
                style={{ animationDelay: `${80 + i * 70}ms` }}
                onClick={() => cerrar(false)}
              >
                {t(clave)}
              </Link>
            ))}
          </nav>

          <LanguageSwitcher className={styles.idioma} />
        </div>
      )}
    </>
  );
}
