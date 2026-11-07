// Validación del formulario de contacto (incluida la protección anti-spam).
import { describe, expect, it } from 'vitest';
import { validarContacto } from '@/lib/contacto/validar';

const AHORA = 1_800_000_000_000;

function formulario(campos: Record<string, string>): FormData {
  const f = new FormData();
  const base = {
    nombre: 'José Núñez',
    email: 'jose@example.com',
    mensaje: 'Hola',
    privacidad: 'on',
    web: '',
    t: String(AHORA - 10_000),
  };
  for (const [k, v] of Object.entries({ ...base, ...campos })) if (v !== undefined) f.set(k, v);
  return f;
}

describe('validarContacto', () => {
  it('acepta nombres con tildes y caracteres no latinos', () => {
    expect(validarContacto(formulario({}), AHORA).ok).toBe(true);
    expect(validarContacto(formulario({ nombre: '王芳' }), AHORA).ok).toBe(true);
  });

  it('rechaza mensajes de más de 5000 caracteres', () => {
    const r = validarContacto(formulario({ mensaje: 'a'.repeat(5001) }), AHORA);
    expect(r).toMatchObject({ ok: false, spam: false, errores: { mensaje: 'largo' } });
  });

  it('exige aceptar la privacidad', () => {
    const f = formulario({});
    f.delete('privacidad');
    expect(validarContacto(f, AHORA)).toMatchObject({ ok: false, errores: { privacidad: 'requerido' } });
  });

  it('detecta un correo inválido', () => {
    expect(validarContacto(formulario({ email: 'a@b' }), AHORA)).toMatchObject({
      ok: false,
      errores: { email: 'invalido' },
    });
  });

  it('marca como spam el campo trampa relleno', () => {
    expect(validarContacto(formulario({ web: 'x' }), AHORA)).toEqual({ ok: false, spam: true });
  });

  it('marca como spam un envío en menos de 3 segundos', () => {
    expect(validarContacto(formulario({ t: String(AHORA - 1000) }), AHORA)).toEqual({
      ok: false,
      spam: true,
    });
  });

  it('sin marca de tiempo (sin JavaScript) no lo considera spam', () => {
    expect(validarContacto(formulario({ t: '' }), AHORA).ok).toBe(true);
  });

  it('quita los saltos de línea del nombre', () => {
    const r = validarContacto(formulario({ nombre: 'Ana\r\nBcc: x@y.z' }), AHORA);
    expect(r.ok && r.datos.nombre).toBe('Ana Bcc: x@y.z');
  });
});
