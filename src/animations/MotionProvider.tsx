'use client';

// SCROLL SUAVE (Lenis) sincronizado con las animaciones de GSAP.
// - Lenis suaviza la rueda del ratón y da la sensación "premium" al desplazarse.
// - Cada fotograma de GSAP mueve Lenis, y cada movimiento de Lenis actualiza
//   ScrollTrigger: así las animaciones ligadas al scroll van perfectamente a la par.
// - Si el usuario pidió menos movimiento, no se activa (scroll normal del navegador).
import { useEffect, type ReactNode } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap, ScrollTrigger } from './gsap';
import { useReducedMotion } from './useReducedMotion';

export function MotionProvider({ children }: { children: ReactNode }) {
  const reducido = useReducedMotion();

  useEffect(() => {
    if (reducido) return;
    const lenis = new Lenis({
      autoRaf: false, // lo mueve el reloj de GSAP (abajo)
      lerp: 0.1, // suavidad: más bajo = más suave y lento
      anchors: true, // los enlaces a #secciones también se desplazan con suavidad
    });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (segundos: number) => lenis.raf(segundos * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [reducido]);

  return <>{children}</>;
}
