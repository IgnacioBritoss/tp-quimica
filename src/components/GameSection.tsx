"use client";

import { motion } from "framer-motion";
import { SectionCard } from "@/components/SectionCard";

export function GameSection() {
  return (
    <SectionCard title="Juego">
      <div className="py-12 flex flex-col items-center text-center gap-4">
        <motion.div
          initial={{ rotate: -8, scale: 0.9, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
          className="inline-flex items-center gap-2 rounded border-2 border-dashed border-warn px-5 py-2"
        >
          {/* cartel tipo obra en construccion */}
          <span className="w-2.5 h-2.5 rounded-full bg-warn animate-pulse" />
          <span className="text-lg font-bold uppercase tracking-wide text-warn">En servicio</span>
        </motion.div>
        <p className="text-sm text-muted max-w-sm">
          Estamos preparando un juego para esta seccion. Mientras tanto seguimos puliendo el resto de
          la app. Volve pronto.
        </p>
      </div>
    </SectionCard>
  );
}
