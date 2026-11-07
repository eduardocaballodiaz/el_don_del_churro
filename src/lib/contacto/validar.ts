// VALIDACIÓN DEL FORMULARIO DE CONTACTO
// Comprueba los campos y aplica dos protecciones anti-spam que no usan cookies:
// - "web": campo trampa oculto. Una persona nunca lo rellena; un robot sí.
// - "t": momento en que se cargó el formulario. Un envío en menos de 3 s es un robot.
//   (Si no hay marca de tiempo, por ejemplo sin JavaScript, no se puede medir y se acepta.)
import { z } from 'zod';

export type CampoError = 'requerido' | 'invalido' | 'largo';
export type Campo = 'nombre' | 'email' | 'mensaje' | 'privacidad';
export type DatosContacto = { nombre: string; email: string; mensaje: string };

export type ResultadoValidacion =
  | { ok: true; datos: DatosContacto }
  | { ok: false; spam: true }
  | { ok: false; spam: false; errores: Partial<Record<Campo, CampoError>> };

export const TIEMPO_MINIMO_MS = 3000;
const MAX_NOMBRE = 120;
const MAX_MENSAJE = 5000;

const texto = (max: number) =>
  z
    .string()
    .trim()
    .min(1, { error: 'requerido' })
    .max(max, { error: 'largo' });

const esquema = z.object({
  nombre: texto(MAX_NOMBRE),
  email: z.email({ error: 'invalido' }),
  mensaje: texto(MAX_MENSAJE),
  privacidad: z.literal('on', { error: 'requerido' }),
});

export function validarContacto(form: FormData, ahora: number = Date.now()): ResultadoValidacion {
  // 1. Protecciones anti-spam.
  if (String(form.get('web') ?? '').trim() !== '') return { ok: false, spam: true };
  const t = Number(form.get('t'));
  if (t > 0 && ahora - t < TIEMPO_MINIMO_MS) return { ok: false, spam: true };

  // 2. Campos.
  const leer = (k: string) => {
    const v = form.get(k);
    return typeof v === 'string' ? v : undefined;
  };
  const resultado = esquema.safeParse({
    nombre: leer('nombre') ?? '',
    email: (leer('email') ?? '').trim(),
    mensaje: leer('mensaje') ?? '',
    privacidad: leer('privacidad'),
  });

  if (!resultado.success) {
    const errores: Partial<Record<Campo, CampoError>> = {};
    for (const problema of resultado.error.issues) {
      const campo = problema.path[0] as Campo;
      const tipo: CampoError =
        problema.message === 'largo' ? 'largo' : problema.message === 'invalido' ? 'invalido' : 'requerido';
      // Un correo vacío es "requerido", no "inválido".
      errores[campo] ??= campo === 'email' && !leer('email')?.trim() ? 'requerido' : tipo;
    }
    return { ok: false, spam: false, errores };
  }

  const { nombre, email, mensaje } = resultado.data;
  // Sin saltos de línea en el nombre: evita que alguien cuele cabeceras en el correo.
  return { ok: true, datos: { nombre: nombre.replace(/[\r\n]+/g, ' '), email, mensaje } };
}
