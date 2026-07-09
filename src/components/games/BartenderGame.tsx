"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RECIPES, Recipe } from "@/lib/cocktailRecipes";
import { getIngredient } from "@/lib/ingredients";
import { ETHANOL_DENSITY } from "@/lib/calc";
import { IceCluster } from "@/components/IceCluster";
import { youtubeEmbed } from "@/lib/recipeVideos";
import { addScore, buildBoard, loadRealScores, BAR_KEY, BAR_PINNED, ScoreEntry } from "@/lib/leaderboard";
import { Leaderboard } from "@/components/games/Leaderboard";

type Mode = "menu" | "play" | "tutorial";

const ICE_CUBE_ML = 28;
const GLASS_W = 120;
const GLASS_H = 190;
const ROUNDS = 5;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Boton de volver con flecha animada. */
function BackButton({ onClick, label = "Volver" }: { onClick: () => void; label?: string }) {
  return (
    <motion.button
      onClick={onClick}
      initial="rest"
      whileHover="hover"
      whileTap={{ scale: 0.96 }}
      className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2 pl-2.5 pr-3.5 py-1.5 text-sm text-muted hover:text-brand hover:border-brand/50 transition-colors"
    >
      <motion.span
        variants={{ rest: { x: 0 }, hover: { x: -3 } }}
        transition={{ type: "spring", stiffness: 500, damping: 20 }}
        className="inline-flex"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4">
          <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.span>
      {label}
    </motion.button>
  );
}

export function BartenderGame({ onExit }: { onExit: () => void }) {
  const [mode, setMode] = useState<Mode>("menu");

  if (mode === "tutorial") return <Tutorial onBack={() => setMode("menu")} />;
  if (mode === "play") return <Play onBack={() => setMode("menu")} />;

  return (
    <div className="py-6 space-y-4">
      <p className="text-sm text-muted text-center max-w-md mx-auto">
        Prepara el trago que te toca acercandote lo mas posible a la receta. Cuanto mejor la
        proporcion, mas puntaje. Y aprende las recetas en el tutorial.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
        <motion.button
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setMode("play")}
          className="rounded-md border border-border bg-surface-2 p-5 text-left hover:border-brand/50"
        >
          <div className="text-base font-semibold text-text">Jugar</div>
          <div className="text-sm text-muted mt-1">Arma el trago y consegui el mejor puntaje.</div>
        </motion.button>
        <motion.button
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setMode("tutorial")}
          className="rounded-md border border-border bg-surface-2 p-5 text-left hover:border-brand/50"
        >
          <div className="text-base font-semibold text-text">Recetas (tutorial)</div>
          <div className="text-sm text-muted mt-1">Aprende las proporciones y mira videos.</div>
        </motion.button>
      </div>
      <div className="text-center">
        <button onClick={onExit} className="rounded px-4 py-2 text-sm border border-border text-muted hover:text-text hover:bg-surface-2">
          Volver a los juegos
        </button>
      </div>
    </div>
  );
}

/** Vaso con liquidos apilados y hielo flotando (como el calculador). */
function GameGlass({ recipe, vols }: { recipe: Recipe; vols: Record<string, number> }) {
  const liquids = recipe.parts.filter((p) => p.ingredientId !== "hielo");
  const liquidVol = liquids.reduce((s, p) => s + (vols[p.ingredientId] || 0), 0);
  const iceVol = vols["hielo"] || 0;
  const totalVol = Math.min(recipe.glassMl, liquidVol + iceVol);
  const surfaceBottom = (totalVol / recipe.glassMl) * GLASS_H;
  const iceCubes = Math.min(9, Math.round(iceVol / ICE_CUBE_ML));

  return (
    <div className="relative shrink-0" style={{ width: GLASS_W, height: GLASS_H }}>
      <div
        className="relative w-full h-full border-2 border-brand/40 overflow-hidden"
        style={{
          clipPath: "polygon(16% 0,84% 0,78% 100%,22% 100%)",
          background: "color-mix(in srgb, var(--muted) 12%, transparent)",
        }}
      >
        {liquidVol > 0 && (
          <div className="absolute inset-x-0 bottom-0 flex flex-col-reverse" style={{ height: `${(totalVol / recipe.glassMl) * 100}%` }}>
            {liquids.map((p) => {
              const ing = getIngredient(p.ingredientId)!;
              const v = vols[p.ingredientId] || 0;
              if (v <= 0) return null;
              return (
                <motion.div
                  key={p.ingredientId}
                  layout
                  animate={{ height: `${(v / liquidVol) * 100}%` }}
                  transition={{ type: "spring", stiffness: 200, damping: 26 }}
                  style={{ backgroundColor: ing.color, opacity: 0.85 }}
                />
              );
            })}
          </div>
        )}
        {iceCubes > 0 && (
          <IceCluster
            cubes={iceCubes}
            perRow={2}
            centerX={GLASS_W / 2}
            containerH={GLASS_H}
            floating={liquidVol > 0}
            surfaceBottom={surfaceBottom}
            size={22}
          />
        )}
      </div>
    </div>
  );
}

type PlayPhase = "intro" | "playing" | "finished";

function Play({ onBack }: { onBack: () => void }) {
  const [phase, setPhase] = useState<PlayPhase>("intro");
  const [nickname, setNickname] = useState("");
  const [deck, setDeck] = useState<Recipe[]>([]);
  const [roundIndex, setRoundIndex] = useState(0);
  const [vols, setVols] = useState<Record<string, number>>({});
  const [served, setServed] = useState<null | { accuracy: number; grams: number; abv: number; total: number }>(null);
  const [scores, setScores] = useState<number[]>([]);
  const [startTime, setStartTime] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [board, setBoard] = useState<ScoreEntry[]>(() => buildBoard(BAR_PINNED, loadRealScores(BAR_KEY)));
  const [lastDate, setLastDate] = useState<number | null>(null);

  function startGame() {
    if (!nickname.trim()) return;
    setDeck(shuffle(RECIPES).slice(0, ROUNDS));
    setRoundIndex(0);
    setVols({});
    setServed(null);
    setScores([]);
    setShowHint(false);
    setStartTime(Date.now());
    setLastDate(null);
    setPhase("playing");
  }

  function finishGame(allScores: number[]) {
    const total = allScores.reduce((a, b) => a + b, 0);
    const avg = Math.round(total / ROUNDS);
    const date = Date.now();
    const entry: ScoreEntry = {
      name: nickname.trim().slice(0, 18),
      score: total,
      timeMs: Date.now() - startTime,
      meta: `${ROUNDS} tragos · ${avg}% prom`,
      date,
    };
    const real = addScore(BAR_KEY, entry);
    setBoard(buildBoard(BAR_PINNED, real));
    setLastDate(date);
    setPhase("finished");
  }

  // ── Intro ──
  if (phase === "intro") {
    const canStart = nickname.trim().length > 0;
    return (
      <div className="py-4 space-y-6 max-w-md mx-auto">
        <BackButton onClick={onBack} />
        <div className="text-center">
          <div className="text-2xl font-bold text-text">Bartender</div>
          <p className="text-sm text-muted mt-2">
            Prepara {ROUNDS} tragos distintos acercandote lo mas posible a cada receta. Cada trago
            suma segun tu precision. Al final entras al podio.
          </p>
        </div>
        <div>
          <label className="text-sm font-medium text-text block mb-1">Tu nombre para el podio</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && startGame()}
            maxLength={18}
            placeholder="Escribi tu nombre"
            className="w-full rounded bg-surface-2 border border-border px-3 py-2 text-text placeholder:text-muted/50"
          />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-semibold text-text">Podio</h3>
            <span className="text-xs text-muted">(se guarda en tu navegador)</span>
          </div>
          <Leaderboard entries={board} />
        </div>
        <div className="text-center">
          <motion.button
            whileTap={{ scale: canStart ? 0.96 : 1 }}
            onClick={startGame}
            disabled={!canStart}
            className="rounded px-6 py-2.5 font-semibold text-on-brand bg-brand hover:bg-brand-strong disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Empezar
          </motion.button>
        </div>
      </div>
    );
  }

  // ── Finished ──
  if (phase === "finished") {
    const total = scores.reduce((a, b) => a + b, 0);
    const avg = Math.round(total / ROUNDS);
    const myRank = board.findIndex((e) => e.date === lastDate) + 1;
    return (
      <div className="py-4 space-y-6 max-w-md mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
          <div className="text-sm uppercase tracking-wider text-muted">Resultado de {nickname.trim()}</div>
          <motion.div
            initial={{ scale: 0.6 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 14 }}
            className="text-5xl font-bold text-brand tabular-nums"
          >
            {total}
          </motion.div>
          <div className="text-text font-medium">
            {avg >= 90 ? "Bartender profesional!" : avg >= 70 ? "Muy buena mano." : avg >= 50 ? "Vas bien, segui practicando." : "A repasar las recetas."}
          </div>
          <div className="grid grid-cols-3 gap-2 pt-2">
            <div className="rounded bg-surface-2 border border-border p-2">
              <div className="text-[11px] text-muted">Tragos</div>
              <div className="text-text font-semibold">{ROUNDS}</div>
            </div>
            <div className="rounded bg-surface-2 border border-border p-2">
              <div className="text-[11px] text-muted">Precision</div>
              <div className="text-text font-semibold">{avg}%</div>
            </div>
            <div className="rounded bg-surface-2 border border-border p-2">
              <div className="text-[11px] text-muted">Puesto</div>
              <div className="text-text font-semibold">{myRank > 0 ? `#${myRank}` : "-"}</div>
            </div>
          </div>
        </motion.div>
        <div>
          <h3 className="text-sm font-semibold text-text mb-2">Podio</h3>
          <Leaderboard entries={board} highlightDate={lastDate ?? undefined} />
        </div>
        <div className="flex gap-2 justify-center">
          <button onClick={onBack} className="rounded px-4 py-2.5 border border-border text-muted hover:text-text hover:bg-surface-2">
            Salir
          </button>
          <button onClick={() => setPhase("intro")} className="rounded px-6 py-2.5 font-semibold text-on-brand bg-brand hover:bg-brand-strong">
            Jugar de nuevo
          </button>
        </div>
      </div>
    );
  }

  // ── Playing ──
  const recipe = deck[roundIndex];
  const ingredients = recipe.parts.map((p) => ({ ...p, ing: getIngredient(p.ingredientId)! }));
  const totalParts = recipe.parts.reduce((s, p) => s + p.parts, 0);
  const liquidIngredients = ingredients.filter((it) => it.ingredientId !== "hielo");
  const sumVol = ingredients.reduce((s, it) => s + (vols[it.ingredientId] || 0), 0);
  const runningScore = scores.reduce((a, b) => a + b, 0);
  const isLast = roundIndex + 1 >= ROUNDS;

  function serve() {
    if (sumVol < 20) return;
    let err = 0;
    let grams = 0;
    ingredients.forEach((it) => {
      const target = it.parts / totalParts;
      const got = (vols[it.ingredientId] || 0) / sumVol;
      err += Math.abs(target - got);
      grams += (vols[it.ingredientId] || 0) * ETHANOL_DENSITY * (it.ing.abv / 100);
    });
    const accuracy = Math.max(0, Math.round((1 - err / 2) * 100));
    const abv = sumVol > 0 ? (grams / ETHANOL_DENSITY / sumVol) * 100 : 0;
    setServed({ accuracy, grams, abv, total: sumVol });
    setScores((s) => [...s, accuracy]);
  }

  function nextRound() {
    if (isLast) {
      finishGame(scores);
      return;
    }
    setRoundIndex((i) => i + 1);
    setVols({});
    setServed(null);
    setShowHint(false);
  }

  return (
    <div className="py-2 space-y-4">
      <div className="flex items-center justify-between">
        <BackButton onClick={onBack} />
        <div className="text-sm text-muted">
          Trago <span className="text-text font-semibold">{roundIndex + 1}</span>/{ROUNDS} · Puntaje{" "}
          <span className="text-brand font-bold tabular-nums">{runningScore}</span>
        </div>
      </div>

      <div className="text-center">
        <div className="text-xs uppercase tracking-wider text-muted">Tenes que preparar</div>
        <motion.div
          key={recipe.id}
          initial={{ opacity: 0, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="text-xl font-bold text-text"
        >
          {recipe.name}
        </motion.div>
      </div>

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
        {/* vaso + porcentaje de ocupacion al costado (el hielo no lleva %) */}
        <div className="flex items-stretch gap-2 shrink-0">
          <GameGlass recipe={recipe} vols={vols} />
          <div className="flex flex-col justify-center gap-1.5">
            {liquidIngredients.map((it) => {
              const pct = Math.round(((vols[it.ingredientId] || 0) / recipe.glassMl) * 100);
              return (
                <div key={it.ingredientId} className="flex items-center gap-1.5 text-xs">
                  <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: it.ing.color }} />
                  <span className="text-muted whitespace-nowrap">{it.ing.name}</span>
                  <span className="text-text font-semibold tabular-nums ml-auto">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex-1 w-full space-y-3">
          {ingredients.map((it) => (
            <div key={it.ingredientId}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="flex items-center gap-2 text-text">
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: it.ing.color }} />
                  {it.ing.name}
                  {it.ing.abv > 0 && <span className="text-muted text-xs">({it.ing.abv}°)</span>}
                </span>
                <span className="text-muted tabular-nums">{vols[it.ingredientId] || 0} cc</span>
              </div>
              <input
                type="range"
                min={0}
                max={recipe.glassMl}
                step={10}
                value={vols[it.ingredientId] || 0}
                disabled={!!served}
                onChange={(e) => setVols((v) => ({ ...v, [it.ingredientId]: Number(e.target.value) }))}
                className="w-full"
              />
            </div>
          ))}

          {!served && (
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setShowHint((h) => !h)}
                className="rounded px-3 py-2 text-sm border border-border text-muted hover:text-text hover:bg-surface-2"
              >
                {showHint ? "Ocultar receta" : "Pista"}
              </button>
              <button
                onClick={serve}
                disabled={sumVol < 20}
                className="flex-1 rounded px-4 py-2 text-sm font-semibold text-on-brand bg-brand hover:bg-brand-strong disabled:opacity-40"
              >
                Servir
              </button>
            </div>
          )}

          {showHint && !served && (
            <div className="text-xs text-muted rounded bg-surface-2 border border-border p-2">
              Receta: {ingredients.map((it) => `${it.ing.name} ${it.parts}`).join(" · ")} partes
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {served && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-md border border-border bg-surface-2 p-4 text-center space-y-2"
          >
            <div className="text-xs uppercase tracking-wider text-muted">Puntaje del trago</div>
            <motion.div
              initial={{ scale: 0.6 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 14 }}
              className="text-4xl font-bold tabular-nums"
              style={{ color: served.accuracy >= 80 ? "var(--ok)" : served.accuracy >= 50 ? "var(--warn)" : "var(--danger)" }}
            >
              {served.accuracy}
            </motion.div>
            <div className="text-sm text-text">
              {served.accuracy >= 90
                ? "Bartender profesional!"
                : served.accuracy >= 70
                  ? "Muy buen trago."
                  : served.accuracy >= 50
                    ? "Zafa, pero se puede mejorar."
                    : "Mmm, revisá las proporciones."}
            </div>
            <div className="text-xs text-muted">
              {Math.round(served.total)} cc · {served.abv.toFixed(1)}° · {served.grams.toFixed(1)} g de alcohol
            </div>
            <button onClick={nextRound} className="mt-1 rounded px-5 py-2 text-sm font-semibold text-on-brand bg-brand hover:bg-brand-strong">
              {isLast ? "Ver resultado" : "Siguiente trago"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Tutorial({ onBack }: { onBack: () => void }) {
  return (
    <div className="py-2 space-y-4">
      <BackButton onClick={onBack} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
        {RECIPES.map((r, idx) => {
          const embed = youtubeEmbed(r.id);
          const liquids = r.parts.filter((p) => p.ingredientId !== "hielo");
          const liquidTotal = liquids.reduce((s, p) => s + p.parts, 0);
          return (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="rounded-md border border-border bg-surface overflow-hidden flex flex-col h-full"
            >
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-semibold text-text">{r.name}</h3>

                {/* barra de proporcion de los liquidos */}
                <div className="mt-3 flex h-2.5 rounded-full overflow-hidden border border-border">
                  {liquids.map((p) => {
                    const ing = getIngredient(p.ingredientId)!;
                    return (
                      <div
                        key={p.ingredientId}
                        style={{ width: `${(p.parts / liquidTotal) * 100}%`, backgroundColor: ing.color }}
                        title={ing.name}
                      />
                    );
                  })}
                </div>

                {/* lista formal de ingredientes */}
                <dl className="mt-3 divide-y divide-border/70 text-sm">
                  {r.parts.map((p) => {
                    const ing = getIngredient(p.ingredientId)!;
                    const isIce = p.ingredientId === "hielo";
                    const pct = !isIce && liquidTotal > 0 ? Math.round((p.parts / liquidTotal) * 100) : null;
                    return (
                      <div key={p.ingredientId} className="flex items-center gap-2 py-1.5">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: ing.color }} />
                        <dt className="text-text">{ing.name}</dt>
                        <dd className="ml-auto text-muted tabular-nums">
                          {p.parts} {p.parts === 1 ? "parte" : "partes"}
                          {pct != null && <span className="text-text font-medium"> · {pct}%</span>}
                        </dd>
                      </div>
                    );
                  })}
                </dl>

                <p className="text-xs text-muted mt-3 leading-relaxed">{r.tip}</p>
              </div>

              {embed && (
                <div className="px-4 pb-4 mt-auto">
                  <div className="aspect-video w-full rounded overflow-hidden border border-border bg-black/5">
                    <iframe
                      src={embed}
                      title={r.name}
                      className="w-full h-full"
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
