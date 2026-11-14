// "Lo nuestro": la carta interactiva de la página de inicio.
import { fireEvent, render, screen, within } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it } from 'vitest';
import mensajes from '../messages/es.json';
import { CartaInteractiva } from '@/components/sections/CartaInteractiva';

function pintar() {
  return render(
    <NextIntlClientProvider locale="es" messages={mensajes}>
      <CartaInteractiva />
    </NextIntlClientProvider>,
  );
}

describe('<CartaInteractiva>', () => {
  it('muestra las seis categorías de la carta, todas cerradas', () => {
    pintar();
    const botones = screen.getAllByRole('button', { expanded: false });
    expect(botones.map((b) => b.textContent)).toEqual([
      expect.stringContaining('Churros'),
      expect.stringContaining('Café y chocolate'),
      expect.stringContaining('Toppings'),
      expect.stringContaining('Los caprichos del Don'),
      expect.stringContaining('Tostadas'),
      expect.stringContaining('Crepes y gofres'),
    ]);
  });

  it('al pulsar Churros aparecen Finos y Rueda con su origen', () => {
    pintar();
    const churros = screen.getByRole('button', { name: /^Churros/ });
    fireEvent.click(churros);
    expect(churros).toHaveAttribute('aria-expanded', 'true');
    const panel = screen.getByRole('region', { name: /^Churros/ });
    expect(within(panel).getByRole('heading', { name: 'Finos' })).toBeInTheDocument();
    expect(within(panel).getByRole('heading', { name: 'Rueda' })).toBeInTheDocument();
    expect(within(panel).getByText(/calentitos/)).toBeInTheDocument();
    expect(within(panel).getByRole('heading', { name: 'Rellenos (1 ud)' })).toBeInTheDocument();
  });

  it('solo hay una categoría abierta a la vez y se cierra al volver a pulsar', () => {
    pintar();
    const churros = screen.getByRole('button', { name: /^Churros/ });
    const cafe = screen.getByRole('button', { name: /^Café y chocolate/ });
    fireEvent.click(churros);
    fireEvent.click(cafe);
    expect(churros).toHaveAttribute('aria-expanded', 'false');
    expect(cafe).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('region', { name: /^Café y chocolate/ })).toHaveTextContent('Chocolate caliente');
    fireEvent.click(cafe);
    expect(cafe).toHaveAttribute('aria-expanded', 'false');
  });

  it('ya no hay tarjeta de "churros con chocolate"', () => {
    pintar();
    expect(screen.queryByText(/con chocolate o con café/i)).toBeNull();
  });
});
