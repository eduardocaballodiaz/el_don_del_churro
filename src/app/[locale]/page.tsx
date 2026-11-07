// Página de inicio (provisional: las secciones llegan en la Tarea 8).
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { use } from 'react';

export default function Inicio({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations('inicio');
  return (
    <main id="contenido">
      <h1>{t('titulo')}</h1>
    </main>
  );
}
