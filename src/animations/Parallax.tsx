'use client';

// Movimiento de profundidad: el contenido se desplaza un poco más lento que la página.
import { useRef, type ReactNode } from 'react';
import { gsap, useGSAP } from './gsap';
import { useReducedMotion } from './useReducedMotion';

type Props = { children: ReactNode; className?: string; /** Desplazamiento total en %. */ intensidad?: number };

export function Parallax({ children, className, intensidad = 10 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reducido = useReducedMotion();

  useGSAP(
    () => {
      if (!ref.current || reducido) return;
      gsap.fromTo(
        ref.current,
        { yPercent: intensidad / 2 },
        {
          yPercent: -intensidad / 2,
          ease: 'none',
          scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );
    },
    { dependencies: [reducido, intensidad], scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
