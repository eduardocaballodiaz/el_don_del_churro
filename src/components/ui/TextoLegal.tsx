// TEXTO LEGAL (aviso legal, privacidad y cookies)
// El contenido está en messages/*.json → "legal". Los datos del titular salen de
// src/content/negocio.ts; mientras falten, se muestran como "[pendiente]" y se
// avisa arriba de forma visible. (Textos base: conviene que los revise un profesional.)
import { getTranslations } from 'next-intl/server';
import { negocio } from '@/content/negocio';
import styles from './TextoLegal.module.css';

export type PaginaLegal = 'avisoLegal' | 'privacidad' | 'cookies';
type Seccion = { titulo: string; parrafos: string[] };

export async function TextoLegal({ pagina }: { pagina: PaginaLegal }) {
  const t = await getTranslations('legal');
  const pendiente = `[${t('pendiente')}]`;
  const { calle, ciudad } = negocio.direccion;

  // Huecos que se rellenan dentro de los textos: {titular}, {nif}…
  const valores: Record<string, string> = {
    titular: negocio.titular?.nombre ?? pendiente,
    nif: negocio.titular?.nif ?? pendiente,
    domicilio: negocio.titular?.domicilio ?? pendiente,
    direccion: `${calle}, ${ciudad}`,
    email: negocio.email,
  };
  const rellenar = (texto: string) => texto.replace(/\{(\w+)\}/g, (_, clave) => valores[clave] ?? '');
  const secciones = t.raw(`${pagina}.secciones`) as Seccion[];

  return (
    <main id="contenido" className={`contenedor ${styles.pagina}`}>
      <h1 className={styles.titulo}>{t(`${pagina}.titulo`)}</h1>
      <p className={styles.fecha}>{t('actualizado')}</p>
      {!negocio.titular && pagina !== 'cookies' && (
        <p className={styles.pendiente} role="note">
          {t('avisoPendiente')}
        </p>
      )}
      {secciones.map((s) => (
        <section key={s.titulo} className={styles.seccion}>
          <h2>{s.titulo}</h2>
          {s.parrafos.map((p) => (
            <p key={p}>{rellenar(p)}</p>
          ))}
        </section>
      ))}
    </main>
  );
}
