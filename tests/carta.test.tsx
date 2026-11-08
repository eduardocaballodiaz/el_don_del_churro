// La carta se genera a partir de los datos de src/content/carta.ts.
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ListaCarta } from '@/components/carta/ListaCarta';
import type { Producto } from '@/content/carta';

const CARTA_PRUEBA: Producto[] = [
  {
    id: 'finos',
    categoria: { es: 'Churros', en: 'Churros' },
    nombre: { es: 'Ración de finos', en: 'Thin churros' },
    descripcion: { es: 'Recién hechos.', en: 'Freshly made.' },
    precio: 2.5,
  },
  {
    id: 'chocolate',
    categoria: { es: 'Para mojar', en: 'For dipping' },
    nombre: { es: 'Chocolate', en: 'Hot chocolate' },
    descripcion: { es: 'Espeso.', en: 'Thick.' },
    precio: null,
  },
  {
    id: 'rueda',
    categoria: { es: 'Churros', en: 'Churros' },
    nombre: { es: 'Ración de rueda', en: 'Churro wheel' },
    descripcion: { es: 'Esponjosos.', en: 'Fluffy.' },
    precio: 3,
  },
];

describe('<ListaCarta>', () => {
  it('agrupa por categoría en el orden de aparición', () => {
    render(<ListaCarta productos={CARTA_PRUEBA} locale="es" />);
    const titulos = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    expect(titulos).toEqual(['Churros', 'Para mojar']);
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
});
