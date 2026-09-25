import type { StyleTag } from "./schema";

/**
 * Resumen en la app de las recetas de estilo de `docs/02-guia-de-componentes.md` §5.
 * La fuente de verdad es el documento; esto es la versión consultable junto a los componentes.
 */
export type StyleRecipe = {
  when: string;
  surface: string;
  type: string;
  ascii: string;
  avoid: string;
  /** tema de las landings que mejor lo ilustra */
  preset: string;
};

export const styleGuide: Record<StyleTag, StyleRecipe> = {
  glass: {
    when: "Marcas amables: naturaleza, deporte, bienestar.",
    surface: "--card translúcido + blur 14 px · borde 1 px --ln · radio 18–28.",
    type: "Sans humanista.",
    ascii: "Trama de texto con hover trail/glow; revelado wipe.",
    avoid: "Fondos muy claros: se pierde contraste.",
    preset: "tide",
  },
  solid: {
    when: "Editorial, artesanal, retro.",
    surface: "Fondo opaco · borde 3 px + sombra dura 6 px · radio 0–6.",
    type: "Serif o monoespaciada.",
    ascii: "Revelado rise; hover magnify/shatter.",
    avoid: "Blur y sombras suaves.",
    preset: "brew",
  },
  outline: {
    when: "Técnico, espacial, nocturno.",
    surface: "Casi transparente · borde 1 px --acc · sombra interior luminosa · radio 0–2.",
    type: "Sans en mayúsculas o mono.",
    ascii: "Disolución ASCII; hover attract/glitchText.",
    avoid: "Rellenos opacos grandes.",
    preset: "orbit",
  },
  neon: {
    when: "Vida nocturna, gaming.",
    surface: "Oscuro con halo (text-shadow / box-shadow) del acento.",
    type: "Monoespaciada.",
    ascii: "Bloom + glitch + parpadeo.",
    avoid: "Más de 2 colores de acento.",
    preset: "pulse",
  },
  retro: {
    when: "Arcade, píxel.",
    surface: "Paleta cerrada de 4 tonos · bordes gruesos · sin degradados.",
    type: "Monoespaciada gruesa.",
    ascii: "Estilos pixel/dither, scanlines.",
    avoid: "Antialias suave y sombras difuminadas.",
    preset: "arcade",
  },
  terminal: {
    when: "Herramientas para desarrolladores.",
    surface: "Fondo oscuro, barra de título, cursor parpadeante.",
    type: "Monoespaciada.",
    ascii: "Escritura carácter a carácter, CRT.",
    avoid: "Iconos de color.",
    preset: "pulse",
  },
  minimal: {
    when: "El contenido manda.",
    surface: "Sin superficie: solo línea fina.",
    type: "Sans neutra.",
    ascii: "Solo ScrambleText en el titular.",
    avoid: "Efectos sobre texto largo.",
    preset: "neutro",
  },
  dotmatrix: {
    when: "Tecnología, seguridad, IA, herramientas de datos: estética hacker sobria.",
    surface: "Negro con trama de puntos · borde punteado 1 px · radio 0 · sin sombras.",
    type: "Titulares Doto (matriz de puntos) · cuerpo IBM Plex Mono en mayúsculas espaciadas.",
    ascii: "RetroCanvas con rampa dots + scanlines; fondos en paleta duotone o tint.",
    avoid: "Colores de acento saturados y degradados: es monocromo.",
    preset: "dotmatrix",
  },
};
