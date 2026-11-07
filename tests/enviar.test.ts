// Envío del correo con Resend (con un cliente simulado).
import { describe, expect, it, vi } from 'vitest';
import { enviarCorreo } from '@/lib/contacto/enviar';

const DATOS = { nombre: 'Ana', email: 'ana@example.com', mensaje: 'Hola' };

describe('enviarCorreo', () => {
  it('envía a info@ con respuesta al remitente', async () => {
    const send = vi.fn().mockResolvedValue({ data: { id: '1' }, error: null });
    const r = await enviarCorreo(DATOS, { emails: { send } });
    expect(r).toEqual({ ok: true });
    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'info@eldondelchurro.com',
        replyTo: 'ana@example.com',
        subject: 'Web El Don del Churro: mensaje de Ana',
      }),
    );
  });

  it('sin clave de Resend no rompe: devuelve ok:false para ofrecer el correo directo', async () => {
    const antes = { ...process.env };
    delete process.env.RESEND_API_KEY;
    delete process.env.CONTACTO_SIMULADO;
    await expect(enviarCorreo(DATOS)).resolves.toEqual({ ok: false });
    process.env = antes;
  });

  it('devuelve ok:false si Resend falla o lanza un error', async () => {
    const conError = { emails: { send: vi.fn().mockResolvedValue({ data: null, error: { message: 'x' } }) } };
    expect(await enviarCorreo(DATOS, conError)).toEqual({ ok: false });
    const queLanza = { emails: { send: vi.fn().mockRejectedValue(new Error('caído')) } };
    expect(await enviarCorreo(DATOS, queLanza)).toEqual({ ok: false });
  });
});
