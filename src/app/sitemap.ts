// Mapa del sitio para Google (/sitemap.xml): cada página en cada idioma, con sus alternativas.
import type { MetadataRoute } from 'next';
import { routing, type Pagina } from '@/i18n/routing';
import { urlsDePagina } from '@/lib/seo/urls';

export default function sitemap(): MetadataRoute.Sitemap {
  const paginas = Object.keys(routing.pathnames) as Pagina[];
  return paginas.flatMap((pagina) =>
    routing.locales.map((locale) => {
      const { canonical, languages } = urlsDePagina(pagina, locale);
      return {
        url: canonical,
        alternates: { languages: { es: languages.es, en: languages.en } },
        changeFrequency: 'monthly' as const,
        priority: pagina === '/' ? 1 : pagina === '/carta' ? 0.9 : 0.5,
      };
    }),
  );
}
