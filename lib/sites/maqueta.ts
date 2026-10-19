import type { MapBlock } from "@/lib/map3d/scene";

/**
 * Datos de maqueta para las demos (`ExplorableCanvas depth="3d"`): una ciudad de cartón alrededor de unos puntos y muros a
 * partir de un plano. Son datos, no componentes: viven junto a las demos, como `stickers.ts`.
 */

/** pseudoaleatorio con semilla: la misma maqueta en el servidor y en cada visita */
export function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type CityOptions = {
  seed?: number;
  /** puntos que quedan en una plaza despejada (en % del mundo) */
  plazas?: { x: number; y: number }[];
  /** tamaño de la manzana, en % del ancho */
  cell?: number;
  /** ancho de calle, en % */
  street?: number;
  /** alto máximo en px del mundo */
  maxH?: number;
  /** relación alto / ancho del mundo (`world.h / world.w`), para que las manzanas sean cuadradas */
  aspect?: number;
  /** proporción de volúmenes con el acento del tema */
  accent?: number;
  /** false: todo cartón (sin piezas sueltas de metacrilato ni de madera), para que el proyecto destaque */
  mix?: boolean;
};

/** Manzanas de cartón con calles, plazas despejadas alrededor de los puntos y árboles en las plazas. */
export function city({ seed = 7, plazas = [], cell = 7, street = 2.2, maxH = 160, aspect = 1, accent = 0.06, mix = true }: CityOptions = {}): MapBlock[] {
  const r = rng(seed);
  const out: MapBlock[] = [];
  const cy = cell / aspect;
  const sy = street / aspect;
  const near = (x: number, y: number, rad: number) => plazas.some((p) => Math.hypot((p.x - x), (p.y - y) * aspect) < rad);
  for (let x = cell / 2 + 1; x < 100; x += cell) {
    for (let y = cy / 2 + 1; y < 100; y += cy) {
      if (near(x, y, cell * 0.9)) {
        // plaza: un par de árboles de espuma
        for (let i = 0; i < 3; i++) out.push({ x: x + (r() - 0.5) * cell * 0.6, y: y + (r() - 0.5) * cy * 0.6, w: 1.1, d: 1.1 / aspect, h: 70 + r() * 30, shape: "tree" });
        continue;
      }
      if (r() < 0.12) continue; // solar vacío
      // cada manzana se parte en 1–3 edificios
      const n = 1 + Math.floor(r() * 3);
      const bw = (cell - street) / n;
      for (let i = 0; i < n; i++) {
        const h = 40 + Math.pow(r(), 2.2) * maxH;
        const mat = r() < accent ? "accent" : mix && r() < 0.05 ? "acrylic" : mix && r() < 0.06 ? "wood" : "paper";
        out.push({ x: x - (cell - street) / 2 + bw * (i + 0.5), y, w: bw * 0.86, d: (cy - sy) * (0.6 + r() * 0.35), h, mat, shape: r() < 0.04 ? "cylinder" : "box" });
      }
    }
  }
  return out;
}

/** Muros a partir de segmentos de un plano: `[x1, y1, x2, y2]` en % del mundo. */
export function walls(segments: [number, number, number, number][], { h = 90, thick = 0.5, aspect = 1, mat = "paper" as MapBlock["mat"] } = {}): MapBlock[] {
  return segments.map(([x1, y1, x2, y2]) => {
    // todo en «% del ancho»: un % vertical mide `aspect` % horizontales
    const dx = x2 - x1, dy = (y2 - y1) * aspect;
    const len = Math.hypot(dx, dy);
    return { x: (x1 + x2) / 2, y: (y1 + y2) / 2, w: len + thick, d: thick / aspect, h, rot: (Math.atan2(dy, dx) * 180) / Math.PI, mat };
  });
}
