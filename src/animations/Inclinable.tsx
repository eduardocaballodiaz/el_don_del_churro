'use client';

// Envoltorio que inclina su contenido siguiendo al cursor (ver useTilt).
import { useRef, type ReactNode } from 'react';
import { useTilt } from './useTilt';

export function Inclinable({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useTilt(ref);
  return (
    <div ref={ref} className={className} data-inclinable>
      {children}
    </div>
  );
}
