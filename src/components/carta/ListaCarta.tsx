// LISTA DE LA CARTA
// Agrupa los productos por categoría (en el orden en que aparecen en carta.ts) y
// los muestra como una carta clásica: nombre, línea de puntos y precio.
// Recibe los productos y el idioma como parámetros para poder probarla aislada.
import Image from 'next/image';
import { formatearPrecio, type Producto } from '@/content/carta';
import { imagenes } from '@/content/imagenes';
import type { Locale } from '@/i18n/routing';
import styles from './ListaCarta.module.css';

type Props = { productos: Producto[]; locale: Locale };

/** Agrupa conservando el orden de la primera aparición de cada categoría. */
function agrupar(productos: Producto[], locale: Locale): [string, Producto[]][] {
  const grupos = new Map<string, Producto[]>();
  for (const p of productos) {
    const clave = p.categoria[locale];
    grupos.set(clave, [...(grupos.get(clave) ?? []), p]);
  }
  return [...grupos.entries()];
}

export function ListaCarta({ productos, locale }: Props) {
  return (
    <div className={styles.carta}>
      {agrupar(productos, locale).map(([categoria, lista], i) => {
        const id = `categoria-${i}`;
        return (
          <section key={categoria} className={styles.categoria} aria-labelledby={id}>
            <h2 id={id} className={styles.tituloCategoria}>
              {categoria}
            </h2>
            <ul className={styles.lista}>
              {lista.map((p) => {
                const foto = p.imagen ? imagenes[p.imagen] : null;
                return (
                  <li key={p.id} className={styles.producto}>
                    {foto && (
                      <Image
                        className={styles.foto}
                        src={foto.src}
                        alt={foto.alt[locale]}
                        width={160}
                        height={120}
                      />
                    )}
                    <div className={styles.cuerpo}>
                      <div className={styles.linea}>
                        <h3 className={styles.nombre}>{p.nombre[locale]}</h3>
                        <span className={styles.puntos} aria-hidden="true" />
                        {p.precio !== null && (
                          <span className={styles.precio}>{formatearPrecio(p.precio, locale)}</span>
                        )}
                      </div>
                      <p className={styles.descripcion}>{p.descripcion[locale]}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
