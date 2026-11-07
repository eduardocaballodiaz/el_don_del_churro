// La ola dorada del logo, dibujada como línea bajo los enlaces del menú.
// Se "dibuja" al pasar el cursor animando stroke-dashoffset (ver Header.module.css).
export function OlaDorada({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 8" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 5 C 25 0, 50 9, 100 3" />
    </svg>
  );
}
