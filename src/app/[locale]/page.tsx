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
import { restaurantJsonLd } from '@/lib/seo/jsonld';
import { construirMetadata } from '@/lib/seo/metadata';
import type { Locale } from '@/i18n/routing';

// Título, descripción, canonical, hreflang e imagen para redes (src/lib/seo/metadata.ts).
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return construirMetadata({ locale: locale as Locale, pagina: '/' });
}

export default function Inicio({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  setRequestLocale(locale);
  return (
    <main id="contenido">
      {/* Datos estructurados para Google (el "<" se escapa por seguridad). */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(restaurantJsonLd(locale as Locale)).replace(/</g, '\\u003c'),
        }}
      />
      <Hero />
      <Productos />
      <Latas />
      <Nosotros />
      <Visitanos />
    </main>
  );
}
