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

describe('carta de El Don del Churro', () => {
  it('tiene los cuatro toppings a +0,50 €', () => {
    const toppings = carta.filter((p) => p.categoria.es === 'Crea tu experiencia');
    expect(toppings.map((p) => p.nombre.es)).toEqual(['Nutella', 'Pistacho', 'Chocolate blanco', 'Kinder']);
    for (const t of toppings) {
      expect(t.precio).toBe(0.5);
      expect(t.suplemento).toBe(true);
    }
  });
});

