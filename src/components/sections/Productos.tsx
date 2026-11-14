// LO NUESTRO: la carta en formato interactivo (ver CartaInteractiva).
import { useTranslations } from 'next-intl';
import { Reveal } from '@/animations/Reveal';
import { CartaInteractiva } from './CartaInteractiva';
import s from './seccion.module.css';

export function Productos() {
  const t = useTranslations('inicio.productos');
  return (
    <section id="lo-nuestro" className={s.seccion} aria-labelledby="titulo-productos">
      <div className="contenedor">
        <Reveal as="p" className={s.etiqueta}>
          {t('etiqueta')}
        </Reveal>
        <Reveal>
          <h2 id="titulo-productos" className={s.titulo}>
            {t('titulo')}
          </h2>
        </Reveal>
        <CartaInteractiva />
      </div>
    </section>
  );
}
