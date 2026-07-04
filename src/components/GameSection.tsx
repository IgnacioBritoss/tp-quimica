"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionCard } from "@/components/SectionCard";
import { QuizGame } from "@/components/games/QuizGame";
import { BartenderGame } from "@/components/games/BartenderGame";

type Game = "menu" | "quiz" | "bartender";

export function GameSection() {
  const [game, setGame] = useState<Game>("menu");

  return (
    <SectionCard
      title={game === "quiz" ? "Quiz del alcohol" : game === "bartender" ? "Bartender" : "Elegi un juego"}
      onBack={game !== "menu" ? () => setGame("menu") : undefined}
    >
      <AnimatePresence mode="wait">
        {game === "menu" && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            <GameCard
              title="Quiz del alcohol"
              desc="Preguntas rapidas contra reloj, con puntaje y racha. Cuanto sabes sobre la alcoholemia?"
              accent="var(--brand)"
              onClick={() => setGame("quiz")}
            />
            <GameCard
              title="Bartender"
              desc="Arma tragos acertando la receta y consegui el mejor puntaje. Incluye tutorial de recetas."
              accent="var(--warn)"
              onClick={() => setGame("bartender")}
            />
          </motion.div>
        )}

        {game === "quiz" && (
          <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <QuizGame onExit={() => setGame("menu")} />
          </motion.div>
        )}

        {game === "bartender" && (
          <motion.div key="bar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <BartenderGame onExit={() => setGame("menu")} />
          </motion.div>
        )}
      </AnimatePresence>
    </SectionCard>
  );
}

function GameCard({
  title,
  desc,
  accent,
  onClick,
}: {
  title: string;
  desc: string;
  accent: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="text-left rounded-md border border-border bg-surface-2 p-5 hover:border-brand/50 transition-colors relative overflow-hidden"
    >
      <span className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: accent }} />
      <div className="text-lg font-semibold text-text pl-2">{title}</div>
      <div className="text-sm text-muted mt-1 pl-2">{desc}</div>
    </motion.button>
  );
}
