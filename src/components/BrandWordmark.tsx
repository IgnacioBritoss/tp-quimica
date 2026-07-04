interface BrandWordmarkProps {
  className?: string;
}

/**
 * Logotipo de texto "ALCOHOL". Las letras que tambien son atomos de la molecula
 * de etanol (C, O, H, O) van en azul y con los subindices de la formula del
 * etanol: C2 H6 O. Las demas letras (A, L, L) quedan en el color del texto.
 */
export function BrandWordmark({ className }: BrandWordmarkProps) {
  return (
    <span className={`font-extrabold tracking-tight leading-none ${className ?? ""}`} aria-label="Alcohol">
      <span className="text-text">AL</span>
      <span className="text-brand">
        C<sub className="text-[0.55em] font-bold">2</sub>
      </span>
      <span className="text-brand">O</span>
      <span className="text-brand">
        H<sub className="text-[0.55em] font-bold">6</sub>
      </span>
      <span className="text-brand">O</span>
      <span className="text-text">L</span>
    </span>
  );
}
