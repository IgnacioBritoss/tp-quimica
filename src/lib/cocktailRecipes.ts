export interface RecipePart {
  ingredientId: string;
  parts: number; // proporcion relativa
}

export interface Recipe {
  id: string;
  name: string;
  glassMl: number;
  parts: RecipePart[];
  tip: string;
}

/**
 * Recetas clasicas expresadas en "partes" (proporciones). Los ids coinciden con
 * los de src/lib/ingredients.ts. Se usan para el juego de bartender y para el
 * modo tutorial de recetas.
 */
export const RECIPES: Recipe[] = [
  {
    id: "fernet-cola",
    name: "Fernet con Coca",
    glassMl: 350,
    parts: [
      { ingredientId: "fernet", parts: 3 },
      { ingredientId: "cola", parts: 7 },
      { ingredientId: "hielo", parts: 3 },
    ],
    tip: "El clasico argentino: aproximadamente 30% fernet y 70% cola, bien frio y con bastante hielo.",
  },
  {
    id: "gin-tonic",
    name: "Gin Tonic",
    glassMl: 350,
    parts: [
      { ingredientId: "gin", parts: 1 },
      { ingredientId: "tonica", parts: 3 },
      { ingredientId: "hielo", parts: 2 },
    ],
    tip: "Una medida de gin por tres de tonica, mucho hielo y, si tenes, una rodaja de limon.",
  },
  {
    id: "cuba-libre",
    name: "Cuba Libre",
    glassMl: 350,
    parts: [
      { ingredientId: "ron", parts: 1 },
      { ingredientId: "cola", parts: 3 },
      { ingredientId: "hielo", parts: 2 },
    ],
    tip: "Ron y cola en proporcion 1 a 3, con hielo y un toque de lima.",
  },
  {
    id: "destornillador",
    name: "Destornillador",
    glassMl: 300,
    parts: [
      { ingredientId: "vodka", parts: 1 },
      { ingredientId: "jugo-naranja", parts: 3 },
      { ingredientId: "hielo", parts: 2 },
    ],
    tip: "Vodka con jugo de naranja, una parte de vodka por tres de jugo.",
  },
  {
    id: "campari-tonic",
    name: "Campari Tonic",
    glassMl: 300,
    parts: [
      { ingredientId: "campari", parts: 1 },
      { ingredientId: "tonica", parts: 2 },
      { ingredientId: "hielo", parts: 2 },
    ],
    tip: "Amargo y refrescante: una de campari por dos de tonica.",
  },
  {
    id: "negroni",
    name: "Negroni",
    glassMl: 200,
    parts: [
      { ingredientId: "gin", parts: 1 },
      { ingredientId: "campari", parts: 1 },
      { ingredientId: "vermut", parts: 1 },
      { ingredientId: "hielo", parts: 2 },
    ],
    tip: "Partes iguales de gin, campari y vermut rojo. Fuerte y con caracter.",
  },
  {
    id: "aperol-spritz",
    name: "Aperol Spritz",
    glassMl: 350,
    parts: [
      { ingredientId: "aperol", parts: 3 },
      { ingredientId: "espumante", parts: 3 },
      { ingredientId: "soda", parts: 1 },
      { ingredientId: "hielo", parts: 3 },
    ],
    tip: "Regla 3-2-1: 3 de espumante, 2 de aperol y 1 de soda. Aca va parejo aperol y espumante.",
  },
  {
    id: "vodka-tonic",
    name: "Vodka Tonic",
    glassMl: 300,
    parts: [
      { ingredientId: "vodka", parts: 1 },
      { ingredientId: "tonica", parts: 3 },
      { ingredientId: "hielo", parts: 2 },
    ],
    tip: "Simple y clasico: una de vodka por tres de tonica, con mucho hielo.",
  },
  {
    id: "mojito",
    name: "Mojito",
    glassMl: 350,
    parts: [
      { ingredientId: "ron", parts: 1 },
      { ingredientId: "soda", parts: 3 },
      { ingredientId: "hielo", parts: 3 },
    ],
    tip: "Ron y soda con mucho hielo. En casa se agrega lima, menta y azucar.",
  },
  {
    id: "tequila-sunrise",
    name: "Tequila Sunrise",
    glassMl: 350,
    parts: [
      { ingredientId: "tequila", parts: 1 },
      { ingredientId: "jugo-naranja", parts: 4 },
      { ingredientId: "hielo", parts: 2 },
    ],
    tip: "Tequila con jugo de naranja. Se completa con un toque de granadina abajo.",
  },
  {
    id: "paloma",
    name: "Paloma",
    glassMl: 350,
    parts: [
      { ingredientId: "tequila", parts: 1 },
      { ingredientId: "jugo-pomelo", parts: 3 },
      { ingredientId: "hielo", parts: 2 },
    ],
    tip: "Refrescante mexicano: tequila con jugo de pomelo y hielo.",
  },
  {
    id: "americano",
    name: "Americano",
    glassMl: 300,
    parts: [
      { ingredientId: "campari", parts: 1 },
      { ingredientId: "vermut", parts: 1 },
      { ingredientId: "soda", parts: 2 },
      { ingredientId: "hielo", parts: 2 },
    ],
    tip: "Campari y vermut en partes iguales, alargado con soda.",
  },
  {
    id: "whisky-cola",
    name: "Whisky con Coca",
    glassMl: 350,
    parts: [
      { ingredientId: "whisky", parts: 1 },
      { ingredientId: "cola", parts: 3 },
      { ingredientId: "hielo", parts: 2 },
    ],
    tip: "Una medida de whisky por tres de cola, con hielo.",
  },
  {
    id: "vodka-anana",
    name: "Vodka con Anana",
    glassMl: 300,
    parts: [
      { ingredientId: "vodka", parts: 1 },
      { ingredientId: "jugo-anana", parts: 3 },
      { ingredientId: "hielo", parts: 2 },
    ],
    tip: "Vodka con jugo de anana, una parte de vodka por tres de jugo.",
  },
];
