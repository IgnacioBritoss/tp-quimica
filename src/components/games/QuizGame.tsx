"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { QUIZ_QUESTIONS, QUIZ_COUNT, QuizQuestion } from "@/lib/quizData";
import { addScore, buildBoard, loadRealScores, QUIZ_KEY, QUIZ_PINNED, ScoreEntry } from "@/lib/leaderboard";
import { fmtTime, Leaderboard } from "@/components/games/Leaderboard";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Mezcla las opciones de una pregunta y recalcula el indice correcto. */
function shuffleOptions(q: QuizQuestion): QuizQuestion {
  const order = shuffle(q.options.map((_, i) => i));
  return {
    ...q,
    options: order.map((i) => q.options[i]),
    correct: order.indexOf(q.correct),
  };
}

/** Arma una partida: preguntas al azar del banco, con opciones mezcladas. */
function buildDeck(): QuizQuestion[] {
  return shuffle(QUIZ_QUESTIONS).slice(0, QUIZ_COUNT).map(shuffleOptions);
}

const TOTAL_MS = 15000;

const TILE = [
  { color: "#e0453f", shape: "triangle" },
  { color: "#1c7ed6", shape: "diamond" },
  { color: "#e0a82e", shape: "circle" },
  { color: "#2e8b57", shape: "square" },
] as const;

function Shape({ kind }: { kind: string }) {
  const common = { width: 18, height: 18, fill: "currentColor" };
  if (kind === "triangle") return <svg viewBox="0 0 20 20" {...common}><path d="M10 2 L18 18 L2 18 Z" /></svg>;
  if (kind === "diamond") return <svg viewBox="0 0 20 20" {...common}><path d="M10 2 L18 10 L10 18 L2 10 Z" /></svg>;
  if (kind === "circle") return <svg viewBox="0 0 20 20" {...common}><circle cx="10" cy="10" r="8" /></svg>;
  return <svg viewBox="0 0 20 20" {...common}><rect x="3" y="3" width="14" height="14" rx="2" /></svg>;
}

type Phase = "intro" | "playing" | "finished";

export function QuizGame({ onExit }: { onExit: () => void }) {
  const [deck, setDeck] = useState<QuizQuestion[]>([]);
  const questions = deck;
  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TOTAL_MS);
  const [gained, setGained] = useState(0);
  const [nickname, setNickname] = useState("");
  const [totalTimeMs, setTotalTimeMs] = useState(0);
  const [board, setBoard] = useState<ScoreEntry[]>(() => buildBoard(QUIZ_PINNED, loadRealScores(QUIZ_KEY)));
  const [lastDate, setLastDate] = useState<number | null>(null);

  const q = questions[index];

  const reveal = useCallback(
    (choice: number | null) => {
      setRevealed((already) => {
        if (already) return already;
        const isCorrect = choice === q.correct;
        setSelected(choice);
        setTotalTimeMs((t) => t + (TOTAL_MS - timeLeft));
        if (isCorrect) {
          setScore((s) => {
            const pts = 100 + Math.round((timeLeft / TOTAL_MS) * 100) + streak * 20;
            setGained(pts);
            return s + pts;
          });
          setStreak((k) => k + 1);
          setCorrectCount((c) => c + 1);
        } else {
          setGained(0);
          setStreak(0);
        }
        return true;
      });
    },
    [q, timeLeft, streak]
  );

  // temporizador
  useEffect(() => {
    if (phase !== "playing" || revealed) return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 100) {
          clearInterval(id);
          reveal(null);
          return 0;
        }
        return t - 100;
      });
    }, 100);
    return () => clearInterval(id);
  }, [phase, revealed, reveal]);

  function start() {
    if (!nickname.trim()) return;
    setDeck(buildDeck());
    setPhase("playing");
    setIndex(0);
    setScore(0);
    setStreak(0);
    setCorrectCount(0);
    setSelected(null);
    setRevealed(false);
    setTimeLeft(TOTAL_MS);
    setTotalTimeMs(0);
    setLastDate(null);
  }

  function finish(finalScore: number, finalCorrect: number, finalTime: number) {
    const date = Date.now();
    const entry: ScoreEntry = {
      name: nickname.trim().slice(0, 18),
      score: finalScore,
      timeMs: finalTime,
      meta: `${finalCorrect}/${questions.length} correctas`,
      date,
    };
    const real = addScore(QUIZ_KEY, entry);
    setBoard(buildBoard(QUIZ_PINNED, real));
    setLastDate(date);
    setPhase("finished");
  }

  function next() {
    if (index + 1 >= questions.length) {
      finish(score, correctCount, totalTimeMs);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setRevealed(false);
    setTimeLeft(TOTAL_MS);
  }

  const barPct = (timeLeft / TOTAL_MS) * 100;

  const resultMsg = useMemo(() => {
    const ratio = correctCount / questions.length;
    if (ratio === 1) return "Perfecto! Sos un experto en toxicocinetica.";
    if (ratio >= 0.7) return "Muy bien! Sabes bastante sobre el alcohol.";
    if (ratio >= 0.4) return "Vas bien, pero repasa algunos conceptos.";
    return "A repasar! Date una vuelta por Consejos y mitos.";
  }, [correctCount, questions.length]);

  if (phase === "intro") {
    const canStart = nickname.trim().length > 0;
    return (
      <div className="py-4 space-y-6 max-w-md mx-auto">
        <div className="text-center">
          <div className="text-2xl font-bold text-text">Quiz del alcohol</div>
          <p className="text-sm text-muted mt-2">
            {QUIZ_COUNT} preguntas al azar. Cuanto mas rapido respondes bien, mas puntos sumas.
            Encadena aciertos para el bonus de racha. Cada partida es distinta.
          </p>
        </div>

        <div>
          <label className="text-sm font-medium text-text block mb-1">Tu nombre para el podio</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && start()}
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

        <div className="flex gap-2 justify-center">
          <button onClick={onExit} className="rounded px-4 py-2.5 border border-border text-muted hover:text-text hover:bg-surface-2">
            Volver
          </button>
          <motion.button
            whileTap={{ scale: canStart ? 0.96 : 1 }}
            onClick={start}
            disabled={!canStart}
            className="rounded px-6 py-2.5 font-semibold text-on-brand bg-brand hover:bg-brand-strong disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Empezar
          </motion.button>
        </div>
      </div>
    );
  }

  if (phase === "finished") {
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
            {score}
          </motion.div>
          <div className="text-text font-medium">{resultMsg}</div>
          <div className="grid grid-cols-3 gap-2 pt-2">
            <div className="rounded bg-surface-2 border border-border p-2">
              <div className="text-[11px] text-muted">Correctas</div>
              <div className="text-text font-semibold">{correctCount}/{questions.length}</div>
            </div>
            <div className="rounded bg-surface-2 border border-border p-2">
              <div className="text-[11px] text-muted">Tiempo</div>
              <div className="text-text font-semibold">{fmtTime(totalTimeMs)}</div>
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
          <button onClick={onExit} className="rounded px-4 py-2.5 border border-border text-muted hover:text-text hover:bg-surface-2">
            Salir
          </button>
          <button onClick={() => setPhase("intro")} className="rounded px-6 py-2.5 font-semibold text-on-brand bg-brand hover:bg-brand-strong">
            Jugar de nuevo
          </button>
        </div>
      </div>
    );
  }

  // playing
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted">
          Pregunta <span className="text-text font-semibold">{index + 1}</span> / {questions.length}
        </span>
        <div className="flex items-center gap-3">
          {streak > 1 && (
            <motion.span
              key={streak}
              initial={{ scale: 1.4 }}
              animate={{ scale: 1 }}
              className="text-xs font-semibold text-warn"
            >
              Racha x{streak}
            </motion.span>
          )}
          <span className="text-muted">
            Puntos <span className="text-brand font-bold tabular-nums">{score}</span>
          </span>
        </div>
      </div>

      {/* barra de tiempo */}
      <div className="h-2 rounded bg-surface-2 overflow-hidden">
        <motion.div
          className="h-full"
          style={{ width: `${barPct}%`, backgroundColor: barPct > 33 ? "var(--brand)" : "var(--danger)" }}
          transition={{ ease: "linear" }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
        >
          <div className="bg-surface-2 border border-border rounded-md p-5 text-center mb-4">
            <h3 className="text-lg font-semibold text-text">{q.question}</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {q.options.map((opt, i) => {
              const t = TILE[i];
              const isCorrect = i === q.correct;
              const isChosen = selected === i;
              let stateCls = "";
              let dim = false;
              if (revealed) {
                if (isCorrect) stateCls = "ring-2 ring-white";
                else if (isChosen) stateCls = "opacity-90";
                else dim = true;
              }
              return (
                <motion.button
                  key={i}
                  disabled={revealed}
                  onClick={() => reveal(i)}
                  whileTap={{ scale: revealed ? 1 : 0.97 }}
                  animate={
                    revealed && isChosen && !isCorrect
                      ? { x: [0, -6, 6, -4, 4, 0] }
                      : revealed && isCorrect
                        ? { scale: [1, 1.04, 1] }
                        : {}
                  }
                  className={`relative flex items-center gap-3 rounded-md px-4 py-4 text-left text-white font-medium transition-opacity ${stateCls}`}
                  style={{ backgroundColor: t.color, opacity: dim ? 0.35 : 1 }}
                >
                  <span className="shrink-0 opacity-90">
                    <Shape kind={t.shape} />
                  </span>
                  <span className="text-sm sm:text-base">{opt}</span>
                  {revealed && isCorrect && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white"
                    >
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </motion.span>
                  )}
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {revealed && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 rounded-md border border-border bg-surface-2 p-4"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold" style={{ color: selected === q.correct ? "var(--ok)" : "var(--danger)" }}>
                    {selected === q.correct ? `Correcto  +${gained}` : "Incorrecto"}
                  </span>
                  <button onClick={next} className="rounded px-4 py-1.5 text-sm font-medium text-on-brand bg-brand hover:bg-brand-strong">
                    {index + 1 >= questions.length ? "Ver resultado" : "Siguiente"}
                  </button>
                </div>
                <p className="text-sm text-muted">{q.explain}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
