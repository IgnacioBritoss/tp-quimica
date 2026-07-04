import { Ingredient } from "./types";

/**
 * Medidas típicas de barra reutilizables.
 * - "medida" (jigger) = 45 cc, la medida estándar del barman
 * - "shot" = 50 cc
 * - "chorrito" = 15 cc
 */
const SPIRIT_MEASURES = [
  { id: "chorrito", label: "Chorrito", volumeMl: 15 },
  { id: "medida", label: "Medida (jigger)", volumeMl: 45 },
  { id: "shot", label: "Shot", volumeMl: 50 },
  { id: "doble", label: "Doble", volumeMl: 90 },
];

const MIXER_MEASURES = [
  { id: "chorro", label: "Un chorro", volumeMl: 50 },
  { id: "vaso", label: "Vaso", volumeMl: 200 },
  { id: "lata", label: "Lata / medio litro", volumeMl: 355 },
];

/**
 * Ingredientes para armar un trago como en la barra. Los mezcladores tienen
 * graduación 0° (no aportan alcohol pero sí volumen y dilución).
 */
export const INGREDIENTS: Ingredient[] = [
  // Destilados / bases
  { id: "gin", name: "Gin", abv: 40, color: "#4f8a72", icon: "gin", measures: SPIRIT_MEASURES },
  { id: "vodka", name: "Vodka", abv: 40, color: "#6f9fc0", icon: "vodka", measures: SPIRIT_MEASURES },
  { id: "ron", name: "Ron", abv: 40, color: "#8a5a2b", icon: "rum", measures: SPIRIT_MEASURES },
  { id: "tequila", name: "Tequila", abv: 38, color: "#c9a83c", icon: "tequila", measures: SPIRIT_MEASURES },
  { id: "whisky", name: "Whisky", abv: 40, color: "#9c6b1f", icon: "whisky", measures: SPIRIT_MEASURES },
  { id: "fernet", name: "Fernet", abv: 39, color: "#3d2b1f", icon: "fernet", measures: SPIRIT_MEASURES },
  { id: "aperol", name: "Aperol", abv: 11, color: "#e8712d", icon: "cocktail", measures: SPIRIT_MEASURES },
  { id: "campari", name: "Campari", abv: 25, color: "#b81f28", icon: "cocktail", measures: SPIRIT_MEASURES },
  { id: "vermut", name: "Vermut", abv: 15, color: "#7a2233", icon: "wine", measures: SPIRIT_MEASURES },
  { id: "licor", name: "Licor dulce", abv: 20, color: "#a34a86", icon: "cocktail", measures: SPIRIT_MEASURES },
  { id: "espumante", name: "Espumante", abv: 12, color: "#d8c56a", icon: "wine", measures: [
    { id: "chorro", label: "Un chorro", volumeMl: 50 },
    { id: "copa", label: "Copa", volumeMl: 120 },
  ] },

  // Mezcladores (0°)
  { id: "cola", name: "Coca / cola", abv: 0, color: "#5b3a29", icon: "soda", measures: MIXER_MEASURES },
  { id: "tonica", name: "Agua tónica", abv: 0, color: "#cfe3e0", icon: "soda", measures: MIXER_MEASURES },
  { id: "soda", name: "Soda", abv: 0, color: "#bcd4e6", icon: "soda", measures: MIXER_MEASURES },
  { id: "jugo-naranja", name: "Jugo de naranja", abv: 0, color: "#e8952d", icon: "juice", measures: MIXER_MEASURES },
  { id: "jugo-anana", name: "Jugo de ananá", abv: 0, color: "#e6c53a", icon: "juice", measures: MIXER_MEASURES },
  { id: "jugo-pomelo", name: "Jugo de pomelo", abv: 0, color: "#e07a6a", icon: "juice", measures: MIXER_MEASURES },
  { id: "hielo", name: "Hielo", abv: 0, color: "#cfe0ee", icon: "soda", measures: [
    { id: "poco", label: "Poco hielo", volumeMl: 40 },
    { id: "medio", label: "Medio vaso", volumeMl: 120 },
    { id: "lleno", label: "Vaso lleno", volumeMl: 200 },
  ] },
];

export function getIngredient(id: string): Ingredient | undefined {
  return INGREDIENTS.find((i) => i.id === id);
}
