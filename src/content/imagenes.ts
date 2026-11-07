// FOTOS DE LA WEB
// ---------------
// Todas las fotos se declaran aquí. Para sustituir una (por ejemplo, tras la
// sesión de fotos real), basta con cambiar el archivo en public/img/ y sus
// medidas aquí. Ningún componente apunta directamente a un archivo.
//
// `provisional: true` marca las fotos actuales, que se cambiarán por fotos
// reales del producto y del local cuando la churrería esté abierta.
import type { Locale } from '@/i18n/routing';

export type Imagen = {
  src: string;
  ancho: number;
  alto: number;
  alt: Record<Locale, string>;
  provisional: boolean;
};

export type ImagenId =
  | 'finos'
  | 'finosCafe'
  | 'finosChocolate'
  | 'largos'
  | 'largosCafe'
  | 'largosChocolate'
  | 'latas';

export const imagenes: Record<ImagenId, Imagen> = {
  finos: {
    src: '/img/finos.webp',
    ancho: 1536,
    alto: 1024,
    alt: {
      es: 'Plato de churros finos dorados con azúcar',
      en: 'Plate of thin golden churros dusted with sugar',
    },
    provisional: true,
  },
  finosCafe: {
    src: '/img/finos-cafe.webp',
    ancho: 1536,
    alto: 1024,
    alt: {
      es: 'Churros finos junto a un café con leche',
      en: 'Thin churros next to a milky coffee',
    },
    provisional: true,
  },
  finosChocolate: {
    src: '/img/finos-chocolate.webp',
    ancho: 1536,
    alto: 1024,
    alt: {
      es: 'Churros finos con una taza de chocolate caliente',
      en: 'Thin churros with a cup of hot chocolate',
    },
    provisional: true,
  },
  largos: {
    src: '/img/largos.webp',
    ancho: 1536,
    alto: 1024,
    alt: {
      es: 'Churros largos, gruesos y esponjosos por dentro',
      en: 'Thick churros, fluffy on the inside',
    },
    provisional: true,
  },
  largosCafe: {
    src: '/img/largos-cafe.webp',
    ancho: 1536,
    alto: 1024,
    alt: {
      es: 'Churros largos junto a un café con leche',
      en: 'Thick churros next to a milky coffee',
    },
    provisional: true,
  },
  largosChocolate: {
    src: '/img/largos-chocolate.webp',
    ancho: 1536,
    alto: 1024,
    alt: {
      es: 'Churros largos, uno mojado en chocolate, con una taza de chocolate',
      en: 'Thick churros, one dipped in chocolate, with a cup of hot chocolate',
    },
    provisional: true,
  },
  latas: {
    src: '/img/latas.png',
    ancho: 1536,
    alto: 1024,
    alt: {
      es: 'Dos postres en lata: uno de chocolate y otro de pistacho con nata',
      en: 'Two desserts in a can: one chocolate, one pistachio with cream',
    },
    provisional: true,
  },
};
