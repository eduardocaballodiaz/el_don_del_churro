// <Reveal> no puede esconder contenido a quien pide menos movimiento.
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Reveal } from '@/animations/Reveal';

function simularMovimientoReducido(reducido: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      matches: query.includes('reduce') ? reducido : false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
}

describe('<Reveal>', () => {
  beforeEach(() => vi.unstubAllGlobals());

  it('con movimiento reducido muestra el contenido sin ocultarlo', () => {
    simularMovimientoReducido(true);
    render(<Reveal>Hola</Reveal>);
    const el = screen.getByText('Hola');
    expect(el).toHaveAttribute('data-reveal', 'visible');
    expect(el.style.opacity).toBe('');
  });

  it('renderiza la etiqueta pedida', () => {
    simularMovimientoReducido(true);
    render(<Reveal as="section">Bloque</Reveal>);
    expect(screen.getByText('Bloque').tagName).toBe('SECTION');
  });
});
