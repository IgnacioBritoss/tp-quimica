interface BrandWordmarkProps {
  className?: string;
}

/**
 * Logotipo de texto "ALCOHOL". La formula del etanol es C2H6O: dos carbonos,
 * seis hidrogenos y UN solo oxigeno. Por eso van en azul solo C (con 2), H (con
 * 6) y una unica O; la otra O y las letras A, L, L quedan en el color del texto.
 */
export function BrandWordmark({ className }: BrandWordmarkProps) {
  return (
    <span className={`font-extrabold tracking-tight leading-none ${className ?? ""}`} aria-label="Alcohol">
      <span className="text-text">AL</span>
      <span className="text-brand">
        C<sub className="text-[0.55em] font-bold">2</sub>
      </span>
      {/* esta O no forma parte de la formula del etanol: queda en color normal */}
      <span className="text-text">O</span>
      <span className="text-brand">
        H<sub className="text-[0.55em] font-bold">6</sub>
      </span>
      {/* el unico oxigeno del etanol */}
      <span className="text-brand">O</span>
      <span className="text-text">L</span>
    </span>
  );
}
