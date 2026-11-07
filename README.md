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
