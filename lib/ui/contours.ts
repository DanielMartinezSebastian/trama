/**
 * Curvas de nivel («mapa topográfico») como trazado SVG, sin canvas ni dependencias: ruido de valor sobre una rejilla y
 * *marching squares* por niveles. Es determinista (misma semilla, mismo dibujo), así que se calcula en el servidor y el HTML
 * ya trae las líneas. Lo usa `GridBackground kind="contour"` (Lando Norris, SOTY 2025: líneas finas de altura detrás de todo).
 */

const W = 1200;
const H = 800;

function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 100000) / 100000;
  };
}

/** Ruido de valor suave: varias octavas de una rejilla aleatoria interpolada con smoothstep. */
function noiseField(cols: number, rows: number, seed: number) {
  const r = rng(seed);
  const octaves = [
    { cells: 3, amp: 1 },
    { cells: 6, amp: 0.45 },
    { cells: 12, amp: 0.18 },
  ].map((o) => {
    const gw = o.cells + 2;
    const gh = Math.ceil((o.cells * H) / W) + 2;
    const g = Array.from({ length: gw * gh }, r);
    return { ...o, gw, gh, g };
  });
  const sm = (t: number) => t * t * (3 - 2 * t);
  const out = new Float32Array((cols + 1) * (rows + 1));
  for (let y = 0; y <= rows; y++) {
    for (let x = 0; x <= cols; x++) {
      let v = 0;
      for (const o of octaves) {
        const fx = (x / cols) * o.cells;
        const fy = (y / rows) * o.cells * (H / W);
        const ix = Math.floor(fx);
        const iy = Math.floor(fy);
        const tx = sm(fx - ix);
        const ty = sm(fy - iy);
        const at = (a: number, b: number) => o.g[Math.min(o.gh - 1, b) * o.gw + Math.min(o.gw - 1, a)];
        const top = at(ix, iy) * (1 - tx) + at(ix + 1, iy) * tx;
        const bot = at(ix, iy + 1) * (1 - tx) + at(ix + 1, iy + 1) * tx;
        v += (top * (1 - ty) + bot * ty) * o.amp;
      }
      out[y * (cols + 1) + x] = v / 1.63;
    }
  }
  return out;
}

/**
 * Trazado `d` con las curvas de nivel de un campo de ruido. `levels` = número de alturas; `seed` cambia el dibujo.
 * Devuelve segmentos sueltos (M…L…): a 1 px de grosor no se distinguen de una polilínea continua y salen mucho más baratos.
 */
export function contourPath(seed = 7, levels = 9, density = 60): string {
  const cols = density;
  const rows = Math.round((density * H) / W);
  const f = noiseField(cols, rows, seed);
  const cw = W / cols;
  const ch = H / rows;
  const v = (x: number, y: number) => f[y * (cols + 1) + x];
  const parts: string[] = [];
  const n = Math.round; // a la escala del viewBox, el píxel entero basta
  for (let l = 1; l <= levels; l++) {
    const t = 0.18 + (l / (levels + 1)) * 0.64;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const a = v(x, y), b = v(x + 1, y), c = v(x + 1, y + 1), d = v(x, y + 1);
        const idx = (a > t ? 8 : 0) | (b > t ? 4 : 0) | (c > t ? 2 : 0) | (d > t ? 1 : 0);
        if (idx === 0 || idx === 15) continue;
        const lerp = (p: number, q: number) => (t - p) / (q - p || 1e-6);
        const X = x * cw, Y = y * ch;
        const top: [number, number] = [X + lerp(a, b) * cw, Y];
        const right: [number, number] = [X + cw, Y + lerp(b, c) * ch];
        const bottom: [number, number] = [X + lerp(d, c) * cw, Y + ch];
        const left: [number, number] = [X, Y + lerp(a, d) * ch];
        const seg = (p: [number, number], q: [number, number]) => parts.push(`M${n(p[0])} ${n(p[1])}L${n(q[0])} ${n(q[1])}`);
        switch (idx) {
          case 1: case 14: seg(left, bottom); break;
          case 2: case 13: seg(bottom, right); break;
          case 3: case 12: seg(left, right); break;
          case 4: case 11: seg(top, right); break;
          case 5: seg(left, bottom); seg(top, right); break;
          case 6: case 9: seg(top, bottom); break;
          case 7: case 8: seg(left, top); break;
          case 10: seg(left, top); seg(bottom, right); break;
        }
      }
    }
  }
  return parts.join("");
}

export const CONTOUR_VIEWBOX = `0 0 ${W} ${H}`;
