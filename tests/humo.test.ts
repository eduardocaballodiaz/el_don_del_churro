// Prueba de humo: confirma que Vitest está bien configurado.
import { describe, expect, it } from 'vitest';

describe('entorno de pruebas', () => {
  it('ejecuta pruebas', () => {
    expect(1 + 1).toBe(2);
  });
});
