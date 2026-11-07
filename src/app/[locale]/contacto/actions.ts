'use server';

// Acción de servidor del formulario de contacto: valida y envía el correo.
// Funciona también sin JavaScript (el formulario se envía de forma tradicional).
import { enviarCorreo } from '@/lib/contacto/enviar';
import { validarContacto, type Campo, type CampoError } from '@/lib/contacto/validar';

export type EstadoFormulario = {
  estado: 'inicial' | 'enviado' | 'error-validacion' | 'error-envio';
  errores?: Partial<Record<Campo, CampoError>>;
};

export async function enviarContacto(
  _anterior: EstadoFormulario,
  form: FormData,
): Promise<EstadoFormulario> {
  const resultado = validarContacto(form);

  // Al spam se le responde "enviado" sin enviar nada: así no aprende a esquivar el filtro.
  if (!resultado.ok && resultado.spam) return { estado: 'enviado' };
  if (!resultado.ok) return { estado: 'error-validacion', errores: resultado.errores };

  const { ok } = await enviarCorreo(resultado.datos);
  return { estado: ok ? 'enviado' : 'error-envio' };
}
