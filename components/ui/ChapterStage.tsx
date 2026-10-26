"use client";

import { Suspense, lazy, useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { GLBoundary, useGLGate } from "@/lib/ui/gl";
import { useReducedMotion } from "@/lib/ui/useReducedMotion";
import { useTokens } from "@/lib/ui/useTokens";
import { pinProgress, trackScroll } from "@/lib/motion/progress";
import { resolveFeel, seguidorRaf } from "@/lib/motion/scroll-feel";
import { fronteras as calcularFronteras, posicionPalabra } from "@/lib/chapterstage/coreografia";

// three y react-three-fiber solo se descargan cuando la pieza está cerca de la pantalla
const ChapterStageScene = lazy(() => import("@/lib/chapterstage/scene"));

export type Chapter = {
  /** la palabra gigante del capítulo */
  word: string;
  /** imagen de la tarjeta central */
  image?: string;
  /** lista corta a la derecha (habilidades, datos, entregables) */
  items?: string[];
  /** etiqueta del capítulo en la barra de abajo; por defecto, la palabra */
  label?: string;
};

export type ChapterStageProps = {
  chapters?: Chapter[];
  /** pantallas de scroll por capítulo: un número para todos o uno por capítulo (la referencia: 3,3 · 1,7 · 2,5) */
  perChapter?: number | number[];
  /** familia de la palabra gigante (una variable CSS de fuente o una familia); por defecto, la display del tema */
  wordFont?: string;
  /** auto = tarjeta con fallo de señal y sala de líneas en WebGL si el equipo puede · static = imagen y líneas en SVG */
  render?: "auto" | "static";
  /**
   * modo controlado: progreso 0–1 que das tú (un deslizador, tu propio relato de scroll). La pieza no se fija al scroll y
   * mide `height`
   */
  progress?: number;
  /** alto en modo controlado (px o medida CSS) */
  height?: number | string;
  className?: string;
};

const DEMO: Chapter[] = [
  { word: "Legacy", items: ["Brand systems", "Art direction", "Motion"], label: "Tension" },
  { word: "UI – UX", items: ["UX research", "Interfaces", "Prototyping"], label: "Immersion" },
  { word: "3D Web", items: ["Three.js / WebGL", "Shaders", "Performance"], label: "Impact" },
];

/**
 * Escenario por capítulos fijado al scroll: una palabra gigante por capítulo que se releva dentro de una máscara (la que
 * sale sube con curva en S, la que entra llega desde abajo frenando), una tarjeta central con la imagen del capítulo que
 * sufre un fallo de señal en cada relevo, una sala en perspectiva dibujada con líneas, la lista del capítulo a la derecha
 * y la barra de capítulos abajo. Concepto y coreografía medidos en meermohsin.me con el gancho del DOM de cine:capture
 * (docs/30). Construido sobre el progreso de `PinnedSection`. Colores del tema: líneas, tarjeta y palabra del acento.
 * Con movimiento reducido o sin WebGL, la imagen sin fallo y las líneas en SVG; el relevo sigue al scroll.
 *
 * Requiere `three` y `@react-three/fiber` (dependencias opcionales del paquete): se importa por subruta, `trama-ui/ChapterStage`.
 */
export default function ChapterStage({ chapters = DEMO, perChapter = 1.6, wordFont, render = "auto", progress, height = 520, className = "" }: ChapterStageProps) {
  const outer = useRef<HTMLDivElement>(null);
  const tokens = useTokens(outer);
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  const { use3d, mounted, near, fail } = useGLGate(outer, { want: render === "auto" && !reduced && chapters.some((c) => c.image) });
  const onReady = useCallback(() => setReady(true), []);
  const u = useRef(0);
  const palabras = useRef<(HTMLSpanElement | null)[]>([]);
  const listas = useRef<(HTMLUListElement | null)[]>([]);
  const barra = useRef<HTMLDivElement>(null);
  const [activo, setActivo] = useState(0);

  const duraciones = chapters.map((_, k) => (Array.isArray(perChapter) ? perChapter[k] ?? perChapter[perChapter.length - 1] ?? 1.6 : perChapter));
  const clave = duraciones.join(",");
  const b = calcularFronteras(duraciones);
  const total = b[b.length - 1];

  const controlado = progress !== undefined;
  // pinta el estado para y pantallas desde el inicio del fijado (o progreso · total en modo controlado)
  const pintar = useCallback(
    (y: number) => {
      const fr = calcularFronteras(clave.split(",").map(Number));
      const tot = fr[fr.length - 1];
      u.current = y;
      palabras.current.forEach((w, k) => {
        if (w) w.style.transform = `translateY(${(posicionPalabra(k, y, fr) * 100).toFixed(2)}%)`;
      });
      let a = 0;
      for (let k = 1; k < fr.length - 1; k++) if (y >= fr[k]) a = k;
      listas.current.forEach((l, k) => {
        if (!l) return;
        // la lista entra tras el relevo y se va antes del siguiente
        const desde = y - fr[k], hasta = fr[k + 1] - y;
        const o = Math.max(0, Math.min(1, (k === 0 ? desde - 0.41 : desde) / 0.15, k === fr.length - 2 ? 1 : hasta / 0.3));
        // entra subiendo, como en la referencia
        l.style.opacity = String(o);
        l.style.transform = `translateY(${((1 - o) * 14).toFixed(1)}px)`;
      });
      barra.current?.style.setProperty("--ch-p", (y / tot).toFixed(4));
      setActivo((x) => (x === a ? x : a));
    },
    [clave],
  );

  useEffect(() => {
    if (controlado) return;
    const el = outer.current;
    if (!el) return;
    // el avance sigue al scroll amortiguado con la sensación de la página (docs/42): no copia cada tirón de la rueda
    const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seg = seguidorRaf(quieto ? Infinity : resolveFeel().damp.pose, pintar);
    const stop = trackScroll(el, (r, vh) => seg.set(pinProgress(r, vh) * total));
    return () => {
      stop();
      seg.stop();
    };
  }, [controlado, pintar, total]);

  useEffect(() => {
    if (controlado) pintar(Math.min(1, Math.max(0, progress ?? 0)) * total * 0.9999);
  }, [controlado, progress, pintar, total]);

  const acento = tokens?.["--acc"] || "#c8101a";
  const imagenes = chapters.map((c) => c.image).filter(Boolean) as string[];

  return (
    <div
      ref={outer}
      className={`${controlado ? "ui-chs--libre" : "ui-pin"} ui-chs ${className}`.trim()}
      style={(controlado ? { height } : { "--pin-len": total, "--pin-p": 0 }) as CSSProperties}
    >
      <div className="ui-pin__in">
        <div className="ui-chs__stage">
          {/* versión plana de la sala: las líneas en SVG (se queda debajo del lienzo cuando hay 3D) */}
          <svg className="ui-chs__room" viewBox="0 0 160 90" preserveAspectRatio="none" aria-hidden>
            <rect x="12" y="10" width="136" height="70" />
            <rect x="52" y="30" width="56" height="30" />
            <path d="M12 10 L52 30 M148 10 L108 30 M12 80 L52 60 M148 80 L108 60 M0 45 H160 M80 0 V90" />
          </svg>
          <div className="ui-chs__words" style={wordFont ? ({ "--chs-font": wordFont } as CSSProperties) : undefined}>
            {chapters.map((c, k) => (
              <span key={k} ref={(el) => void (palabras.current[k] = el)} className="ui-chs__word" style={{ transform: "translateY(100%)" }}>
                {c.word}
              </span>
            ))}
          </div>
          {!use3d && chapters[activo]?.image && <img className="ui-chs__card" src={chapters[activo].image} alt="" />}
          {use3d && mounted && (
            <div className={`ui-chs__gl ${ready ? "is-on" : ""}`} aria-hidden>
              <GLBoundary onError={fail}>
                <Suspense fallback={null}>
                  <ChapterStageScene imagenes={imagenes} u={u} fronteras={b} acento={acento} active={near} onReady={onReady} />
                </Suspense>
              </GLBoundary>
            </div>
          )}
          <div className="ui-chs__lists">
            {chapters.map((c, k) => (
              <ul key={k} ref={(el) => void (listas.current[k] = el)} style={{ opacity: k ? 0 : 1 }} aria-hidden={k !== activo}>
                {(c.items ?? []).map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            ))}
          </div>
          <div ref={barra} className="ui-chs__bar" aria-hidden>
            {chapters.map((c, k) => (
              <span key={k} className={k === activo ? "is-on" : ""}>
                {c.label ?? c.word}
              </span>
            ))}
            <i />
          </div>
        </div>
        {/* para lectores de pantalla: los capítulos en orden */}
        <ol className="ui-sr">
          {chapters.map((c, k) => (
            <li key={k}>
              {c.word}
              {c.items?.length ? `: ${c.items.join(", ")}` : ""}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
