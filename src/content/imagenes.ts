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
  | 'rueda'
  | 'ruedaCafe'
  | 'ruedaChocolate'
  | 'latas'
  | 'lataChocolate'
  | 'lataPistacho'
  | 'lataTartaAbuela'
  | 'lataTartaQueso'
  | 'latasTodas';

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
  rueda: {
    src: '/img/rueda.webp',
    ancho: 1536,
    alto: 1024,
    alt: {
      es: 'Porciones de churro de rueda, gruesas y esponjosas por dentro',
      en: 'Portions of churro wheel, fluffy on the inside',
    },
    provisional: true,
  },
  ruedaCafe: {
    src: '/img/rueda-cafe.webp',
    ancho: 1536,
    alto: 1024,
    alt: {
      es: 'Porciones de rueda junto a un café con leche',
      en: 'Churro wheel portions next to a milky coffee',
    },
    provisional: true,
  },
  ruedaChocolate: {
    src: '/img/rueda-chocolate.webp',
    ancho: 1536,
    alto: 1024,
    alt: {
      es: 'Porciones de rueda, una mojada en chocolate, con una taza de chocolate',
      en: 'Churro wheel portions, one dipped in chocolate, with a cup of hot chocolate',
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
  lataChocolate: {
    src: '/img/lata-chocolate.webp',
    ancho: 1024,
    alto: 1535,
    alt: {
      es: 'Lata transparente de Los caprichos del Don: chocolate en capas con virutas',
      en: 'Clear can from Los caprichos del Don: layered chocolate dessert with shavings',
    },
    provisional: true,
  },
  lataPistacho: {
    src: '/img/lata-pistacho.webp',
    ancho: 1024,
    alto: 1535,
    alt: {
      es: 'Lata transparente de Los caprichos del Don: pistacho en capas con pistacho troceado',
      en: 'Clear can from Los caprichos del Don: layered pistachio dessert with chopped pistachios',
    },
    provisional: true,
  },
  lataTartaAbuela: {
    src: '/img/lata-tarta-abuela.webp',
    ancho: 1024,
    alto: 1535,
    alt: {
      es: 'Lata transparente de Los caprichos del Don: tarta de la abuela en capas',
      en: "Clear can from Los caprichos del Don: layered grandma's cake",
    },
    provisional: true,
  },
  lataTartaQueso: {
    src: '/img/lata-tarta-queso.webp',
    ancho: 1024,
    alto: 1536,
    alt: {
      es: 'Lata transparente de Los caprichos del Don: tarta de queso en capas',
      en: 'Clear can from Los caprichos del Don: layered cheesecake',
    },
    provisional: true,
  },
  latasTodas: {
    src: '/img/latas-todas.webp',
    ancho: 1832,
    alto: 710,
    alt: {
      es: 'Las cuatro latas de Los caprichos del Don: pistacho, tarta de la abuela, chocolate y tarta de queso',
      en: "The four Los caprichos del Don cans: pistachio, grandma's cake, chocolate and cheesecake",
    },
    provisional: true,
  },
};
