'use client';

// Inclinación 3D sutil que sigue al cursor, con un brillo dorado que se mueve
// con él (variables CSS --brillo-x / --brillo-y). Solo con ratón y sin movimiento reducido.
import { useEffect, type RefObject } from 'react';
import { gsap } from './gsap';
import { usePunteroFino } from './usePunteroFino';
import { useReducedMotion } from './useReducedMotion';

export function useTilt(ref: RefObject<HTMLElement | null>, maxGrados = 6) {
  const raton = usePunteroFino();
  const reducido = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !raton || reducido) return;
    gsap.set(el, { transformPerspective: 900 });
    const rotX = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3.out' });
    const rotY = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3.out' });

    const mover = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width; // 0 (izquierda) → 1 (derecha)
      const py = (e.clientY - r.top) / r.height; // 0 (arriba) → 1 (abajo)
      rotY((px - 0.5) * 2 * maxGrados);
      rotX((0.5 - py) * 2 * maxGrados);
      el.style.setProperty('--brillo-x', `${px * 100}%`);
      el.style.setProperty('--brillo-y', `${py * 100}%`);
    };
    const salir = () => {
      rotX(0);
      rotY(0);
    };
    el.addEventListener('pointermove', mover);
    el.addEventListener('pointerleave', salir);
    return () => {
      el.removeEventListener('pointermove', mover);
      el.removeEventListener('pointerleave', salir);
      gsap.killTweensOf(el);
      gsap.set(el, { clearProps: 'transform' });
    };
  }, [ref, maxGrados, raton, reducido]);
}
