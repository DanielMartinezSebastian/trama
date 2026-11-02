"use client";

import { useEffect, useRef } from "react";

/*
 * Globo de puntos en lienzo 2D: los continentes son polígonos aproximados a mano (lon, lat) que se rellenan con una rejilla de
 * puntos; gira despacio y dibuja las rutas como arcos de círculo máximo, con el tramo activo moviéndose. Sin WebGL ni mapas.
 */

const TIERRA: [number, number][][] = [
  // América del Norte
  [[-165, 62], [-155, 71], [-125, 70], [-95, 72], [-80, 73], [-62, 60], [-55, 50], [-68, 45], [-75, 38], [-81, 31], [-81, 25], [-90, 29], [-97, 26], [-97, 19], [-88, 17], [-83, 9], [-92, 15], [-105, 21], [-115, 31], [-124, 40], [-125, 49], [-140, 59], [-165, 62]],
  // Groenlandia
  [[-55, 60], [-44, 60], [-22, 70], [-20, 80], [-60, 82], [-68, 76], [-55, 60]],
  // América del Sur
  [[-80, 9], [-62, 11], [-50, 1], [-35, -6], [-39, -18], [-48, -26], [-57, -35], [-65, -42], [-68, -54], [-74, -50], [-72, -30], [-71, -18], [-80, -5], [-80, 9]],
  // Europa y Asia
  [[-9, 37], [-9, 44], [-2, 48], [4, 52], [8, 57], [5, 62], [14, 69], [28, 71], [50, 69], [70, 73], [105, 77], [140, 73], [178, 68], [170, 60], [155, 59], [140, 53], [130, 42], [122, 39], [122, 30], [110, 20], [108, 11], [103, 2], [98, 8], [97, 17], [90, 22], [80, 15], [77, 8], [72, 20], [62, 25], [56, 26], [52, 17], [44, 13], [38, 21], [35, 31], [28, 37], [24, 40], [18, 40], [12, 44], [8, 44], [0, 39], [-5, 36], [-9, 37]],
  // África
  [[-16, 28], [-6, 35], [10, 37], [20, 32], [33, 31], [37, 20], [43, 12], [51, 11], [41, -2], [40, -15], [35, -24], [27, -33], [19, -34], [13, -18], [13, -6], [9, 4], [-7, 5], [-17, 13], [-16, 28]],
  // Australia
  [[114, -22], [122, -17], [131, -12], [137, -16], [142, -11], [153, -27], [150, -37], [140, -38], [131, -32], [116, -34], [114, -22]],
  // Islas
  [[-10, 52], [-6, 55], [-2, 58], [1, 52], [-5, 50], [-10, 52]],
  [[130, 31], [136, 34], [142, 40], [141, 45], [138, 37], [130, 33], [130, 31]],
  [[44, -16], [50, -14], [47, -25], [44, -24], [44, -16]],
  [[95, 5], [106, -6], [116, -8], [106, -3], [100, 2], [95, 5]],
];

const dentro = (lon: number, lat: number, pol: [number, number][]) => {
  let si = false;
  for (let i = 0, j = pol.length - 1; i < pol.length; j = i++) {
    const [xi, yi] = pol[i];
    const [xj, yj] = pol[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) si = !si;
  }
  return si;
};

const vec = (lon: number, lat: number): [number, number, number] => {
  const a = (lon * Math.PI) / 180;
  const b = (lat * Math.PI) / 180;
  return [Math.cos(b) * Math.sin(a), Math.sin(b), Math.cos(b) * Math.cos(a)];
};

export type Ruta = { de: [number, number]; a: [number, number] };

function arco(p: [number, number, number], q: [number, number, number], t: number) {
  const d = Math.acos(Math.max(-1, Math.min(1, p[0] * q[0] + p[1] * q[1] + p[2] * q[2])));
  const s = Math.sin(d) || 1;
  const m = Math.sin((1 - t) * d) / s;
  const n = Math.sin(t * d) / s;
  const alto = 1 + Math.sin(Math.PI * t) * 0.16 * Math.min(1, d);
  return [(m * p[0] + n * q[0]) * alto, (m * p[1] + n * q[1]) * alto, (m * p[2] + n * q[2]) * alto] as const;
}

export default function Globo({ rutas, className = "", inicio = -10 }: { rutas: Ruta[]; className?: string; inicio?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    const c = cv?.getContext("2d");
    if (!cv || !c) return;
    const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const puntos: [number, number, number][] = [];
    for (let lat = -58; lat <= 82; lat += 2) {
      const n = Math.max(8, Math.round(180 * Math.cos((lat * Math.PI) / 180)));
      for (let k = 0; k < n; k++) {
        const lon = -180 + (k * 360) / n;
        if (TIERRA.some((p) => dentro(lon, lat, p))) puntos.push(vec(lon, lat));
      }
    }
    const rts = rutas.map((r) => ({ p: vec(...r.de), q: vec(...r.a) }));
    let W = 0;
    let H = 0;
    let raf = 0;
    let giro = (inicio * Math.PI) / 180;
    const ajusta = () => {
      const r = cv.getBoundingClientRect();
      const d = Math.min(devicePixelRatio, 2);
      W = r.width;
      H = r.height;
      cv.width = W * d;
      cv.height = H * d;
      c.setTransform(d, 0, 0, d, 0, 0);
    };
    ajusta();
    const ro = new ResizeObserver(ajusta);
    ro.observe(cv);
    const incl = 0.32;
    const proyecta = (v: readonly [number, number, number]) => {
      const cg = Math.cos(giro);
      const sg = Math.sin(giro);
      const x = v[0] * cg + v[2] * sg;
      const z0 = -v[0] * sg + v[2] * cg;
      const y = v[1] * Math.cos(incl) - z0 * Math.sin(incl);
      const z = v[1] * Math.sin(incl) + z0 * Math.cos(incl);
      return [x, y, z] as const;
    };
    const dibuja = (ms: number) => {
      const R = Math.min(W, H) * 0.44;
      const cx = W / 2;
      const cy = H / 2;
      c.clearRect(0, 0, W, H);
      const halo = c.createRadialGradient(cx, cy, R * 0.92, cx, cy, R * 1.18);
      halo.addColorStop(0, "rgba(38,92,255,0.75)");
      halo.addColorStop(0.3, "rgba(255,110,40,0.3)");
      halo.addColorStop(1, "rgba(0,0,0,0)");
      c.fillStyle = halo;
      c.beginPath();
      c.arc(cx, cy, R * 1.18, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = "#04060c";
      c.beginPath();
      c.arc(cx, cy, R, 0, Math.PI * 2);
      c.fill();
      for (const v of puntos) {
        const [x, y, z] = proyecta(v);
        if (z < 0) continue;
        c.fillStyle = `rgba(200,212,235,${0.25 + z * 0.75})`;
        const s = Math.max(1, R / 210);
        c.fillRect(cx + x * R, cy - y * R, s, s);
      }
      const t = (ms / 2600) % 1;
      c.lineWidth = 1.4;
      rts.forEach((r, i) => {
        c.strokeStyle = "rgba(255,122,48,0.42)";
        c.beginPath();
        let abierto = false;
        for (let k = 0; k <= 40; k++) {
          const [x, y, z] = proyecta(arco(r.p, r.q, k / 40));
          if (z < 0) {
            abierto = false;
            continue;
          }
          if (abierto) c.lineTo(cx + x * R, cy - y * R);
          else c.moveTo(cx + x * R, cy - y * R);
          abierto = true;
        }
        c.stroke();
        const [x, y, z] = proyecta(arco(r.p, r.q, quieto ? 0.5 : (t + i * 0.17) % 1));
        if (z > 0) {
          c.fillStyle = "#ff8a3c";
          c.beginPath();
          c.arc(cx + x * R, cy - y * R, 3, 0, Math.PI * 2);
          c.fill();
        }
      });
      if (!quieto) {
        giro -= 0.0009;
        raf = requestAnimationFrame(dibuja);
      }
    };
    raf = requestAnimationFrame(dibuja);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [rutas, inicio]);
  return <canvas ref={ref} className={className} role="img" aria-label="Globo terráqueo de puntos con las rutas de transporte" />;
}
