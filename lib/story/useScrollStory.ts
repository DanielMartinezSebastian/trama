"use client";

import { useEffect, type RefObject } from "react";
import { resolveFeel, tramo, type Curva, type ScrollFeel, type ScrollFeelName } from "@/lib/motion/scroll-feel";

/**
 * El motor de los recorridos por pasos de Trama (Quilate y Ánima, docs/19 §7 y docs/20): un escenario fijo (`sticky`) y una
 * lista de pasos (`[data-step]`) que pasan con el scroll. Sin opiniones de diseño: mide y publica, y cada web decide qué
 * hacer con ello.
 *
 * En cada fotograma de scroll:
 * - **el tramo**: `j` (el paso cuya mitad ya ha pasado la línea media) y `t` (0–1 hacia el siguiente) con una **meseta**: el
 *   30 % central de cada paso no se mueve (`plateau`), así lo que sigue al scroll ya está en su sitio cuando el texto llega;
 * - **en el escenario**, variables CSS:
 *   - `--story-p` (avance total, 0–1);
 *   - `--w<k>` (peso de cada paso: el actual se apaga mientras el siguiente se enciende; salas, HUD…);
 *   - `--r<k>` (avance de cada paso respecto a la línea media, −1 entrando por abajo, 0 centrado, 1 saliendo por arriba);
 *   - `--o<k>` (opacidad que se apaga del todo a |r| = 0,45: cintas que nunca coinciden con el paso vecino);
 * - **los cuadros** (`[data-card="<k>"]` dentro del escenario): suben 1:1 con el scroll y se disuelven al alejarse de la
 *   línea media (opacidad y desenfoque, tipo tilt-shift; sin desenfoque con movimiento reducido);
 * - **`onFrame`**: el tramo, para mover lo que no es CSS (la pose de un 3D, un fuego, un humo). `lerp(a, b)` interpola dos
 *   valores de paso con el `t` ya suavizado.
 */
export type StoryFrame = {
  /** paso actual y siguiente, y el avance suavizado entre ellos (0–1) */
  j: number;
  next: number;
  t: number;
  /** el avance entre los dos pasos sin meseta ni curva (0–1): para curvas propias de cada tramo */
  raw: number;
  /** centros de los pasos en px de la ventana, y la línea media */
  centers: number[];
  mid: number;
  /** interpola entre el valor del paso actual y el del siguiente */
  lerp: (a: number, b: number) => number;
};

export type ScrollStoryOptions = {
  /** sensación (docs/42): de ella salen la meseta y la curva si no se dan; por defecto, la de la página (`SmoothScroll feel`) */
  feel?: ScrollFeelName | ScrollFeel;
  /** fracción de cada tramo que se queda quieta en el centro de los pasos (0,3 = el 30 %) */
  plateau?: number;
  /** curva del recorrido entre mesetas */
  curve?: Curva;
  /** cuadros: distancia (en altos de ventana) a la que empiezan a desenfocarse y a apagarse, y desenfoque máximo (px) */
  cards?: { blurFrom?: number; fadeFrom?: number; fadeSpan?: number; blur?: number } | false;
  onFrame?: (f: StoryFrame) => void;
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const smooth = (t: number) => t * t * (3 - 2 * t);

export function useScrollStory(list: RefObject<HTMLElement | null>, stage: RefObject<HTMLElement | null>, { feel, plateau: plateauProp, curve: curveProp, cards = {}, onFrame }: ScrollStoryOptions = {}) {
  useEffect(() => {
    const f = resolveFeel(feel);
    const plateau = plateauProp ?? f.plateau;
    const curve = curveProp ?? f.curve;
    const items = Array.from(list.current?.querySelectorAll<HTMLElement>("[data-step]") ?? []);
    const cardEls = cards === false ? [] : Array.from(stage.current?.querySelectorAll<HTMLElement>("[data-card]") ?? []);
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const { blurFrom = 0.08, fadeFrom = 0.16, fadeSpan = 0.3, blur: maxBlur = 16 } = cards || {};
    if (!items.length) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = innerHeight / 2;
      const centers = items.map((el) => {
        const r = el.getBoundingClientRect();
        return r.top + r.height / 2;
      });
      let j = 0;
      while (j < centers.length - 1 && centers[j + 1] <= mid) j++;
      const raw = j >= centers.length - 1 || mid <= centers[0] ? 0 : clamp01((mid - centers[j]) / (centers[j + 1] - centers[j]));
      const t = tramo(raw, plateau, curve);
      const next = Math.min(j + 1, centers.length - 1);
      const st = stage.current?.style;
      const span = centers[centers.length - 1] - centers[0];
      st?.setProperty("--story-p", String(clamp01((mid - centers[0]) / (span || 1))));
      for (let k = 0; k < centers.length; k++) {
        st?.setProperty(`--w${k}`, (k === j ? 1 - t : k === next && next !== j ? t : 0).toFixed(3));
        const gap = (centers[Math.min(k + 1, centers.length - 1)] - centers[Math.max(k - 1, 0)]) / 2 || innerHeight;
        const r = Math.min(1.2, Math.max(-1.2, (mid - centers[k]) / gap));
        st?.setProperty(`--r${k}`, r.toFixed(4));
        st?.setProperty(`--o${k}`, (1 - smooth(clamp01((Math.abs(r) - 0.3) / 0.15))).toFixed(3));
      }
      for (const el of cardEls) {
        const k = Number(el.dataset.card);
        const y = centers[k] - mid;
        const d = Math.abs(y) / innerHeight;
        const op = 1 - smooth(clamp01((d - fadeFrom) / fadeSpan));
        const blur = still ? 0 : maxBlur * smooth(clamp01((d - blurFrom) / 0.35));
        el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
        el.style.opacity = op.toFixed(3);
        el.style.filter = blur > 0.2 ? `blur(${blur.toFixed(1)}px)` : "";
        el.style.visibility = op < 0.02 ? "hidden" : "";
        el.style.setProperty("--y", y.toFixed(1));
      }
      onFrame?.({ j, next, t, raw, centers, mid, lerp: (a, b) => a + (b - a) * t });
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", on);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", on);
      removeEventListener("resize", on);
    };
    // onFrame va por referencia estable en quien lo usa (useRef/useCallback); el motor se monta una vez
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
