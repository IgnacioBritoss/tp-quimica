export type Sex = "masculino" | "femenino";

export type BodyType = "astenico" | "atletico" | "picnico" | "promedio";

export type DrinkCategory = "fermentada" | "destilada" | "preparado" | "otra";

export type IconKey =
  | "wine"
  | "beer"
  | "cider"
  | "sake"
  | "mead"
  | "gin"
  | "rum"
  | "brandy"
  | "tequila"
  | "whisky"
  | "vodka"
  | "fernet"
  | "cocktail"
  | "soda"
  | "juice"
  | "custom";

export interface Measure {
  id: string;
  label: string;
  volumeMl: number;
}

export interface DrinkPreset {
  id: string;
  name: string;
  category: DrinkCategory;
  icon: IconKey;
  defaultAbv: number;
  measures: Measure[];
  /** Solo para tragos preparados: fraccion del volumen total que es la bebida base alcoholica */
  baseRatio?: number;
  color: string;
  /** URL de foto real (opcional). Si falla o no hay, se usa el icono dibujado. */
  image?: string;
}

/** Ingrediente para el armador de tragos (barman). Incluye mezcladores sin alcohol. */
export interface Ingredient {
  id: string;
  name: string;
  abv: number;
  color: string;
  icon: IconKey;
  image?: string;
  measures: Measure[];
}

/** Una porcion concreta de un ingrediente dentro de un trago armado */
export interface CocktailPart {
  ingredientId: string;
  name: string;
  abv: number;
  volumeMl: number;
  color: string;
  icon: IconKey;
}

export interface DrinkEntry {
  id: string;
  presetId: string;
  name: string;
  icon: IconKey;
  abv: number;
  totalVolumeMl: number;
  /** volumen efectivo (ml) del componente alcoholico puro, ya aplicada la dilucion */
  pureVolumeMl: number;
  quantity: number;
  color: string;
  image?: string;
  /** Si esta seteado, se usa este valor de gramos de etanol por unidad (tragos armados) */
  ethanolGramsOverride?: number;
  /** Detalle de ingredientes para tragos armados (solo display) */
  parts?: CocktailPart[];
}

export interface Profile {
  sex: Sex;
  bodyType: BodyType;
  weightKg: number;
}
