// Plano ilustrado con la marca: manzanas de casas estilizadas y el sello en la ubicación.
// Es DECORATIVO (no reproduce el callejero real): para orientarse están el botón
// "Cómo llegar" y el mapa interactivo de Google bajo demanda.
// No conecta con ningún servicio externo.

/** Manzanas de casas de fondo, en coordenadas de un lienzo de 400×300. */
const MANZANAS = [
  'M10 12h88l-6 58H8z',
  'M112 10h96l-4 52h-96z',
  'M222 8h70l6 62h-80z',
  'M310 14h80v60h-86z',
  'M6 92h80l-4 70H4z',
  'M100 84h70l-6 80h-66z',
  'M236 90h70l2 76h-76z',
  'M322 96h70v70h-72z',
  'M8 186h88v100H6z',
  'M112 190h90l-2 96h-90z',
  'M220 192h86l4 94h-92z',
  'M324 190h68v96h-70z',
];

export function MapaIlustrado({ etiqueta, alt }: { etiqueta: string; alt: string }) {
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={alt}>
      <rect width="400" height="300" fill="#efe6d3" />
      <g fill="#e2d6bc">
        {MANZANAS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      {/* La calle de la churrería, resaltada en oro. */}
      <path d="M208 0 L214 300" stroke="#D4A448" strokeWidth="10" strokeLinecap="round" opacity="0.85" />
      {/* Halo de luz y sello en la ubicación. */}
      <circle cx="211" cy="176" r="34" fill="#FFC24D" opacity="0.35" />
      <image href="/logo/sello-color.svg" x="187" y="152" width="48" height="48" />
      <g transform="translate(244 160)">
        <rect width="132" height="30" rx="15" fill="#23281A" />
        <text x="66" y="20" textAnchor="middle" fill="#FFF3D6" fontSize="12" fontFamily="var(--fuente-texto)" fontWeight="600">
          {etiqueta}
        </text>
      </g>
    </svg>
  );
}
