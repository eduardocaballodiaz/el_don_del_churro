// Contacto (provisional: el formulario llega en la Tarea 10).
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { use } from 'react';

export default function Contacto({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations('contacto');
  return (
    <main id="contenido">
      <h1>{t('titulo')}</h1>
    </main>
  );
}
