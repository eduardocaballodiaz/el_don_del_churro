// Datos del negocio, imágenes y comprobación de lanzamiento.
import { describe, expect, it } from 'vitest';
import { formatearHorario, negocio } from '@/content/negocio';
import { formatearPrecio } from '@/content/carta';
import { imagenes } from '@/content/imagenes';
import { datosPendientes } from '@/content/pendientes';

describe('formatearPrecio', () => {
  it('usa el formato de cada idioma', () => {
    expect(formatearPrecio(2.5, 'es')).toBe('2,50 €');
    expect(formatearPrecio(2.5, 'en')).toBe('€2.50');
  });
});

describe('formatearHorario', () => {
  it('muestra los dos tramos del día', () => {
    const lineas = formatearHorario(negocio.horario, 'es').join(' ');
    expect(lineas).toContain('7:00 – 13:00');
    expect(lineas).toContain('17:00 – 20:00');
  });
});

describe('datos del negocio', () => {
  it('tiene la dirección y el correo de la especificación', () => {
    expect(negocio.direccion.calle).toBe('Calle Correduría, 42');
    expect(negocio.direccion.ciudad).toBe('Sevilla');
    expect(negocio.direccion.codigoPostal).toBe('41002');
    expect(negocio.email).toBe('info@eldondelchurro.com');
  });
});

describe('datosPendientes', () => {
  it('lista lo que falta para publicar', () => {
    const pendientes = datosPendientes().join(' | ').toLowerCase();
    expect(pendientes).toContain('carta');
    expect(pendientes).toContain('titular');
    expect(pendientes).toContain('días de apertura');
  });

  it('avisa mientras falten los alérgenos de algún producto', () => {
    expect(datosPendientes().join(' | ').toLowerCase()).toContain('alérgenos pendientes');
  });

  it('avisa de los precios que faltan (solo las latas, que no venían en el documento)', () => {
    const linea = datosPendientes().find((l) => l.startsWith('Precios pendientes'));
    expect(linea).toBe('Precios pendientes en la carta: Pistacho, Tarta de la abuela, Chocolate, Tarta de queso');
  });

  it('avisa mientras queden textos en borrador', () => {
    expect(datosPendientes().join(' | ').toLowerCase()).toContain('textos sin aprobar');
  });
});

describe('imágenes', () => {
  it('no usan fotos de otra marca', () => {
    for (const img of Object.values(imagenes)) {
      expect(img.src).not.toMatch(/kukuchurro|churros-largos-2|el-don-del-churro-web/i);
    }
  });

  it('tienen texto alternativo en los dos idiomas', () => {
    for (const img of Object.values(imagenes)) {
      expect(img.alt.es.trim()).not.toBe('');
      expect(img.alt.en.trim()).not.toBe('');
    }
  });
});
