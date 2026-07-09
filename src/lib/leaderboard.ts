/**
 * Podios de los juegos guardados en localStorage (momentaneo, sin base de datos).
 * Cada juego tiene su propia clave y sus jugadores fijos arriba con puntaje
 * perfecto. El resto se suma ordenado por mejor puntaje (desempate por tiempo).
 */
export interface ScoreEntry {
  name: string;
  score: number;
  timeMs: number;
  /** Texto libre para la segunda linea (ej: "4/10 correctas" o "5 tragos"). */
  meta?: string;
  pinned?: boolean;
  date?: number;
}

const MAX_STORED = 30;

// ── Quiz ──────────────────────────────────────────────────────────────────
export const QUIZ_KEY = "alcohol_quiz_scores_v1";
export const QUIZ_PINNED: ScoreEntry[] = [
  { name: "Britos", score: 2900, timeMs: 41000, meta: "10/10 correctas", pinned: true },
  { name: "Geonas", score: 2900, timeMs: 44000, meta: "10/10 correctas", pinned: true },
];

// ── Bartender ────────────────────────────────────────────────────────────
export const BAR_KEY = "alcohol_bar_scores_v1";
export const BAR_PINNED: ScoreEntry[] = [
  { name: "Geonas", score: 500, timeMs: 60000, meta: "5 tragos perfectos", pinned: true },
  { name: "Britos", score: 500, timeMs: 66000, meta: "5 tragos perfectos", pinned: true },
];

function load(key: string): ScoreEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const arr = JSON.parse(raw) as ScoreEntry[];
    return Array.isArray(arr) ? arr.filter((e) => e && typeof e.score === "number") : [];
  } catch {
    return [];
  }
}

function save(key: string, list: ScoreEntry[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(list.slice(0, MAX_STORED)));
  } catch {}
}

function sortScores(list: ScoreEntry[]): ScoreEntry[] {
  return [...list].sort((a, b) => b.score - a.score || a.timeMs - b.timeMs);
}

export function loadRealScores(key: string): ScoreEntry[] {
  return sortScores(load(key));
}

/** Agrega un puntaje al juego indicado y devuelve la lista de jugadores reales. */
export function addScore(key: string, entry: ScoreEntry): ScoreEntry[] {
  const list = load(key);
  list.push({ ...entry, date: entry.date ?? Date.now() });
  const sorted = sortScores(list).slice(0, MAX_STORED);
  save(key, sorted);
  return sorted;
}

/** Podio completo: los fijos arriba y despues los jugadores reales. */
export function buildBoard(pinned: ScoreEntry[], realPlayers: ScoreEntry[]): ScoreEntry[] {
  return [...pinned, ...sortScores(realPlayers)];
}
