"use client";

import { stageForBac, SymptomStage } from "@/lib/symptoms";
import { motion } from "framer-motion";

const TONE_COLOR: Record<SymptomStage["tone"], string> = {
  ok: "var(--ok)",
  warn: "var(--warn)",
  danger: "var(--danger)",
  critical: "var(--danger)",
};

export function SymptomsPanel({ bac }: { bac: number }) {
  const stage = stageForBac(bac);
  const color = TONE_COLOR[stage.tone];

  return (
    <motion.div
      key={stage.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded border border-border overflow-hidden"
    >
      <div className="px-4 py-2 flex items-center gap-2" style={{ backgroundColor: `${color}22` }}>
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-sm font-semibold text-text">{stage.period}</span>
      </div>
      <div className="p-4 space-y-2">
        <p className="text-sm font-medium text-text">{stage.title}</p>
        <ul className="space-y-1.5">
          {stage.symptoms.map((s, i) => (
            <li key={i} className="text-sm text-muted flex gap-2">
              <span style={{ color }} className="mt-0.5">
                •
              </span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
