// Validación del formulario de contacto (incluida la protección anti-spam).
import { describe, expect, it } from 'vitest';
import { validarContacto } from '@/lib/contacto/validar';


function formulario(campos: Record<string, string>): FormData {
  const f = new FormData();
  const base = {
    nombre: 'José Núñez',
    email: 'jose@example.com',
    mensaje: 'Hola',
    privacidad: 'on',
    web: '',
    t: '10000', // milisegundos que el visitante tardó en enviar (medidos en su navegador)
  };
  for (const [k, v] of Object.entries({ ...base, ...campos })) if (v !== undefined) f.set(k, v);
  return f;
}

describe('validarContacto', () => {
  it('acepta nombres con tildes y caracteres no latinos', () => {
    expect(validarContacto(formulario({})).ok).toBe(true);
    expect(validarContacto(formulario({ nombre: '王芳' })).ok).toBe(true);
  });

  it('rechaza mensajes de más de 5000 caracteres', () => {
    const r = validarContacto(formulario({ mensaje: 'a'.repeat(5001) }));
    expect(r).toMatchObject({ ok: false, spam: false, errores: { mensaje: 'largo' } });
  });

  it('exige aceptar la privacidad', () => {
    const f = formulario({});
    f.delete('privacidad');
    expect(validarContacto(f)).toMatchObject({ ok: false, errores: { privacidad: 'requerido' } });
  });

  it('detecta un correo inválido', () => {
    expect(validarContacto(formulario({ email: 'a@b' }))).toMatchObject({
      ok: false,
      errores: { email: 'invalido' },
    });
  });

  it('marca como spam el campo trampa relleno', () => {
    expect(validarContacto(formulario({ web: 'x' }))).toEqual({ ok: false, spam: true });
  });

  it('marca como spam un envío en menos de 3 segundos', () => {
    expect(validarContacto(formulario({ t: '1000' }))).toEqual({
      ok: false,
      spam: true,
    });
  });

  it('sin marca de tiempo (sin JavaScript) no lo considera spam', () => {
    expect(validarContacto(formulario({ t: '' })).ok).toBe(true);
  });

  it('no depende del reloj del visitante: solo del tiempo transcurrido', () => {
    // Antes se comparaba la hora del servidor con la del navegador: un reloj
    // adelantado convertía mensajes reales en spam.
    expect(validarContacto(formulario({ t: '45000' })).ok).toBe(true);
  });

  it('cuenta los saltos de línea igual que el navegador (CRLF = 1 carácter)', () => {
    const lineas = Array.from({ length: 1000 }, () => 'abcd').join('\r\n'); // 4000 letras + 999 saltos
    expect(validarContacto(formulario({ mensaje: lineas })).ok).toBe(true);
  });

  it('quita los saltos de línea del nombre', () => {
    const r = validarContacto(formulario({ nombre: 'Ana\r\nBcc: x@y.z' }));
    expect(r.ok && r.datos.nombre).toBe('Ana Bcc: x@y.z');
  });
});
