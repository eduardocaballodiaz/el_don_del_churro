// DATOS DEL NEGOCIO
// -----------------
// Única fuente de verdad para la dirección, el horario, el contacto y las redes.
// La usan el encabezado, el pie, la página de contacto y los datos para Google (JSON-LD).
//
// Regla: lo que no sabemos vale `null`, NUNCA un dato inventado.
// `npm run comprobar-lanzamiento` avisa de todo lo que siga pendiente.
import type { Locale } from '@/i18n/routing';

export type Dia = 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado' | 'domingo';
/** Tramo horario con horas en formato 'HH:MM'. */
export type Tramo = { abre: string; cierra: string };

export type Negocio = {
  nombre: 'El Don del Churro';
  direccion: { calle: string; codigoPostal: string | null; ciudad: string; pais: 'ES' };
  geo: { lat: number; lng: number } | null;
  horario: { dias: Dia[] | null; tramos: Tramo[] };
  email: string;
  telefono: string | null;
  whatsapp: string | null;
  redes: { red: 'instagram' | 'tiktok' | 'facebook'; url: string }[];
  /** Datos legales del titular (aviso legal). Pendientes hasta que Edu sea autónomo. */
  titular: { nombre: string; nif: string; domicilio: string } | null;
  /** Enlace a la ficha de Google Maps, cuando exista. */
  urlMaps: string | null;
};

export const negocio: Negocio = {
  nombre: 'El Don del Churro',
  direccion: {
    calle: 'Calle Correduría, 42',
    codigoPostal: '41002', // confirmado por Edu el 14-nov-2026
    ciudad: 'Sevilla',
    pais: 'ES',
  },
  geo: null,
  horario: {
    dias: null, // pendiente: qué días abre
    tramos: [
      { abre: '07:00', cierra: '13:00' },
      { abre: '17:00', cierra: '20:00' },
    ],
  },
  email: 'info@eldondelchurro.com',
  telefono: null,
  whatsapp: null,
  redes: [],
  titular: null,
  urlMaps: null,
};

/** Quita el cero inicial de la hora: '07:00' → '7:00'. */
function hora(hhmm: string): string {
  return hhmm.replace(/^0/, '');
}

const NOMBRES_DIAS: Record<Locale, Record<Dia, string>> = {
  es: {
    lunes: 'Lunes',
    martes: 'Martes',
    miercoles: 'Miércoles',
    jueves: 'Jueves',
    viernes: 'Viernes',
    sabado: 'Sábado',
    domingo: 'Domingo',
  },
  en: {
    lunes: 'Monday',
    martes: 'Tuesday',
    miercoles: 'Wednesday',
    jueves: 'Thursday',
    viernes: 'Friday',
    sabado: 'Saturday',
    domingo: 'Sunday',
  },
};

/**
 * Devuelve el horario como líneas de texto listas para mostrar.
 * Ejemplo: ['Mañanas 7:00 – 13:00', 'Tardes 17:00 – 20:00'] y, si se conocen
 * los días, una primera línea con ellos.
 */
export function formatearHorario(h: Negocio['horario'], locale: Locale): string[] {
  const etiquetas = locale === 'es' ? ['Mañanas', 'Tardes'] : ['Mornings', 'Afternoons'];
  const tramos = h.tramos.map(
    (t, i) => `${etiquetas[i] ?? ''} ${hora(t.abre)} – ${hora(t.cierra)}`.trim(),
  );
  if (!h.dias) return tramos;
  const dias = h.dias.map((d) => NOMBRES_DIAS[locale][d]).join(', ');
  return [dias, ...tramos];
}
