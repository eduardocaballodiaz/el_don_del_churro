// Página legal: cookies (texto en messages/*.json → legal.cookies).
import { setRequestLocale } from 'next-intl/server';
import { TextoLegal } from '@/components/ui/TextoLegal';
import { construirMetadata } from '@/lib/seo/metadata';
import type { Locale } from '@/i18n/routing';

// Título, descripción, canonical, hreflang e imagen para redes (src/lib/seo/metadata.ts).
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return construirMetadata({ locale: locale as Locale, pagina: '/cookies' });
}

export default async function Cookies({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <TextoLegal pagina="cookies" />;
}
