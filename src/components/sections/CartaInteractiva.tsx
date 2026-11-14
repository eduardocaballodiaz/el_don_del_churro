'use client';

// CARTA INTERACTIVA ("Lo nuestro")
// Cuatro tarjetas de categoría. Al pulsar una, se despliegan debajo sus productos
// (en Churros: Finos y Rueda con un poco de su origen). Solo una abierta a la vez;
// al volver a pulsarla, se cierra.
//
// Accesibilidad y sin JavaScript:
// - Cada tarjeta es un botón con aria-expanded que controla su panel.
// - Sin JavaScript todos los paneles se ven abiertos (el CSS solo los cierra con la clase "js").
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
import { Link } from '@/i18n/navigation';
import styles from './CartaInteractiva.module.css';

function precio(p: Producto | undefined, locale: Locale) {
  if (!p) return null;
  if (p.precio !== null) return (p.suplemento ? '+' : '') + formatearPrecio(p.precio, locale);
  // Con tamaños: "desde 1,50 €"
  if (p.variantes?.length) {
    const minimo = Math.min(...p.variantes.map((v) => v.precio));
    return `${locale === 'es' ? 'desde' : 'from'} ${formatearPrecio(minimo, locale)}`;
  }
  return null;
}

export function CartaInteractiva() {
  const t = useTranslations('inicio.productos');
  const locale = useLocale() as Locale;
  const [abierta, setAbierta] = useState<CategoriaId | null>(null);
  // true en el navegador, false en el servidor: así los paneles solo se ocultan
  // (a lectores de pantalla incluidos) cuando la web ya funciona.
  const montado = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const reducido = useReducedMotion();
  const zona = useRef<HTMLDivElement>(null);

  // Al abrir una categoría, sus tarjetas entran escalonadas.
  useGSAP(
    () => {
      if (!abierta || reducido) return;
      gsap.from(`[data-panel="${abierta}"] [data-item]`, {
        y: 28,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out',
      });
    },
    { dependencies: [abierta, reducido], scope: zona },
  );

  const alternar = (id: CategoriaId) => setAbierta((actual) => (actual === id ? null : id));

  return (
    <div ref={zona}>
      <p className={styles.pista}>{t('pista')}</p>

      <div className={`${styles.categorias} grupo-categorias`}>
        {CATEGORIAS.map(({ id, imagen }) => {
          const img = imagen ? imagenes[imagen] : null;
          const activa = abierta === id;
          return (
            <Inclinable key={id} className={styles.inclinable}>
              <button
                type="button"
                id={`categoria-${id}`}
                className={`${styles.categoria} ${activa ? styles.activa : ''}`}
                aria-expanded={activa}
                aria-controls={`panel-${id}`}
                onClick={() => alternar(id)}
              >
                <span className={`${styles.foto} ${img ? '' : styles.sinFoto}`}>
                  {/* Decorativa: el botón ya dice qué categoría es. Sin foto, el sello de la marca. */}
                  <Image
                    src={img ? img.src : '/logo/sello-color.svg'}
                    alt=""
                    aria-hidden="true"
                    width={img ? img.ancho : 160}
                    height={img ? img.alto : 160}
                    sizes="(max-width: 700px) 50vw, 300px"
                    unoptimized={!img}
                  />
                </span>
                <span className={styles.cuerpo}>
                  <span className={styles.titulo}>{t(`categorias.${id}.titulo`)}</span>
                  <span className={styles.texto}>{t(`categorias.${id}.texto`)}</span>
                </span>
                <span className={styles.mas} aria-hidden="true" />
              </button>
            </Inclinable>
          );
        })}
      </div>

      {CATEGORIAS.map(({ id, seccionCarta }) => {
        const activa = abierta === id;
        const productos = carta.filter((p) => p.categoria.es === seccionCarta);
        return (
          <section
            key={id}
            id={`panel-${id}`}
            data-panel={id}
            data-abierto={activa ? '' : undefined}
            hidden={montado && !activa}
            className={styles.panel}
            aria-labelledby={`categoria-${id}`}
          >
            {id === 'churros' ? (
              <>
                <p className={styles.intro}>{t('churros.intro')}</p>
                <div className={styles.dos}>
                  {(['finos', 'rueda'] as const).map((tipo) => {
                    const p = carta.find((x) => x.id === `churros-${tipo}`);
                    const img = imagenes[tipo];
                    return (
                      <article key={tipo} className={styles.churro} data-item>
                        <Image src={img.src} alt={img.alt[locale]} width={img.ancho} height={img.alto} sizes="(max-width: 700px) 100vw, 520px" />
                        <div className={styles.churroCuerpo}>
                          <div className={styles.linea}>
                            <h3>{t(`churros.${tipo}.titulo`)}</h3>
                            {precio(p, locale) && <span className={styles.precio}>{precio(p, locale)}</span>}
                          </div>
                          <p>{t(`churros.${tipo}.origen`)}</p>
                        </div>
                      </article>
                    );
                  })}
                </div>
                {/* Otros churros (por ejemplo, los rellenos), en formato compacto. */}
                <ul className={styles.items}>
                  {productos
                    .filter((p) => p.id !== 'churros-finos' && p.id !== 'churros-rueda')
                    .map((p) => (
                      <li key={p.id} className={styles.item} data-item>
                        <div className={styles.linea}>
                          <h3>{p.nombre[locale]}</h3>
                          {precio(p, locale) && <span className={styles.precio}>{precio(p, locale)}</span>}
                        </div>
                        {p.descripcion[locale] && <p>{p.descripcion[locale]}</p>}
                      </li>
                    ))}
                </ul>
              </>
            ) : (
              <ul className={styles.items}>
                {productos.map((p) => (
                  <li key={p.id} className={styles.item} data-item>
                    {p.imagen && (
                      <Image
                        className={styles.itemFoto}
                        src={imagenes[p.imagen].src}
                        alt={imagenes[p.imagen].alt[locale]}
                        width={imagenes[p.imagen].ancho}
                        height={imagenes[p.imagen].alto}
                        sizes="(max-width: 640px) 100vw, 300px"
                      />
                    )}
                    <div className={styles.linea}>
                      <h3>{p.nombre[locale]}</h3>
                      {precio(p, locale) && <span className={styles.precio}>{precio(p, locale)}</span>}
                    </div>
                    {p.descripcion[locale] && <p>{p.descripcion[locale]}</p>}
                  </li>
                ))}
              </ul>
            )}
            <Link href="/carta" className={styles.verTodo}>
              {t('verCartaCompleta')} →
            </Link>
          </section>
        );
      })}
    </div>
  );
}
