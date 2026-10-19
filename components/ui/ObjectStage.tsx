"use client";

import { Suspense, lazy, useEffect, useRef, useState, type CSSProperties } from "react";
import type { ObjectMaterial, ObjectShape } from "@/lib/object3d/scene";
import { GLBoundary, useGLGate } from "@/lib/ui/gl";
import { useReducedMotion } from "@/lib/ui/useReducedMotion";
import { useTokens } from "@/lib/ui/useTokens";
import { tcls, type Tone } from "./variants";

// three, react-three-fiber y el entorno de reflejos solo se descargan cuando el objeto está cerca de la pantalla
const ObjectScene = lazy(() => import("@/lib/object3d/scene"));

export const OBJECT_SHAPE_LIST = ["knot", "sphere", "torus", "capsule", "gem"] as const;
export const OBJECT_MATERIAL_LIST = ["metal", "glass", "gloss", "matte"] as const;

export type ObjectStageProps = {
  /** forma del objeto */
  shape?: ObjectShape;
  /** metal · glass (vidrio con refracción) · gloss (plástico barnizado) · matte (mate) */
  material?: ObjectMaterial;
  /** token del color del objeto */
  tone?: Tone;
  /** spin = gira · float = flota y se mece · pointer = sigue al puntero · none = quieto */
  motion?: "spin" | "float" | "pointer" | "none";
  /** multiplicador de velocidad (1 = normal) */
  speed?: number;
  /** alto en px; el ancho es el del contenedor */
  height?: number;
  /** auto = 3D si el equipo puede y no pide reducir movimiento · static = solo la imagen plana */
  render?: "auto" | "static";
  /** descripción para lectores de pantalla. Vacío = decorativo */
  alt?: string;
  className?: string;
};

/**
 * Un objeto 3D con materiales físicos (metal, vidrio, plástico barnizado, mate) y reflejos de estudio, sin cargar
 * ningún HDR (usa `RoomEnvironment` de three). Para fondos de hero, secciones de producto y detalles; el color sale de los
 * tokens del tema. Mientras carga, y siempre que el equipo no pueda o pida reducir movimiento, se pinta una esfera plana
 * con degradado del mismo color. Decorativo por defecto (no recibe eventos).
 *
 * Requiere `three` y `@react-three/fiber` (dependencias opcionales del paquete): se importa por subruta, `trama-ui/ObjectStage`.
 */
export default function ObjectStage({ shape = "knot", material = "metal", tone = "acc", motion = "pointer", speed = 1, height = 320, render = "auto", alt = "", className = "" }: ObjectStageProps) {
  const root = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const tokens = useTokens(root);
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  const { use3d, mounted, near, fail } = useGLGate(root, { want: render === "auto" && !reduced });

  // el puntero se normaliza respecto al centro del elemento, aunque esté fuera de él (el objeto «mira» al cursor)
  useEffect(() => {
    if (!use3d || motion !== "pointer") return;
    const on = (e: PointerEvent) => {
      const r = root.current?.getBoundingClientRect();
      if (!r) return;
      pointer.current.x = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / Math.max(240, r.width)));
      pointer.current.y = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / Math.max(240, r.height)));
    };
    window.addEventListener("pointermove", on, { passive: true });
    return () => window.removeEventListener("pointermove", on);
  }, [use3d, motion]);

  const color = tokens?.[`--${tone}`] || "#7cc4ff";
  return (
    <div
      ref={root}
      className={`ui-obj ${tcls(tone)} ${className}`.trim()}
      style={{ height, "--obj-color": color } as CSSProperties}
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
    >
      {!ready && <div className="ui-obj__flat" />}
      {use3d && mounted && (
        <div className={`ui-obj__gl ${ready ? "is-on" : ""}`}>
          <GLBoundary onError={fail}>
            <Suspense fallback={null}>
              <ObjectScene shape={shape} material={material} color={color} motion={motion} speed={speed} pointer={pointer} active={near} onReady={() => setReady(true)} />
            </Suspense>
          </GLBoundary>
        </div>
      )}
    </div>
  );
}
