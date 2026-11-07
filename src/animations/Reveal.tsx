'use client';

// <Reveal>: hace aparecer su contenido (fundido + subida suave) al entrar en pantalla.
//
// Cómo se evita esconder contenido por error:
// - El estado oculto lo pone el CSS SOLO si hay JavaScript (clase "js" en <html>).
// - Con movimiento reducido se muestra directamente, sin animación.
// - Al terminar, se limpian los estilos en línea y queda data-reveal="visible".
import { useRef, type ElementType, type ReactNode } from 'react';
import { gsap, useGSAP } from './gsap';
import { useReducedMotion } from './useReducedMotion';

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Retraso en segundos (útil para escalonar varios elementos). */
  delay?: number;
};

export function Reveal({ children, as: Etiqueta = 'div', className, delay = 0 }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reducido = useReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reducido) return;
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 1.1,
        delay,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        onComplete: () => {
          el.setAttribute('data-reveal', 'visible');
          gsap.set(el, { clearProps: 'opacity,transform' });
        },
      });
    },
    { dependencies: [reducido, delay], scope: ref },
  );

  return (
    <Etiqueta ref={ref} className={className} data-reveal={reducido ? 'visible' : 'oculto'}>
      {children}
    </Etiqueta>
  );
}
