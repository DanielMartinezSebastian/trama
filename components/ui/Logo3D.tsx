"use client";

import { Component, Suspense, lazy, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { hasWebGL, lowPower } from "@/lib/ui/capability";
import { useReducedMotion } from "@/lib/ui/useReducedMotion";
import { useTokens } from "@/lib/ui/useTokens";
import type { RetroFXProps } from "./RetroFX";
import { tcls, type Tone } from "./variants";

// three, react-three-fiber y el filtro retro solo se descargan cuando de verdad se va a dibujar en 3D
const LogoScene = lazy(() => import("@/lib/logo3d/scene"));

export const LOGO3D_STYLES = ["solid", "wire", "ascii", "pixel", "both"] as const;
export const LOGO3D_MOTIONS = ["spin", "sway", "float", "pointer", "none"] as const;

/** del filtro retro del kit (`RetroFX`): solo actúan con `renderStyle` ascii, pixel o both */
type FxProps = Pick<RetroFXProps, "tint" | "ramp" | "chars" | "cellSize" | "pixelSize" | "levels" | "dither" | "ditherPattern" | "contrast" | "invert" | "scanlines" | "glow" | "curvature" | "vignette" | "flicker" | "glitch" | "aberration" | "noise">;

export type Logo3DProps = FxProps & {
  /** trazado SVG de la marca (atributo `d`; admite varios subtrazados). Por defecto, «< >» */
  path?: string;
  /** `viewBox` del SVG del que sale `path` */
  viewBox?: string;
  /** > 0: `path` es una línea de ese grosor, con extremos y uniones redondos · 0: `path` es una forma rellena */
  strokeWidth?: number;
  /** fondo de la extrusión, en unidades del `viewBox` */
  depth?: number;
  /** bisel de las aristas, en unidades del `viewBox` (0 = aristas vivas) */
  bevel?: number;
  /** none = solo la marca · plate = sobre una placa de esquinas redondas · ring = dentro de un aro */
  base?: "none" | "plate" | "ring";
  /** solid = material con luz · wire = malla de alambre · ascii = caracteres · pixel = pixel art con dither · both = caracteres sobre pixel art */
  renderStyle?: (typeof LOGO3D_STYLES)[number];
  /** token del color de la marca (y de los caracteres, con `tint="mono"`) */
  tone?: Tone;
  /** token del color de la base (placa o aro) y del acento de `tint="gradient"` */
  baseTone?: Tone;
  /** spin = gira sin parar · sway = se balancea · float = flota · pointer = sigue al puntero · none = quieto */
  motion?: (typeof LOGO3D_MOTIONS)[number];
  /** eje del giro y del balanceo */
  axis?: "x" | "y" | "z";
  /** multiplicador de la velocidad (1 = normal; negativo = al revés) */
  speed?: number;
  /** inclinación en grados (positivo = visto desde arriba) */
  tilt?: number;
  /** deja girarlo arrastrando, con inercia. Por defecto no: es decorativo y no recibe toques */
  draggable?: boolean;
  /** detiene el movimiento sin desmontar nada */
  paused?: boolean;
  /** alto en px; el ancho es el del contenedor */
  height?: number;
  /** fotogramas por segundo (0 = los de la pantalla) */
  fps?: number;
  /** auto = 3D si el equipo puede y no pide reducir movimiento; si no, la marca plana · 3d = siempre 3D (si hay WebGL) · static = la marca plana, sin WebGL */
  render?: "auto" | "3d" | "static";
  /** descripción para lectores de pantalla. Vacío = decorativo */
  alt?: string;
  className?: string;
};

/** si el lienzo falla (sin WebGL, contexto perdido al crear), se queda la marca plana */
class Boundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

const CHEVRONS = "M78 62 44 96l34 34M114 62l34 34-34 34";

/**
 * La marca como objeto 3D: un trazado SVG extruido que gira, se balancea o sigue al puntero, pintado como sólido, malla de
 * alambre, caracteres ASCII o pixel art con el mismo filtro que `RetroCanvas`. Rellena el ancho de su contenedor con el alto
 * `height`. Mientras carga, y siempre que el equipo no pueda o pida reducir movimiento, pinta la marca plana en SVG.
 * Decorativo por defecto: no recibe eventos salvo con `draggable`.
 *
 * Requiere `three` y `@react-three/fiber` (dependencias opcionales del paquete): se importa por subruta, `trama-ui/Logo3D`.
 * Para un logo redondo sin WebGL, `LogoCoin`.
 */
export default function Logo3D({
  path = CHEVRONS,
  viewBox = "0 0 192 192",
  strokeWidth = 16,
  depth = 22,
  bevel = 3,
  base = "none",
  renderStyle = "ascii",
  tone = "fg",
  baseTone = "acc",
  motion = "spin",
  axis = "y",
  speed = 1,
  tilt = 8,
  draggable = false,
  paused = false,
  height = 160,
  fps = 30,
  render = "auto",
  alt = "",
  className = "",
  tint = "mono",
  ramp = "classic",
  chars = "",
  cellSize = 6,
  pixelSize = 4,
  levels = 4,
  dither = 0.6,
  ditherPattern = "bayer",
  contrast = 1.25,
  invert = false,
  scanlines = 0.2,
  glow = 0,
  curvature = 0,
  vignette = 0,
  flicker = 0,
  glitch = 0,
  aberration = 0,
  noise = 0,
}: Logo3DProps) {
  const root = useRef<HTMLDivElement>(null);
  const flat = useRef<SVGSVGElement>(null);
  const tokens = useTokens(root);
  const reduced = useReducedMotion();
  const [capable, setCapable] = useState<boolean | null>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [near, setNear] = useState(false);
  const [mounted, setMounted] = useState(false);

  const want3d = render === "3d" || (render === "auto" && !reduced);
  const use3d = want3d && capable === true && !failed;

  useEffect(() => {
    if (want3d) setCapable(hasWebGL() && (render === "3d" || !lowPower()));
  }, [want3d, render]);

  // el lienzo se crea al acercarse a la pantalla y deja de dibujar al alejarse o al ocultarse su contenedor
  useEffect(() => {
    const el = root.current;
    if (!el || !use3d) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setNear(e.isIntersecting);
        if (e.isIntersecting) setMounted(true);
      },
      { rootMargin: "120px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [use3d]);

  // La marca plana se encuadra a su trazado, como hace la escena 3D: así las dos miden lo mismo aunque el viewBox tenga aire
  useEffect(() => {
    const svg = flat.current;
    const mark = svg?.querySelector("path");
    if (!svg || !mark) return;
    const b = mark.getBBox();
    const pad = strokeWidth / 2;
    if (b.width > 0 && b.height > 0) svg.setAttribute("viewBox", `${b.x - pad} ${b.y - pad} ${b.width + pad * 2} ${b.height + pad * 2}`);
  }, [path, viewBox, strokeWidth]);

  const quiet = reduced || paused;
  const hand = draggable && use3d && !reduced;
  const show3d = use3d && mounted;
  const stroke = strokeWidth > 0;

  return (
    <div ref={root} className={`ui-logo3d ${tcls(tone)} ${hand ? "is-hand" : ""} ${className}`} style={{ height } as CSSProperties} role={alt ? "img" : undefined} aria-label={alt || undefined} aria-hidden={alt ? undefined : true}>
      {/* la marca plana: se ve mientras llegan three y el primer fotograma, y se queda si no hay 3D */}
      {!(show3d && ready) && (
        <svg ref={flat} className="ui-logo3d__flat" viewBox={viewBox} aria-hidden>
          <path d={path} fill={stroke ? "none" : "currentColor"} stroke={stroke ? "currentColor" : "none"} strokeWidth={stroke ? strokeWidth : undefined} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {show3d && (
        <div className={`ui-logo3d__gl${ready ? "" : " is-loading"}`}>
          <Boundary onError={() => setFailed(true)}>
            <Suspense fallback={null}>
              <LogoScene
                path={path}
                viewBox={viewBox}
                strokeWidth={strokeWidth}
                depth={depth}
                bevel={bevel}
                base={base}
                renderStyle={renderStyle}
                fx={{ tint, ramp, chars, cellSize, pixelSize, levels, dither, ditherPattern, contrast, invert, scanlines, glow, curvature, vignette, flicker, glitch, aberration, noise, fg: tokens?.[`--${tone}`] || undefined, bg: tokens?.["--bg"] || undefined, accent: tokens?.[`--${baseTone}`] || undefined }}
                color={tokens?.[`--${tone}`] || "#e8ecf4"}
                baseColor={tokens?.[`--${baseTone}`] || "#7cc4ff"}
                motion={quiet ? "none" : motion}
                axis={axis}
                speed={speed}
                tilt={tilt}
                draggable={hand}
                fps={fps}
                active={near}
                root={root}
                onReady={() => setReady(true)}
              />
            </Suspense>
          </Boundary>
        </div>
      )}
    </div>
  );
}
