/**
 * Podio del quiz guardado en localStorage (momentaneo, sin base de datos).
 * Britos y Geonas quedan fijos en el 1er y 2do puesto con puntaje perfecto.
 * El resto de los jugadores se suman ordenados por mejor puntaje.
 */
export interface ScoreEntry {
  name: string;
  score: number;
  correct: number;
  total: number;
  timeMs: number;
  pinned?: boolean;
  date?: number;
}

const KEY = "alcohol_quiz_scores_v1";
const MAX_STORED = 30;

// Los dos que siempre encabezan el podio, con puntaje perfecto.
export const PINNED: ScoreEntry[] = [
  { name: "Britos", score: 2900, correct: 10, total: 10, timeMs: 41000, pinned: true },
  { name: "Geonas", score: 2900, correct: 10, total: 10, timeMs: 44000, pinned: true },
];

export function loadScores(): ScoreEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as ScoreEntry[];
    return Array.isArray(arr) ? arr.filter((e) => e && typeof e.score === "number") : [];
  } catch {
    return [];
  }
}

function saveScores(list: ScoreEntry[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX_STORED)));
  } catch {}
}

function sortScores(list: ScoreEntry[]): ScoreEntry[] {
  return [...list].sort((a, b) => b.score - a.score || a.timeMs - b.timeMs);
}

/** Agrega un puntaje y devuelve la lista de jugadores reales ya ordenada. */
export function addScore(entry: ScoreEntry): ScoreEntry[] {
  const list = loadScores();
  list.push({ ...entry, date: entry.date ?? Date.now() });
  const sorted = sortScores(list).slice(0, MAX_STORED);
  saveScores(sorted);
  return sorted;
}

/** Podio completo: los dos fijos arriba y despues los jugadores reales. */
export function getLeaderboard(realPlayers?: ScoreEntry[]): ScoreEntry[] {
  const real = sortScores(realPlayers ?? loadScores());
  return [...PINNED, ...real];
}
