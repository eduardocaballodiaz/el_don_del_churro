'use client';

// Efecto "magnético": el elemento se acerca un poco al cursor cuando pasa cerca
// y vuelve a su sitio con suavidad al salir. Solo con ratón y sin movimiento reducido.
import { useEffect, type RefObject } from 'react';
import { gsap } from './gsap';
import { usePunteroFino } from './usePunteroFino';
import { useReducedMotion } from './useReducedMotion';

export function useMagnetic(ref: RefObject<HTMLElement | null>, fuerza = 0.3) {
  const raton = usePunteroFino();
  const reducido = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !raton || reducido) return;
    const x = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    const y = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });

    const mover = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x((e.clientX - (r.left + r.width / 2)) * fuerza);
      y((e.clientY - (r.top + r.height / 2)) * fuerza);
    };
    const salir = () => {
      x(0);
      y(0);
    };
    el.addEventListener('pointermove', mover);
    el.addEventListener('pointerleave', salir);
    return () => {
      el.removeEventListener('pointermove', mover);
      el.removeEventListener('pointerleave', salir);
      gsap.killTweensOf(el);
      gsap.set(el, { clearProps: 'x,y,transform' });
    };
  }, [ref, fuerza, raton, reducido]);
}
