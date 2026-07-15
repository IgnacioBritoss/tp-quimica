"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProfileSelector } from "@/components/ProfileSelector";
import { DrinkCatalog } from "@/components/DrinkCatalog";
import { DrinkList } from "@/components/DrinkList";
import { ResultsPanel } from "@/components/ResultsPanel";
import { GlassPourBuilder } from "@/components/GlassPourBuilder";
import { TipsAndMyths } from "@/components/TipsAndMyths";
import { GameSection } from "@/components/GameSection";
import { CalcExplainer } from "@/components/CalcExplainer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SectionCard } from "@/components/SectionCard";
import { Logo } from "@/components/Logo";
import { BrandWordmark } from "@/components/BrandWordmark";
import { DrinkEntry, Profile } from "@/lib/types";
import { getR } from "@/lib/bodyTypes";
import { ethanolGramsForEntry, simulateDoses, totalEthanolGrams } from "@/lib/calc";

type Tab = "calculadora" | "consejos" | "calculo" | "juego";

function TabIcon({ id }: { id: Tab }) {
  const p = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (id === "calculadora")
    return (
      <svg {...p}>
        <rect x="5" y="3" width="14" height="18" rx="2" />
        <path d="M9 7h6M8 12h.01M12 12h.01M16 12v5M8 16h.01M12 16h.01" />
      </svg>
    );
  if (id === "consejos")
    return (
      <svg {...p}>
        <path d="M9 18h6M10 21h4" />
        <path d="M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.3 1 2.5h6c0-1.2.3-1.8 1-2.5A6 6 0 0 0 12 3Z" />
      </svg>
    );
  if (id === "calculo")
    return (
      <svg {...p}>
        <path d="M4 19V5M4 19h16" />
        <path d="M4 15c3 0 4-8 7-8s4 6 7 6" />
      </svg>
    );
  // juego
  return (
    <svg {...p}>
      <path d="M7 12h4M9 10v4" />
      <circle cx="15.5" cy="11.5" r="0.6" fill="currentColor" />
      <circle cx="17.5" cy="13.5" r="0.6" fill="currentColor" />
      <path d="M17 6H7a5 5 0 0 0-5 5v1a4 4 0 0 0 7 3h6a4 4 0 0 0 7-3v-1a5 5 0 0 0-5-5Z" />
    </svg>
  );
}

export default function Home() {
  const [tab, setTab] = useState<Tab>("calculadora");
  const [profile, setProfile] = useState<Profile>({
    sex: "masculino",
    bodyType: "promedio",
    weightKg: 70,
  });
  const [entries, setEntries] = useState<DrinkEntry[]>([]);
  const [now, setNow] = useState<Date | null>(null);
  const [builderOpen, setBuilderOpen] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    const raf = requestAnimationFrame(() => setNow(new Date()));
    return () => {
      clearInterval(id);
      cancelAnimationFrame(raf);
    };
  }, []);

  const totalGrams = useMemo(() => totalEthanolGrams(entries), [entries]);
  const r = getR(profile.sex, profile.bodyType);

  const sim = useMemo(() => {
    const nowMs = (now ?? new Date()).getTime();
    const doses = entries.map((e) => ({
      grams: ethanolGramsForEntry(e),
      // Positivo = pasado, negativo = futuro. Un trago futuro no afecta el "ahora".
      hoursAgo: e.at ? (nowMs - e.at) / 3_600_000 : 0,
    }));
    return simulateDoses(doses, profile.weightKg, r);
  }, [entries, now, profile.weightKg, r]);

  function addEntry(entry: DrinkEntry) {
    setEntries((prev) => [...prev, { ...entry, at: entry.at ?? Date.now() }]);
  }
  function removeEntry(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }
  function updateQuantity(id: string, quantity: number) {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, quantity } : e)));
  }
  function updateAt(id: string, at: number) {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, at } : e)));
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
              { id: "calculadora", label: "Calculadora", short: "Calcular" },
              { id: "consejos", label: "Consejos y mitos", short: "Consejos" },
              { id: "calculo", label: "El calculo", short: "Metodo" },
              { id: "juego", label: "Juegos", short: "Juegos" },
            ] as { id: Tab; label: string; short: string }[]).map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`relative flex-1 sm:flex-none flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-4 py-2 sm:py-2.5 text-[11px] sm:text-sm font-medium transition-colors ${
                  tab === t.id ? "text-brand" : "text-muted hover:text-text"
                }`}
              >
                <TabIcon id={t.id} />
                <span className="sm:hidden">{t.short}</span>
                <span className="hidden sm:inline">{t.label}</span>
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
                  Elegi tus tragos como los pediste en la barra, o arma el tuyo sirviendo a ojo.
                  Ponele a cada uno la hora en que lo tomaste y estimamos como sube y baja tu
                  alcoholemia durante la noche.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6 items-start">
                <div className="space-y-6">
                  <ProfileSelector profile={profile} onChange={setProfile} />
                  <DrinkCatalog onAdd={addEntry} onOpenBuilder={() => setBuilderOpen(true)} />
                  <SectionCard
                    title="Tu lista de esta noche"
                    subtitle="Cada trago arranca con la hora en que lo agregaste. Tocá la hora para ajustarla."
                  >
                    <DrinkList
                      entries={entries}
                      onRemove={removeEntry}
                      onQuantityChange={updateQuantity}
                      onAtChange={updateAt}
                    />
                  </SectionCard>
                </div>

                <ResultsPanel sim={sim} totalGrams={totalGrams} hasDrinks={entries.length > 0} />
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
          {tab === "calculo" && (
            <motion.div
              key="calc-explain"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-text">El calculo</h1>
                <p className="mt-2 text-muted max-w-2xl">
                  Como estimamos la alcoholemia, con que formulas y con que logica. Y como se fue
                  midiendo el alcohol a lo largo del tiempo.
                </p>
              </div>
              <CalcExplainer />
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
                <h1 className="text-2xl sm:text-3xl font-bold text-text">Juegos</h1>
                <p className="mt-2 text-muted max-w-2xl">
                  Aprende jugando: un quiz rapido sobre el alcohol y un juego para armar tragos.
                </p>
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
