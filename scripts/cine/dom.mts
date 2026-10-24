import { spawnSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fitCurve } from "../../lib/cine/curves";
import type { Muestra } from "./lib.mts";

/**
 * El relato escrito de una captura (docs/30 §1): qué textos se ven, cuándo entran y salen, cómo (fundido, sube, recorte,
 * desenfoque) y con qué curva, y a qué altura del scroll. La visibilidad sale de los píxeles del fotograma, no del DOM:
 * un lienzo encima con pointer-events: none tapa el texto solo donde pinta, y el DOM no lo sabe. Un bloque se ve cuando
 * su color de texto aparece dentro de su caja (tinta).
 */
export type Aparicion = {
  texto: string;
  /** segundos de la captura en que entra (la tinta pasa de la mitad de su máximo) y en que sale; null si no sale */
  entra: number;
  sale: number | null;
  /** posición del scroll (px) al entrar, si la página se desplaza */
  scrollEntra: number | null;
  /** cómo entra: lo que cambia durante la entrada */
  como: ("fundido" | "sube" | "baja" | "recorte" | "desenfoque" | "aparece")[];
  /** duración de la entrada (s) y su curva (sobre la tinta normalizada) */
  dura: number;
  curva: string | null;
  /** cuerpo del texto (px) y tamaño en pantalla (fracción del ancho) */
  cuerpo: number;
  ancho: number;
};

type Bloque = { t: number; i: number; shot: number | null; tinta: number; op: number; dy: number; clip: number; blur: number; y: number; scroll: number; fs: number; w: number };

const parseColor = (c: string): [number, number, number] | null => {
  const m = /rgba?\(([^)]+)\)/.exec(c);
  if (!m) return null;
  const [r, g, b] = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
  return [r, g, b];
};

/** fotogramas a 1/4 de resolución en memoria (gris no: hace falta el color del texto) */
function lector(dir: string, W: number, H: number) {
  const w = Math.round(W / 4), h = Math.round(H / 4);
  const cache = new Map<number, Buffer>();
  return {
    w,
    h,
    leer(shot: number) {
      if (cache.has(shot)) return cache.get(shot)!;
      const png = join(dir, "frames", `${String(shot).padStart(5, "0")}.png`);
      if (!existsSync(png)) return null;
      const r = spawnSync("ffmpeg", ["-loglevel", "error", "-i", png, "-vf", `scale=${w}:${h}`, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], { maxBuffer: 1 << 26 });
      if (r.status !== 0) return null;
      cache.set(shot, r.stdout);
      return r.stdout;
    },
  };
}

export function relatoDom(dir: string, ms: Muestra[], size: [number, number]): Aparicion[] {
  if (!ms.some((m) => m.dom?.length) || !existsSync(join(dir, "frames")) || !readdirSync(join(dir, "frames")).length) return [];
  const [W, H] = size;
  const L = lector(dir, W, H);
  const series = new Map<string, Bloque[]>();
  // un fotograma de cada dos basta para la tinta (y la mitad de lecturas)
  for (const m of ms) {
    if (!m.dom || m.shot == null || m.shot % 2) continue;
    const px = L.leer(m.shot);
    if (!px) continue;
    for (const d of m.dom) {
      if (d.txt.length < 2) continue;
      const col = parseColor(d.col);
      let tinta = 0;
      if (col && d.vis > 0) {
        const x0 = Math.max(0, Math.floor(d.r[0] / 4)), y0 = Math.max(0, Math.floor(d.r[1] / 4));
        const x1 = Math.min(L.w, Math.ceil((d.r[0] + d.r[2]) / 4)), y1 = Math.min(L.h, Math.ceil((d.r[1] + d.r[3]) / 4));
        let n = 0, cerca = 0;
        const fondo: number[][] = [];
        for (let y = y0; y < y1; y++)
          for (let x = x0; x < x1; x++) {
            const k = (y * L.w + x) * 3;
            n++;
            const dist = Math.abs(px[k] - col[0]) + Math.abs(px[k + 1] - col[1]) + Math.abs(px[k + 2] - col[2]);
            if (dist < 60) cerca++;
            fondo.push([px[k], px[k + 1], px[k + 2]]);
          }
        // el fondo de la caja (mediana de toda ella: las letras ocupan poco) tiene que contrastar con el texto: texto rojo
        // sobre una sección roja no se distingue, y su «tinta» sería el fondo
        const med = (c: number) => fondo.map((p) => p[c]).sort((p, q) => p - q)[fondo.length >> 1] ?? 0;
        const contraste = fondo.length ? Math.abs(med(0) - col[0]) + Math.abs(med(1) - col[1]) + Math.abs(med(2) - col[2]) : 0;
        // casi toda la caja «tinta» es fondo del mismo color, no letras
        tinta = n && contraste > 70 && cerca / n < 0.5 ? cerca / n : 0;
      }
      const s = series.get(d.txt) ?? [];
      s.push({ t: m.t, i: m.i, shot: m.shot, tinta, op: d.op, dy: d.dy, clip: d.clip, blur: d.blur, y: d.r[1], scroll: m.scroll?.y ?? 0, fs: d.fs, w: d.r[2] / W });
      series.set(d.txt, s);
    }
  }
  const out: Aparicion[] = [];
  for (const [texto, s] of series) {
    // el percentil 90, no el máximo: un fotograma suelto con el fondo del color del texto no fija el umbral
    const orden = s.map((b) => b.tinta).sort((p, q) => p - q);
    const max = orden[Math.floor(orden.length * 0.9)] ?? 0;
    if (max < 0.01) continue;
    const umbral = max / 2;
    // histéresis: entra al pasar de la mitad de su máximo y sale cuando baja de un cuarto durante 0,15 s (un titular que
    // se mueve oscila de un fotograma a otro)
    let dentro = false;
    // la tinta «anterior»: 0 en la primera muestra del bloque y tras un hueco en la serie (el bloque entra en pantalla ya
    // visible: un titular que llega con el scroll no tiene subida de tinta, pero entra)
    const antes = (k: number) => (k === 0 || s[k].i - s[k - 1].i > 3 ? 0 : s[k - 1].tinta);
    for (let k = 0; k < s.length; k++) {
      if (dentro) {
        if (s[k].tinta < max / 4) {
          let j = k;
          while (j < s.length && s[j].tinta < max / 4 && s[j].t - s[k].t < 0.15) j++;
          if (j >= s.length || s[j].tinta < max / 4) dentro = false;
        }
        continue;
      }
      if (!(antes(k) < umbral && s[k].tinta >= umbral)) continue;
      dentro = true;
      // la entrada: del último fotograma sin tinta al primero en su máximo local
      let a = Math.max(0, k - 1);
      if (antes(k) === 0 && k > 0 && s[k].i - s[k - 1].i > 3) a = k;
      while (a > 0 && s[a].i - s[a - 1].i <= 3 && s[a - 1].tinta < s[a].tinta - 1e-4 && s[a].tinta > max * 0.05) a--;
      let b = k;
      while (b < s.length - 1 && s[b + 1].tinta >= s[b].tinta && s[b + 1].tinta > umbral) b++;
      const tramo = s.slice(a, b + 1);
      // duración del 10 % al 90 % de la subida: no depende de dónde empieza la rampa (un bloque que entra en pantalla
      // poco a poco tiene una cola larga de tinta baja)
      const t0v = tramo[0].tinta, t1v = tramo[tramo.length - 1].tinta;
      const cruza = (f: number) => tramo.find((x) => x.tinta >= t0v + (t1v - t0v) * f)?.t ?? tramo[0].t;
      const dura = Math.max(0, cruza(0.9) - cruza(0.1));
      const como: Aparicion["como"] = [];
      if (tramo[tramo.length - 1].op - tramo[0].op > 0.2) como.push("fundido");
      if (tramo[0].dy - tramo[tramo.length - 1].dy > 6 || tramo[0].y - tramo[tramo.length - 1].y > 20) como.push("sube");
      if (tramo[tramo.length - 1].dy - tramo[0].dy > 6 || tramo[tramo.length - 1].y - tramo[0].y > 20) como.push("baja");
      if (tramo.some((x) => x.clip >= 1)) como.push("recorte");
      if (tramo[0].blur - tramo[tramo.length - 1].blur > 1) como.push("desenfoque");
      if (!como.length) como.push("aparece");
      const t0 = tramo[0].t;
      const muestras = dura > 0 ? tramo.map((x) => ({ t: (x.t - t0) / dura, v: (x.tinta - tramo[0].tinta) / Math.max(1e-6, tramo[tramo.length - 1].tinta - tramo[0].tinta) })) : [];
      // salida: la próxima vez que cae por debajo del umbral
      let sale: number | null = null;
      for (let j = b + 1; j < s.length; j++)
        if (s[j].tinta < max / 4) {
          let q = j;
          while (q < s.length && s[q].tinta < max / 4 && s[q].t - s[j].t < 0.15) q++;
          if (q >= s.length || s[q].tinta < max / 4) {
            sale = s[j].t;
            break;
          }
        }
      // menos de 0,2 s a la vista es un parpadeo (una coincidencia de color en un fotograma), no una aparición
      if (sale !== null && sale - s[k].t < 0.2) continue;
      if (out.some((o) => o.texto === texto && Math.abs(o.entra - s[k].t) < 0.2)) continue;
      out.push({ texto, entra: s[k].t, sale, scrollEntra: s[k].scroll || null, como, dura: +dura.toFixed(3), curva: muestras.length > 3 ? fitCurve(muestras)[0]?.curva ?? null : null, cuerpo: s[k].fs, ancho: +s[k].w.toFixed(3) });
    }
  }
  return out.sort((a, b) => a.entra - b.entra);
}
