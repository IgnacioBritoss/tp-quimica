"use client";

import { motion } from "framer-motion";
import { MYTHS, TIPS } from "@/lib/tips";
import { SectionCard } from "@/components/SectionCard";

export function TipsAndMyths() {
  return (
    <div className="space-y-6">
      <SectionCard
        title="Consejos"
        subtitle="Buenas practicas para reducir el dano y el riesgo si vas a tomar."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TIPS.map((t, i) => (
            <motion.div
              key={t.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="rounded border border-border bg-surface-2 p-4"
            >
              <h3 className="text-sm font-semibold text-brand mb-1">{t.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{t.body}</p>
            </motion.div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Mitos que conviene desmentir"
        subtitle="Creencias comunes sobre el alcohol y lo que dice la evidencia."
      >
        <div className="space-y-3">
          {MYTHS.map((m, i) => (
            <motion.div
              key={m.myth}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="rounded border border-border overflow-hidden"
            >
              <div className="px-4 py-2 bg-surface-2 border-b border-border">
                <span className="text-xs font-semibold uppercase tracking-wide text-danger mr-2">Mito</span>
                <span className="text-sm text-text">{m.myth}</span>
              </div>
              <div className="px-4 py-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-ok mr-2">Realidad</span>
                <span className="text-sm text-muted">{m.truth}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
