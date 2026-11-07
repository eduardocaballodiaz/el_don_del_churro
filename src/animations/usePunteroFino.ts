'use client';

// ¿Se maneja la web con ratón (puntero fino y hover real)?
// En móviles y tabletas devuelve false: allí no tienen sentido el cursor
// personalizado, la inclinación de tarjetas ni los botones magnéticos.
import { useSyncExternalStore } from 'react';

const CONSULTA = '(hover: hover) and (pointer: fine)';

function suscribir(avisar: () => void) {
  const mq = window.matchMedia(CONSULTA);
  mq.addEventListener('change', avisar);
  return () => mq.removeEventListener('change', avisar);
}

export function usePunteroFino(): boolean {
  return useSyncExternalStore(
    suscribir,
    () => window.matchMedia(CONSULTA).matches,
    () => false,
  );
}
