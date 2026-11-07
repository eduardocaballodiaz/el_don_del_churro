# El Don del Churro · Web

Web de la churrería **El Don del Churro** (Calle Correduría, 42, Sevilla), en español e inglés.

- Diseño aprobado: [`docs/superpowers/specs/2026-11-07-web-el-don-del-churro-design.md`](docs/superpowers/specs/2026-11-07-web-el-don-del-churro-design.md)
- Plan de trabajo: [`docs/superpowers/plans/2026-11-07-web-el-don-del-churro-fase-1.md`](docs/superpowers/plans/2026-11-07-web-el-don-del-churro-fase-1.md)

## Requisitos

- **Node.js 22** o superior (`node -v` para comprobarlo).
- npm (viene con Node).

## Arrancar en tu ordenador

```bash
npm install        # solo la primera vez, o cuando cambien las dependencias
npm run dev        # abre http://localhost:3000
```

## Comandos

| Comando | Para qué sirve |
|---|---|
| `npm run dev` | Web en modo desarrollo, que se recarga sola al guardar |
| `npm run build` | Compila la web como se publicará |
| `npm test` | Pruebas rápidas (lógica y componentes) |
| `npm run e2e` | Pruebas en navegador real, en escritorio y en móvil |
| `npm run lint` | Revisa el código en busca de errores comunes |
| `npm run format` | Ordena el formato del código |
| `npm run comprobar-lanzamiento` | Lista los datos que faltan para poder publicar |

## Dónde está cada cosa

| Quiero cambiar… | Archivo |
|---|---|
| Textos (español / inglés) | `messages/es.json` y `messages/en.json` |
| Dirección, horario, correo, redes | `src/content/negocio.ts` |
| La carta y los precios | `src/content/carta.ts` |
| Fotos | `public/img/` (las rutas se declaran en `src/content/imagenes.ts`) |
| Colores, tipografías, espaciados | `src/styles/tokens.css` |
| Encabezado, pie de página | `src/components/layout/` |
| Secciones de la página de inicio | `src/components/sections/` |
| Animaciones | `src/animations/` |

## Formulario de contacto (variables de entorno)

El formulario envía los mensajes con [Resend](https://resend.com). Copia `.env.example` como `.env.local` y rellénalo:

| Variable | Para qué |
|---|---|
| `RESEND_API_KEY` | Clave de Resend (secreta; nunca en git ni en el chat) |
| `CONTACTO_DESTINO` | A quién llegan los mensajes: `info@eldondelchurro.com` |
| `CONTACTO_REMITENTE` | Remitente. `onboarding@resend.dev` hasta verificar el dominio; luego `web@eldondelchurro.com` |
| `CONTACTO_SIMULADO` | `1` = no envía nada (solo pruebas) |

Los mensajes no se guardan en ninguna base de datos: solo se reenvían por correo.

## Nota sobre iCloud

El proyecto está en el Escritorio, que se sincroniza con iCloud Drive. Por eso la carpeta de compilación se llama `.next.nosync` (iCloud ignora todo lo que termina en `.nosync`). Aun así, lo ideal es mover el proyecto a una carpeta que no se sincronice, por ejemplo `~/Proyectos`.

## Textos legales

Las páginas de aviso legal, privacidad y cookies (`messages/*.json` → `legal`) son **una base redactada con cuidado, no asesoramiento jurídico**. Antes de publicar, conviene que las revise un profesional. Los datos del titular se rellenan en `src/content/negocio.ts` → `titular`.

## Publicar

La web se aloja en **Netlify** (plan gratuito) y se publica sola cada vez que se sube un cambio a GitHub.

1. Los cambios se guardan en git y se suben a GitHub (`git push`).
2. Netlify compila la web (`npm run build`) y la publica. Cada propuesta de cambio tiene además su propia dirección de vista previa.
3. Las claves secretas (`RESEND_API_KEY`, etc.) se configuran en Netlify → *Site configuration → Environment variables*.

**Antes de publicar en eldondelchurro.com**, `npm run comprobar-lanzamiento` debe decir que no falta nada.

En Hostalia solo se cambian los registros de la web (A de `@` y CNAME de `www`). **Nunca los MX**: son los del correo `info@`.
