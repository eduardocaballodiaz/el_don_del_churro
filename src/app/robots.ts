// /robots.txt: indica a los buscadores qué pueden rastrear y dónde está el sitemap.
// Antes del lanzamiento lo prohíbe todo (ver src/lib/seo/indexacion.ts).
import type { MetadataRoute } from 'next';
import { indexacionPermitida } from '@/lib/seo/indexacion';
import { DOMINIO } from '@/lib/seo/urls';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: indexacionPermitida() ? { userAgent: '*', allow: '/' } : { userAgent: '*', disallow: '/' },
    sitemap: `${DOMINIO}/sitemap.xml`,
    host: DOMINIO,
  };
}
