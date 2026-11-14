'use client';

// Botón del pie para volver a abrir el banner y cambiar la decisión sobre las cookies.
import { useTranslations } from 'next-intl';
import { abrirConfiguracion } from '@/lib/consentimiento';

export function ConfigurarCookies({ className }: { className?: string }) {
  const t = useTranslations('consentimiento');
  return (
    <button type="button" className={className} onClick={abrirConfiguracion}>
      {t('configurar')}
    </button>
  );
}
