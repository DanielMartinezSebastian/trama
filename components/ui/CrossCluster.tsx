"use client";

import { Suspense, lazy, useCallback, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { GLBoundary, useGLGate } from "@/lib/ui/gl";
import { useReducedMotion } from "@/lib/ui/useReducedMotion";
import { useTokens } from "@/lib/ui/useTokens";
import { sobreFondo } from "@/lib/ui/color";
import type { PiezaRacimo } from "@/lib/crosscluster/content";

// three (con su WebGPURenderer) y react-three-fiber solo se descargan cuando la pieza está cerca de la pantalla
const CrossClusterScene = lazy(() => import("@/lib/crosscluster/scene"));

export type CrossClusterProps = {
  /** contenido encima de la escena (titular, botones): la pieza hace de fondo */
  children?: ReactNode;
  /** alto en px (o cualquier medida CSS); el ancho es el del contenedor */
  height?: number | string;
  /** cuántas cruces (8–40) */
  count?: number;
  /** colores de las cruces, repartidos por turnos; por defecto, los del tema: acento, texto y texto atenuado */
  colors?: string[];
  /** cuántas son de cristal (refractan lo que tienen detrás), 0–4 */
  glass?: number;
  /** fracción de cruces pulidas (reflejos finos de estudio) frente a mates, 0–1 */
  glossy?: number;
  /** cuánto sigue el racimo al puntero, 0 (nada) – 1 (hasta el puntero); Lusion: 0,35 */
  follow?: number;
  /** false = sin puntero: el racimo flota solo */
  interactive?: boolean;
  /** auto = 3D si el equipo puede y no pide reducir movimiento · static = solo la versión plana */
  render?: "auto" | "static";
  className?: string;
};

/**
 * Un racimo de cruces de plástico que flotan juntas, se empujan y siguen al puntero, sombreadas sin luces ni mapa de
 * entorno: cada píxel calcula de forma analítica la oclusión, la sombra y el reflejo que le dan las demás cruces, sobre
 * un matcap y una sombra propia horneada. Para portadas de estudio, de producto o de marca con un objeto 3D vivo detrás
 * del titular. Concepto, material (traducido de sus shaders), cámara y dinámica medidos en la portada de Lusion con
 * cine:capture y cine:conjunto (docs/31). La física es la del kit (`lib/physics`, sin WebAssembly). Colores del tema:
 * fondo de --card (o del fondo), cruces de acento, texto y atenuado, cristal de --acc2. Sin WebGL o con movimiento
 * reducido, las cruces en plano.
 *
 * Requiere `three` y `@react-three/fiber` (dependencias opcionales del paquete): se importa por subruta, `trama-ui/CrossCluster`.
 */
export default function CrossCluster({ children, height = 520, count = 24, colors, glass = 2, glossy = 0.25, follow = 0.35, interactive = true, render = "auto", className = "" }: CrossClusterProps) {
  const root = useRef<HTMLDivElement>(null);
  const tokens = useTokens(root);
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  const { use3d, mounted, near, fail } = useGLGate(root, { want: render === "auto" && !reduced });
  const onReady = useCallback(() => setReady(true), []);

  const fondo = sobreFondo(tokens?.["--card"], tokens?.["--bg"]) || "#141518";
  const paleta = colors?.length ? colors : [tokens?.["--acc"] || "#061dfb", tokens?.["--fg"] || "#ffffff", tokens?.["--mut"] || "#111111"];
  const tintes = [tokens?.["--acc2"] || "#9da6fd", tokens?.["--fg"] || "#eeeeee"];
  const n = Math.max(8, Math.min(40, Math.round(count)));
  const vidrio = Math.max(0, Math.min(4, Math.round(glass)));
  const piezas = useMemo<PiezaRacimo[]>(() => {
    const out: PiezaRacimo[] = [];
    const opacas = n - vidrio;
    // una de cada 1/glossy pulida, sin que coincida siempre con el mismo color
    const cada = glossy > 0 ? Math.max(1, Math.round(1 / Math.min(1, glossy))) : 0;
    for (let i = 0; i < opacas; i++) out.push({ color: paleta[i % paleta.length], pulida: cada > 0 && Math.floor(i / paleta.length) % cada === cada - 1 });
    for (let i = 0; i < vidrio; i++) out.push({ color: tintes[i % tintes.length], cristal: true });
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n, vidrio, glossy, paleta.join(), tintes.join()]);
  const fisica = useMemo(() => ({ seguir: Math.max(0, Math.min(1, follow)) }), [follow]);

  return (
    <div ref={root} className={`ui-cc ${className}`.trim()} style={{ height, background: fondo } as CSSProperties}>
      {!ready && <Plano piezas={piezas} />}
      {use3d && mounted && (
        <div className={`ui-cc__gl ${ready ? "is-on" : ""}`} aria-hidden>
          <GLBoundary onError={fail}>
            <Suspense fallback={null}>
              <CrossClusterScene piezas={piezas} fondo={fondo} fondoCristal={tokens?.["--bg"] || "#f0f1fa"} fisica={fisica} objetivo={root} interactivo={interactive} active={near} onReady={onReady} />
            </Suspense>
          </GLBoundary>
        </div>
      )}
      {children && <div className="ui-cc__content">{children}</div>}
    </div>
  );
}

/** la versión plana: las cruces como signos más repartidos alrededor del centro, con los mismos colores */
function Plano({ piezas }: { piezas: PiezaRacimo[] }) {
  const puntos = useMemo(() => {
    const g = Math.PI * (3 - Math.sqrt(5));
    return piezas.map((p, i) => {
      const r = Math.sqrt((i + 0.5) / piezas.length) * 34;
      return { x: 50 + Math.cos(i * g) * r * 1.6, y: 50 + Math.sin(i * g) * r, giro: (i * 37) % 90, color: p.color, cristal: p.cristal };
    });
  }, [piezas]);
  return (
    <svg className="ui-cc__flat" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden>
      {puntos.map((p, i) => (
        <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${p.giro})`} opacity={p.cristal ? 0.55 : 1}>
          <rect x={-7} y={-2.2} width={14} height={4.4} rx={1} fill={p.color} />
          <rect x={-2.2} y={-7} width={4.4} height={14} rx={1} fill={p.color} />
        </g>
      ))}
    </svg>
  );
}
