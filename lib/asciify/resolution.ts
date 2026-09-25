/**
 * Resolución real de los fondos de caracteres (asciify-engine Studio).
 *
 * Lo que hace el motor con el tamaño de celda que se le pide, y por qué no basta con pasarlo tal cual:
 *  - `cellSize` se recorta a 3–60; con el estilo `dither` se ignora y manda `dither.scale` (entero de 1 a 12).
 *  - El lienzo interno se limita a `maxDimension` (960 px por defecto) y la rejilla a `maxCells` (12 000 por defecto, 160 000
 *    como máximo): si la celda pedida da más celdas de las permitidas, el motor la agranda sin avisar. En pantalla completa,
 *    una celda «de 4 px» acababa siendo de unos 11.
 *  - Tampoco existe celda por debajo de 3 (1 en dither) ni con decimales.
 *
 * `planResolution` convierte una celda pedida **en px CSS** (admite decimales) en los parámetros del motor:
 *  - `unit` es la celda que entiende el motor (dentro de su rango) y `s` el sobremuestreo: el motor pinta en un lienzo `s` veces
 *    mayor que el elemento (el CSS lo reduce), de modo que `unit / s` es exactamente la celda pedida, también por debajo de 3.
 *  - `maxCells` se sube lo justo para que quepan las celdas pedidas, hasta el tope del motor (160 000). Ese tope es el límite
 *    real: la celda mínima alcanzable es √(ancho·alto / 160 000) px (≈ 3 px a pantalla completa, 1 px en un elemento de 400×400).
 */

export const ENGINE_CELL_RANGE = [3, 60] as const;
export const ENGINE_DITHER_RANGE = [1, 12] as const;
export const ENGINE_DEFAULT_CELLS = 12000;
export const ENGINE_MAX_CELLS = 160000;
export const ENGINE_MAX_DIMENSION = 4096;
/** Suelo absoluto de la celda pedida: por debajo, el sobremuestreo dispararía el tamaño del lienzo sin ganar detalle visible. */
export const MIN_CELL = 0.1;

/** Estilos de celda cuadrada; el resto (ascii, braille, líneas…) usan celdas más altas que anchas (×1,65). */
const SQUARE_STYLES = new Set(["dither", "pixel", "mosaic", "lego", "voxel", "disco", "dots"]);
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export type ResolutionPlan = {
  /** celda pedida, en px CSS (ya con el suelo aplicado) */
  requested: number;
  /** valor para el motor: `cellSize`, o `dither.scale` con el estilo dither */
  unit: number;
  /** sobremuestreo: tamaño del lienzo del motor respecto al elemento */
  s: number;
  /** tamaño del lienzo del motor (px lógicos, antes del pixel ratio) */
  width: number;
  height: number;
  /** `maxCells` para el motor */
  maxCells: number;
  /** ancho del lienzo fuente en el que dibujan las escenas (más celdas → más detalle) */
  srcWidth: number;
};

export function planResolution(w: number, h: number, cell: number, style: string, maxCells?: number): ResolutionPlan {
  const c = Math.max(MIN_CELL, Number.isFinite(cell) ? cell : 8);
  const dither = style === "dither";
  const [lo, hi] = dither ? ENGINE_DITHER_RANGE : ENGINE_CELL_RANGE;
  let unit = clamp(c, lo, hi);
  if (dither) unit = Math.round(unit);
  const s = unit / c;

  const rowFactor = SQUARE_STYLES.has(style) ? 1 : 1.65;
  const wanted = (w * h) / (c * c * rowFactor);
  const budget = Math.round(clamp(maxCells && maxCells > 0 ? maxCells : wanted * 1.05, ENGINE_DEFAULT_CELLS, ENGINE_MAX_CELLS));

  // Columnas que de verdad habrá (la celda no baja de lo que permite el tope de celdas): las escenas se dibujan con ese detalle
  const effective = Math.max(c, Math.sqrt((w * h) / (budget * rowFactor)));
  const cols = w / effective;
  return {
    requested: c,
    unit,
    s,
    width: Math.max(2, Math.round(w * s)),
    height: Math.max(2, Math.round(h * s)),
    maxCells: budget,
    srcWidth: Math.round(clamp(cols * 1.25, 480, 1024)),
  };
}

/** Lo que muestra la vista previa: qué celda se pidió y cuál se está usando de verdad. */
export type ResolutionInfo = {
  requested: number;
  /** celda que se dibuja de verdad, en px CSS */
  effective: number;
  columns: number;
  rows: number;
  /** el motor ha tenido que agrandar la celda pedida (tope de celdas o de tamaño del lienzo) */
  limited: boolean;
  /** celdas máximas vigentes (el modo adaptativo las baja si el fotograma tarda demasiado) */
  maxCells: number;
  /** el modo adaptativo ha reducido el presupuesto por rendimiento */
  degraded: boolean;
};
