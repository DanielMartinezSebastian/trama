"use client";

import { Suspense, lazy, useCallback, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { GLBoundary, useGLGate } from "@/lib/ui/gl";
import { useReducedMotion } from "@/lib/ui/useReducedMotion";
import { useTokens } from "@/lib/ui/useTokens";

// three (con su WebGPURenderer) y react-three-fiber solo se descargan cuando la pieza está cerca de la pantalla
const PortholeScene = lazy(() => import("@/lib/porthole/scene"));

export const PORTHOLE_TONES = ["acc", "acc2", "fg", "mut"] as const;
export type PortholeTone = (typeof PORTHOLE_TONES)[number];

export type PortholeProps = {
  /** contenido encima de la escena (titular, botones): la pieza hace de fondo */
  children?: ReactNode;
  /** alto en px (o cualquier medida CSS); el ancho es el del contenedor */
  height?: number | string;
  /** arrastrar saca la cámara por la ventanilla (y otro arrastre la devuelve); false = solo se asoma con el puntero */
  interactive?: boolean;
  /** token del tema para la librea (la punta del ala) */
  livery?: PortholeTone;
  /** densidad de las ciudades del suelo, 0–1 */
  cities?: number;
  /** pista de uso (abajo); pasa "" para ocultarla */
  hint?: string;
  /** auto = 3D si el equipo puede y no pide reducir movimiento · static = solo la versión plana */
  render?: "auto" | "static";
  /** avisa al salir (true) o volver (false) por la ventanilla */
  onChange?: (outside: boolean) => void;
  className?: string;
};

/**
 * La vista desde la ventanilla de un avión al alba, para fondos de portada: cielo, horizonte con su resplandor, ciudades y
 * ríos en el suelo, estrellas y el ala con su librea, todo procedural (sin modelos ni texturas). La cámara se asoma hacia
 * el puntero y, al arrastrar, sale por la ventanilla. Concepto, cámara y cielo medidos en Hublot (darkroom.engineering)
 * con cine:capture (docs/28). La escena es fotográfica (sus colores son los del cielo); el tema pone la librea. Sin WebGL o
 * con movimiento reducido, el cielo plano enmarcado por la ventanilla.
 *
 * Requiere `three` y `@react-three/fiber` (dependencias opcionales del paquete): se importa por subruta, `trama-ui/Porthole`.
 */
export default function Porthole({ children, height = 560, interactive = true, livery = "acc", cities = 0.35, hint = "Arrastra para salir por la ventanilla", render = "auto", onChange, className = "" }: PortholeProps) {
  const root = useRef<HTMLDivElement>(null);
  const tokens = useTokens(root);
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [outside, setOutside] = useState(false);
  const { use3d, mounted, near, fail } = useGLGate(root, { want: render === "auto" && !reduced });
  const onReady = useCallback(() => setReady(true), []);
  const onCambio = useCallback(
    (f: boolean) => {
      setOutside(f);
      onChange?.(f);
    },
    [onChange],
  );

  return (
    <div ref={root} className={`ui-ph ${outside ? "is-out" : ""} ${className}`.trim()} style={{ height } as CSSProperties}>
      {!ready && (
        <div className="ui-ph__flat" aria-hidden>
          <div className="ui-ph__window" />
        </div>
      )}
      {use3d && mounted && (
        <div className={`ui-ph__gl ${ready ? "is-on" : ""}`} aria-hidden>
          <GLBoundary onError={fail}>
            <Suspense fallback={null}>
              <PortholeScene librea={tokens?.[`--${livery}`] || "#c0161b"} ciudades={cities} objetivo={root} interactivo={interactive} active={near} onCambio={onCambio} onReady={onReady} />
            </Suspense>
          </GLBoundary>
        </div>
      )}
      {children && <div className="ui-ph__content">{children}</div>}
      {hint && use3d && interactive && ready && <p className="ui-ph__hint">{hint}</p>}
    </div>
  );
}
