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
  "fernet-cola": "https://youtu.be/oTaL76MURpg?si=ale8Ne53XsD9Ohm7", // Fernet con Coca
  "gin-tonic": "https://youtu.be/vAJDT_YkgwY?si=DxL6VSfYYKdD4vE-", // Gin Tonic
  "cuba-libre": "https://youtu.be/GabNqhuS-ZE?si=enZMKSpKwhKz48rD", // Cuba Libre
  destornillador: "https://youtu.be/shgVdkxgfQs?si=_39imLiH6nQZBAnF", // Destornillador
  "campari-tonic": "https://youtu.be/3_zjtZEmqR8?si=dPtc1VB5RKOWvY2P", // Campari Tonic
  negroni: "https://youtu.be/qzkvAKUadZE?si=FCHG01Lw0fOAbbEG", // Negroni
  "aperol-spritz": "https://youtu.be/feSYNFGLZK8?si=FcgHjM0M83qFL01M", // Aperol Spritz
  "vodka-tonic": "https://youtu.be/gl5fp1eY-J8?si=i20OEhywNHxQvSpT", // Vodka Tonic
  mojito: "https://youtu.be/CAn7k-M_YSU?si=dK2dKAvdl7euKldJ", // Mojito
  "tequila-sunrise": "https://youtu.be/PLYzM68EHbk?si=3IRAp5ss4P77FRIS", // Tequila Sunrise
  paloma: "https://youtu.be/kouhVIAailM?si=YyOkhW1W6D0nanbu", // Paloma
  americano: "https://youtu.be/bxhHoLUVnAg?si=dnlGQ_YiU7qhBxp5", // Americano
  "whisky-cola": "https://youtu.be/6yooT9FJKSY?si=JGrvNo7EEE40lqus", // Whisky con Coca
  "vodka-anana": "https://youtu.be/mh2p9Njfgag?si=6ENb82JTHUtTWMvA", // Vodka con Anana
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
