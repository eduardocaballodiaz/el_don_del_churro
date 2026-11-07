// LA CARTA (/carta · /en/menu)
// Los productos salen de src/content/carta.ts. Mientras esté vacía se muestra
// un aviso; `npm run comprobar-lanzamiento` impide publicar la web sin carta.
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { use } from 'react';
import { Reveal } from '@/animations/Reveal';
import { ListaCarta } from '@/components/carta/ListaCarta';
import { carta } from '@/content/carta';
import type { Locale } from '@/i18n/routing';
import s from '@/components/sections/seccion.module.css';
import styles from './carta.module.css';
import { construirMetadata } from '@/lib/seo/metadata';

// Título, descripción, canonical, hreflang e imagen para redes (src/lib/seo/metadata.ts).
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return construirMetadata({ locale: locale as Locale, pagina: '/carta' });
}

export default function Carta({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations('carta');

  return (
    <main id="contenido" className={`${s.seccion} contenedor`}>
      <header className={styles.cabecera}>
        <Reveal as="p" className={s.etiqueta}>
          {t('etiqueta')}
        </Reveal>
        <Reveal>
          <h1 className={styles.titulo}>{t('titulo')}</h1>
        </Reveal>
        <Reveal as="p" className={s.texto}>
          {t('intro')}
        </Reveal>
      </header>

      {carta.length > 0 ? (
        <ListaCarta productos={carta} locale={locale as Locale} />
      ) : (
        <p className={styles.vacia} role="status">
          {t('enPreparacion')}
        </p>
      )}
    </main>
  );
}
