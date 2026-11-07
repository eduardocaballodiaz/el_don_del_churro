// Página legal: aviso-legal (texto en messages/*.json → legal.avisoLegal).
import { setRequestLocale } from 'next-intl/server';
import { TextoLegal } from '@/components/ui/TextoLegal';

export default async function AvisoLegal({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <TextoLegal pagina="avisoLegal" />;
}
