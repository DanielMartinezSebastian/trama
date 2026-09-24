/**
 * Imágenes de ejemplo para las galerías: escenas de mar en pixel art generadas como SVG, así el kit no depende de
 * ninguna imagen ni de la red. En cualquier prop de imágenes, `gen:N` (N = 0, 1, 2…) pide la escena N; cualquier otra
 * cosa se trata como una URL normal.
 */

type Pal = { sky: string[]; sun: string; far: string; mid: string; near: string; foam: string; stars?: boolean };

const PALS: Pal[] = [
  { sky: ["#2b1b4d", "#6a3a7a", "#c2587a", "#ff9a6b", "#ffc98a"], sun: "#ffe28c", far: "#3a2a66", mid: "#1f4d7a", near: "#0f2f55", foam: "#ffd9b8" },
  { sky: ["#2f8fd8", "#5fb0e8", "#8fd0f4", "#bfe8ff"], sun: "#fff6c2", far: "#2a86a8", mid: "#1670a0", near: "#0e5583", foam: "#ffffff" },
  { sky: ["#3a1c71", "#7a2a8a", "#d1467a", "#ff6a4d", "#ffa860"], sun: "#ffd27c", far: "#5a2a7a", mid: "#33306b", near: "#1a1a4a", foam: "#ffb59a" },
  { sky: ["#050a25", "#0b1440", "#14295a", "#1d3f70"], sun: "#eaf0ff", far: "#0f2a55", mid: "#0a1f45", near: "#050f2a", foam: "#9fb8e8", stars: true },
  { sky: ["#0f4c5c", "#1f7a80", "#3fb0a8", "#9fe0c8"], sun: "#fdf2b0", far: "#1b6a6a", mid: "#0f5560", near: "#083b46", foam: "#eafff5" },
  { sky: ["#3b1f2b", "#8a3a3a", "#d1653f", "#ffa64d", "#ffd27c"], sun: "#fff0b0", far: "#5a2f3a", mid: "#2f2a4a", near: "#171733", foam: "#ffd9a0" },
  { sky: ["#1a2b52", "#3a5a9a", "#7aa0d8", "#c8def5"], sun: "#ffffff", far: "#2f5a9a", mid: "#1f427a", near: "#12295a", foam: "#f2f8ff" },
  { sky: ["#10102a", "#2a1a5a", "#5a2a8a", "#9a3aa0"], sun: "#ffe6ff", far: "#3a1f6a", mid: "#231452", near: "#0f0a2e", foam: "#d9a8ff", stars: true },
];

const W = 40;
const H = 30;
const C = 20;

/** Escena pixel art N (rejilla 40×30, 800×600). Determinista: la misma N da siempre la misma imagen. */
export function pixelScene(n: number): string {
  const seed = Math.abs(Math.floor(n));
  const p = PALS[seed % PALS.length];
  const kind = seed % 3; // 0 mar y sol · 1 montañas · 2 solo mar
  const hz = 15 + (seed % 3);
  const rnd = (i: number) => {
    const x = Math.sin((seed + 1) * 127.1 + i * 311.7) * 43758.5453;
    return x - Math.floor(x);
  };
  const rect = (x: number, y: number, w: number, h: number, fill: string) => `<rect x="${x * C}" y="${y * C}" width="${w * C}" height="${h * C}" fill="${fill}"/>`;

  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W * C} ${H * C}" shape-rendering="crispEdges" preserveAspectRatio="xMidYMid slice">`;
  p.sky.forEach((c, b) => {
    const y0 = Math.round((b * hz) / p.sky.length);
    const y1 = Math.round(((b + 1) * hz) / p.sky.length);
    s += rect(0, y0, W, y1 - y0, c);
  });
  if (p.stars) for (let i = 0; i < 46; i++) s += rect(Math.floor(rnd(i) * W), Math.floor(rnd(i + 99) * (hz - 2)), 1, 1, "#ffffff");

  // sol o luna: un cuadrado con las esquinas comidas
  const sx = 5 + Math.floor(rnd(1) * 28);
  const sy = 2 + Math.floor(rnd(2) * 5);
  s += rect(sx + 1, sy, 3, 5, p.sun) + rect(sx, sy + 1, 5, 3, p.sun);

  if (kind === 1) {
    for (let x = 0; x < W; x++) {
      const h = 2 + Math.round(Math.abs(Math.sin(x * 0.33 + seed)) * 4 + Math.abs(Math.sin(x * 0.11 + seed * 2)) * 4);
      s += rect(x, hz - h, 1, h + 1, p.far);
    }
  }

  [p.far, p.mid, p.near].forEach((col, l) => {
    for (let x = 0; x < W; x++) {
      const y = hz + l * 4 + 1 + Math.round(Math.sin(x * 0.5 + seed + l * 2) * 1.2);
      s += rect(x, y, 1, H - y, col);
      if (l === 2 && Math.sin(x * 0.5 + seed + l * 2) > 0.7) s += rect(x, y, 1, 1, p.foam);
    }
  });
  return `${s}</svg>`;
}

/** Data URI de la escena N: se puede usar directamente en `<img src>`. */
export const pixelSceneUri = (n: number) => `data:image/svg+xml;utf8,${encodeURIComponent(pixelScene(n))}`;

/** `gen:N` → escena generada; cualquier otra cosa se devuelve tal cual (URL, ruta o data URI). */
export function resolveImage(src: string): string {
  const m = /^gen:(\d+)$/.exec(src.trim());
  return m ? pixelSceneUri(parseInt(m[1], 10)) : src.trim();
}
