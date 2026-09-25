import { CanvasTexture, LinearFilter } from "three";

/** Rampas de glifos, de menos a más denso. Las que dicen «procedural» se dibujan a mano: no dependen de ninguna fuente. */
export const RETRO_RAMPS = ["classic", "dots", "braille", "blocks", "binary", "hex", "code", "hatch", "circuit"] as const;
export type RetroRamp = (typeof RETRO_RAMPS)[number];

const TEXT_RAMPS: Partial<Record<RetroRamp, string>> = {
  classic: " .:-=+*#%@",
  binary: " 01",
  hex: " 0123456789ABCDEF",
  code: " .,:;<>/|{}[]#@",
};

/** orden en que se «encienden» los 8 puntos de una celda braille (2 columnas × 4 filas) */
const BRAILLE_ORDER: [number, number][] = [[0, 3], [1, 3], [0, 2], [1, 2], [0, 1], [1, 1], [0, 0], [1, 0]];
const BAYER4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

export type GlyphAtlas = { texture: CanvasTexture; count: number };

/**
 * Atlas horizontal de N glifos blancos sobre negro (el shader lee el canal rojo). La celda tiene la misma proporción que la
 * celda de pantalla para que los glifos no salgan estirados. `chars` (si no está vacío) sustituye a la rampa.
 */
export function createGlyphAtlas(ramp: RetroRamp, chars: string, aspect: number): GlyphAtlas {
  const w = 32;
  const h = Math.max(8, Math.round(w * aspect));
  const text = chars.trim() ? Array.from(chars) : TEXT_RAMPS[ramp] ? Array.from(TEXT_RAMPS[ramp]!) : null;
  const count = text ? Math.max(2, text.length) : ramp === "dots" || ramp === "braille" ? 9 : ramp === "circuit" ? 7 : 6;

  const canvas = document.createElement("canvas");
  canvas.width = w * count;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";

  for (let i = 0; i < count; i++) {
    const x0 = i * w;
    if (text) {
      ctx.font = `700 ${Math.round(Math.min(h, w * 1.7) * 0.86)}px ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text[i] ?? " ", x0 + w / 2, h / 2 + 1);
    } else if (ramp === "dots") {
      if (i === 0) continue;
      ctx.beginPath();
      ctx.arc(x0 + w / 2, h / 2, Math.min(w, h) * 0.46 * Math.sqrt(i / (count - 1)), 0, Math.PI * 2);
      ctx.fill();
    } else if (ramp === "braille") {
      const r = Math.min(w / 5, h / 9);
      for (let k = 0; k < i; k++) {
        const [cx, cy] = BRAILLE_ORDER[k];
        ctx.beginPath();
        ctx.arc(x0 + w * (0.3 + cx * 0.4), h * (0.14 + cy * 0.24) + h * 0.03, r, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (ramp === "hatch") {
      // trama diagonal: más líneas (y más gruesas) cuanto más luz
      ctx.save();
      ctx.beginPath();
      ctx.rect(x0, 0, w, h);
      ctx.clip();
      ctx.lineWidth = 1 + (i / (count - 1)) * 2.4;
      ctx.strokeStyle = "#fff";
      const step = w / (1 + i);
      for (let o = -h; i > 0 && o < w + h; o += step) {
        ctx.beginPath();
        ctx.moveTo(x0 + o, h);
        ctx.lineTo(x0 + o + h, 0);
        ctx.stroke();
      }
      ctx.restore();
    } else if (ramp === "circuit") {
      // pistas y nodos de placa: punto → pista → cruce → nodos → pastilla
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      const cx = x0 + w / 2, cy = h / 2;
      const line = (ax: number, ay: number, bx: number, by: number) => { ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke(); };
      const dot = (x: number, y: number, r: number) => { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); };
      if (i >= 1) dot(cx, cy, 2);
      if (i >= 2) line(x0, cy, x0 + w, cy);
      if (i >= 3) line(cx, 0, cx, h);
      if (i >= 4) { line(x0, cy, cx, cy); line(cx, cy, x0 + w, 0); dot(cx, cy, 3.5); }
      if (i >= 5) { line(x0, 0, x0 + w, h); dot(x0 + 4, cy, 3); dot(x0 + w - 4, cy, 3); }
      if (i >= 6) ctx.fillRect(x0 + 5, h * 0.2, w - 10, h * 0.6);
    } else {
      // blocks: rejilla 4×4 que se rellena según el umbral de Bayer
      const on = Math.round((i / (count - 1)) * 16);
      for (let k = 0; k < 16; k++) {
        if (BAYER4[k] < on) ctx.fillRect(x0 + (k % 4) * (w / 4), Math.floor(k / 4) * (h / 4), w / 4 - 1, h / 4 - 1);
      }
    }
  }

  const texture = new CanvasTexture(canvas);
  texture.generateMipmaps = false;
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  return { texture, count };
}
