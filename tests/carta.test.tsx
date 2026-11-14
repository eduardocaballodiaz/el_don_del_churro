// La carta se genera a partir de los datos de src/content/carta.ts.
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ListaCarta } from '@/components/carta/ListaCarta';
import { carta, type Producto } from '@/content/carta';

const CARTA_PRUEBA: Producto[] = [
  {
    id: 'finos',
    categoria: { es: 'Churros', en: 'Churros' },
    nombre: { es: 'Ración de finos', en: 'Thin churros' },
    descripcion: { es: 'Recién hechos.', en: 'Freshly made.' },
    precio: 2.5,
    alergenos: ['gluten'],
  },
  {
    id: 'chocolate',
    categoria: { es: 'Para mojar', en: 'For dipping' },
    nombre: { es: 'Chocolate', en: 'Hot chocolate' },
    descripcion: { es: 'Espeso.', en: 'Thick.' },
    precio: null,
    alergenos: ['lacteos', 'soja'],
  },
  {
    id: 'rueda',
    categoria: { es: 'Churros', en: 'Churros' },
    nombre: { es: 'Ración de rueda', en: 'Churro wheel' },
    descripcion: { es: 'Esponjosos.', en: 'Fluffy.' },
    precio: 3,
    alergenos: [],
  },
  {
    id: 'nutella',
    categoria: { es: 'Toppings', en: 'Toppings' },
    nombre: { es: 'Nutella', en: 'Nutella' },
    descripcion: { es: '', en: '' },
    precio: 0.5,
    suplemento: true,
    alergenos: null,
  },
];

describe('<ListaCarta>', () => {
  it('agrupa por categoría en el orden de aparición', () => {
    render(<ListaCarta productos={CARTA_PRUEBA} locale="es" />);
    const titulos = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    expect(titulos).toEqual(['Churros', 'Para mojar', 'Toppings']);
    const churros = screen.getByRole('region', { name: 'Churros' });
    expect(within(churros).getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual([
      'Ración de finos',
      'Ración de rueda',
    ]);
  });

  it('muestra el precio con el formato de cada idioma', () => {
    const { unmount } = render(<ListaCarta productos={CARTA_PRUEBA} locale="es" />);
    expect(screen.getByText('2,50 €')).toBeInTheDocument();
    unmount();
    render(<ListaCarta productos={CARTA_PRUEBA} locale="en" />);
    expect(screen.getByText('€2.50')).toBeInTheDocument();
    expect(screen.getByText('Thin churros')).toBeInTheDocument();
  });

  it('no muestra precio si es null', () => {
    render(<ListaCarta productos={CARTA_PRUEBA} locale="es" />);
    const item = screen.getByRole('heading', { name: 'Chocolate' }).closest('li')!;
    expect(item.textContent).not.toMatch(/€/);
  });

  it('muestra los suplementos con un "+" delante', () => {
    const { unmount } = render(<ListaCarta productos={CARTA_PRUEBA} locale="es" />);
    expect(screen.getByText('+0,50 €')).toBeInTheDocument();
    unmount();
    render(<ListaCarta productos={CARTA_PRUEBA} locale="en" />);
    expect(screen.getByText('+€0.50')).toBeInTheDocument();
  });

  it('muestra los alérgenos de cada producto en su idioma', () => {
    const { unmount } = render(<ListaCarta productos={CARTA_PRUEBA} locale="es" />);
    const chocolate = screen.getByRole('heading', { name: 'Chocolate' }).closest('li')!;
    expect(within(chocolate).getByText('Lácteos')).toBeInTheDocument();
    expect(within(chocolate).getByText('Soja')).toBeInTheDocument();
    unmount();
    render(<ListaCarta productos={CARTA_PRUEBA} locale="en" />);
    const choc = screen.getByRole('heading', { name: 'Hot chocolate' }).closest('li')!;
    expect(within(choc).getByText('Milk')).toBeInTheDocument();
  });

  it('incluye el aviso de alérgenos para el cliente', () => {
    render(<ListaCarta productos={CARTA_PRUEBA} locale="es" />);
    expect(screen.getByRole('note')).toHaveTextContent(/alergia|intolerancia/i);
  });
});

describe('carta de El Don del Churro (documento de Edu, 14-nov)', () => {
  const seccion = (nombre: string) => carta.filter((p) => p.categoria.es === nombre);
  const precios = (p: Producto) => p.variantes?.map((v) => v.precio);

  it('tiene las secciones en el orden del documento', () => {
    expect([...new Set(carta.map((p) => p.categoria.es))]).toEqual([
      'Churros',
      'Momento café',
      'Crea tu experiencia',
      'Los caprichos del Don',
      'Tostadas',
      'Crepes y gofres',
    ]);
  });

  it('churros: rueda, finos y rellenos a 3,00 €', () => {
    const churros = seccion('Churros');
    expect(churros.map((p) => p.nombre.es)).toEqual(['De rueda (5 uds)', 'Finos (5 uds)', 'Rellenos (1 ud)']);
    for (const p of churros) expect(p.precio).toBe(3);
  });

  it('momento café: siete bebidas en tres tamaños (1,50 / 1,80 / 2,50 €)', () => {
    const cafes = seccion('Momento café');
    expect(cafes).toHaveLength(7);
    for (const p of cafes) expect(precios(p)).toEqual([1.5, 1.8, 2.5]);
  });

  it('tiene los cuatro toppings a +0,50 €', () => {
    const toppings = seccion('Crea tu experiencia');
    expect(toppings.map((p) => p.nombre.es)).toEqual(['Nutella', 'Pistacho', 'Chocolate blanco', 'Kinder']);
    for (const t of toppings) {
      expect(t.precio).toBe(0.5);
      expect(t.suplemento).toBe(true);
    }
  });

  it('los caprichos del Don son las cuatro latas, cada una con su foto', () => {
    const latas = seccion('Los caprichos del Don');
    expect(latas.map((p) => p.nombre.es)).toEqual(['Pistacho', 'Tarta de la abuela', 'Chocolate', 'Tarta de queso']);
    expect(latas.map((p) => p.imagen)).toEqual(['lataPistacho', 'lataTartaAbuela', 'lataChocolate', 'lataTartaQueso']);
  });

  it('tostadas: media y entera', () => {
    const [simple, jamon] = seccion('Tostadas');
    expect(precios(simple)).toEqual([1.5, 2.5]);
    expect(precios(jamon)).toEqual([2.5, 3.5]);
  });

  it('crepes y gofres a 4,00 € con un topping incluido', () => {
    const cg = seccion('Crepes y gofres');
    expect(cg.map((p) => [p.nombre.es, p.precio])).toEqual([
      ['Crepes', 4],
      ['Gofres', 4],
    ]);
    for (const p of cg) expect(p.descripcion.es).toMatch(/topping incluido/i);
  });
});

describe('<ListaCarta> con tamaños', () => {
  it('muestra cada tamaño con su precio', () => {
    render(
      <ListaCarta
        locale="es"
        productos={[
          {
            id: 'latte',
            categoria: { es: 'Momento café', en: 'Coffee time' },
            nombre: { es: 'Latte', en: 'Latte' },
            descripcion: { es: '', en: '' },
            precio: null,
            variantes: [
              { nombre: { es: 'Pequeño', en: 'Small' }, precio: 1.5 },
              { nombre: { es: 'Grande', en: 'Large' }, precio: 2.5 },
            ],
            alergenos: null,
          },
        ]}
      />,
    );
    expect(screen.getByText('Pequeño')).toBeInTheDocument();
    expect(screen.getByText('1,50 €')).toBeInTheDocument();
    expect(screen.getByText('2,50 €')).toBeInTheDocument();
  });
});
