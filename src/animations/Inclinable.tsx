'use client';

// Envoltorio que inclina su contenido siguiendo al cursor (ver useTilt).
import { useRef, type ReactNode } from 'react';
import { useTilt } from './useTilt';

/** Grados máximos de inclinación de las tarjetas (más alto = efecto más pronunciado). */
const INCLINACION_MAXIMA = 14;

export function Inclinable({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useTilt(ref, INCLINACION_MAXIMA);
  return (
    <div ref={ref} className={className} data-inclinable>
      {children}
    </div>
  );
}
