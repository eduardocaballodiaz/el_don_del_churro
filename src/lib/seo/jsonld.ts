// DATOS ESTRUCTURADOS (JSON-LD) para Google: le dicen qué es el negocio, dónde está
// y su horario, para que aparezca bien en búsquedas y en Google Maps.
// Regla: solo se incluyen los datos que tenemos. Nada inventado.
import { negocio, type Dia } from '@/content/negocio';
import type { Locale } from '@/i18n/routing';
import { DOMINIO, urlAbsoluta } from './urls';

const DIAS_SCHEMA: Record<Dia, string> = {
  lunes: 'Monday',
  martes: 'Tuesday',
  miercoles: 'Wednesday',
  jueves: 'Thursday',
  viernes: 'Friday',
  sabado: 'Saturday',
  domingo: 'Sunday',
};

export function restaurantJsonLd(locale: Locale): Record<string, unknown> {
  const { calle, codigoPostal, ciudad, pais } = negocio.direccion;
  const ld: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: negocio.nombre,
    url: urlAbsoluta('/', locale),
    logo: `${DOMINIO}/logo/sello-color.svg`,
    image: `${DOMINIO}/img/finos-chocolate.webp`,
    servesCuisine: ['Spanish', 'Churros'],
    email: negocio.email,
    hasMenu: urlAbsoluta('/carta', locale),
    address: {
      '@type': 'PostalAddress',
      streetAddress: calle,
      addressLocality: ciudad,
      addressRegion: 'Sevilla',
      addressCountry: pais,
      ...(codigoPostal ? { postalCode: codigoPostal } : {}),
    },
  };

  if (negocio.geo) {
    ld.geo = { '@type': 'GeoCoordinates', latitude: negocio.geo.lat, longitude: negocio.geo.lng };
  }
  if (negocio.telefono) ld.telephone = negocio.telefono;
  if (negocio.horario.dias) {
    const dias = negocio.horario.dias.map((d) => DIAS_SCHEMA[d]);
    ld.openingHoursSpecification = negocio.horario.tramos.map((t) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: dias,
      opens: t.abre,
      closes: t.cierra,
    }));
  }
  if (negocio.redes.length > 0) ld.sameAs = negocio.redes.map((r) => r.url);
  return ld;
}
