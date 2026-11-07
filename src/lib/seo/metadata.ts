// Metadatos de cada página: título, descripción, dirección canónica, versiones por
// idioma (hreflang) e información para redes sociales (Open Graph y X/Twitter).
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import type { Locale, Pagina } from '@/i18n/routing';
import { DOMINIO, urlsDePagina } from './urls';

/** Clave de cada página en messages/*.json → "seo". */
const CLAVE_SEO: Record<Pagina, string> = {
  '/': 'inicio',
  '/carta': 'carta',
  '/contacto': 'contacto',
  '/aviso-legal': 'avisoLegal',
  '/privacidad': 'privacidad',
  '/cookies': 'cookies',
};

export async function construirMetadata({
  locale,
  pagina,
}: {
  locale: Locale;
  pagina: Pagina;
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'seo' });
  const clave = CLAVE_SEO[pagina];
  const titulo = t(`${clave}.titulo`);
  const descripcion = t(`${clave}.descripcion`);
  const { canonical, languages } = urlsDePagina(pagina, locale);
  // Imagen para compartir: la genera src/app/[locale]/opengraph-image.tsx.
  const imagen = `${DOMINIO}${locale === 'es' ? '' : `/${locale}`}/opengraph-image`;

  return {
    title: titulo,
    description: descripcion,
    alternates: { canonical, languages },
    openGraph: {
      type: 'website',
      siteName: t('nombreSitio'),
      locale: locale === 'es' ? 'es_ES' : 'en_GB',
      url: canonical,
      title: titulo,
      description: descripcion,
      images: [{ url: imagen, width: 1200, height: 630, alt: t('og.lema') }],
    },
    twitter: { card: 'summary_large_image', title: titulo, description: descripcion, images: [imagen] },
  };
}
