"use client";

import { Suspense, lazy, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { GLBoundary, useGLGate } from "@/lib/ui/gl";
import { useReducedMotion } from "@/lib/ui/useReducedMotion";
import { useTokens } from "@/lib/ui/useTokens";

// three y react-three-fiber solo se descargan cuando el campo está cerca de la pantalla
const TypeFieldScene = lazy(() => import("@/lib/typefield/scene"));

export const TYPE_FIELD_TONES = ["acc", "acc2", "fg", "mut"] as const;
export type TypeFieldTone = (typeof TYPE_FIELD_TONES)[number];

export type TypeFieldProps = {
  /**
   * Palabras escondidas, una por línea (hasta cuatro): «TEXTO» o «TEXTO|tono» (acc, acc2, fg, mut). Se colocan solas en el
   * campo, dos en horizontal y dos en vertical. Son el contenido: van también como texto para lectores de pantalla.
   */
  words?: string;
  /** scroll = suben mientras el campo cruza la pantalla · hover = suben al pasar el puntero · loop = suben y bajan solas */
  trigger?: "scroll" | "hover" | "loop";
  /** segundos de un ciclo con trigger="loop" */
  duration?: number;
  /** alto en px; el ancho es el del contenedor */
  height?: number;
  /** auto = 3D si el equipo puede y no pide reducir movimiento · static = solo la versión plana */
  render?: "auto" | "static";
  /** fuente en formato typeface de three (JSON); por defecto, Anton (OFL), servida con el kit */
  font?: string;
  className?: string;
};

/** huecos de la rejilla para las palabras (los de Plain Sight): [columna, fila desde el centro, vertical] */
const HUECOS: [number, number, boolean][] = [
  [14, 4, false],
  [19, -2, false],
  [32, 4, true],
  [42, 0, true],
];

/**
 * Un suelo de letras en 3D con palabras escondidas a la vista: en reposo son del color del fondo, como todas; con el
 * scroll (o el puntero, o solas) suben, toman su color y proyectan sombra mientras el resto del campo se hunde con
 * rebote, y vuelven en una onda que sale del centro. El puntero hunde y tiñe las letras de alrededor. Concepto, medidas y
 * coreografía de Plain Sight (motion-pieces), estudiado con cine:capture (docs/27). Los colores salen del tema: letras y
 * niebla del fondo, palabras de sus tokens. Sin WebGL o con movimiento reducido, las palabras en plano.
 *
 * Requiere `three` y `@react-three/fiber` (dependencias opcionales del paquete): se importa por subruta, `trama-ui/TypeField`.
 */
export default function TypeField({ words = "ABOUT\nCONTACT\nWORKS\nNEWS", trigger = "scroll", duration = 6, height = 520, render = "auto", font = "/fonts/anton/anton.typeface.json", className = "" }: TypeFieldProps) {
  const root = useRef<HTMLDivElement>(null);
  const tokens = useTokens(root);
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  const { use3d, mounted, near, fail } = useGLGate(root, { want: render === "auto" && !reduced });
  const progreso = useRef(0);

  const lista = useMemo(
    () =>
      words
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .slice(0, HUECOS.length)
        .map((l, i) => {
          const [texto, tono] = l.split("|").map((x) => x.trim());
          return { texto: texto.toUpperCase(), tono: (TYPE_FIELD_TONES as readonly string[]).includes(tono) ? (tono as TypeFieldTone) : i % 2 ? "acc2" : "acc" };
        }),
    [words],
  );

  // las palabras en sus huecos, recortadas para que quepan en la rejilla (56 × 23)
  const palabras = useMemo(
    () =>
      lista.map((p, i) => {
        const [col, fila, vertical] = HUECOS[i];
        const max = vertical ? fila + 11 + 1 : 56 - col;
        return { texto: p.texto.slice(0, max), color: tokens?.[`--${p.tono}`] || "#7cc4ff", celda: [col, fila] as [number, number], vertical };
      }),
    [lista, tokens],
  );

  // el progreso del relato (0–1): lo que dura la pieza en pantalla, el puntero encima o un ciclo de tiempo
  useEffect(() => {
    if (!use3d) return;
    let raf = 0;
    let hover = false;
    const el = root.current;
    const enter = () => (hover = true);
    const leave = () => (hover = false);
    if (trigger === "hover") {
      el?.addEventListener("pointerenter", enter);
      el?.addEventListener("pointerleave", leave);
    }
    const t0 = performance.now();
    const loop = () => {
      if (trigger === "loop") progreso.current = (((performance.now() - t0) / 1000) % duration) / duration;
      else if (trigger === "hover") progreso.current = hover ? 0.5 : 0;
      else if (el) {
        const r = el.getBoundingClientRect();
        progreso.current = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight + r.height)));
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      el?.removeEventListener("pointerenter", enter);
      el?.removeEventListener("pointerleave", leave);
    };
  }, [use3d, trigger, duration]);

  return (
    <div ref={root} className={`ui-tf ${className}`.trim()} style={{ height } as CSSProperties}>
      <p className="ui-sr">{lista.map((p) => p.texto).join(" · ")}</p>
      {!ready && (
        <div className="ui-tf__flat" aria-hidden>
          {lista.map((p) => (
            <span key={p.texto} style={{ color: `var(--${p.tono})` }}>
              {p.texto}
            </span>
          ))}
        </div>
      )}
      {use3d && mounted && (
        <div className={`ui-tf__gl ${ready ? "is-on" : ""}`} aria-hidden>
          <GLBoundary onError={fail}>
            <Suspense fallback={null}>
              <TypeFieldScene
                fuente={font}
                progreso={progreso}
                palabras={palabras}
                fondo={tokens?.["--bg"] || "#e4ddd3"}
                texto={tokens?.["--fg"] || "#2b2622"}
                acento={tokens?.["--acc2"] || tokens?.["--acc"] || "#7c83ff"}
                active={near}
                puntero={!reduced}
                onReady={() => setReady(true)}
              />
            </Suspense>
          </GLBoundary>
        </div>
      )}
    </div>
  );
}
