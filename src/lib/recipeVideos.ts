/**
 * ═════════════════════════════════════════════════════════════════════════
 *   VIDEOS DE YOUTUBE PARA EL TUTORIAL DE RECETAS
 * ═════════════════════════════════════════════════════════════════════════
 *
 *  Pega aca el link de YouTube de cada trago (como bartenders lo preparan).
 *  El video aparece embebido en la tarjeta del tutorial, listo para ver desde
 *  la web.
 *
 *  Sirve cualquier formato de link de YouTube, por ejemplo:
 *     https://www.youtube.com/watch?v=XXXXXXXXXXX
 *     https://youtu.be/XXXXXXXXXXX
 *     https://www.youtube.com/shorts/XXXXXXXXXXX
 *
 *  La clave es el id de la receta (ver src/lib/cocktailRecipes.ts).
 *  Si dejas una vacia (""), esa receta simplemente no muestra video.
 */
export const RECIPE_VIDEOS: Record<string, string> = {
  "fernet-cola": "", // Fernet con Coca
  "gin-tonic": "", // Gin Tonic
  "cuba-libre": "", // Cuba Libre
  destornillador: "", // Destornillador
  "campari-tonic": "", // Campari Tonic
  negroni: "", // Negroni
  "aperol-spritz": "", // Aperol Spritz
  "vodka-tonic": "", // Vodka Tonic
  mojito: "", // Mojito
  "tequila-sunrise": "", // Tequila Sunrise
  paloma: "", // Paloma
  americano: "", // Americano
  "whisky-cola": "", // Whisky con Coca
  "vodka-anana": "", // Vodka con Anana
};

/** Convierte cualquier link de YouTube al formato embebible. Devuelve undefined si no hay. */
export function youtubeEmbed(id: string): string | undefined {
  const url = (RECIPE_VIDEOS[id] || "").trim();
  if (!url) return undefined;
  let videoId = "";
  const patterns = [
    /[?&]v=([\w-]{6,})/, // watch?v=ID
    /youtu\.be\/([\w-]{6,})/, // youtu.be/ID
    /\/embed\/([\w-]{6,})/, // /embed/ID
    /\/shorts\/([\w-]{6,})/, // /shorts/ID
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) {
      videoId = m[1];
      break;
    }
  }
  if (!videoId) return undefined;
  return `https://www.youtube.com/embed/${videoId}`;
}
