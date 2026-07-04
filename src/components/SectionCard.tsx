import { ReactNode } from "react";

interface SectionCardProps {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
  onBack?: () => void;
}

/** Tarjeta con barra de encabezado azul, al estilo del Campus ORT. */
export function SectionCard({ title, subtitle, right, children, className, onBack }: SectionCardProps) {
  return (
    <section
      className={`bg-surface border border-border rounded-md overflow-hidden shadow-sm ${className ?? ""}`}
    >
      <div className="section-bar px-5 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          {onBack && (
            <button
              onClick={onBack}
              aria-label="Volver al menu de juegos"
              title="Volver"
              className="shrink-0 -ml-1.5 p-1 rounded text-on-brand hover:bg-white/20 transition-colors"
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
          <h2 className="text-base sm:text-lg font-semibold truncate">{title}</h2>
        </div>
        {right}
      </div>
      <div className="p-5 sm:p-6 space-y-5">
        {subtitle && <p className="text-sm text-muted -mt-1">{subtitle}</p>}
        {children}
      </div>
    </section>
  );
}
