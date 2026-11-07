// Direcciones canónicas, versiones por idioma y datos estructurados para Google.
import { describe, expect, it } from 'vitest';
import { urlsDePagina } from '@/lib/seo/urls';
import { restaurantJsonLd } from '@/lib/seo/jsonld';

describe('urlsDePagina', () => {
  it('da la dirección canónica y las de cada idioma', () => {
    const u = urlsDePagina('/carta', 'en');
    expect(u.canonical).toBe('https://eldondelchurro.com/en/menu');
    expect(u.languages.es).toBe('https://eldondelchurro.com/carta');
    expect(u.languages.en).toBe('https://eldondelchurro.com/en/menu');
    expect(u.languages['x-default']).toBe('https://eldondelchurro.com/carta');
  });

  it('el inicio en español es la raíz del dominio', () => {
    expect(urlsDePagina('/', 'es').canonical).toBe('https://eldondelchurro.com');
    expect(urlsDePagina('/', 'en').canonical).toBe('https://eldondelchurro.com/en');
  });
});

describe('restaurantJsonLd', () => {
  const ld = restaurantJsonLd('es');

  it('describe la churrería con su dirección real', () => {
    expect(ld['@type']).toBe('Restaurant');
    expect((ld.address as Record<string, string>).streetAddress).toBe('Calle Correduría, 42');
    expect(ld.email).toBe('info@eldondelchurro.com');
    expect(ld.hasMenu).toBe('https://eldondelchurro.com/carta');
  });

  it('no inventa datos que aún no tenemos', () => {
    expect(ld).not.toHaveProperty('geo');
    expect(ld).not.toHaveProperty('telephone');
    expect(ld).not.toHaveProperty('openingHoursSpecification');
    expect(ld).not.toHaveProperty('sameAs');
  });
});
