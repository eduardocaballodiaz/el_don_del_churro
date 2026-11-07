// El rótulo del encabezado, tal como en la caja de la marca (sin corona):
// "EL DON DEL" con filetes dorados a los lados y "CHURRO" con cuatro capas.
// De fuera adentro: borde negro grueso → filete dorado → línea negra fina → letra crema.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const svg = readFileSync('public/logo/rotulo.svg', 'utf8');
const capa = (id: string) => svg.match(new RegExp(`<[a-z]+ id="${id}"[^>]*>`))?.[0] ?? '';
const grosor = (etiqueta: string) => Number(etiqueta.match(/stroke-width="([\d.]+)"/)?.[1] ?? 0);

describe('rótulo como en la caja', () => {
  const negro = capa('churro-borde-negro');
  const crema = capa('churro-crema');
  const fina = capa('churro-linea-fina');
  const dorado = capa('churro-filete-dorado');

  it('tiene "EL DON DEL" en crema y los filetes dorados a los lados', () => {
    expect(capa('el-don-del')).toContain('fill="#FFF3D6"');
    expect(svg.match(/<g id="filetes"[\s\S]*?<\/g>/)?.[0].match(/<rect /g)).toHaveLength(2);
  });

  it('CHURRO tiene borde negro grueso, filete dorado y línea negra fina', () => {
    expect(negro).toContain('stroke="#000000"');
    expect(dorado).toContain('stroke="#D4A448"');
    expect(fina).toContain('stroke="#000000"');
    expect(crema).toContain('fill="#FFF3D6"');
    // La línea fina asoma por dentro del filete: su trazo es algo más ancho.
    expect(grosor(fina)).toBeGreaterThan(grosor(dorado));
    expect(grosor(negro)).toBeGreaterThan(grosor(fina));
  });

  it('pinta las capas en orden: negro, crema, línea fina, dorado', () => {
    const pos = [negro, crema, fina, dorado].map((c) => svg.indexOf(c));
    expect(pos.every((p) => p >= 0)).toBe(true);
    expect(pos).toEqual([...pos].sort((a, b) => a - b));
  });

  it('no lleva corona', () => {
    expect(svg.toLowerCase()).not.toMatch(/id="corona/);
  });
});
