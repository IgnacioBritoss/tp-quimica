import { ReactNode } from "react";

interface SectionCardProps {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Tarjeta con barra de encabezado azul, al estilo del Campus ORT. */
export function SectionCard({ title, subtitle, right, children, className }: SectionCardProps) {
  return (
    <section
      className={`bg-surface border border-border rounded-md overflow-hidden shadow-sm ${className ?? ""}`}
    >
      <div className="section-bar px-5 py-3 flex items-center justify-between gap-3">
        <h2 className="text-base sm:text-lg font-semibold">{title}</h2>
        {right}
      </div>
      <div className="p-5 sm:p-6 space-y-5">
        {subtitle && <p className="text-sm text-muted -mt-1">{subtitle}</p>}
        {children}
      </div>
    </section>
  );
}
