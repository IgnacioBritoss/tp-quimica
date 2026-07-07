"use client";

import { DrinkEntry } from "@/lib/types";
import { DrinkImage } from "@/components/DrinkImage";
import { ethanolGramsForEntry } from "@/lib/calc";
import { TimePicker } from "@/components/TimePicker";
import { AnimatePresence, motion } from "framer-motion";

interface DrinkListProps {
  entries: DrinkEntry[];
  onRemove: (id: string) => void;
  onQuantityChange: (id: string, quantity: number) => void;
  onTimeChange: (id: string, time: string) => void;
}

export function DrinkList({ entries, onRemove, onQuantityChange, onTimeChange }: DrinkListProps) {
  if (entries.length === 0) {
    return <p className="text-sm text-muted italic">Todavia no agregaste ningun trago.</p>;
  }

  return (
    <ul className="space-y-2">
      <AnimatePresence initial={false}>
        {entries.map((entry) => {
          const color = entry.color.startsWith("var") ? "#1c5aa6" : entry.color;
          return (
            <motion.li
              key={entry.id}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.15 }}
              className="rounded border border-border bg-surface-2 p-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded overflow-hidden flex items-center justify-center shrink-0 border border-border"
                  style={{ backgroundColor: `${color}1f` }}
                >
                  <DrinkImage
                    src={entry.image}
                    icon={entry.icon}
                    color={color}
                    alt={entry.name}
                    className="w-full h-full object-cover"
                    iconClassName="w-7 h-7"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-text truncate">{entry.name}</div>
                  <div className="text-xs text-muted">
                    {Math.round(entry.totalVolumeMl)} cc · {entry.abv.toFixed(entry.parts ? 1 : 0)}° ·{" "}
                    {ethanolGramsForEntry(entry).toFixed(1)} g de alcohol
                  </div>
                  {entry.parts && (
                    <div className="text-[11px] text-muted truncate mt-0.5">
                      {entry.parts.map((p) => p.name).join(" + ")}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onQuantityChange(entry.id, Math.max(1, entry.quantity - 1))}
                    className="w-7 h-7 rounded border border-border text-text text-sm flex items-center justify-center hover:bg-surface"
                  >
                    −
                  </button>
                  <span className="w-4 text-center text-sm text-text">{entry.quantity}</span>
                  <button
                    onClick={() => onQuantityChange(entry.id, entry.quantity + 1)}
                    className="w-7 h-7 rounded border border-border text-text text-sm flex items-center justify-center hover:bg-surface"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => onRemove(entry.id)}
                  className="text-muted hover:text-danger px-1"
                  aria-label={`Quitar ${entry.name}`}
                >
                  ✕
                </button>
              </div>

              <div className="mt-2 flex items-center gap-2 pl-14">
                <span className="text-xs text-muted">Lo tomaste a las</span>
                <TimePicker
                  compact
                  value={entry.time || ""}
                  onChange={(t) => onTimeChange(entry.id, t)}
                />
              </div>
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ul>
  );
}
