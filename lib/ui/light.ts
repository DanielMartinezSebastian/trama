/**
 * Luz por finalidad (docs/18): una «toma de luz» describe cómo se ilumina una sección según para qué sirve (emocionar,
 * comparar con honestidad, leer un grabado, intimidad…), con magnitudes físicas —temperatura de color, dureza, dirección—
 * que `LightScroll` pinta en CSS y que una escena 3D puede leer para colocar sus luces. Sin React.
 */

export type LightKind = "spot" | "wash" | "rake";

export type LightCue = {
  /** temperatura de color en kelvin (1500–10000): 2700 cálida de lámpara · 4000 neutra de taller · 6500 luz de día */
  kelvin: number;
  /** intensidad 0–1,5 */
  intensity: number;
  /** spot = foco con caída · wash = baño difuso y uniforme · rake = luz rasante (un lado muy iluminado, el otro en sombra) */
  kind: LightKind;
  /** centro del foco en % de la ventana (en `rake`, el lado del que viene la luz) */
  x: number;
  y: number;
  /** radio del foco en % del lado mayor de la ventana */
  radius: number;
  /** 0 = foco duro y pequeño (destellos, fuego) · 1 = difusa y envolvente (brillo, color honesto) */
  softness: number;
  /** luz del resto de la escena 0–1: 0 = fondo en sombra (vitrina de museo) · 1 = todo iluminado (caja de luz) */
  ambient: number;
  /** ángulo de la luz rasante en grados (0 = de izquierda a derecha); en los demás tipos, inclinación del foco */
  angle: number;
  /** none = quieta · pointer = el foco sigue al puntero (centelleo: la luz tiene que moverse para que haya destellos) */
  follow: "none" | "pointer";
  /** destellos por encima del foco 0–1 (se apagan con movimiento reducido) */
  sparkle: number;
};

/** Valores de partida de cualquier toma: foco neutro centrado, sin destellos. */
export const LIGHT_DEFAULT: LightCue = { kelvin: 4000, intensity: 0.8, kind: "spot", x: 50, y: 40, radius: 55, softness: 0.6, ambient: 0.5, angle: 0, follow: "none", sparkle: 0 };

/**
 * Tomas de luz documentadas (docs/18 §5, de GIA, fotografía de joyería, conservación y fabricantes de vitrinas). Sirven
 * para joyería y para cualquier producto que se elige mirando (relojes, cerámica, vino, cosmética, piezas de museo).
 */
export const LIGHT_PRESETS = {
  /** emoción: fondo en sombra y la pieza bajo un foco neutro, con destellos (vitrina de museo, foco + difusa) */
  vitrina: { kelvin: 3600, intensity: 1.1, kind: "spot", x: 62, y: 38, radius: 42, softness: 0.35, ambient: 0.12, angle: 0, follow: "none", sparkle: 0.8 },
  /** ver fuego y centelleo: foco pequeño y duro que se mueve con el puntero (GIA: la luz puntual acentúa el fuego) */
  fuego: { kelvin: 4800, intensity: 1.2, kind: "spot", x: 50, y: 45, radius: 26, softness: 0.1, ambient: 0.08, angle: 0, follow: "pointer", sparkle: 1 },
  /** comparar color y quilates: luz de día difusa y uniforme, fondo neutro, sin destellos ni movimiento */
  honesta: { kelvin: 6500, intensity: 0.9, kind: "wash", x: 50, y: 50, radius: 120, softness: 1, ambient: 0.9, angle: 0, follow: "none", sparkle: 0 },
  /** luz cálida de interior (CIE A, ~2700 K): la otra mitad del conmutador para piedras de color */
  calida: { kelvin: 2700, intensity: 0.85, kind: "wash", x: 50, y: 30, radius: 110, softness: 1, ambient: 0.75, angle: 0, follow: "none", sparkle: 0 },
  /** leer un grabado, un punzón o una textura: rasante, una sola fuente casi tangente */
  rasante: { kelvin: 4000, intensity: 1, kind: "rake", x: 0, y: 50, radius: 70, softness: 0.25, ambient: 0.15, angle: 8, follow: "none", sparkle: 0 },
  /** intimidad de una conversación: lámpara baja y cálida, caída rápida */
  lampara: { kelvin: 2600, intensity: 0.75, kind: "spot", x: 22, y: 70, radius: 60, softness: 0.85, ambient: 0.18, angle: 0, follow: "none", sparkle: 0 },
  /** banco de trabajo: flexo cenital neutro, documental, sin drama */
  taller: { kelvin: 4200, intensity: 0.95, kind: "spot", x: 50, y: 6, radius: 75, softness: 0.55, ambient: 0.4, angle: 0, follow: "none", sparkle: 0 },
  /** documento y lupa: frontal, uniforme y neutra, para leer sin embellecer */
  lupa: { kelvin: 5500, intensity: 0.9, kind: "wash", x: 50, y: 50, radius: 100, softness: 0.95, ambient: 0.8, angle: 0, follow: "none", sparkle: 0 },
  /** lo que pasa de una generación a otra: cálida pero clara, suave */
  memoria: { kelvin: 3100, intensity: 0.85, kind: "spot", x: 40, y: 35, radius: 80, softness: 0.8, ambient: 0.35, angle: 0, follow: "none", sparkle: 0.25 },
} satisfies Record<string, LightCue>;

export type LightPresetName = keyof typeof LIGHT_PRESETS;

/** Una toma completa a partir de un preset y retoques (`light("fuego", { x: 70 })`). */
export const light = (preset: LightPresetName | LightCue, patch: Partial<LightCue> = {}): LightCue => ({
  ...LIGHT_DEFAULT,
  ...(typeof preset === "string" ? LIGHT_PRESETS[preset] : preset),
  ...patch,
});

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/**
 * Color RGB (0–255) de un cuerpo negro a esa temperatura (aproximación de Tanner Helland, válida 1000–40000 K). Es el tinte
 * de la luz, no el color de un píxel: 6500 K da blanco casi puro, 2700 K un ámbar suave.
 */
export function kelvinToRgb(kelvin: number): [number, number, number] {
  const t = clamp(kelvin, 1000, 40000) / 100;
  const r = t <= 66 ? 255 : 329.698727446 * Math.pow(t - 60, -0.1332047592);
  const g = t <= 66 ? 99.4708025861 * Math.log(t) - 161.1195681661 : 288.1221695283 * Math.pow(t - 60, -0.0755148492);
  const b = t >= 66 ? 255 : t <= 19 ? 0 : 138.5177312231 * Math.log(t - 10) - 305.0447927307;
  return [Math.round(clamp(r, 0, 255)), Math.round(clamp(g, 0, 255)), Math.round(clamp(b, 0, 255))];
}

/** El mismo tinte como `#rrggbb` (para three.js o CSS). */
export const kelvinToHex = (kelvin: number) => `#${kelvinToRgb(kelvin).map((c) => c.toString(16).padStart(2, "0")).join("")}`;

const NUMERIC = ["kelvin", "intensity", "x", "y", "radius", "softness", "ambient", "angle", "sparkle"] as const;

/** Paso de interpolación de una toma hacia otra (k = 0…1 por fotograma); los campos discretos cambian al instante. */
export function lerpCue(from: LightCue, to: LightCue, k: number): LightCue {
  const out = { ...to };
  for (const key of NUMERIC) out[key] = from[key] + (to[key] - from[key]) * k;
  return out;
}

/** ¿Ha llegado? (para dejar de pedir fotogramas). */
export const cueSettled = (a: LightCue, b: LightCue) => NUMERIC.every((key) => Math.abs(a[key] - b[key]) < (key === "kelvin" ? 4 : 0.004));
