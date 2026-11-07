// ENVÍO DEL CORREO DE CONTACTO con Resend (https://resend.com).
//
// Variables de entorno (ver .env.example):
// - RESEND_API_KEY       clave de la API de Resend (secreta: nunca en el código)
// - CONTACTO_DESTINO     a quién llegan los mensajes (info@eldondelchurro.com)
// - CONTACTO_REMITENTE   desde qué dirección se envían (debe ser de un dominio verificado en Resend)
// - CONTACTO_SIMULADO=1  no envía nada: solo para pruebas
//
// No se guarda ningún mensaje en ninguna base de datos: solo se reenvía por correo.
import { Resend } from 'resend';
import type { DatosContacto } from './validar';

type ClienteCorreo = {
  emails: {
    send: (opciones: {
      from: string;
      to: string;
      replyTo: string;
      subject: string;
      text: string;
    }) => Promise<{ error: unknown }>;
  };
};

const DESTINO_POR_DEFECTO = 'info@eldondelchurro.com';

/** Cliente falso para pruebas: "[simular-fallo]" en el mensaje provoca un error. */
const clienteSimulado: ClienteCorreo = {
  emails: {
    send: async ({ text }) => {
      if (text.includes('[simular-fallo]')) throw new Error('Fallo simulado');
      return { error: null };
    },
  },
};

/** Cliente de envío real, o null si falta la clave (entonces se ofrece el correo directo). */
function clientePorDefecto(): ClienteCorreo | null {
  if (process.env.CONTACTO_SIMULADO === '1') return clienteSimulado;
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY) as unknown as ClienteCorreo;
}

export async function enviarCorreo(
  datos: DatosContacto,
  clienteInyectado?: ClienteCorreo,
): Promise<{ ok: boolean }> {
  try {
    // Dentro del try: si crear el cliente falla, el usuario ve el aviso con el correo directo.
    const cliente = clienteInyectado ?? clientePorDefecto();
    if (!cliente) {
      console.error('[contacto] Falta RESEND_API_KEY: no se puede enviar el mensaje.');
      return { ok: false };
    }
    const { error } = await cliente.emails.send({
      from: `El Don del Churro <${process.env.CONTACTO_REMITENTE ?? 'onboarding@resend.dev'}>`,
      to: process.env.CONTACTO_DESTINO ?? DESTINO_POR_DEFECTO,
      replyTo: datos.email,
      subject: `Web El Don del Churro: mensaje de ${datos.nombre}`,
      text: `Nombre: ${datos.nombre}\nCorreo: ${datos.email}\n\n${datos.mensaje}\n`,
    });
    return { ok: !error };
  } catch {
    return { ok: false };
  }
}
