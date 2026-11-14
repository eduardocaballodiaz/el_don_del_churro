// LOS 14 ALÉRGENOS DE DECLARACIÓN OBLIGATORIA
// (Reglamento UE 1169/2011, anexo II, y Real Decreto 126/2015 en España).
// Cada producto de la carta indica cuáles contiene en `alergenos`.
//
// IMPORTANTE: los alérgenos de cada producto los confirma Edu con sus recetas y las
// etiquetas de los proveedores. Nunca se deducen ni se inventan.
import type { Locale } from '@/i18n/routing';

export const ALERGENOS = [
  'gluten',
  'crustaceos',
  'huevos',
  'pescado',
  'cacahuetes',
  'soja',
  'lacteos',
  'frutos-de-cascara',
  'apio',
  'mostaza',
  'sesamo',
  'sulfitos',
  'altramuces',
  'moluscos',
] as const;

export type Alergeno = (typeof ALERGENOS)[number];

export const NOMBRES_ALERGENOS: Record<Alergeno, Record<Locale, string>> = {
  gluten: { es: 'Gluten', en: 'Gluten' },
  crustaceos: { es: 'Crustáceos', en: 'Crustaceans' },
  huevos: { es: 'Huevo', en: 'Egg' },
  pescado: { es: 'Pescado', en: 'Fish' },
  cacahuetes: { es: 'Cacahuete', en: 'Peanuts' },
  soja: { es: 'Soja', en: 'Soy' },
  lacteos: { es: 'Lácteos', en: 'Milk' },
  'frutos-de-cascara': { es: 'Frutos de cáscara', en: 'Tree nuts' },
  apio: { es: 'Apio', en: 'Celery' },
  mostaza: { es: 'Mostaza', en: 'Mustard' },
  sesamo: { es: 'Sésamo', en: 'Sesame' },
  sulfitos: { es: 'Sulfitos', en: 'Sulphites' },
  altramuces: { es: 'Altramuces', en: 'Lupin' },
  moluscos: { es: 'Moluscos', en: 'Molluscs' },
};

/** Textos fijos sobre alérgenos que acompañan a la carta. */
export const TEXTOS_ALERGENOS: Record<Locale, { etiqueta: string; aviso: string }> = {
  es: {
    etiqueta: 'Alérgenos',
    aviso:
      'Si tienes alguna alergia o intolerancia alimentaria, díselo a nuestro equipo antes de pedir: te informamos de los alérgenos de cada producto.',
  },
  en: {
    etiqueta: 'Allergens',
    aviso:
      'If you have a food allergy or intolerance, please tell our staff before ordering: we will tell you the allergens in each product.',
  },
};
