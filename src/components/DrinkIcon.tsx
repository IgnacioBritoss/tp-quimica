import { IconKey } from "@/lib/types";

interface DrinkIconProps {
  icon: IconKey;
  color: string;
  className?: string;
}

/**
 * Iconos vectoriales dibujados a mano (sin dependencias externas ni imagenes
 * descargadas) que representan el recipiente tipico de cada bebida. Todos
 * comparten el mismo viewBox para alinearse en grillas.
 */
export function DrinkIcon({ icon, color, className }: DrinkIconProps) {
  const common = {
    viewBox: "0 0 64 64",
    className,
    fill: "none",
  };

  switch (icon) {
    case "wine":
      return (
        <svg {...common}>
          <path
            d="M20 8h24c0 12-3 20-12 20S20 20 20 8Z"
            fill={color}
            fillOpacity={0.35}
            stroke={color}
            strokeWidth={2}
          />
          <path d="M32 28v20" stroke={color} strokeWidth={2} />
          <path d="M22 54h20" stroke={color} strokeWidth={2} strokeLinecap="round" />
        </svg>
      );
    case "beer":
      return (
        <svg {...common}>
          <path
            d="M14 16h26v34a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4V16Z"
            fill={color}
            fillOpacity={0.3}
            stroke={color}
            strokeWidth={2}
          />
          <path d="M14 24h26" stroke={color} strokeWidth={1.5} strokeOpacity={0.6} />
          <path
            d="M40 22h6a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4h-6"
            stroke={color}
            strokeWidth={2}
          />
          <path d="M18 10c1 2-2 3-1 6M26 8c1 2-2 3-1 6" stroke={color} strokeWidth={2} strokeLinecap="round" />
        </svg>
      );
    case "cider":
      return (
        <svg {...common}>
          <path
            d="M26 6h12v8l4 6v30a4 4 0 0 1-4 4H26a4 4 0 0 1-4-4V20l4-6V6Z"
            fill={color}
            fillOpacity={0.3}
            stroke={color}
            strokeWidth={2}
          />
          <path d="M22 34h20" stroke={color} strokeWidth={1.5} strokeOpacity={0.6} />
        </svg>
      );
    case "sake":
      return (
        <svg {...common}>
          <path
            d="M18 24h28l-3 26a4 4 0 0 1-4 4H25a4 4 0 0 1-4-4l-3-26Z"
            fill={color}
            fillOpacity={0.3}
            stroke={color}
            strokeWidth={2}
          />
          <path d="M16 24h32" stroke={color} strokeWidth={2} strokeLinecap="round" />
        </svg>
      );
    case "mead":
      return (
        <svg {...common}>
          <path
            d="M20 14h20l-2 8v26a4 4 0 0 1-4 4H26a4 4 0 0 1-4-4V22l-2-8Z"
            fill={color}
            fillOpacity={0.3}
            stroke={color}
            strokeWidth={2}
          />
          <path d="M40 24h5a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-5" stroke={color} strokeWidth={2} />
        </svg>
      );
    case "gin":
      return (
        <svg {...common}>
          <path
            d="M22 10h20l-2 44a3 3 0 0 1-3 3H27a3 3 0 0 1-3-3L22 10Z"
            fill={color}
            fillOpacity={0.28}
            stroke={color}
            strokeWidth={2}
          />
          <circle cx={29} cy={28} r={1.6} fill={color} />
          <circle cx={35} cy={22} r={1.6} fill={color} />
          <circle cx={31} cy={38} r={1.6} fill={color} />
          <path d="M23 20h18" stroke={color} strokeWidth={1.5} strokeOpacity={0.6} />
        </svg>
      );
    case "rum":
      return (
        <svg {...common}>
          <path
            d="M18 22h28l-2 28a4 4 0 0 1-4 4H24a4 4 0 0 1-4-4l-2-28Z"
            fill={color}
            fillOpacity={0.32}
            stroke={color}
            strokeWidth={2}
          />
          <rect x={26} y={30} width={6} height={6} rx={1} fill={color} fillOpacity={0.5} />
          <path d="M17 22h30" stroke={color} strokeWidth={2} strokeLinecap="round" />
        </svg>
      );
    case "brandy":
      return (
        <svg {...common}>
          <path
            d="M16 18c0 12 6 22 16 22s16-10 16-22c0-4-4-4-4 0 0 9-5 16-12 16s-12-7-12-16c0-4-4-4-4 0Z"
            fill={color}
            fillOpacity={0.3}
            stroke={color}
            strokeWidth={2}
          />
          <path d="M32 40v10M23 54h18" stroke={color} strokeWidth={2} strokeLinecap="round" />
        </svg>
      );
    case "tequila":
      return (
        <svg {...common}>
          <path
            d="M24 16h16l-2 30a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3l-2-30Z"
            fill={color}
            fillOpacity={0.32}
            stroke={color}
            strokeWidth={2}
          />
          <path d="M23 16h18" stroke={color} strokeWidth={2} strokeLinecap="round" />
          <path d="M18 8c3 3 3 5 0 8M46 8c-3 3-3 5 0 8" stroke={color} strokeWidth={2} strokeLinecap="round" />
        </svg>
      );
    case "whisky":
      return (
        <svg {...common}>
          <path
            d="M18 20h28v26a4 4 0 0 1-4 4H22a4 4 0 0 1-4-4V20Z"
            fill={color}
            fillOpacity={0.3}
            stroke={color}
            strokeWidth={2}
          />
          <rect x={26} y={30} width={9} height={9} rx={2} fill={color} fillOpacity={0.55} />
        </svg>
      );
    case "vodka":
      return (
        <svg {...common}>
          <path
            d="M25 12h14l1 38a3 3 0 0 1-3 3H27a3 3 0 0 1-3-3l1-38Z"
            fill={color}
            fillOpacity={0.28}
            stroke={color}
            strokeWidth={2}
          />
          <path d="M24 12h16" stroke={color} strokeWidth={2} strokeLinecap="round" />
        </svg>
      );
    case "fernet":
      return (
        <svg {...common}>
          <path
            d="M18 20h28v26a4 4 0 0 1-4 4H22a4 4 0 0 1-4-4V20Z"
            fill={color}
            fillOpacity={0.5}
            stroke={color}
            strokeWidth={2}
          />
          <path d="M18 30h28" stroke={color} strokeWidth={1.5} strokeOpacity={0.5} />
        </svg>
      );
    case "soda":
      return (
        <svg {...common}>
          <path
            d="M20 14h24l-3 36a4 4 0 0 1-4 4H27a4 4 0 0 1-4-4l-3-36Z"
            fill={color}
            fillOpacity={0.3}
            stroke={color}
            strokeWidth={2}
          />
          <path d="M18 14h28" stroke={color} strokeWidth={2} strokeLinecap="round" />
          <path d="M22 26h20M23 36h18" stroke={color} strokeWidth={1.5} strokeOpacity={0.5} />
        </svg>
      );
    case "juice":
      return (
        <svg {...common}>
          <path
            d="M22 16h20v34a4 4 0 0 1-4 4H26a4 4 0 0 1-4-4V16Z"
            fill={color}
            fillOpacity={0.3}
            stroke={color}
            strokeWidth={2}
          />
          <path d="M22 16l4-8h12l4 8" stroke={color} strokeWidth={2} strokeLinejoin="round" fill="none" />
          <path d="M40 22l6-6" stroke={color} strokeWidth={2} strokeLinecap="round" />
        </svg>
      );
    case "cocktail":
      return (
        <svg {...common}>
          <path
            d="M14 14h36L32 34v16"
            fill={color}
            fillOpacity={0.25}
            stroke={color}
            strokeWidth={2}
            strokeLinejoin="round"
          />
          <path d="M22 54h20" stroke={color} strokeWidth={2} strokeLinecap="round" />
          <path d="M40 20a4 4 0 1 1-3-6" stroke={color} strokeWidth={2} strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path
            d="M20 10h24v10c0 14-5 24-12 24S20 34 20 20V10Z"
            fill={color}
            fillOpacity={0.25}
            stroke={color}
            strokeWidth={2}
          />
          <path d="M22 54h20" stroke={color} strokeWidth={2} strokeLinecap="round" />
          <text x={32} y={30} textAnchor="middle" fontSize={12} fill={color}>
            ?
          </text>
        </svg>
      );
  }
}
