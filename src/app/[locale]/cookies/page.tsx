// Página legal: cookies (texto en messages/*.json → legal.cookies).
import { setRequestLocale } from 'next-intl/server';
import { TextoLegal } from '@/components/ui/TextoLegal';

export default async function Cookies({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <TextoLegal pagina="cookies" />;
}
