'use client';

// La foto crece a medida que se baja por la página, hasta su tamaño final
// (sin pasarse del tamaño en el que se ve nítida). Se usa en El Don de Latas.
import { useRef, type ReactNode } from 'react';
import { gsap, useGSAP } from './gsap';
import { useReducedMotion } from './useReducedMotion';

export function CreceConScroll({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reducido = useReducedMotion();

  useGSAP(
    () => {
      if (!ref.current || reducido) return;
      gsap.fromTo(
        ref.current,
        { scale: 0.8, borderRadius: 48 },
        {
          scale: 1,
          borderRadius: 22,
          ease: 'none',
          scrollTrigger: { trigger: ref.current, start: 'top 95%', end: 'center 55%', scrub: 0.6 },
        },
      );
    },
    { dependencies: [reducido], scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
