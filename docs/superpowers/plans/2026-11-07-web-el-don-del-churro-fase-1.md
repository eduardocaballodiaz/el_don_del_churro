# Web de El Don del Churro (fase 1) · Plan de implementación

> **Para agentes que ejecuten el plan:** SUB-SKILL OBLIGATORIA: usar superpowers:subagent-driven-development (recomendada) o superpowers:executing-plans para implementarlo tarea a tarea. Los pasos usan casillas (`- [ ]`) para el seguimiento.

**Objetivo:** construir la web bilingüe (ES/EN) de El Don del Churro con Next.js, animaciones de alta calidad, formulario a `info@eldondelchurro.com`, SEO local y cumplimiento legal, desplegada en Netlify gratis y lista para recibir después la tarjeta de sellos (fase 2).

**Arquitectura:** Next.js (App Router) con páginas estáticas por idioma mediante next-intl (`/` español, `/en` inglés, slugs traducidos). Los datos del negocio, la carta y las imágenes viven en módulos de `src/content/`, que son la única fuente para la interfaz, el JSON-LD y la comprobación de lanzamiento. Las animaciones (GSAP + Lenis) son una capa progresiva sobre HTML completo. El formulario es una Server Action que valida y envía con Resend.

**Tecnología:** Node 22 · Next.js 16 · TypeScript · next-intl 4 · CSS Modules · GSAP 3 (+ @gsap/react) · Lenis · Resend · Zod · Vitest + Testing Library · Playwright · Netlify.

**Especificación:** `docs/superpowers/specs/2026-11-07-web-el-don-del-churro-design.md` (leerla entera antes de empezar).

## Restricciones globales

- **Idiomas:** español por defecto en `/`, inglés en `/en`. Todo el contenido existe en ambos idiomas y no hay textos sueltos en los componentes: van en `messages/es.json` y `messages/en.json`.
- **Comentarios en español** que expliquen el *porqué*. `README.md` en español.
- **Cero cookies que requieran consentimiento y sin banner.** Sin Google Fonts remoto, sin analítica, sin iframes de terceros salvo el mapa de Google tras clic explícito.
- **No inventar datos:** nada de precios, días, coordenadas, teléfono, redes, datos del titular ni historia que no estén en `src/content/`. Lo desconocido vale `null`, nunca un valor de relleno.
- **Datos fijados por la especificación:** dirección "Calle Correduría, 42", "Sevilla"; horario con dos tramos, de 07:00 a 13:00 y de 17:00 a 20:00 (días pendientes); correo `info@eldondelchurro.com`; dominio canónico `https://eldondelchurro.com`.
- **Paleta** (como variables CSS con estos nombres y valores): `--oliva #3C4229`, `--oliva-rotulo #3F4A2B`, `--oliva-oscuro #23281A`, `--oro #D4A448`, `--crema #FFF3D6`, `--led #FFC24D` (solo para luz), `--cal #F4EFE6`.
- **Fotos:** solo de `../img/nuevas/` y `../img/El Don de Latas.png`. **Nunca** `el-don-del-churro-web.jpg` ni `churros-largos-2.jpg`. Todas pasan por `src/content/imagenes.ts`. Las actuales llevan `provisional: true`.
- **No usar como referencia** el zip `../Logo /Claude outputs/el-don-del-churro-web.zip`.
- **Animación:** solo `transform` y `opacity`. Con `prefers-reduced-motion: reduce` no hay Lenis ni animaciones grandes. El contenido es visible sin JavaScript.
- **Objetivo de calidad:** Lighthouse en móvil ≥ 90 en las cuatro categorías y contraste WCAG 2.2 AA. El oro no se usa para texto pequeño sobre crema.
- **Cuentas:** Edu olvida las tecnologías. En los pasos marcados **🔔 CUENTA** hay que pararse y decirle qué servicio es, para qué sirve, el enlace de alta, el plan gratuito que debe elegir y qué dato tiene que devolver. No se le pide ninguna cuenta antes de su paso.
- **Git:** no se hace commit ni push sin que Edu lo haya autorizado en la sesión. Los pasos "Commit" se ejecutan solo con esa autorización.

## Puntos de revisión

1. **JavaScript desactivado o que falla:** todo el texto, los enlaces, el menú móvil (como enlace a un menú alternativo) y el formulario siguen funcionando. El formulario envía con un `<form action>` nativo. Lo cubre la prueba `sin-js.spec.ts` (Tareas 6 y 10).
2. **Dispositivos táctiles:** ningún efecto queda atrapado en `:hover` (se usa `@media (hover: hover)`), y el cursor personalizado y la inclinación 3D no se activan con `pointer: coarse`. Lo cubren las pruebas `tactil.spec.ts` (Tareas 5 y 13).
3. **Cambio de idioma en páginas con distinto slug:** desde `/carta` se va a `/en/menu` y viceversa. `/en/carta` devuelve 404, no la página en inglés. Lo cubre `idioma.spec.ts` (Tarea 3).
4. **Formulario con entradas reales:** nombres con tildes o caracteres no latinos (por ejemplo "José Núñez" o "王芳"), doble clic en Enviar, Resend caído (mensaje de error con enlace `mailto:`) y mensajes de más de 5000 caracteres (rechazados). Lo cubren las pruebas de la Tarea 10.
5. **Movimiento reducido:** con `reducedMotion: 'reduce'`, el halo LED del logo se muestra sin parpadeo, no se inicializa Lenis y los `Reveal` muestran el contenido sin desplazamiento. Lo cubre `movimiento-reducido.spec.ts` (Tareas 5, 6 y 13).

---

## Estructura de archivos

```
src/
  app/
    [locale]/
      layout.tsx                 html lang, fuentes, Header, Footer, MotionProvider
      page.tsx                   Inicio
      carta/page.tsx             La carta (/carta · /en/menu)
      contacto/page.tsx          Contacto (/contacto · /en/contact)
      contacto/actions.ts        Server Action enviarContacto
      aviso-legal/page.tsx  privacidad/page.tsx  cookies/page.tsx
      not-found.tsx
      opengraph-image.tsx        imagen OG por idioma (next/og)
    sitemap.ts  robots.ts
  proxy.ts                       detección de idioma de next-intl (Next 16 llama "proxy" al middleware)
  i18n/routing.ts  i18n/navigation.ts  i18n/request.ts
  content/negocio.ts  carta.ts  imagenes.ts  pendientes.ts
  lib/contacto/validar.ts  enviar.ts
  lib/seo/metadata.ts  jsonld.ts
  animations/MotionProvider.tsx  useReducedMotion.ts  Reveal.tsx  useMagnetic.ts  useTilt.ts  CustomCursor.tsx  gsap.ts
  components/layout/Header.tsx  LanguageSwitcher.tsx  MobileMenu.tsx  Footer.tsx  (+ .module.css)
  components/sections/Hero.tsx  Productos.tsx  Latas.tsx  Nosotros.tsx  Visitanos.tsx  MapaIlustrado.tsx
  components/ui/Button.tsx  ProductCard.tsx  MapaGoogleBajoDemanda.tsx
  styles/tokens.css  globals.css  fonts.ts
messages/es.json  messages/en.json
public/logo/  (SVG del sello: color, contornos, una tinta)   public/img/ (fotos)
tests/  (Vitest)    e2e/ (Playwright)
scripts/comprobar-lanzamiento.ts
netlify.toml  README.md  .env.example
```

---

### Tarea 1: Proyecto base, calidad y pruebas

**🔔 CUENTA · GitHub.** Avisar a Edu al empezar esta tarea: crear una cuenta en https://github.com/signup (plan Free) y un repositorio **privado** vacío llamado `web-el-don-del-churro`. Debe devolver la URL del repositorio. Si aún no la tiene, se trabaja con git en local y se conecta en la Tarea 14.

**Archivos:** crear el proyecto en la raíz del repositorio actual, más `.gitignore` (que incluya `.superpowers/` y `.env*` excepto `.env.example`), `vitest.config.ts`, `playwright.config.ts`, `tests/humo.test.ts` y `README.md`.

**Interfaces:** produce los scripts `npm run dev | build | start | lint | test | e2e | comprobar-lanzamiento`.

- [ ] **Paso 1:** `git init`. Crear la app con `npx create-next-app@latest . --ts --eslint --app --src-dir --no-tailwind --import-alias "@/*" --use-npm`, sin borrar `docs/` ni `.superpowers/`.
- [ ] **Paso 2:** instalar las dependencias: `next-intl gsap @gsap/react lenis resend zod`. En desarrollo: `vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @playwright/test prettier tsx`.
- [ ] **Paso 3:** escribir `tests/humo.test.ts` con `expect(1 + 1).toBe(2)` y ejecutar `npm test`. Resultado esperado: PASS.
- [ ] **Paso 4:** configurar Playwright con los proyectos `escritorio` (Chrome, 1440×900) y `movil` (Pixel 7) y `webServer: npm run build && npm start`.
- [ ] **Paso 5:** `npm run lint && npm run build`. Resultado esperado: sin errores.
- [ ] **Paso 6:** README en español: requisitos (Node 22), arranque, scripts y dónde están los textos, colores, datos y fotos.
- [ ] **Paso 7:** commit `chore: proyecto base Next.js con pruebas`.

---

### Tarea 2: Tokens de diseño, tipografías y recursos de marca

**Archivos:** crear `src/styles/tokens.css`, `src/styles/globals.css`, `src/styles/fonts.ts`, `public/logo/sello-color.svg`, `public/logo/sello-contornos.svg`, `public/logo/sello-una-tinta.svg` (copiados de `../Logo /0X_*/El-Don-del-Churro.svg`), `src/app/icon.svg` (el sello a color) y `e2e/privacidad-red.spec.ts`.

**Interfaces:** produce las variables CSS de la paleta (ver restricciones globales), además de `--fuente-titulos`, `--fuente-texto`, `--espacio-1…8` y `--radio`. `fonts.ts` exporta `fuenteTitulos` (Fraunces) y `fuenteTexto` (Montserrat), ambas con `next/font/google`, que las aloja en el propio dominio durante la build.

- [ ] **Paso 1:** escribir `e2e/privacidad-red.spec.ts`: al cargar `/`, `/en`, `/carta` y `/contacto`, ninguna petición va a un dominio que no sea el propio (en concreto, ninguna a `fonts.googleapis.com`, `fonts.gstatic.com`, `google-analytics.com` ni `googletagmanager.com`), y `context.cookies()` está vacío.
- [ ] **Paso 2:** ejecutarla. Resultado esperado: falla, porque aún no existen las rutas.
- [ ] **Paso 3:** definir los tokens y los estilos globales: fondo `--cal`, texto `--oliva-oscuro`, foco visible con un contorno `--oro` de 2px y desplazamiento de 3px, y la clase `.visually-hidden`.
- [ ] **Paso 4:** commit `feat: tokens de diseño, fuentes locales y logos`. La prueba pasará en la Tarea 3.

---

### Tarea 3: Idiomas y rutas

**Archivos:** crear `src/i18n/routing.ts`, `src/i18n/navigation.ts`, `src/i18n/request.ts`, `src/proxy.ts`, `messages/es.json`, `messages/en.json`, `src/app/[locale]/layout.tsx`, `src/app/[locale]/page.tsx` (provisional), `tests/mensajes.test.ts` y `e2e/idioma.spec.ts`.

**Interfaces:**
- `routing` (`defineRouting`): `locales: ['es','en']`, `defaultLocale: 'es'`, `localePrefix: 'as-needed'`, `localeDetection: false` (siempre se entra en español; el usuario cambia con el selector) y `pathnames`:
  `'/'`, `'/carta': {es:'/carta', en:'/menu'}`, `'/contacto': {es:'/contacto', en:'/contact'}`, `'/aviso-legal': {es:'/aviso-legal', en:'/legal-notice'}`, `'/privacidad': {es:'/privacidad', en:'/privacy'}`, `'/cookies': {es:'/cookies', en:'/cookies'}`.
- `navigation.ts` exporta `Link`, `usePathname`, `useRouter`, `getPathname` (de `createNavigation(routing)`).
- `type Locale = 'es' | 'en'`, exportado desde `routing.ts`.
- Todas las páginas usan `generateStaticParams` con los dos idiomas y `setRequestLocale`, para que sean estáticas.

- [ ] **Paso 1:** escribir `tests/mensajes.test.ts`, que comprueba que el conjunto de claves (aplanado) de `es.json` es igual al de `en.json` y que ningún valor está vacío.
- [ ] **Paso 2:** escribir `e2e/idioma.spec.ts`:
  - `/` tiene `<html lang="es">` y `/en` tiene `lang="en"`;
  - `/en/carta` devuelve 404 y `/en/menu` devuelve 200;
  - `/es` redirige a `/`.
- [ ] **Paso 3:** ejecutar ambas pruebas. Resultado esperado: FAIL.
- [ ] **Paso 4:** implementar la configuración y un layout mínimo.
- [ ] **Paso 5:** ejecutar `npm test && npm run e2e -- idioma privacidad-red`. Resultado esperado: PASS.
- [ ] **Paso 6:** commit `feat: rutas bilingües con next-intl`.

---

### Tarea 4: Datos del negocio, imágenes y comprobación de lanzamiento

**Archivos:** crear `src/content/negocio.ts`, `src/content/imagenes.ts`, `src/content/carta.ts`, `src/content/pendientes.ts`, `scripts/comprobar-lanzamiento.ts`, `public/img/*` y `tests/contenido.test.ts`.

**Interfaces:**
```ts
// negocio.ts
type Dia = 'lunes'|'martes'|'miercoles'|'jueves'|'viernes'|'sabado'|'domingo'
type Tramo = { abre: string; cierra: string }            // 'HH:MM'
type Negocio = {
  nombre: 'El Don del Churro'
  direccion: { calle: string; codigoPostal: string | null; ciudad: string; pais: 'ES' }
  geo: { lat: number; lng: number } | null
  horario: { dias: Dia[] | null; tramos: Tramo[] }
  email: string; telefono: string | null; whatsapp: string | null
  redes: { red: 'instagram'|'tiktok'|'facebook'; url: string }[]
  titular: { nombre: string; nif: string; domicilio: string } | null
  urlMaps: string | null
}
export const negocio: Negocio
export function formatearHorario(h: Negocio['horario'], locale: Locale): string[]

// imagenes.ts
type Imagen = { src: string; ancho: number; alto: number; alt: Record<Locale,string>; provisional: boolean }
export const imagenes: Record<'finos'|'finosCafe'|'finosChocolate'|'largos'|'largosCafe'|'largosChocolate'|'latas', Imagen>

// carta.ts
type Producto = { id: string; categoria: string; nombre: Record<Locale,string>;
  descripcion: Record<Locale,string>; precio: number | null; imagen?: keyof typeof imagenes }
export const carta: Producto[]                      // vacío hasta que Edu entregue la carta
export function formatearPrecio(euros: number, locale: Locale): string

// pendientes.ts
export function datosPendientes(): string[]         // lista legible de lo que falta para publicar
```
Valores: `calle: 'Calle Correduría, 42'`, `codigoPostal: null` (41002, pendiente de confirmar), `ciudad: 'Sevilla'`, `geo: null`, `dias: null`, `tramos: [{abre:'07:00',cierra:'13:00'},{abre:'17:00',cierra:'20:00'}]`, `email: 'info@eldondelchurro.com'`, y `titular`, `telefono`, `whatsapp` y `urlMaps` a `null`, `redes: []`.

- [ ] **Paso 1:** escribir `tests/contenido.test.ts`:
  - `formatearPrecio(2.5,'es') === '2,50 €'` y `formatearPrecio(2.5,'en') === '€2.50'`;
  - `formatearHorario(negocio.horario,'es')` contiene `'7:00 – 13:00'` y `'17:00 – 20:00'`;
  - con los datos actuales, `datosPendientes()` incluye las entradas de carta, titular, días de apertura y código postal;
  - ninguna imagen de `imagenes` tiene un `src` que contenga `kukuchurro`, `churros-largos-2` ni `el-don-del-churro-web`;
  - cada `alt` tiene texto en ES y en EN.
- [ ] **Paso 2:** ejecutar. Resultado esperado: FAIL.
- [ ] **Paso 3:** implementar. Las fotos se copian a `public/img/` con nombres en minúsculas y guiones.
- [ ] **Paso 4:** `scripts/comprobar-lanzamiento.ts` imprime `datosPendientes()` y sale con código 1 si hay alguno. Lo ejecuta `npm run comprobar-lanzamiento`.
- [ ] **Paso 5:** ejecutar `npm test`. Resultado esperado: PASS. Ejecutar `npm run comprobar-lanzamiento`. Resultado esperado: código de salida 1 con la lista.
- [ ] **Paso 6:** commit `feat: datos del negocio, imágenes y comprobación de lanzamiento`.

---

### Tarea 5: Encabezado (opción B), selector de idioma y menú móvil

Referencia visual obligatoria: `docs/referencias/maqueta-encabezado.html`, opción B. Su CSS sirve de punto de partida.

**Archivos:** crear `src/components/layout/Header.tsx` y su `.module.css`, `LanguageSwitcher.tsx`, `MobileMenu.tsx` (con sus `.module.css`), `e2e/encabezado.spec.ts` y `e2e/tactil.spec.ts`.

**Interfaces:** `<Header />` (lee los mensajes con `useTranslations('header')`). `<LanguageSwitcher />` usa `usePathname` y `getPathname` de `@/i18n/navigation` para conservar la página equivalente.

Comportamiento fijado por la especificación (§7):
- Banda `--oliva-rotulo` con textura de ruido y tira LED inferior de 2px en `--led`, que respira con un ciclo de 5 s.
- Logo a la izquierda con el texto "CHURRERÍA · SEVILLA", oculto por debajo de 1240px.
- Al pasar el cursor, el logo hace `scale(1.14)` y se enciende el halo radial `--led` detrás, con el parpadeo `enciende` de unos 0,9 s.
- Menú a la derecha en mayúsculas con `letter-spacing: .28em`. Al pasar el cursor se dibuja la ola dorada.
- Botón "Contacto" con borde de oro, que se rellena al pasar el cursor.
- Selector ES/EN.
- Al bajar más de 80px, el encabezado se compacta (clase `is-compacto`).
- Por debajo de 900px, botón hamburguesa que abre un panel a pantalla completa.
- Todos los efectos de hover van dentro de `@media (hover: hover)`.

- [ ] **Paso 1:** escribir `e2e/encabezado.spec.ts`:
  - en `/carta`, pulsar "EN" lleva a `/en/menu`, y desde `/en/contact`, pulsar "ES" lleva a `/contacto`;
  - en móvil, el botón de menú tiene `aria-expanded="false"` y pasa a `"true"` al abrir; Escape cierra el panel y devuelve el foco al botón;
  - con el panel abierto, Tab no sale del panel;
  - el logo es un enlace al inicio con nombre accesible "El Don del Churro".
- [ ] **Paso 2:** escribir `e2e/tactil.spec.ts` (proyecto `movil`): tras tocar el logo y navegar atrás, la transformación calculada del logo es `none`, es decir, no se queda atascado el estado de hover.
- [ ] **Paso 3:** añadir a `e2e/movimiento-reducido.spec.ts` (con `reducedMotion: 'reduce'`): al pasar el cursor por el logo, `animation-name` del halo es `none` y su opacidad es 1.
- [ ] **Paso 4:** ejecutar las pruebas. Resultado esperado: FAIL. Implementar. Ejecutarlas de nuevo. Resultado esperado: PASS.
- [ ] **Paso 5:** comprobación visual en el navegador con capturas de escritorio y móvil, comparándolas con la maqueta.
- [ ] **Paso 6:** commit `feat: encabezado tipo rótulo con selector de idioma y menú móvil`.

---

### Tarea 6: Infraestructura de animación

**Archivos:** crear `src/animations/gsap.ts`, `useReducedMotion.ts`, `MotionProvider.tsx`, `Reveal.tsx`, `tests/reveal.test.tsx` y `e2e/sin-js.spec.ts`.

**Interfaces:**
- `gsap.ts`: registra ScrollTrigger una sola vez y exporta `{ gsap, ScrollTrigger }`.
- `useReducedMotion(): boolean`.
- `<MotionProvider>`: solo en el cliente. Si no hay movimiento reducido, crea Lenis, lo conecta al ticker de GSAP (`lenis.on('scroll', ScrollTrigger.update)`, `gsap.ticker.add(t => lenis.raf(t*1000))`, `gsap.ticker.lagSmoothing(0)`) y lo destruye al desmontarse. Expone `window.__lenis` solo con `NODE_ENV==='test'`.
- `<Reveal as? delay? y?>`: el estado inicial oculto solo se aplica cuando hay JS. Para ello, el layout añade la clase `js` a `<html>` con un script inline y el CSS oculta solo `.js [data-reveal]`.

- [ ] **Paso 1:** escribir `tests/reveal.test.tsx`: con `matchMedia('(prefers-reduced-motion: reduce)')` a `true`, `<Reveal>` renderiza a sus hijos sin `opacity: 0` en línea.
- [ ] **Paso 2:** escribir `e2e/sin-js.spec.ts` (con `javaScriptEnabled: false`): en `/` y `/en`, el `h1` y todos los `[data-reveal]` son visibles y los enlaces del pie funcionan.
- [ ] **Paso 3:** en `movimiento-reducido.spec.ts`, comprobar que `window.__lenis` es `undefined`.
- [ ] **Paso 4:** FAIL → implementar → PASS.
- [ ] **Paso 5:** commit `feat: base de animaciones con GSAP y Lenis`.

---

### Tarea 7: Pie de página, layout final y 404

**Archivos:** crear `src/components/layout/Footer.tsx` y su `.module.css`, `src/app/[locale]/not-found.tsx` y un enlace "Saltar al contenido" en el layout.

**Interfaces:** `<Footer />` lee `negocio`: dirección, horario (`formatearHorario`), email, redes (solo si hay alguna) y enlaces legales. Usa el sello en versión una tinta en crema sobre `--oliva-oscuro`.

- [ ] **Paso 1:** prueba e2e: el pie muestra "Calle Correduría, 42" y `info@eldondelchurro.com`, no muestra ningún teléfono mientras `telefono` sea `null`, y una ruta inexistente devuelve 404 con un enlace al inicio en el idioma de la URL.
- [ ] **Paso 2:** FAIL → implementar → PASS.
- [ ] **Paso 3:** commit `feat: pie de página y página 404`.

---

### Tarea 8: Página de inicio

**Archivos:** crear `src/components/sections/Hero.tsx`, `Productos.tsx`, `Latas.tsx`, `Nosotros.tsx`, `Visitanos.tsx`, `MapaIlustrado.tsx`, `src/components/ui/ProductCard.tsx`, `src/components/ui/Button.tsx`, `MapaGoogleBajoDemanda.tsx` (con sus `.module.css`) y `src/app/[locale]/page.tsx`; añadir las claves `inicio.*` en los dos archivos de mensajes; crear `e2e/inicio.spec.ts`.

**Interfaces:** `<ProductCard imagen: keyof typeof imagenes; titulo: string; texto: string />` (la usará también la carta). `<Button href variante: 'oro' | 'oliva' />`.

Contenido y reglas:
- **Textos:** los redactamos nosotros en los dos idiomas, sin hechos inventados (ver §8 de la especificación). En `messages/*.json`, todas las claves `inicio.*` llevan junto a ellas la clave hermana `_estado: "borrador"`. `datosPendientes()` incluye "textos sin aprobar" mientras quede algún `_estado: "borrador"`. Hay que añadir esa regla a `pendientes.ts` y su prueba a `contenido.test.ts`.
- **Portada:** no usa una foto a pantalla completa. Usa una composición con la foto a un tamaño en el que se vea nítida (como máximo su ancho real de 1536px), con color y luz.
- **Productos:** finos, largos y "con chocolate o con café".
- **Latas:** postres en capas en lata, de chocolate y de pistacho con nata. La foto crece con el scroll hasta su tamaño máximo nítido, no hasta toda la pantalla.
- **Nosotros:** texto breve sobre el local y su ambiente.
- **Visítanos:** dirección, horario, `<MapaIlustrado>`, un SVG propio de la zona de la calle Correduría y la Alameda de Hércules con el sello en la ubicación, el botón "Cómo llegar" (enlace a Google Maps con la dirección codificada, `target="_blank" rel="noopener"`) y `<MapaGoogleBajoDemanda>`. Este último solo inserta el iframe tras pulsar un botón, con el aviso de que conecta con Google.

- [ ] **Paso 1:** escribir `e2e/inicio.spec.ts`:
  - hay un solo `h1` en `/` y en `/en`;
  - en el HTML inicial no hay ningún `iframe`; tras pulsar "Cargar mapa", aparece un iframe con `src` de `google.com/maps`;
  - "Cómo llegar" tiene un `href` que contiene `Correduría` (codificado) y `target="_blank"`;
  - todas las imágenes tienen `alt` no vacío.
- [ ] **Paso 2:** FAIL → implementar las secciones (sin animaciones avanzadas: solo `Reveal`) → PASS.
- [ ] **Paso 3:** revisar el contraste con axe (`@axe-core/playwright` en `inicio.spec.ts`). Resultado esperado: 0 violaciones serias.
- [ ] **Paso 4:** commit `feat: página de inicio con textos en borrador`.

---

### Tarea 9: Página de la carta

**Archivos:** crear `src/app/[locale]/carta/page.tsx`, `carta.module.css` y `tests/carta.test.tsx`.

**Interfaces:** consume `carta`, `formatearPrecio` y `ProductCard`. Agrupa los productos por `categoria` en el orden de aparición.

- [ ] **Paso 1:** escribir `tests/carta.test.tsx` con una carta de prueba de dos categorías: se renderizan los encabezados de categoría en orden, el precio aparece como `2,50 €` en ES y como `€2.50` en EN, y un producto con `precio: null` no muestra precio.
- [ ] **Paso 2:** con `carta` vacía, la página muestra el mensaje `carta.enPreparacion`. No hay riesgo de publicarla así, porque `comprobar-lanzamiento` falla mientras la carta esté vacía.
- [ ] **Paso 3:** FAIL → implementar → PASS.
- [ ] **Paso 4:** commit `feat: página de la carta a partir de datos`.

Cuando Edu entregue la carta, se rellena `src/content/carta.ts` y sus textos. No hace falta tocar componentes.

---

### Tarea 10: Formulario de contacto

**🔔 CUENTA · Resend.** Avisar a Edu al llegar al paso 6: crear una cuenta en https://resend.com/signup (plan Free, 3.000 correos/mes) y una API key con permiso solo de envío. Tiene que pasarla **por un canal privado**, nunca por el chat: la pegará él mismo en `.env.local` y, más adelante, en Netlify. Hasta que el dominio esté verificado (Tarea 15), Resend solo permite enviar desde `onboarding@resend.dev` al correo del propio titular de la cuenta, y así se prueba.

**Archivos:** crear `src/lib/contacto/validar.ts`, `src/lib/contacto/enviar.ts`, `src/app/[locale]/contacto/actions.ts`, `page.tsx` y `Formulario.tsx` (con `.module.css`), `.env.example`, `tests/validar.test.ts`, `tests/enviar.test.ts` y `e2e/contacto.spec.ts`.

**Interfaces:**
```ts
type CampoError = 'requerido' | 'invalido' | 'largo'
type ResultadoValidacion =
  | { ok: true; datos: { nombre: string; email: string; mensaje: string } }
  | { ok: false; spam: true }
  | { ok: false; spam: false; errores: Partial<Record<'nombre'|'email'|'mensaje'|'privacidad', CampoError>> }
export function validarContacto(form: FormData, ahora?: number): ResultadoValidacion
export async function enviarCorreo(datos, cliente?: { emails: { send: Function } }): Promise<{ ok: boolean }>
type EstadoFormulario = { estado: 'inicial'|'enviado'|'error-validacion'|'error-envio'; errores?: ... }
export async function enviarContacto(prev: EstadoFormulario, form: FormData): Promise<EstadoFormulario>
```
Reglas:
- Campos: `nombre` (1–120 caracteres), `email` (formato válido), `mensaje` (1–5000 caracteres) y `privacidad` (casilla marcada, sin marcar por defecto).
- Anti-spam: `web` es un campo trampa (si llega relleno, es spam), y `t` lleva la marca de tiempo del render (si se envía en menos de 3000 ms, es spam).
- Al spam se responde `'enviado'` sin enviar nada.
- Variables de entorno: `RESEND_API_KEY`, `CONTACTO_DESTINO=info@eldondelchurro.com` y `CONTACTO_REMITENTE` (provisionalmente `onboarding@resend.dev`; luego `web@eldondelchurro.com`).
- `reply_to` = el email del usuario, y asunto `Web El Don del Churro: mensaje de {nombre}`.
- Se quitan los saltos de línea del nombre y no se guarda nada en ninguna base de datos.
- Junto a la casilla se muestra el texto de información básica de protección de datos.

- [ ] **Paso 1:** escribir `tests/validar.test.ts`:
  - acepta `'José Núñez'` y `'王芳'`;
  - rechaza un mensaje de 5001 caracteres con el error `largo`;
  - la casilla sin marcar da el error `requerido`;
  - con `web='x'` devuelve `spam: true`;
  - con `t = ahora - 1000` devuelve `spam: true`;
  - un `email='a@b'` da el error `invalido`.
- [ ] **Paso 2:** escribir `tests/enviar.test.ts` con un cliente simulado: se llama a `send` con `to: 'info@eldondelchurro.com'` y `replyTo` el email del usuario, y si `send` lanza un error se devuelve `{ok:false}`.
- [ ] **Paso 3:** escribir `e2e/contacto.spec.ts`, interceptando la acción o con `CONTACTO_SIMULADO=1`, que hace que `enviarCorreo` use un cliente falso:
  - un envío válido muestra el mensaje de éxito;
  - en el doble clic, el botón se desactiva mientras envía y solo hay una petición;
  - con el envío fallido aparece un mensaje con un enlace `mailto:info@eldondelchurro.com`.
  - Añadir a `sin-js.spec.ts`: sin JS, el formulario envía y la página de respuesta muestra el éxito.
- [ ] **Paso 4:** FAIL → implementar con `useActionState` y `<form action={…}>` → PASS.
- [ ] **Paso 5:** documentar las variables en `.env.example` y en el README.
- [ ] **Paso 6:** 🔔 pedir la cuenta de Resend y hacer un envío real de prueba al correo del titular de la cuenta.
- [ ] **Paso 7:** commit `feat: formulario de contacto con Resend`.

---

### Tarea 11: Páginas legales

**Archivos:** crear `src/app/[locale]/aviso-legal/page.tsx`, `privacidad/page.tsx` y `cookies/page.tsx`, un componente `src/components/ui/TextoLegal.tsx` y el contenido en `messages/*.json` (`legal.*`).

**Contenido:**
- **Aviso legal (LSSI-CE, art. 10):** titular, NIF, domicilio, email y objeto.
- **Privacidad (RGPD, art. 13):** responsable, finalidad (responder consultas), base legal (consentimiento), conservación, destinatarios (Resend como encargado, con transferencia internacional cubierta por cláusulas tipo) y derechos, incluido el de reclamar ante la AEPD.
- **Cookies:** la web no usa cookies propias ni de terceros que requieran consentimiento. Se explica qué ocurre al cargar el mapa de Google, y que en ese caso se aplican las condiciones de Google.
- Los datos del titular salen de `negocio.titular`. Mientras sea `null`, se muestra un aviso visible "Datos del titular pendientes", y `datosPendientes()` ya lo cuenta.
- Al final de cada página, una nota interna en el README (no en la web): "Revisar por un profesional antes de publicar".

- [ ] **Paso 1:** prueba e2e: las tres páginas existen en ES y EN, con `h1`. Con `titular: null` aparece el aviso de pendiente, y nunca aparece el texto "null" ni "undefined".
- [ ] **Paso 2:** FAIL → implementar → PASS.
- [ ] **Paso 3:** commit `feat: páginas legales`.

---

### Tarea 12: SEO, datos estructurados e imágenes para compartir

**Archivos:** crear `src/lib/seo/metadata.ts`, `src/lib/seo/jsonld.ts`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/[locale]/opengraph-image.tsx`, `tests/seo.test.ts` y `e2e/seo.spec.ts`.

**Interfaces:**
```ts
type PaginaId = '/' | '/carta' | '/contacto' | '/aviso-legal' | '/privacidad' | '/cookies'
export function construirMetadata(p: { locale: Locale; pagina: PaginaId }): Metadata
// title y description desde messages (seo.<pagina>.*), alternates.canonical,
// alternates.languages {es, en, 'x-default': URL española}, openGraph y twitter
export function restaurantJsonLd(locale: Locale): Record<string, unknown>
// @type 'Restaurant', name, url, logo, image, address (PostalAddress), servesCuisine,
// email, hasMenu (URL de la carta); geo, telephone, openingHoursSpecification y sameAs SOLO si sus datos no son null/vacíos
```
- `metadataBase`: `https://eldondelchurro.com`.
- `robots.ts` permite todo y enlaza el sitemap.
- La imagen OG es de 1200×630, con fondo `--oliva`, el sello y el titular del idioma.

- [ ] **Paso 1:** escribir `tests/seo.test.ts`:
  - `construirMetadata({locale:'en', pagina:'/carta'})` da `canonical === 'https://eldondelchurro.com/en/menu'` y `languages.es === 'https://eldondelchurro.com/carta'`;
  - `restaurantJsonLd('es')` no tiene las claves `geo` ni `telephone` mientras sean `null`;
  - `address.streetAddress === 'Calle Correduría, 42'`.
- [ ] **Paso 2:** escribir `e2e/seo.spec.ts`:
  - cada página tiene un `<title>` distinto;
  - `/sitemap.xml` contiene las 12 URL (6 páginas × 2 idiomas) con `xhtml:link` alternativos;
  - `/` incluye un `script[type="application/ld+json"]` que es JSON válido;
  - `/opengraph-image` responde con 200 y `image/png`.
- [ ] **Paso 3:** FAIL → implementar → PASS.
- [ ] **Paso 4:** commit `feat: SEO, sitemap, JSON-LD e imágenes Open Graph`.

---

### Tarea 13: Catálogo de animaciones

**Archivos:** crear `src/animations/useMagnetic.ts`, `useTilt.ts` y `CustomCursor.tsx`, y modificar `Hero.tsx`, `Latas.tsx`, `ProductCard.tsx`, `Button.tsx` y el layout (transición entre páginas con la View Transitions API de Next.js si es estable en la versión instalada; si no, un fundido con GSAP al montar la página).

**Interfaces:**
- `useMagnetic(ref, fuerza = 0.3)`.
- `useTilt(ref, maxGrados = 6)`.
- `<CustomCursor />`: se monta solo si `matchMedia('(hover: hover) and (pointer: fine)')` y no hay movimiento reducido.
- Los tres limpian sus listeners y sus tweens al desmontarse (dentro de `useGSAP` con `scope`).

Animaciones de la especificación (§9):
- titular de la portada línea a línea y parallax suave de la foto;
- `Reveal` en las secciones;
- tarjetas con zoom lento, inclinación siguiendo el cursor y brillo de oro en el borde;
- botones magnéticos;
- la foto de Latas que crece con el scroll (ScrollTrigger con `scrub`);
- cursor de punto dorado que crece sobre los elementos interactivos;
- transición entre páginas.

- [ ] **Paso 1:** en `tactil.spec.ts` (proyecto `movil`), comprobar que no existe `[data-cursor]` y que `ProductCard` no tiene `transform` en línea tras tocarla.
- [ ] **Paso 2:** en `movimiento-reducido.spec.ts`, comprobar que no existe `[data-cursor]` y que el titular es visible al cargar, sin esperar a ninguna animación.
- [ ] **Paso 3:** FAIL → implementar → PASS.
- [ ] **Paso 4:** medir el rendimiento con `npx lighthouse http://localhost:3000 --preset=perf --form-factor=mobile` (y también `/en` y `/carta`). Resultado esperado: rendimiento ≥ 90. Si no se alcanza, cargar GSAP de forma diferida en las secciones de abajo.
- [ ] **Paso 5:** revisión visual en el navegador de cada animación, en escritorio y móvil, y enseñarle a Edu un vídeo o una vista previa.
- [ ] **Paso 6:** commit `feat: animaciones e interacciones`.

---

### Tarea 14: Despliegue de pruebas en Netlify

**🔔 CUENTA · GitHub** (si no se creó en la Tarea 1) **y 🔔 CUENTA · Netlify.** Avisar a Edu: crear una cuenta en https://app.netlify.com/signup **iniciando sesión con GitHub** (plan Free, que permite uso comercial), revisando antes las condiciones vigentes del plan gratuito, e importar el repositorio. Él mismo pega las variables `RESEND_API_KEY`, `CONTACTO_DESTINO` y `CONTACTO_REMITENTE` en *Site configuration → Environment variables*. Tiene que devolver la URL `*.netlify.app`.

**Archivos:** crear `netlify.toml` (`[build] command = "npm run build"`, la versión de Node 22 y las cabeceras de seguridad: `Content-Security-Policy` compatible con el iframe de Google Maps tras clic, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Content-Type-Options: nosniff`, `Permissions-Policy` restrictiva y `X-Frame-Options: DENY`) y añadir una sección "Publicar" en el README.

- [ ] **Paso 1:** `git remote add origin <url>` y `git push` (con la autorización de Edu).
- [ ] **Paso 2:** comprobar en la URL de Netlify:
  - `/`, `/en/menu` y `/contacto` responden 200;
  - el envío real del formulario llega;
  - las cabeceras aparecen en `curl -I`;
  - `e2e/privacidad-red.spec.ts` pasa contra la URL (`BASE_URL=… npm run e2e`).
- [ ] **Paso 3:** Lighthouse en móvil sobre la URL de Netlify. Resultado esperado: ≥ 90 en las cuatro categorías.
- [ ] **Paso 4:** enseñar la URL de pruebas a Edu para que revise los textos en borrador (`_estado: "borrador"` → `"aprobado"` según lo que apruebe).

---

### Tarea 15: Publicación en eldondelchurro.com

**Bloqueada** hasta que `npm run comprobar-lanzamiento` salga con código 0. Para eso hacen falta la carta, los datos del titular, los días de apertura, el código postal y los textos aprobados.

**🔔 CUENTAS:**
- **Hostalia** (panel DNS, cuenta ya existente). Edu entra con su acceso; no se le pide la contraseña.
- **Google Search Console** (https://search.google.com/search-console, gratis).
- **Google Business Profile** (https://business.google.com, gratis). Recordarle que puede crearla en cualquier momento, cuanto antes mejor.

- [ ] **Paso 1:** antes de tocar nada, anotar los registros DNS actuales de Hostalia (copia de seguridad), sobre todo los **MX, SPF y autodiscover** del correo.
- [ ] **Paso 2:** en Netlify, añadir los dominios `eldondelchurro.com` y `www.eldondelchurro.com`, con `www` redirigiendo al dominio principal.
- [ ] **Paso 3:** en Hostalia, cambiar **solo** el registro A de `@` y el CNAME de `www` a los valores que indique Netlify. No se cambian los servidores de nombres y **no se tocan los MX**.
- [ ] **Paso 4:** en Resend, verificar el dominio añadiendo en Hostalia sus registros DKIM y SPF. Si ya existe un SPF del correo, **se fusiona en un único registro TXT**, no se crea un segundo. Después, cambiar `CONTACTO_REMITENTE=web@eldondelchurro.com` en Netlify.
- [ ] **Paso 5:** comprobar que:
  - `https://eldondelchurro.com` sirve la web con HTTPS;
  - `www` redirige;
  - un correo enviado a `info@` desde fuera sigue llegando;
  - el formulario llega a `info@`.
- [ ] **Paso 5b:** en Netlify, añadir la variable `PERMITIR_INDEXAR=1` y volver a publicar (hasta ahora la web pedía no ser indexada).
- [ ] **Paso 6:** dar de alta la propiedad en Search Console (verificación por DNS) y enviar `sitemap.xml`. En Google Business Profile, poner la misma dirección y horario y el enlace a la web.
- [ ] **Paso 7:** etiqueta git `v1.0.0` (con la autorización de Edu).
