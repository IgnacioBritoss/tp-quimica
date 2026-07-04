"use client";

import { formatHours, getPhase } from "@/lib/calc";
import { SectionCard } from "@/components/SectionCard";

interface TimeControlProps {
  lastDrinkTime: string; // "HH:MM"
  onChange: (value: string) => void;
  hoursSinceLastDrink: number;
}

const PHASE_LABEL: Record<string, string> = {
  ascendente: "Todavia estas absorbiendo el alcohol: puede seguir subiendo.",
  meseta: "Estas en la meseta: el nivel esta en su punto mas alto.",
  descendente: "Ya empezaste a eliminar alcohol de tu sangre.",
};

function nowHHMM() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function TimeControl({ lastDrinkTime, onChange, hoursSinceLastDrink }: TimeControlProps) {
  const phase = getPhase(hoursSinceLastDrink);

  return (
    <SectionCard
      title="3. Cuando fue tu ultimo trago"
      subtitle="El cuerpo elimina alcohol a ritmo fijo. Con esto ajustamos tu nivel actual, no solo el pico."
    >
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="last-drink" className="text-sm text-muted block mb-1">
            Hora del ultimo trago
          </label>
          <input
            id="last-drink"
            type="time"
            value={lastDrinkTime}
            onChange={(e) => onChange(e.target.value)}
            className="rounded bg-surface-2 border border-border px-3 py-2 text-text"
          />
        </div>
        <button
          onClick={() => onChange(nowHHMM())}
          className="rounded px-4 py-2 text-sm border border-border text-muted hover:text-text hover:bg-surface-2"
        >
          Fue ahora
        </button>
        <div className="text-sm text-muted">
          Pasaron <span className="text-text font-medium">{formatHours(hoursSinceLastDrink)}</span>
        </div>
      </div>

      <div className="rounded border-l-4 border-brand bg-surface-2 px-3 py-2 text-sm text-text">
        {PHASE_LABEL[phase]}
      </div>
    </SectionCard>
  );
}
