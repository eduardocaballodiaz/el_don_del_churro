'use client';

// Selector de idioma ES / EN.
// Lleva a la MISMA página en el otro idioma: desde /carta a /en/menu, por ejemplo.
// usePathname() de next-intl devuelve la ruta interna ('/carta'), y <Link locale>
// la traduce a la dirección correcta del otro idioma.
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import styles from './LanguageSwitcher.module.css';

const NOMBRES: Record<Locale, { corto: string; largo: string }> = {
  es: { corto: 'ES', largo: 'Español' },
  en: { corto: 'EN', largo: 'English' },
};

export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations('header');
  const actual = useLocale();
  const pathname = usePathname();

  return (
    <nav className={`${styles.selector} ${className ?? ''}`} aria-label={t('idioma')}>
      {routing.locales.map((locale) => {
        const activo = locale === actual;
        return (
          <Link
            key={locale}
            href={pathname}
            locale={locale}
            hrefLang={locale}
            lang={locale}
            aria-current={activo ? 'true' : undefined}
            className={`${styles.opcion} ${activo ? styles.activo : ''}`}
          >
            {/* Se ve "EN"; el lector de pantalla lee "English". */}
            <span aria-hidden="true">{NOMBRES[locale].corto}</span>
            <span className="visually-hidden">{NOMBRES[locale].largo}</span>
          </Link>
        );
      })}
    </nav>
  );
}
