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

  // La web ya funciona:
  // - "hidratado" desactiva la red de seguridad del layout (que mostraría todo de
  //   golpe si el JavaScript no hubiera llegado a arrancar);
  // - "js" se vuelve a poner por si React la ha borrado: si el alojamiento o una
  //   extensión alteran el HTML (Netlify añade un comentario en <head>), React
  //   repinta la página y sustituye las clases de <html> por las originales.
  useEffect(() => {
    document.documentElement.classList.add('js', 'hidratado');
  }, []);

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
