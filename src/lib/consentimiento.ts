'use client';

// CONSENTIMIENTO DE COOKIES (solo para el mapa de Google)
// La web no usa cookies propias. Lo único que las usa es el mapa de Google, así
// que se pide permiso antes de cargarlo (guía de cookies de la AEPD).
//
// La decisión se guarda en el navegador del visitante (localStorage), que es un
// almacenamiento técnico necesario para recordar lo que eligió; no es una cookie
// ni se envía a ningún sitio.
import { useSyncExternalStore } from 'react';

export type Decision = 'aceptado' | 'rechazado';
/** 'pendiente' = aún no ha elegido; 'cargando' = en el servidor, antes de saberlo. */
export type EstadoConsentimiento = Decision | 'pendiente' | 'cargando';

const CLAVE = 'edc-consentimiento-mapas';
const EVENTO = 'edc-consentimiento';
const EVENTO_ABRIR = 'edc-abrir-consentimiento';

function leer(): EstadoConsentimiento {
  try {
    const v = window.localStorage.getItem(CLAVE);
    return v === 'aceptado' || v === 'rechazado' ? v : 'pendiente';
  } catch {
    return 'pendiente'; // navegación privada o almacenamiento bloqueado: se vuelve a preguntar
  }
}

export function guardarDecision(decision: Decision) {
  try {
    window.localStorage.setItem(CLAVE, decision);
  } catch {
    // Si no se puede guardar, la decisión vale solo para esta visita.
  }
  memoria = decision;
  window.dispatchEvent(new Event(EVENTO));
}

/** Vuelve a mostrar el banner para cambiar la decisión (enlace del pie). */
export function abrirConfiguracion() {
  window.dispatchEvent(new Event(EVENTO_ABRIR));
}

let memoria: EstadoConsentimiento | null = null;

function suscribir(avisar: () => void) {
  const alCambiar = () => {
    memoria = null;
    avisar();
  };
  window.addEventListener(EVENTO, avisar);
  window.addEventListener('storage', alCambiar);
  return () => {
    window.removeEventListener(EVENTO, avisar);
    window.removeEventListener('storage', alCambiar);
  };
}

/** Estado actual del consentimiento, que se actualiza en toda la página a la vez. */
export function useConsentimiento(): EstadoConsentimiento {
  return useSyncExternalStore(
    suscribir,
    () => memoria ?? leer(),
    () => 'cargando',
  );
}

/** Se activa cuando alguien pide reabrir el banner. */
export function suscribirAbrir(alAbrir: () => void) {
  window.addEventListener(EVENTO_ABRIR, alAbrir);
  return () => window.removeEventListener(EVENTO_ABRIR, alAbrir);
}
