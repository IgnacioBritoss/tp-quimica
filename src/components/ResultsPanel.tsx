"use client";

import { formatHours, SimResult } from "@/lib/calc";
import { BacCurveChart } from "@/components/BacCurveChart";
import { SymptomsPanel } from "@/components/SymptomsPanel";

interface ResultsPanelProps {
  sim: SimResult;
  totalGrams: number;
  hasDrinks: boolean;
}

function verdict(current: number, hasFuture: boolean) {
  if (current <= 0.01)
    return {
      color: "var(--ok)",
      text: hasFuture
        ? "Ahora estas en cero. Los tragos que cargaste a futuro todavia no cuentan."
        : "Alcohol cero: segun la estimacion ya podrias conducir.",
    };
  return {
    color: "var(--danger)",
    text: "Tenes alcohol en sangre. En Argentina el limite es 0,0: no manejes.",
  };
}

export function ResultsPanel({ sim, totalGrams, hasDrinks }: ResultsPanelProps) {
  const v = verdict(sim.current, sim.hasFuture);

  return (
    <section className="bg-surface border border-border rounded-md overflow-hidden shadow-sm lg:sticky lg:top-4">
      <div className="section-bar px-5 py-3">
        <h2 className="text-base sm:text-lg font-semibold">Tu estimacion ahora</h2>
      </div>
      <div className="p-5 sm:p-6 space-y-5">
        <p className="text-sm text-muted -mt-1">
          Aproximacion educativa (modelo de Widmark), no es un alcoholimetro. Ante la duda, no manejes.
        </p>

        {!hasDrinks ? (
          <div className="text-center py-10 text-muted text-sm">
            Agrega al menos un trago para ver tu alcoholemia estimada.
          </div>
        ) : (
          <>
            <div className="text-center py-2">
              <div className="text-6xl font-bold tabular-nums" style={{ color: v.color }}>
                {sim.current.toFixed(2)}
                <span className="text-2xl text-muted ml-1">g/L</span>
              </div>
              <div className="mt-2 text-sm font-medium" style={{ color: v.color }}>
                {v.text}
              </div>
            </div>

            <BacCurveChart series={sim.series} nowX={sim.nowX} maxX={sim.maxX} />
            {sim.hasFuture && (
              <p className="-mt-2 text-xs text-muted text-center">
                La linea incluye los tragos que cargaste a futuro. La marca &quot;ahora&quot; es este
                momento: lo que esta a su derecha todavia no paso.
              </p>
            )}

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="rounded bg-surface-2 border border-border p-3">
                <div className="text-muted text-xs">Alcohol total ingerido</div>
                <div className="text-text font-semibold">{totalGrams.toFixed(1)} g</div>
              </div>
              <div className="rounded bg-surface-2 border border-border p-3">
                <div className="text-muted text-xs">Pico estimado</div>
                <div className="text-text font-semibold">{sim.peak.toFixed(2)} g/L</div>
              </div>
            </div>

            <div className="rounded border border-border bg-surface-2 px-4 py-3 flex items-center justify-between">
              <div>
                <div className="text-sm text-text font-medium">Para poder conducir (alcohol cero)</div>
                <div className="text-xs text-muted">Necesitas llegar a 0,0 g/L</div>
              </div>
              <div className="text-sm font-semibold">
                {sim.timeToZero <= 0 ? (
                  <span className="text-ok">Ya podrias</span>
                ) : (
                  <span className="text-text">en {formatHours(sim.timeToZero)}</span>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-text mb-2">Posibles sintomas en este nivel</h3>
              <SymptomsPanel bac={sim.current} />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
