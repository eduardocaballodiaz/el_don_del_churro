// Página legal: privacidad (texto en messages/*.json → legal.privacidad).
import { setRequestLocale } from 'next-intl/server';
import { TextoLegal } from '@/components/ui/TextoLegal';

export default async function Privacidad({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <TextoLegal pagina="privacidad" />;
}
