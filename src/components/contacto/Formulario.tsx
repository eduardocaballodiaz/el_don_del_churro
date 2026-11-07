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
  const tiempo = useRef<HTMLInputElement>(null);
  const inicio = useRef(0);
  const bloqueado = useRef(false);

  // Filtro anti-spam: se mide en el navegador cuánto tarda el visitante en enviar
  // (performance.now no depende de la hora del reloj del ordenador).
  useEffect(() => {
    inicio.current = performance.now();
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
  // Tras un error, React vacía el formulario: se rellena de nuevo con lo que se escribió.
  const v = estado.valores;
  const atributosError = (campo: Campo) =>
    error(campo) ? { 'aria-invalid': true as const, 'aria-describedby': `error-${campo}` } : {};

  return (
    <form
      action={accion}
      className={styles.formulario}
      noValidate
      onSubmit={(e) => {
        // Segunda pulsación antes de que React desactive el botón: se ignora.
        if (bloqueado.current) {
          e.preventDefault();
          return;
        }
        bloqueado.current = true;
        if (tiempo.current) tiempo.current.value = String(Math.round(performance.now() - inicio.current));
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
          <input
            name="nombre"
            autoComplete="name"
            required
            maxLength={120}
            defaultValue={v?.nombre}
            {...atributosError('nombre')}
          />
          {mensajeError('nombre')}
        </label>
        <label className={styles.campo}>
          <span>{t('campos.email')}</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            defaultValue={v?.email}
            {...atributosError('email')}
          />
          {mensajeError('email')}
        </label>
      </div>

      <label className={styles.campo}>
        <span>{t('campos.mensaje')}</span>
        <textarea
          name="mensaje"
          rows={6}
          required
          maxLength={5000}
          defaultValue={v?.mensaje}
          {...atributosError('mensaje')}
        />
        {mensajeError('mensaje')}
      </label>

      {/* Anti-spam: campo trampa (oculto para personas) y momento de carga. */}
      <label className={styles.trampa} aria-hidden="true">
        Web
        <input name="web" tabIndex={-1} autoComplete="off" />
      </label>
      <input ref={tiempo} type="hidden" name="t" defaultValue="" />

      <label className={styles.casilla}>
        <input
          type="checkbox"
          name="privacidad"
          required
          defaultChecked={v?.privacidad}
          {...atributosError('privacidad')}
        />
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
