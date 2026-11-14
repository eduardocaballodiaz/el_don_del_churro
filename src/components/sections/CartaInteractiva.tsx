'use client';

// PRESENTACIÓN DE PRODUCTOS (inicio)
// Bloques uno debajo de otro: Churros y Los caprichos del Don. Cada bloque es una
// tarjeta; al pulsarla se despliegan debajo sus productos (Finos y Rueda, o las
// cuatro latas). Al volver a pulsarla, se cierra.
//
// Accesibilidad y sin JavaScript:
// - Cada tarjeta es un botón con aria-expanded que controla su panel.
// - Sin JavaScript los paneles se ven abiertos (el CSS solo los cierra con la clase "js").
import Image from 'next/image';
import { useRef, useState, useSyncExternalStore } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Inclinable } from '@/animations/Inclinable';
import { gsap, useGSAP } from '@/animations/gsap';
import { useReducedMotion } from '@/animations/useReducedMotion';
import { carta, formatearPrecio, type Producto } from '@/content/carta';
import { CATEGORIAS, type CategoriaId } from '@/content/categorias';
import { imagenes } from '@/content/imagenes';
import type { Locale } from '@/i18n/routing';
import styles from './CartaInteractiva.module.css';

function precio(p: Producto | undefined, locale: Locale) {
  if (!p || p.precio === null) return null;
  return (p.suplemento ? '+' : '') + formatearPrecio(p.precio, locale);
}

/** Tarjeta de producto dentro de un panel desplegado (foto, nombre, precio y texto). */
function TarjetaProducto({ p, texto, locale }: { p: Producto; texto: string; locale: Locale }) {
  const img = p.imagen ? imagenes[p.imagen] : null;
  return (
    <Inclinable className={styles.inclinable}>
      <article className={styles.producto} data-item>
        {img && (
          <span className={styles.productoFoto}>
            <Image
              src={img.src}
              alt={img.alt[locale]}
              width={img.ancho}
              height={img.alto}
              sizes="(max-width: 640px) 100vw, 400px"
            />
          </span>
        )}
        <div className={styles.productoCuerpo}>
          <div className={styles.linea}>
            <h3>{p.nombre[locale]}</h3>
            {precio(p, locale) && <span className={styles.precio}>{precio(p, locale)}</span>}
          </div>
          {texto && <p>{texto}</p>}
        </div>
      </article>
    </Inclinable>
  );
}

export function CartaInteractiva() {
  const t = useTranslations('inicio.productos');
  const locale = useLocale() as Locale;
  const [abierta, setAbierta] = useState<CategoriaId | null>(null);
  const reducido = useReducedMotion();
  const zona = useRef<HTMLDivElement>(null);
  // true en el navegador, false en el servidor: los paneles solo se ocultan
  // (a lectores de pantalla incluidos) cuando la web ya funciona.
  const montado = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  // Al abrir una tarjeta, sus productos entran escalonados.
  useGSAP(
    () => {
      if (!abierta || reducido) return;
      gsap.from(`[data-panel="${abierta}"] [data-item]`, {
        y: 28,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out',
        // Al terminar se quitan los estilos en línea: si no, anularían el efecto
        // de crecer al pasar el ratón (que va en el CSS).
        clearProps: 'transform,opacity',
      });
    },
    { dependencies: [abierta, reducido], scope: zona },
  );

  const alternar = (id: CategoriaId) => setAbierta((actual) => (actual === id ? null : id));

  return (
    <div ref={zona}>
      <p className={styles.pista}>{t('pista')}</p>

      {CATEGORIAS.map(({ id, ancla, seccionCarta, imagen }) => {
        const img = imagenes[imagen];
        const activa = abierta === id;
        const productos = carta.filter((p) => p.categoria.es === seccionCarta);
        return (
          <div key={id} id={ancla} className={styles.bloque}>
            <Inclinable className={styles.inclinableCategoria}>
              <button
                type="button"
                id={`categoria-${id}`}
                className={`${styles.categoria} ${activa ? styles.activa : ''}`}
                aria-expanded={activa}
                aria-controls={`panel-${id}`}
                onClick={() => alternar(id)}
              >
                <span className={styles.foto}>
                  {/* Decorativa: el botón ya dice qué es. */}
                  <Image
                    src={img.src}
                    alt=""
                    aria-hidden="true"
                    width={img.ancho}
                    height={img.alto}
                    sizes="(max-width: 900px) 100vw, 1100px"
                  />
                </span>
                <span className={styles.cuerpo}>
                  <span className={styles.titulo}>{t(`categorias.${id}.titulo`)}</span>
                  <span className={styles.texto}>{t(`categorias.${id}.texto`)}</span>
                </span>
                <span className={styles.mas} aria-hidden="true" />
              </button>
            </Inclinable>

            <section
              id={`panel-${id}`}
              data-panel={id}
              data-abierto={activa ? '' : undefined}
              hidden={montado && !activa}
              className={styles.panel}
              aria-labelledby={`categoria-${id}`}
            >
              {id === 'churros' && <p className={styles.intro}>{t('churros.intro')}</p>}
              <div className={`${styles.productos} ${styles[`productos-${id}`]} grupo-productos`}>
                {id === 'churros'
                  ? (['finos', 'rueda'] as const).map((tipo) => {
                      const p = carta.find((x) => x.id === `churros-${tipo}`)!;
                      // En la presentación, el nombre corto ("Finos") y su origen.
                      const conNombreCorto = {
                        ...p,
                        nombre: { es: t(`churros.${tipo}.titulo`), en: t(`churros.${tipo}.titulo`) },
                      };
                      return (
                        <TarjetaProducto key={tipo} p={conNombreCorto} texto={t(`churros.${tipo}.origen`)} locale={locale} />
                      );
                    })
                  : productos.map((p) => (
                      <TarjetaProducto key={p.id} p={p} texto={p.descripcion[locale]} locale={locale} />
                    ))}
              </div>
            </section>
          </div>
        );
      })}
    </div>
  );
}
