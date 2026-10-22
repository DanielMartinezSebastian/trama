"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { useTokens } from "@/lib/ui/useTokens";

export const SCRATCH_COVERS = ["dust", "foil", "solid"] as const;
export type ScratchCover = (typeof SCRATCH_COVERS)[number];

export type ScratchRevealProps = {
  /** lo que hay debajo (se ve al rascar) */
  children: ReactNode;
  /** dust = sedimento con grano · foil = lámina metálica con brillo (rasca y gana) · solid = color plano */
  cover?: ScratchCover;
  /** color de la capa (vacío = mezcla de `--mut` y `--card` del tema) */
  color?: string;
  /** radio del pincel en px */
  brush?: number;
  /** fracción rascada (0–1) a la que la capa se retira sola */
  threshold?: number;
  /** texto pintado sobre la capa (vacío = sin texto) */
  label?: string;
  /** botón para revelar sin rascar (teclado y lectores de pantalla; se ve al recibir el foco) */
  revealLabel?: string;
  /** progreso de 0 a 1 mientras se rasca */
  onProgress?: (p: number) => void;
  /** se llama una vez, al pasar del umbral (o con el botón) */
  onReveal?: () => void;
  /** cambia la clave para volver a cubrir */
  resetKey?: string | number;
  className?: string;
  style?: CSSProperties;
};

const GRID = 24;

/**
 * Una capa que se **rasca** con el puntero (o el dedo) para descubrir lo que hay debajo: un fósil bajo el sedimento, un
 * premio bajo la lámina, una imagen bajo la niebla. Mide cuánto se ha rascado (una rejilla de 24 × 24 celdas, sin leer
 * píxeles) y, al pasar de `threshold`, la capa se retira sola y avisa (`onReveal`). Lo de debajo es HTML normal (texto,
 * imagen, un lienzo 3D): sigue ahí para lectores de pantalla, y un botón que aparece con el foco lo revela sin rascar.
 *
 * Colores de los tokens (`--mut`, `--card`, `--fg`). En táctil captura el gesto dentro de la capa (`touch-action: none`),
 * así que no la hagas más alta que la pantalla.
 */
export default function ScratchReveal({
  children,
  cover = "dust",
  color = "",
  brush = 28,
  threshold = 0.6,
  label = "Rasca aquí",
  revealLabel = "Revelar sin rascar",
  onProgress,
  onReveal,
  resetKey,
  className = "",
  style,
}: ScratchRevealProps) {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const tokens = useTokens(root);
  const [done, setDone] = useState(false);
  const cells = useRef<Uint8Array>(new Uint8Array(GRID * GRID));
  const last = useRef<{ x: number; y: number } | null>(null);
  const cb = useRef({ onProgress, onReveal });
  cb.current = { onProgress, onReveal };
  const doneRef = useRef(false);

  const reveal = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    setDone(true);
    cb.current.onProgress?.(1);
    cb.current.onReveal?.();
  }, []);

  // pinta la capa a la medida del contenedor (y otra vez si cambia de tamaño, mientras no se haya rascado)
  useEffect(() => {
    const el = root.current, cv = canvas.current;
    if (!el || !cv) return;
    doneRef.current = false;
    setDone(false);
    cells.current.fill(0);
    const paint = () => {
      const w = el.clientWidth, h = el.clientHeight, dpr = Math.min(2, devicePixelRatio || 1);
      if (!w || !h) return;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      const g = cv.getContext("2d");
      if (!g) return;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.globalCompositeOperation = "source-over";
      const base = color || `color-mix(in srgb, ${tokens?.["--mut"] || "#8a8378"} 55%, ${tokens?.["--card"] || "#d8cfc0"})`;
      // canvas no entiende color-mix: se resuelve con un elemento de prueba
      const probe = document.createElement("span");
      probe.style.color = base;
      el.appendChild(probe);
      const solid = getComputedStyle(probe).color || "#a99f90";
      probe.remove();
      g.fillStyle = solid;
      g.fillRect(0, 0, w, h);
      if (cover === "foil") {
        const sh = g.createLinearGradient(0, 0, w, h);
        sh.addColorStop(0, "rgba(255,255,255,0.0)");
        sh.addColorStop(0.45, "rgba(255,255,255,0.35)");
        sh.addColorStop(0.55, "rgba(255,255,255,0.05)");
        sh.addColorStop(1, "rgba(0,0,0,0.12)");
        g.fillStyle = sh;
        g.fillRect(0, 0, w, h);
      }
      if (cover !== "solid") {
        // grano: puntos claros y oscuros con semilla fija (la misma capa en cada pintado)
        let s = 7;
        const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
        const n = Math.round((w * h) / (cover === "dust" ? 60 : 140));
        for (let i = 0; i < n; i++) {
          const v = rnd();
          g.fillStyle = v > 0.5 ? `rgba(255,255,255,${0.05 + rnd() * 0.12})` : `rgba(0,0,0,${0.04 + rnd() * 0.12})`;
          const r = cover === "dust" ? 0.6 + rnd() * 1.8 : 0.5 + rnd() * 0.8;
          g.beginPath();
          g.arc(rnd() * w, rnd() * h, r, 0, Math.PI * 2);
          g.fill();
        }
      }
      if (label) {
        g.fillStyle = tokens?.["--fg"] || "#1b1916";
        g.globalAlpha = 0.55;
        g.font = `500 ${Math.max(11, Math.min(15, w / 28))}px ui-monospace, monospace`;
        g.textAlign = "center";
        g.textBaseline = "middle";
        g.fillText(label.toUpperCase(), w / 2, h / 2);
        g.globalAlpha = 1;
      }
    };
    paint();
    const ro = new ResizeObserver(() => {
      if (!cells.current.some(Boolean)) paint();
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [cover, color, label, tokens, resetKey]);

  const scratch = (x: number, y: number) => {
    const el = root.current, cv = canvas.current;
    const g = cv?.getContext("2d");
    if (!el || !g || doneRef.current) return;
    const p = last.current ?? { x, y };
    g.globalCompositeOperation = "destination-out";
    g.lineCap = "round";
    g.lineJoin = "round";
    g.lineWidth = brush * 2;
    g.beginPath();
    g.moveTo(p.x, p.y);
    g.lineTo(x + 0.01, y);
    g.stroke();
    last.current = { x, y };
    // marca las celdas que cubre el trazo (muestras a lo largo del segmento)
    const w = el.clientWidth, h = el.clientHeight, cw = w / GRID, ch = h / GRID;
    const steps = Math.max(1, Math.ceil(Math.hypot(x - p.x, y - p.y) / (brush / 2)));
    for (let k = 0; k <= steps; k++) {
      const sx = p.x + ((x - p.x) * k) / steps, sy = p.y + ((y - p.y) * k) / steps;
      const i0 = Math.max(0, Math.floor((sx - brush) / cw)), i1 = Math.min(GRID - 1, Math.floor((sx + brush) / cw));
      const j0 = Math.max(0, Math.floor((sy - brush) / ch)), j1 = Math.min(GRID - 1, Math.floor((sy + brush) / ch));
      for (let j = j0; j <= j1; j++)
        for (let i = i0; i <= i1; i++) if (Math.hypot((i + 0.5) * cw - sx, (j + 0.5) * ch - sy) < brush) cells.current[j * GRID + i] = 1;
    }
    let on = 0;
    for (const c of cells.current) on += c;
    const prog = on / cells.current.length;
    cb.current.onProgress?.(prog);
    if (prog >= threshold) reveal();
  };

  const at = (e: ReactPointerEvent) => {
    const r = root.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  return (
    <div ref={root} className={`ui-scratch ${done ? "is-done" : ""} ${className}`.trim()} style={style}>
      <div className="ui-scratch__under">{children}</div>
      <canvas
        ref={canvas}
        className="ui-scratch__cover"
        aria-hidden
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          last.current = null;
          const p = at(e);
          scratch(p.x, p.y);
        }}
        onPointerMove={(e) => {
          // con ratón se rasca al pasar con el botón pulsado; con dedo o lápiz, siempre que haya contacto
          if (e.pointerType === "mouse" && !(e.buttons & 1)) {
            last.current = null;
            return;
          }
          const p = at(e);
          scratch(p.x, p.y);
        }}
        onPointerUp={() => (last.current = null)}
        onPointerCancel={() => (last.current = null)}
      />
      {revealLabel && !done && (
        <button type="button" className="ui-scratch__skip" onClick={reveal}>
          {revealLabel}
        </button>
      )}
    </div>
  );
}
