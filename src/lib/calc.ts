import { DrinkEntry } from "./types";

/** Densidad del etanol puro (g/ml) */
export const ETHANOL_DENSITY = 0.789;

/** Velocidad de eliminacion del etanol en sangre (g/L por hora) */
export const ELIMINATION_RATE = 0.15;

/**
 * Tiempo promedio (h) que tarda en completarse la absorcion + meseta luego
 * del ultimo trago, antes de que la alcoholemia empiece a bajar de forma
 * sostenida. Es un promedio de la ventana de 30-90 min mencionada en la
 * cursada.
 */
export const ABSORPTION_BUFFER_HOURS = 0.75;

/**
 * En Argentina rige la Ley de Alcohol Cero al volante: el limite para conducir
 * es 0,0 g/L. No hay margen permitido.
 */
export const DRIVING_LIMIT = 0.0;

/** Gramos de etanol puro aportados por una entrada (ya multiplicado por cantidad) */
export function ethanolGramsForEntry(entry: DrinkEntry): number {
  if (entry.ethanolGramsOverride != null) {
    return entry.ethanolGramsOverride * entry.quantity;
  }
  return entry.pureVolumeMl * entry.quantity * ETHANOL_DENSITY * (entry.abv / 100);
}

/** Gramos de etanol puro de una sola porcion de ingrediente */
export function ethanolGramsForPart(volumeMl: number, abv: number): number {
  return volumeMl * ETHANOL_DENSITY * (abv / 100);
}

export function totalEthanolGrams(entries: DrinkEntry[]): number {
  return entries.reduce((sum, e) => sum + ethanolGramsForEntry(e), 0);
}

/** Alcoholemia maxima estimada (g/L), formula de Widmark */
export function peakAlcoholemia(totalGrams: number, weightKg: number, r: number): number {
  if (weightKg <= 0 || r <= 0) return 0;
  return totalGrams / (weightKg * r);
}

/** Alcoholemia estimada al momento actual, segun cuanto paso desde el ultimo trago */
export function currentAlcoholemia(peak: number, hoursSinceLastDrink: number): number {
  const hoursEliminating = Math.max(0, hoursSinceLastDrink - ABSORPTION_BUFFER_HOURS);
  const value = peak - ELIMINATION_RATE * hoursEliminating;
  return Math.max(0, value);
}

/** Horas restantes, desde ahora, para llegar a un nivel objetivo de alcoholemia */
export function hoursUntilLevel(
  peak: number,
  targetLevel: number,
  hoursSinceLastDrink: number
): number {
  if (peak <= targetLevel) return 0;
  const totalHoursFromLastDrink =
    ABSORPTION_BUFFER_HOURS + (peak - targetLevel) / ELIMINATION_RATE;
  return Math.max(0, totalHoursFromLastDrink - hoursSinceLastDrink);
}

/** Alcoholemia estimada en un momento cualquiera desde el ultimo trago (para graficar la curva) */
export function bacAtHour(peak: number, hoursFromLastDrink: number): number {
  const rampEnd = ABSORPTION_BUFFER_HOURS / 3;
  if (hoursFromLastDrink <= 0) return 0;
  if (hoursFromLastDrink < rampEnd) return peak * (hoursFromLastDrink / rampEnd);
  if (hoursFromLastDrink < ABSORPTION_BUFFER_HOURS) return peak;
  const declined = peak - ELIMINATION_RATE * (hoursFromLastDrink - ABSORPTION_BUFFER_HOURS);
  return Math.max(0, declined);
}

export type Phase = "ascendente" | "meseta" | "descendente";

export function getPhase(hoursSinceLastDrink: number): Phase {
  if (hoursSinceLastDrink < ABSORPTION_BUFFER_HOURS / 3) return "ascendente";
  if (hoursSinceLastDrink < ABSORPTION_BUFFER_HOURS) return "meseta";
  return "descendente";
}

export function formatHours(hours: number): string {
  if (!isFinite(hours) || hours <= 0) return "0 min";
  const totalMinutes = Math.round(hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} h`;
  return `${h} h ${m} min`;
}

export function formatGrams(g: number): string {
  return `${g.toFixed(1)} g`;
}
