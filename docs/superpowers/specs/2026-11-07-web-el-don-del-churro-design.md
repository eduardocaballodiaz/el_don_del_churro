# Web de El Don del Churro · Documento de diseño (fase 1)

**Fecha:** 7 de noviembre de 2026
**Titular:** Edu (Eduardo Caballo Díaz), dueño de El Don del Churro
**Estado:** aprobado por Edu el 7 de noviembre de 2026

> Cómo leer este documento: lo marcado como **[decidido por Edu]** se acordó en la sesión de preguntas. Lo marcado como **[propuesta]** es una decisión técnica nuestra, que Edu puede corregir. Lo que queda **[a criterio de quien construya]** no cambia lo que se entrega.

---

## 1. Qué es y por qué

El Don del Churro es una churrería en el centro de Sevilla. El local tiene una imagen muy cuidada: rótulo verde oliva con letras doradas iluminadas por LED cálido, paredes encaladas, zócalo verde, madera, latón y láminas botánicas de olivo (ver `docs/referencias/fachada-rotulo.webp`).

La web tiene que cumplir tres funciones a la vez **[decidido por Edu]**:

1. **Atraer a la tienda:** que quien la vea (vecinos y turistas) quiera venir y sepa dónde estáis y cuándo abrís.
2. **Recibir mensajes:** un formulario de contacto que llega a `info@eldondelchurro.com`.
3. **Construir marca:** transmitir la misma calidad que el local.

Edu quiere una web **viva**, con animaciones modernas, profesionales y realistas, y efectos al pasar el cursor por los elementos y menús.

**Por qué ahora:** la web es la base sobre la que irá más adelante una **tarjeta de sellos digital** (fase 2). Esta fase debe dejar el proyecto preparado para ello.

## 2. Objetivos, no objetivos y antiobjetivos

**Objetivos**
- Una web en español e inglés, rápida, accesible y bien posicionada en Google, sobre todo en búsquedas locales ("churrería centro Sevilla", "churros Seville").
- Animaciones y efectos que hagan sentir la web viva, sin perder velocidad.
- Cumplir la normativa española y europea (RGPD, LOPDGDD, LSSI-CE y la guía de cookies de la AEPD).
- Que se vea bien al compartir enlaces en WhatsApp e Instagram.
- Código limpio, ordenado y **comentado en español**, fácil de mantener **[decidido por Edu]**.
- Coste fijo mensual de alojamiento: **0 €** **[decidido por Edu]**.

**No objetivos (fase 1)**
- La tarjeta de sellos, las cuentas de cliente, los pedidos o las reservas online: van en la fase 2, con su propio diseño.
- Un panel para que Edu edite los textos sin código. Los textos viven en archivos del proyecto.
- Venta online.

**Antiobjetivos (aunque funcione, sería un fracaso si…)**
- …se ve barato, con un 3D de aspecto "videojuego antiguo" o efectos llamativos sin calidad.
- …las animaciones retrasan la carga o tapan el contenido: en el móvil tiene que cargar rápido y leerse aunque falle el JavaScript.
- …aparece un banner de cookies porque se metió un servicio que las pone sin necesidad.
- …muestra datos inventados: precios, direcciones u horarios que no haya dado Edu.
- …parte del contenido solo existe en un idioma.

## 3. Restricciones

- **Dominio y correo:** `eldondelchurro.com` está registrado en **Hostalia** y se queda allí. El correo `info@` también sigue en Hostalia. Para publicar solo se cambian los registros DNS de la web, **nunca los MX** del correo.
- **Alojamiento de la web:** **Netlify, plan gratuito** (permite uso comercial). Hay que comprobar sus condiciones vigentes antes del alta.
- **Edu no es programador y se le olvidan las tecnologías.** En el plan de trabajo, cada paso que exija crear una cuenta debe avisarle en ese momento: qué servicio, para qué, el enlace, qué plan elegir y qué dato hay que devolver (ver §9).
- **No usar como referencia** la web anterior que hay en `Logo/Claude outputs/el-don-del-churro-web.zip` **[decidido por Edu]**.
- Sin precios, dirección exacta ni horarios hasta que Edu los dé (ver §10).

## 4. Enfoques considerados

| Enfoque | A favor | En contra | Resultado |
|---|---|---|---|
| **Astro, estático en Hostalia** | Rapidísimo, sin coste nuevo, HTML casi puro | Sin Node en Hostalia: la tarjeta de sellos obligaría a mudarse o a hacerla en PHP | Descartado al aparecer la fase 2 |
| **HTML, CSS y JS con Vite** | El más simple | Dos idiomas a mano, sin sitemap ni optimización de imágenes; se mantiene mal | Descartado |
| **WordPress en Hostalia** | Edición desde un panel | Lento, actualizaciones constantes, las animaciones a medida chocan con el tema | Descartado |
| **Next.js en Vercel** | La plataforma natural de Next.js | Uso comercial = plan Pro, unos 20 $/mes | Descartado por coste |
| **Next.js en Netlify (gratis)** | Un solo proyecto para la web y la futura app, Node disponible, despliegue automático, páginas estáticas para el posicionamiento | Límite mensual de uso en el plan gratuito; si se superara, plan de unos 9 $/mes | **Elegido por Edu** |

**Tarjeta de sellos (fase 2):** Edu eligió una **app web instalable (PWA)**, a la que se accede con un QR en el mostrador y que se puede añadir a la pantalla de inicio, en vez de una app de las tiendas. Vivirá en este mismo proyecto.

## 5. Decisiones técnicas

| Pieza | Elección | Por qué |
|---|---|---|
| Framework | **Next.js** (versión estable actual, App Router) con **TypeScript** **[propuesta]** | TypeScript detecta errores antes y documenta el código; ayuda al mantenimiento |
| Alojamiento | **Netlify**, plan gratuito **[decidido por Edu]** | 0 €/mes, despliegue automático desde GitHub |
| Código fuente | **GitHub**, repositorio privado **[propuesta]** | Lo necesita Netlify; además da historial de cambios |
| Idiomas | **next-intl** **[propuesta]**. Español por defecto en `/`, inglés en `/en/` **[decidido por Edu]** | Rutas por idioma, textos en `messages/es.json` y `messages/en.json` |
| Estilos | **CSS Modules** + variables CSS globales para colores, espaciado y tipografía **[propuesta]** | CSS normal y legible, junto a cada componente. Sin Tailwind, para que el código se lea sin aprender otra sintaxis |
| Animación | **GSAP** (con ScrollTrigger) + **@gsap/react** **[propuesta]** | El estándar en webs premiadas; ahora gratis con todos sus plugins |
| Scroll suave | **Lenis** **[propuesta]** | Da la sensación "premium" al desplazarse |
| Tipografías | Con `next/font`, **alojadas en el propio dominio** (sin peticiones a Google) **[propuesta]** | Cumple el RGPD y carga más rápido |
| Imágenes | `next/image` (WebP/AVIF, varios tamaños, carga diferida) **[propuesta]** | Velocidad y posicionamiento |
| Formulario | Server Action o Route Handler de Next.js → **Resend** → `info@eldondelchurro.com` **[propuesta]** | Gratis hasta 3.000 correos/mes, mejor entrega que `mail()`. Necesita registros SPF/DKIM en Hostalia |
| Estadísticas | **Ninguna en la web** + Google Search Console + Google Business Profile **[propuesta]** | Sin cookies, sin banner y sin coste |
| 3D (Three.js) | **No en la fase 1** **[propuesta]** | Hay que evitar el antiobjetivo del "aspecto PlayStation 1". El realismo se consigue con fotografía, luz y movimiento. Se puede reconsiderar más adelante con un modelo 3D profesional |

## 6. Identidad visual

**Paleta** (del logo y el rótulo) **[propuesta, basada en la fachada]**

| Variable | Color | Uso |
|---|---|---|
| `--oliva` | `#3C4229` | Fondo del sello, bandas y secciones oscuras |
| `--oliva-rotulo` | `#3F4A2B` | Banda del encabezado (con una textura sutil de ruido) |
| `--oliva-oscuro` | `#23281A` | Fondos profundos, pie de página |
| `--oro` | `#D4A448` | Filetes, bordes, botones, iconos |
| `--crema` | `#FFF3D6` | Texto sobre oscuro, letras del logo |
| `--led` | `#FFC24D` | **Solo para luz**: brillos, halos y tiras LED |
| `--cal` | `#F4EFE6` | Fondo de las secciones claras (pared encalada) |

**Tipografía [propuesta]:** una serifa con carácter para los titulares, en el espíritu de "CHURRO" (la maqueta usa *Fraunces*), y una sans geométrica muy espaciada en mayúsculas para el menú y las etiquetas, como "CHURRERÍA" en la fachada (la maqueta usa *Montserrat*). Elegir las definitivas es **[a criterio de quien construya]**, siempre que respeten ese espíritu.

**Recursos gráficos:** el sello en sus versiones color, contornos y una tinta (`../Logo /01_Color`, `02_Contornos`, `03_Una_tinta`, en SVG). La ola dorada del logo como motivo recurrente (subrayados, separadores). Texturas y detalles del local: madera, latón y láminas de olivo.

**Fotografía [decidido por Edu]:** las fotos actuales son **provisionales**. Cuando el local esté abierto se hará una sesión de fotos real del producto y del local, y se sustituirán. Por eso: (1) cambiar una foto debe ser tan simple como reemplazar el archivo, porque todas se referencian desde un solo sitio (`src/content/imagenes.ts`); (2) mientras tanto, la portada y El Don de Latas **no deben depender de una foto a pantalla completa en alta resolución** (las actuales miden 1536×1024). Se usarán composiciones con la foto a un tamaño en el que se vea nítida, combinada con color, luz y movimiento, y el diseño debe estar preparado para usar fotos grandes cuando lleguen las reales. Las fotos provisionales son las de `../img/nuevas/` (finos, largos, con café o con chocolate) y `../img/El Don de Latas.png`. **No usar** `el-don-del-churro-web.jpg` ni `churros-largos-2.jpg`: llevan la marca de otro negocio. Sirven solo como referencia de cómo son los largos (porras).

## 7. Encabezado (decidido con maqueta)

Maqueta de referencia: `docs/referencias/maqueta-encabezado.html` (**opción B**, elegida por Edu).

- Banda verde oliva con textura, inspirada en el rótulo, con una **tira LED** cálida en el borde inferior que "respira" muy despacio.
- **Rótulo a la izquierda, como en la caja de la marca [decidido por Edu, 7-nov]** (`docs/referencias/caja-churros.webp`), **sin corona**: "EL DON DEL" en mayúsculas con serifa y con los filetes dorados de la fachada a los lados; "CHURRO" con la tipografía de la caja y cuatro capas (borde negro grueso, filete dorado, línea negra fina y letra crema); debajo, "CHURRERÍA" entre filetes. Está vectorizado a partir de la foto de la caja (`public/logo/rotulo.svg`). **Si aparece el archivo original del diseño de la caja, conviene sustituirlo.** Mide unos 270 px de ancho en escritorio y 170 px al compactarse o en móvil.
- **Al pasar el cursor por el rótulo [decidido por Edu]:** crece (alrededor de un 8%), se ilumina por detrás con luz LED cálida mediante un **fundido suave, sin parpadeo**, y "EL DON DEL" pasa de crema a oscuro con una transición fluida. Para eso el rótulo va incrustado en la página (SVG en línea), no como imagen.
- **Menú a la derecha**, en mayúsculas espaciadas. Al pasar el cursor, el texto se ilumina un poco y se dibuja debajo la ola dorada del logo **[propuesta, mostrada en la maqueta]**.
- **Selector de idioma ES / EN** en el encabezado **[decidido por Edu]**. Al cambiar de idioma se mantiene la misma página en el otro idioma.
- **Botón "Contacto"** con borde dorado, que se rellena de oro y brilla al pasar el cursor.
- **Al hacer scroll [propuesta]:** el encabezado se compacta (menos alto y logo más pequeño) y queda fijo arriba.
- **En móvil [propuesta]:** botón de menú que abre un panel a pantalla completa en verde oliva, con los enlaces animados en cascada y el selector de idioma. Los efectos de hover tienen un equivalente al tocar.

## 8. Estructura y contenido

**Páginas [propuesta]** (cada una con su versión en inglés):

| Ruta (ES / EN) | Contenido |
|---|---|
| `/` · `/en` | **Inicio:** portada a pantalla completa con fotografía y titular animado, presentación de la casa, productos destacados (finos, largos, con chocolate o café), El Don de Latas, el local (ambiente, fotos), cómo llegar y llamada a contacto |
| `/carta` · `/en/menu` | **La carta.** El contenido lo prepara Edu en otro chat. Se guardará como datos estructurados (`src/content/carta.ts`) con nombre, descripción, precio y foto por idioma. Hasta entonces, la página existe pero sin productos ni precios inventados |
| `/contacto` · `/en/contact` | Formulario, dirección, horario, mapa que se carga al pulsar y enlaces a redes |
| `/aviso-legal`, `/privacidad`, `/cookies` (y sus versiones en inglés) | Páginas legales (ver §11) |
| `404` | Página de error con la marca y un enlace al inicio |

El menú principal enlaza a Inicio, La carta, El Don de Latas (sección de Inicio), Nosotros (sección de Inicio) y Contacto. Los nombres exactos y el orden son **[a criterio de quien construya]**.

**Textos:** todos en `messages/es.json` y `messages/en.json`. Nada de textos sueltos dentro de los componentes.

**Quién escribe los textos [propuesta]:** los redactamos nosotros en los dos idiomas (titulares, presentación, descripciones de producto y El Don de Latas) y Edu los aprueba antes de publicar. **Sin inventar hechos:** nada de años de fundación, historia familiar, recetas "de la abuela" ni premios que Edu no haya contado. Mientras no los cuente, los textos hablan de lo que se ve y se puede comprobar: el producto, el local y el momento de comerse un churro recién hecho. Se le pedirán dos o tres datos de la casa para la sección Nosotros.

**El Don de Latas:** postres en capas servidos en lata. Por la foto, hay uno de chocolate y otro de pistacho con nata. Edu confirmará sabores, descripción y precios con la carta.

## 9. Animaciones e interacción

**Principios**
- **Primero el contenido, luego la animación:** la página se genera como HTML completo y se lee sin JavaScript. Las animaciones se añaden por encima y nunca ocultan contenido de forma permanente.
- **Movimiento realista:** curvas de aceleración suaves y naturales, nada de rebotes exagerados. Inspiración: luz cálida, vapor, azúcar, textura.
- **Respeto a quien no quiere movimiento:** con `prefers-reduced-motion` se desactivan el scroll suave y las animaciones grandes, y solo quedan fundidos breves.
- **Rendimiento:** animar solo `transform` y `opacity`, y cargar GSAP y Lenis sin bloquear el primer pintado.

**Catálogo [propuesta]** (los detalles de cada uno quedan **[a criterio de quien construya]**):
- Encabezado: el logo con LED, la ola en el menú y el encabezado que se compacta (§7).
- Portada: el titular aparece línea a línea y la foto tiene un leve movimiento de profundidad (parallax).
- Revelado de secciones al hacer scroll: textos e imágenes entran con desplazamiento y fundido.
- Tarjetas de producto: al pasar el cursor, zoom lento de la foto, inclinación 3D sutil siguiendo el cursor y un brillo dorado en el borde.
- Botones "magnéticos" que se acercan ligeramente al cursor.
- El Don de Latas: la foto se expande hasta ocupar la pantalla con el scroll.
- Un cursor personalizado discreto (un punto dorado que crece sobre los elementos interactivos), **solo en escritorio**.
- Transiciones suaves entre páginas.
- Scroll suave con Lenis.

## 10. Datos que tiene que dar Edu (pendientes)

**Qué hace falta para publicar [decidido por Edu]:** la web se publica **con la carta completa**, nunca con "Próximamente". Requisitos para salir a producción: carta, datos legales del titular, días de apertura y textos aprobados por Edu. Mientras tanto, todo se construye y se revisa en la dirección de pruebas de Netlify, con huecos claramente marcados.

Datos pendientes:

1. ✅ **Dirección:** Calle Correduría, 42, Sevilla (zona de la Alameda de Hércules). El código postal (probablemente 41002) está por confirmar.
2. ✅ **Horario:** mañanas de 7:00 a 13:00 y tardes de 17:00 a 20:00. Falta confirmar **qué días** abre y si hay día de cierre.
3. **Teléfono** (si se quiere mostrar) y **WhatsApp** (si se usa).
4. **Redes sociales:** qué cuentas existen (Instagram, TikTok, Facebook…) y sus enlaces.
5. **Datos legales del titular** para el aviso legal: nombre completo o razón social, NIF y domicilio. Edu todavía no es autónomo; los dará cuando lo sea.
6. **La carta**, con productos, descripciones y precios.
7. Si las **ruedas** siguen en la carta o los **largos** las sustituyen.
8. **Fotos del local real.** La de la fachada sirve como referencia; habrá que confirmar si se puede publicar o si es un montaje.

## 11. Normativa

- **Cookies:** la web **no usará cookies que necesiten consentimiento**. Por eso **no lleva banner**, pero sí una política de cookies que explica que solo hay cookies técnicas (o ninguna). Si en el futuro se añade Google Analytics, el píxel de Meta, vídeos de YouTube o similares, habrá que poner un banner conforme a la AEPD, con "Aceptar" y "Rechazar" igual de visibles.
- **Mapa [decidido por Edu, 8-nov: solo el mapa de Google; se retira el plano ilustrado]:** antes había un **plano ilustrado propio** en SVG, con el estilo de la marca (calles cercanas, la Alameda de Hércules como referencia y el sello en la ubicación). No necesita cuentas ni claves y no conecta con nadie. Debajo, un botón "Cómo llegar" que abre Google Maps en una pestaña nueva (es un enlace normal, sin cookies). Opcionalmente, el mapa interactivo de Google se carga solo si el usuario pulsa, con un aviso de que se conecta a Google. No se usa Google Static Maps (pediría una clave y datos de facturación).
- **Tipografías:** alojadas en el propio dominio.
- **Formulario:**
  - casilla de aceptación de la privacidad, sin marcar por defecto;
  - texto con la información básica de protección de datos (responsable, finalidad, base legal, derechos y enlace a la política de privacidad);
  - protección anti-spam sin cookies (campo trampa y control de tiempo);
  - no se guardan los mensajes en ninguna base de datos: solo se envían por correo.
- **Páginas legales:** aviso legal (LSSI-CE, art. 10), política de privacidad (RGPD, art. 13) y política de cookies, en los dos idiomas. Las redactamos nosotros como base; **conviene que las revise un profesional**.
- **Accesibilidad:** objetivo WCAG 2.2 nivel AA. Contraste suficiente (el oro sobre crema no vale para texto pequeño), navegación con teclado, foco visible, textos alternativos y un enlace para saltar al contenido.

## 12. Posicionamiento (SEO) y redes

- Título y descripción propios por página e idioma (Metadata API de Next.js).
- Etiquetas `hreflang` que enlazan cada página con su versión en el otro idioma, más `x-default`.
- `sitemap.xml` y `robots.txt` generados automáticamente.
- **Datos estructurados JSON-LD** de tipo `Restaurant` (o `Bakery`) con nombre, logo, dirección, coordenadas, horario, teléfono, carta y redes (`sameAs`).
- **Imágenes para compartir (Open Graph)** de 1200×630 por página, con la marca, para WhatsApp, Instagram y Facebook.
- URL canónicas y una sola versión del dominio: `https://eldondelchurro.com`, con `www` redirigiendo a ella.
- Objetivo de **Lighthouse en móvil ≥ 90** en rendimiento, accesibilidad, buenas prácticas y SEO, y Core Web Vitals en verde.
- **Fuera de la web, pero lo más importante para el posicionamiento local:** crear o completar la ficha de **Google Business Profile** con la misma dirección, horario y enlace a la web.

## 13. Cuentas y servicios (con cuándo crear cada una)

Este es el orden en que se le pedirá a Edu cada cuenta. Quien construya debe **avisarle en ese momento** y no antes:

| Cuándo | Servicio | Para qué | Plan |
|---|---|---|---|
| Al empezar a programar | **GitHub** | Guardar el código y conectar con Netlify | Gratis |
| Al publicar la primera versión de prueba | **Netlify** | Alojar la web | Gratis |
| Al conectar el formulario | **Resend** | Enviar los mensajes a `info@` (hay que añadir registros DNS en Hostalia) | Gratis |
| Al publicar en el dominio | **Hostalia** (panel DNS, cuenta ya existente) | Apuntar la web a Netlify sin tocar el correo | Lo que ya paga |
| Al publicar en el dominio | **Google Search Console** | Ver cómo aparece la web en Google y enviar el sitemap | Gratis |
| Cuanto antes (no depende de la web) | **Google Business Profile** | Aparecer en Google Maps | Gratis |
| Fase 2 | **Neon** (u otra base de datos) | Tarjeta de sellos | Gratis al empezar |

## 14. Estructura del código [propuesta]

```
src/
  app/[locale]/            páginas por idioma (inicio, carta, contacto, legales)
  components/
    layout/                Header, Footer, MobileMenu, LanguageSwitcher
    sections/              secciones de la página de inicio (Hero, Productos, Latas…)
    ui/                    piezas pequeñas reutilizables (Button, Card…)
  animations/              hooks y utilidades de GSAP y Lenis
  content/                 datos estructurados (carta, datos del negocio)
  i18n/                    configuración de idiomas y rutas
  lib/                     utilidades (SEO, JSON-LD, envío de correo)
  styles/                  variables globales (colores, tipografía, espaciado)
messages/                  es.json, en.json
public/                    logos, imágenes, favicon
```

- Comentarios en español que expliquen **por qué** se hace cada cosa, no solo qué hace.
- Un `README.md` en español con cómo arrancar el proyecto, cómo cambiar textos y colores, y cómo publicar.
- Los datos del negocio (dirección, horario, teléfono, redes) en **un solo archivo** (`src/content/negocio.ts`), que alimenta el pie, la página de contacto y el JSON-LD.
- **Preparado para la fase 2:** la tarjeta de sellos podrá añadirse como una sección propia (por ejemplo `/tarjeta`) con su propia lógica de servidor, sin tocar la web pública.

## 15. A criterio de quien construya

- Las tipografías definitivas, dentro del espíritu descrito en §6.
- Los tiempos, curvas e intensidades exactos de cada animación.
- La composición de cada sección de Inicio.
- Las herramientas de calidad (linter, formateador, pruebas) y su configuración.
- Las versiones concretas de las librerías (las estables actuales).
