'use client';

// CURSOR DORADO: un punto de luz que sigue al ratón con suavidad y crece sobre
// los elementos que se pueden pulsar. El cursor normal del sistema se mantiene
// (accesibilidad). Solo con ratón y sin movimiento reducido.
import { useEffect, useRef } from 'react';
import { gsap } from './gsap';
import { usePunteroFino } from './usePunteroFino';
import { useReducedMotion } from './useReducedMotion';
import styles from './CustomCursor.module.css';

const INTERACTIVOS = 'a, button, input, textarea, label, [data-inclinable]';

export function CustomCursor() {
  const raton = usePunteroFino();
  const reducido = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const x = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3.out' });
    const y = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' });

    const mover = (e: PointerEvent) => {
      x(e.clientX);
      y(e.clientY);
      el.dataset.visible = 'true';
      const sobre = (e.target as Element | null)?.closest?.(INTERACTIVOS);
      el.dataset.grande = sobre ? 'true' : 'false';
    };
    const salir = () => (el.dataset.visible = 'false');
    window.addEventListener('pointermove', mover);
    document.documentElement.addEventListener('pointerleave', salir);
    return () => {
      window.removeEventListener('pointermove', mover);
      document.documentElement.removeEventListener('pointerleave', salir);
    };
  }, [raton, reducido]);

  if (!raton || reducido) return null;
  return <div ref={ref} className={styles.cursor} data-cursor aria-hidden="true" />;
}
