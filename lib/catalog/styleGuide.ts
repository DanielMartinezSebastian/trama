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
  /** familia y peso de iconos que encajan (ver `Icon`): pixel art en lo retro, Phosphor o Lucide en lo demás */
  icons: { set: "pixel" | "phosphor" | "lucide"; weight: "thin" | "light" | "regular" | "bold" | "fill" | "duotone" };
};

export const styleGuide: Record<StyleTag, StyleRecipe> = {
  glass: {
    when: "Marcas amables: naturaleza, deporte, bienestar.",
    surface: "--card translúcido + blur 14 px · borde 1 px --ln · radio 18–28.",
    type: "Sans humanista.",
    ascii: "Trama de texto con hover trail/glow; revelado wipe.",
    avoid: "Fondos muy claros: se pierde contraste.",
    preset: "tide",
    icons: { set: "phosphor", weight: "duotone" },
  },
  solid: {
    when: "Editorial, artesanal, retro.",
    surface: "Fondo opaco · borde 3 px + sombra dura 6 px · radio 0–6.",
    type: "Serif o monoespaciada.",
    ascii: "Revelado rise; hover magnify/shatter.",
    avoid: "Blur y sombras suaves.",
    preset: "brew",
    icons: { set: "phosphor", weight: "bold" },
  },
  outline: {
    when: "Técnico, espacial, nocturno.",
    surface: "Casi transparente · borde 1 px --acc · sombra interior luminosa · radio 0–2.",
    type: "Sans en mayúsculas o mono.",
    ascii: "Disolución ASCII; hover attract/glitchText.",
    avoid: "Rellenos opacos grandes.",
    preset: "orbit",
    icons: { set: "lucide", weight: "light" },
  },
  neon: {
    when: "Vida nocturna, gaming.",
    surface: "Oscuro con halo (text-shadow / box-shadow) del acento.",
    type: "Monoespaciada.",
    ascii: "Bloom + glitch + parpadeo.",
    avoid: "Más de 2 colores de acento.",
    preset: "pulse",
    icons: { set: "lucide", weight: "regular" },
  },
  retro: {
    when: "Arcade, píxel.",
    surface: "Paleta cerrada de 4 tonos · bordes gruesos · sin degradados.",
    type: "Monoespaciada gruesa.",
    ascii: "Estilos pixel/dither, scanlines.",
    avoid: "Antialias suave y sombras difuminadas.",
    preset: "arcade",
    icons: { set: "pixel", weight: "regular" },
  },
  terminal: {
    when: "Herramientas para desarrolladores.",
    surface: "Fondo oscuro, barra de título, cursor parpadeante.",
    type: "Monoespaciada.",
    ascii: "Escritura carácter a carácter, CRT.",
    avoid: "Iconos de color.",
    preset: "pulse",
    icons: { set: "pixel", weight: "regular" },
  },
  minimal: {
    when: "El contenido manda.",
    surface: "Sin superficie: solo línea fina.",
    type: "Sans neutra.",
    ascii: "Solo ScrambleText en el titular.",
    avoid: "Efectos sobre texto largo.",
    preset: "neutro",
    icons: { set: "phosphor", weight: "light" },
  },
  dotmatrix: {
    when: "Tecnología, seguridad, IA, herramientas de datos: estética hacker sobria.",
    surface: "Negro con trama de puntos · borde punteado 1 px · radio 0 · sin sombras.",
    type: "Titulares Doto (matriz de puntos) · cuerpo IBM Plex Mono en mayúsculas espaciadas.",
    ascii: "RetroCanvas con rampa dots + scanlines; fondos en paleta duotone o tint.",
    avoid: "Colores de acento saturados y degradados: es monocromo.",
    preset: "dotmatrix",
    icons: { set: "pixel", weight: "regular" },
  },
  editorial: {
    when: "Estudios, portfolios, revistas y marcas con fotografía: la tipografía y el espacio mandan.",
    surface: "Sin relleno · línea fina de 1 px · radio 0 · sin sombras; la acción primaria es un bloque sólido invertido.",
    type: "Sans grotesca grande con tracking ajustado; serif cursiva para el énfasis.",
    ascii: "Ninguno: SplitText, FitText, RollLink y ProjectList son sus recursos.",
    avoid: "Neón, glass y degradados: pierde la sobriedad.",
    preset: "editorial",
    icons: { set: "phosphor", weight: "thin" },
  },
};
