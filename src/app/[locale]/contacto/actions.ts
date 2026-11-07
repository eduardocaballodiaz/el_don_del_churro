'use server';

// Acción de servidor del formulario de contacto: valida y envía el correo.
// Funciona también sin JavaScript (el formulario se envía de forma tradicional).
import { enviarCorreo } from '@/lib/contacto/enviar';
import { validarContacto, type Campo, type CampoError } from '@/lib/contacto/validar';

export type EstadoFormulario = {
  estado: 'inicial' | 'enviado' | 'error-validacion' | 'error-envio';
  errores?: Partial<Record<Campo, CampoError>>;
  /** Lo que escribió el usuario, para devolvérselo si algo falla (no se pierde nada). */
  valores?: { nombre: string; email: string; mensaje: string; privacidad: boolean };
};

function valoresDe(form: FormData): NonNullable<EstadoFormulario['valores']> {
  const texto = (k: string) => String(form.get(k) ?? '').slice(0, 6000);
  return {
    nombre: texto('nombre'),
    email: texto('email'),
    mensaje: texto('mensaje'),
    privacidad: form.get('privacidad') === 'on',
  };
}

export async function enviarContacto(
  _anterior: EstadoFormulario,
  form: FormData,
): Promise<EstadoFormulario> {
  const resultado = validarContacto(form);

  // Al spam se le responde "enviado" sin enviar nada: así no aprende a esquivar el filtro.
  if (!resultado.ok && resultado.spam) return { estado: 'enviado' };
  if (!resultado.ok)
    return { estado: 'error-validacion', errores: resultado.errores, valores: valoresDe(form) };

  const { ok } = await enviarCorreo(resultado.datos);
  return ok ? { estado: 'enviado' } : { estado: 'error-envio', valores: valoresDe(form) };
}
