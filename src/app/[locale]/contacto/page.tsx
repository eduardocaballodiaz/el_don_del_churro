// CONTACTO (/contacto · /en/contact)
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { use } from 'react';
import { Reveal } from '@/animations/Reveal';
import { Formulario } from '@/components/contacto/Formulario';
import { negocio } from '@/content/negocio';
import s from '@/components/sections/seccion.module.css';
import styles from './contacto.module.css';

export default function Contacto({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations('contacto');

  return (
    <main id="contenido" className={`${s.seccion} contenedor ${styles.rejilla}`}>
      <div>
        <Reveal as="p" className={s.etiqueta}>
          {t('etiqueta')}
        </Reveal>
        <Reveal>
          <h1 className={styles.titulo}>{t('titulo')}</h1>
        </Reveal>
        <Reveal as="p" className={s.texto}>
          {t('intro')}
        </Reveal>
        <Reveal as="p" className={styles.correo}>
          {t('otrasVias')} <a href={`mailto:${negocio.email}`}>{negocio.email}</a>
        </Reveal>
      </div>
      <Formulario />
    </main>
  );
}
