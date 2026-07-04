"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProfileSelector } from "@/components/ProfileSelector";
import { DrinkCatalog } from "@/components/DrinkCatalog";
import { DrinkList } from "@/components/DrinkList";
import { TimeControl } from "@/components/TimeControl";
import { ResultsPanel } from "@/components/ResultsPanel";
import { GlassPourBuilder } from "@/components/GlassPourBuilder";
import { TipsAndMyths } from "@/components/TipsAndMyths";
import { GameSection } from "@/components/GameSection";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SectionCard } from "@/components/SectionCard";
import { Logo } from "@/components/Logo";
import { BrandWordmark } from "@/components/BrandWordmark";
import { DrinkEntry, Profile } from "@/lib/types";
import { getR } from "@/lib/bodyTypes";
import { currentAlcoholemia, peakAlcoholemia, totalEthanolGrams } from "@/lib/calc";

type Tab = "calculadora" | "consejos" | "juego";

function nowHHMM() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function hoursSince(hhmm: string, now: Date) {
  const [h, m] = hhmm.split(":").map(Number);
  const then = new Date(now);
  then.setHours(h, m, 0, 0);
  let diffMs = now.getTime() - then.getTime();
  if (diffMs < 0) diffMs += 24 * 60 * 60 * 1000;
  return diffMs / (1000 * 60 * 60);
}

export default function Home() {
  const [tab, setTab] = useState<Tab>("calculadora");
  const [profile, setProfile] = useState<Profile>({
    sex: "masculino",
    bodyType: "promedio",
    weightKg: 70,
  });
  const [entries, setEntries] = useState<DrinkEntry[]>([]);
  const [lastDrinkTime, setLastDrinkTime] = useState<string>("");
  const [now, setNow] = useState<Date | null>(null);
  const [builderOpen, setBuilderOpen] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    const raf = requestAnimationFrame(() => {
      setNow(new Date());
      setLastDrinkTime(nowHHMM());
    });
    return () => {
      clearInterval(id);
      cancelAnimationFrame(raf);
    };
  }, []);

  const hoursSinceLastDrink = useMemo(
    () => (now && lastDrinkTime ? hoursSince(lastDrinkTime, now) : 0),
    [lastDrinkTime, now]
  );

  const totalGrams = useMemo(() => totalEthanolGrams(entries), [entries]);
  const r = getR(profile.sex, profile.bodyType);
  const peak = useMemo(() => peakAlcoholemia(totalGrams, profile.weightKg, r), [totalGrams, profile.weightKg, r]);
  const current = useMemo(() => currentAlcoholemia(peak, hoursSinceLastDrink), [peak, hoursSinceLastDrink]);

  function addEntry(entry: DrinkEntry) {
    setEntries((prev) => [...prev, entry]);
  }
  function removeEntry(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }
  function updateQuantity(id: string, quantity: number) {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, quantity } : e)));
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header estilo ORT */}
      <header className="bg-surface border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo className="w-10 h-10 shrink-0" />
            <div className="leading-tight">
              <BrandWordmark className="text-xl" />
              <div className="text-xs text-muted mt-0.5">Calculadora de alcoholemia</div>
            </div>
          </div>
          <ThemeToggle />
        </div>
        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <nav className="flex gap-1">
            {([
              { id: "calculadora", label: "Calculadora" },
              { id: "consejos", label: "Consejos y mitos" },
              { id: "juego", label: "Juego" },
            ] as { id: Tab; label: string }[]).map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${
                  tab === t.id ? "text-brand" : "text-muted hover:text-text"
                }`}
              >
                {t.label}
                {tab === t.id && (
                  <motion.span
                    layoutId="tab-underline"
                    className="absolute left-0 right-0 -bottom-px h-0.5 bg-brand"
                  />
                )}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <AnimatePresence mode="wait">
          {tab === "calculadora" && (
            <motion.div
              key="calc"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-text">Cuanto tome esta noche</h1>
                <p className="mt-2 text-muted max-w-2xl">
                  Elegi tus tragos como los pediste en la barra, o arma el tuyo sirviendo a ojo, y
                  estima tu alcoholemia sin tener que saber ningun numero exacto.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6 items-start">
                <div className="space-y-6">
                  <ProfileSelector profile={profile} onChange={setProfile} />
                  <DrinkCatalog onAdd={addEntry} onOpenBuilder={() => setBuilderOpen(true)} />
                  <SectionCard title="Tu lista de esta noche">
                    <DrinkList entries={entries} onRemove={removeEntry} onQuantityChange={updateQuantity} />
                  </SectionCard>
                  <TimeControl
                    lastDrinkTime={lastDrinkTime}
                    onChange={setLastDrinkTime}
                    hoursSinceLastDrink={hoursSinceLastDrink}
                  />
                </div>

                <ResultsPanel
                  peak={peak}
                  current={current}
                  hoursSinceLastDrink={hoursSinceLastDrink}
                  totalGrams={totalGrams}
                  hasDrinks={entries.length > 0}
                />
              </div>
            </motion.div>
          )}
          {tab === "consejos" && (
            <motion.div
              key="tips"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-text">Consejos y mitos</h1>
                <p className="mt-2 text-muted max-w-2xl">
                  Como cuidarte si vas a tomar, y las creencias mas comunes sobre el alcohol que no
                  son ciertas.
                </p>
              </div>
              <TipsAndMyths />
            </motion.div>
          )}
          {tab === "juego" && (
            <motion.div
              key="game"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-text">Juego</h1>
                <p className="mt-2 text-muted max-w-2xl">Una seccion nueva que estamos preparando.</p>
              </div>
              <GameSection />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="bg-footer text-white/80 mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 text-center text-xs space-y-1">
          <p>
            Los valores son estimaciones basadas en promedios de graduacion alcoholica y en el modelo
            de Widmark. Cada cuerpo es unico: esto no reemplaza un test de alcoholemia real.
          </p>
          <p className="text-white/60">
            En Argentina rige el alcohol cero al volante. Si tomaste, no manejes: pedi un remis, un
            acompanante, o espera.
          </p>
        </div>
      </footer>

      <GlassPourBuilder open={builderOpen} onClose={() => setBuilderOpen(false)} onAdd={addEntry} />
    </div>
  );
}
