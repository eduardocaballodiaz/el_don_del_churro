// LO NUESTRO: los dos churros de la casa y cómo acompañarlos.
import { useTranslations } from 'next-intl';
import { Reveal } from '@/animations/Reveal';
import { ProductCard } from '@/components/ui/ProductCard';
import type { ImagenId } from '@/content/imagenes';
import s from './seccion.module.css';
import styles from './Productos.module.css';

const PRODUCTOS: { clave: 'finos' | 'rueda' | 'acompanar'; imagen: ImagenId }[] = [
  { clave: 'finos', imagen: 'finos' },
  { clave: 'rueda', imagen: 'rueda' },
  { clave: 'acompanar', imagen: 'ruedaChocolate' },
];

export function Productos() {
  const t = useTranslations('inicio.productos');
  return (
    <section className={s.seccion} aria-labelledby="titulo-productos">
      <div className="contenedor">
        <Reveal as="p" className={s.etiqueta}>
          {t('etiqueta')}
        </Reveal>
        <Reveal>
          <h2 id="titulo-productos" className={s.titulo}>
            {t('titulo')}
          </h2>
        </Reveal>
        <div className={`${styles.rejilla} grupo-tarjetas`}>
          {PRODUCTOS.map(({ clave, imagen }, i) => (
            <Reveal key={clave} delay={i * 0.12}>
              <ProductCard imagen={imagen} titulo={t(`${clave}.titulo`)} texto={t(`${clave}.texto`)} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
