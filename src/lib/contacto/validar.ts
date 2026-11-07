// VALIDACIÓN DEL FORMULARIO DE CONTACTO
// Comprueba los campos y aplica dos protecciones anti-spam que no usan cookies:
// - "web": campo trampa oculto. Una persona nunca lo rellena; un robot sí.
// - "t": milisegundos entre la carga del formulario y el envío, medidos en el
//   navegador del visitante (así no influye que su reloj vaya adelantado o atrasado).
//   Menos de 3 s es un robot. Sin "t" (por ejemplo, sin JavaScript) no se puede medir y se acepta.
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

export function validarContacto(form: FormData): ResultadoValidacion {
  // 1. Protecciones anti-spam.
  if (String(form.get('web') ?? '').trim() !== '') return { ok: false, spam: true };
  const tRecibido = String(form.get('t') ?? '').trim();
  if (tRecibido !== '') {
    const transcurrido = Number(tRecibido);
    if (!Number.isFinite(transcurrido) || transcurrido < TIEMPO_MINIMO_MS) return { ok: false, spam: true };
  }

  // 2. Campos.
  const leer = (k: string) => {
    const v = form.get(k);
    return typeof v === 'string' ? v : undefined;
  };
  const resultado = esquema.safeParse({
    nombre: leer('nombre') ?? '',
    email: (leer('email') ?? '').trim(),
    // El navegador cuenta cada salto de línea como 1 carácter, pero lo envía como 2 (\r\n).
    mensaje: (leer('mensaje') ?? '').replace(/\r\n?/g, '\n'),
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
