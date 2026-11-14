// Presentación de productos del inicio: Churros y, debajo, Los caprichos del Don.
// Cada uno es una tarjeta que, al pulsarla, despliega sus productos.
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
  it('solo presenta Churros y, después, Los caprichos del Don, ambos cerrados', () => {
    pintar();
    const botones = screen.getAllByRole('button', { expanded: false });
    expect(botones.map((b) => b.textContent)).toEqual([
      expect.stringContaining('Churros'),
      expect.stringContaining('Los caprichos del Don'),
    ]);
    expect(screen.queryByText(/tostadas|crepes|toppings|café/i)).toBeNull();
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
  });

  it('al pulsar Los caprichos del Don aparecen los cuatro sabores', () => {
    pintar();
    fireEvent.click(screen.getByRole('button', { name: /^Los caprichos del Don/ }));
    const panel = screen.getByRole('region', { name: /^Los caprichos del Don/ });
    expect(within(panel).getAllByRole('heading').map((h) => h.textContent)).toEqual([
      'Pistacho',
      'Tarta de la abuela',
      'Chocolate',
      'Tarta de queso',
    ]);
  });

  it('se cierra al volver a pulsar', () => {
    pintar();
    const churros = screen.getByRole('button', { name: /^Churros/ });
    fireEvent.click(churros);
    fireEvent.click(churros);
    expect(churros).toHaveAttribute('aria-expanded', 'false');
  });
});
