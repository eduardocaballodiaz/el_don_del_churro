'use client';

// FORMULARIO DE CONTACTO
// - Envía con una acción de servidor (también sin JavaScript).
// - Mientras envía, el botón se desactiva: un doble clic no manda dos mensajes.
// - Los errores aparecen junto a cada campo y se anuncian a los lectores de pantalla.
// - Si el envío falla, ofrece escribir directamente al correo.
import { useActionState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { negocio } from '@/content/negocio';
import { enviarContacto, type EstadoFormulario } from '@/app/[locale]/contacto/actions';
import type { Campo } from '@/lib/contacto/validar';
import styles from './Formulario.module.css';

const INICIAL: EstadoFormulario = { estado: 'inicial' };

export function Formulario() {
  const t = useTranslations('contacto');
  const [estado, accion, enviando] = useActionState(enviarContacto, INICIAL);
  const marcaTiempo = useRef<HTMLInputElement>(null);
  const bloqueado = useRef(false);

  // Momento de carga para el filtro anti-spam (la página es estática, así que se pone en el navegador).
  useEffect(() => {
    if (marcaTiempo.current) marcaTiempo.current.value = String(Date.now());
  }, []);

  // Cuando llega la respuesta, se vuelve a permitir enviar.
  useEffect(() => {
    bloqueado.current = false;
  }, [estado]);

  if (estado.estado === 'enviado') {
    return (
      <p className={styles.exito} role="status">
        {t('ok')}
      </p>
    );
  }

  const error = (campo: Campo) => estado.errores?.[campo];
  const mensajeError = (campo: Campo) => {
    const e = error(campo);
    if (!e) return null;
    return (
      <span id={`error-${campo}`} className={styles.error}>
        {campo === 'privacidad' ? t('errores.privacidad') : t(`errores.${e}`)}
      </span>
    );
  };
  const atributosError = (campo: Campo) =>
    error(campo) ? { 'aria-invalid': true as const, 'aria-describedby': `error-${campo}` } : {};

  return (
    <form
      action={accion}
      className={styles.formulario}
      noValidate
      onSubmit={(e) => {
        // Segunda pulsación antes de que React desactive el botón: se ignora.
        if (bloqueado.current) e.preventDefault();
        bloqueado.current = true;
      }}
    >
      {estado.estado === 'error-validacion' && (
        <p className={styles.aviso} role="alert">
          {t('revisa')}
        </p>
      )}
      {estado.estado === 'error-envio' && (
        <p className={styles.aviso} role="alert">
          {t('fallo')} <a href={`mailto:${negocio.email}`}>{negocio.email}</a>
        </p>
      )}

      <div className={styles.fila}>
        <label className={styles.campo}>
          <span>{t('campos.nombre')}</span>
          <input name="nombre" autoComplete="name" required maxLength={120} {...atributosError('nombre')} />
          {mensajeError('nombre')}
        </label>
        <label className={styles.campo}>
          <span>{t('campos.email')}</span>
          <input name="email" type="email" autoComplete="email" required {...atributosError('email')} />
          {mensajeError('email')}
        </label>
      </div>

      <label className={styles.campo}>
        <span>{t('campos.mensaje')}</span>
        <textarea name="mensaje" rows={6} required maxLength={5000} {...atributosError('mensaje')} />
        {mensajeError('mensaje')}
      </label>

      {/* Anti-spam: campo trampa (oculto para personas) y momento de carga. */}
      <label className={styles.trampa} aria-hidden="true">
        Web
        <input name="web" tabIndex={-1} autoComplete="off" />
      </label>
      <input ref={marcaTiempo} type="hidden" name="t" defaultValue="" />

      <label className={styles.casilla}>
        <input type="checkbox" name="privacidad" required {...atributosError('privacidad')} />
        <span>
          {t('campos.privacidadAntes')} <Link href="/privacidad">{t('campos.privacidadEnlace')}</Link>
        </span>
      </label>
      {mensajeError('privacidad')}

      <p className={styles.info}>{t('infoBasica')}</p>

      <button type="submit" className={styles.enviar} disabled={enviando}>
        {enviando ? t('enviando') : t('enviar')}
      </button>
    </form>
  );
}
