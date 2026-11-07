// /robots.txt: permite a los buscadores rastrear toda la web y les indica el sitemap.
import type { MetadataRoute } from 'next';
import { DOMINIO } from '@/lib/seo/urls';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${DOMINIO}/sitemap.xml`,
    host: DOMINIO,
  };
}
