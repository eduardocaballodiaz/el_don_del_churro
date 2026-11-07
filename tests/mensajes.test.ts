// Los dos idiomas deben tener exactamente los mismos textos (las mismas claves)
// y ninguno puede estar vacío. Así nunca se publica algo solo en un idioma.
import { describe, expect, it } from 'vitest';
import es from '../messages/es.json';
import en from '../messages/en.json';

function aplanar(obj: Record<string, unknown>, prefijo = ''): Record<string, unknown> {
  return Object.entries(obj).reduce<Record<string, unknown>>((acc, [clave, valor]) => {
    const ruta = prefijo ? `${prefijo}.${clave}` : clave;
    if (valor && typeof valor === 'object' && !Array.isArray(valor)) {
      Object.assign(acc, aplanar(valor as Record<string, unknown>, ruta));
    } else acc[ruta] = valor;
    return acc;
  }, {});
}

describe('mensajes ES / EN', () => {
  const planoEs = aplanar(es);
  const planoEn = aplanar(en);

  it('tienen las mismas claves', () => {
    expect(Object.keys(planoEn).sort()).toEqual(Object.keys(planoEs).sort());
  });

  it('no tienen textos vacíos', () => {
    for (const [clave, valor] of Object.entries({ ...planoEs, ...planoEn })) {
      expect(String(valor).trim(), clave).not.toBe('');
    }
  });
});
