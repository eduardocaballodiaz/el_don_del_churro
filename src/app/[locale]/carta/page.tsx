// La carta (provisional: el contenido llega en la Tarea 9).
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { use } from 'react';

export default function Carta({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations('carta');
  return (
    <main id="contenido">
      <h1>{t('titulo')}</h1>
    </main>
  );
}
