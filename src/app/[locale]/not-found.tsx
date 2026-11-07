// Página 404 con la marca y un enlace al inicio en el idioma de la URL.
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import styles from './not-found.module.css';

export default function NoEncontrada() {
  const t = useTranslations('noEncontrada');
  return (
    <main id="contenido" className={`contenedor ${styles.pagina}`}>
      <p className={styles.codigo} aria-hidden="true">
        404
      </p>
      <h1>{t('titulo')}</h1>
      <p>{t('texto')}</p>
      <Link href="/" className={styles.volver}>
        {t('volver')}
      </Link>
    </main>
  );
}
