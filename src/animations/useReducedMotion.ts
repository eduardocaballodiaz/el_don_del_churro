'use client';

// ¿Ha pedido el usuario menos movimiento en su sistema (accesibilidad)?
// Se actualiza al momento si lo cambia con la página abierta.
import { useSyncExternalStore } from 'react';

const CONSULTA = '(prefers-reduced-motion: reduce)';

function suscribir(avisar: () => void) {
  const mq = window.matchMedia(CONSULTA);
  mq.addEventListener('change', avisar);
  return () => mq.removeEventListener('change', avisar);
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    suscribir,
    () => window.matchMedia(CONSULTA).matches,
    () => false, // en el servidor no se sabe: se decide al cargar en el navegador
  );
}
