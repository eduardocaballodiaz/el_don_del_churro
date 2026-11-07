// PIE DE PÁGINA
// Dirección, horario y contacto salen de src/content/negocio.ts (nunca se escriben aquí).
// Incluye la navegación completa: sin JavaScript, el menú móvil enlaza aquí (#navegacion-pie).
import Image from 'next/image';
import { getLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { formatearHorario, negocio } from '@/content/negocio';
import { ENLACE_CONTACTO, ENLACES_MENU } from './navegacion';
import styles from './Footer.module.css';

/** Enlace a Google Maps con la dirección (un enlace normal: no carga nada de Google). */
function enlaceMaps(): string {
  if (negocio.urlMaps) return negocio.urlMaps;
  const { calle, codigoPostal, ciudad } = negocio.direccion;
  const q = [calle, codigoPostal, ciudad].filter(Boolean).join(', ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

export async function Footer() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('footer');
  const tMenu = await getTranslations('header');
  const { calle, codigoPostal, ciudad } = negocio.direccion;

  return (
    <footer className={styles.pie}>
      <div className={`contenedor ${styles.rejilla}`}>
        <div className={styles.marca}>
          <Image src="/logo/sello-crema.svg" alt="El Don del Churro" width={112} height={112} unoptimized />
        </div>

        <section aria-labelledby="pie-direccion">
          <h2 id="pie-direccion" className={styles.titulo}>
            {t('direccion')}
          </h2>
          <address className={styles.texto}>
            {calle}
            <br />
            {[codigoPostal, ciudad].filter(Boolean).join(' ')}
          </address>
          <a className={styles.enlace} href={enlaceMaps()} target="_blank" rel="noopener noreferrer">
            {t('comoLlegar')} ↗
          </a>
        </section>

        <section aria-labelledby="pie-horario">
          <h2 id="pie-horario" className={styles.titulo}>
            {t('horario')}
          </h2>
          <ul className={styles.lista}>
            {!negocio.horario.dias && <li>{t('diasPendientes')}</li>}
            {formatearHorario(negocio.horario, locale).map((linea) => (
              <li key={linea}>{linea}</li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="pie-contacto">
          <h2 id="pie-contacto" className={styles.titulo}>
            {t('contacto')}
          </h2>
          <ul className={styles.lista}>
            <li>
              <a className={styles.enlace} href={`mailto:${negocio.email}`}>
                {negocio.email}
              </a>
            </li>
            {negocio.telefono && (
              <li>
                <a className={styles.enlace} href={`tel:${negocio.telefono.replace(/\s/g, '')}`}>
                  {negocio.telefono}
                </a>
              </li>
            )}
            {negocio.redes.map(({ red, url }) => (
              <li key={red}>
                <a className={styles.enlace} href={url} target="_blank" rel="noopener noreferrer">
                  {red.charAt(0).toUpperCase() + red.slice(1)} ↗
                </a>
              </li>
            ))}
          </ul>
        </section>

        <nav id="navegacion-pie" aria-label={t('navegacion')}>
          <h2 className={styles.titulo}>{t('navegacion')}</h2>
          <ul className={styles.lista}>
            {[...ENLACES_MENU, ENLACE_CONTACTO].map(({ clave, href }) => (
              <li key={clave}>
                <Link className={styles.enlace} href={href}>
                  {tMenu(clave)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className={`contenedor ${styles.legal}`}>
        <p>
          © {new Date().getFullYear()} {negocio.nombre}. {t('derechos')}
        </p>
        <nav aria-label={t('legal')}>
          <Link href="/aviso-legal">{t('avisoLegal')}</Link>
          <Link href="/privacidad">{t('privacidad')}</Link>
          <Link href="/cookies">{t('cookies')}</Link>
        </nav>
      </div>
    </footer>
  );
}
