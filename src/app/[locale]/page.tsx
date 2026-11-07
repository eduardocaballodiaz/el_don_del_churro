// PÁGINA DE INICIO
// Portada, productos, El Don de Latas, la casa y cómo visitarnos.
// Los textos están en messages/*.json → "inicio" (en borrador hasta que Edu los apruebe).
import { setRequestLocale } from 'next-intl/server';
import { use } from 'react';
import { Hero } from '@/components/sections/Hero';
import { Productos } from '@/components/sections/Productos';
import { Latas } from '@/components/sections/Latas';
import { Nosotros } from '@/components/sections/Nosotros';
import { Visitanos } from '@/components/sections/Visitanos';

export default function Inicio({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  setRequestLocale(locale);
  return (
    <main id="contenido">
      <Hero />
      <Productos />
      <Latas />
      <Nosotros />
      <Visitanos />
    </main>
  );
}
