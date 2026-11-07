'use client';

// TITULAR QUE APARECE LÍNEA A LÍNEA (portada).
// SplitText parte el texto en líneas y cada una sube desde detrás de una "máscara".
// Hasta que está listo, el CSS lo oculta solo si hay JavaScript; con movimiento
// reducido se muestra tal cual. Si cambia el ancho, se vuelve a partir (autoSplit).
import { useRef, type ReactNode } from 'react';
import { gsap, SplitText, useGSAP } from './gsap';
import { useReducedMotion } from './useReducedMotion';

type Props = { children: ReactNode; className?: string; id?: string };

export function TitularAnimado({ children, className, id }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);
  const reducido = useReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reducido) return;
      const partido = SplitText.create(el, {
        type: 'lines',
        mask: 'lines',
        autoSplit: true,
        onSplit: (self) => {
          gsap.set(el, { visibility: 'visible' });
          return gsap.from(self.lines, {
            yPercent: 110,
            duration: 1.15,
            stagger: 0.12,
            ease: 'power4.out',
            delay: 0.15,
          });
        },
      });
      return () => partido.revert();
    },
    { dependencies: [reducido], scope: ref },
  );

  return (
    <h1 ref={ref} id={id} className={className} data-titular>
      {children}
    </h1>
  );
}
