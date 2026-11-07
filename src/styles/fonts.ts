// Tipografías de la web.
//
// next/font descarga las fuentes durante la compilación y las sirve desde
// nuestro propio dominio: el navegador del visitante NUNCA contacta con Google.
// Eso evita compartir la IP del usuario con terceros (RGPD) y carga más rápido.
//
// - Fraunces: serifa con carácter para titulares, en el espíritu de "CHURRO" del rótulo.
// - Montserrat: sans geométrica para texto y para las etiquetas espaciadas
//   en mayúsculas, como "CHURRERÍA" en la fachada.
import { Fraunces, Montserrat } from 'next/font/google';

export const fuenteTitulos = Fraunces({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-titulos',
  display: 'swap',
});

export const fuenteTexto = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-texto',
  display: 'swap',
});
