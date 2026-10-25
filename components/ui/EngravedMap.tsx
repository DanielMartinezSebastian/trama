"use client";

import { Suspense, lazy, useCallback, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { GLBoundary, useGLGate } from "@/lib/ui/gl";
import { useReducedMotion } from "@/lib/ui/useReducedMotion";
import { useTokens } from "@/lib/ui/useTokens";
import { sobreFondo } from "@/lib/ui/color";

// three (con su WebGPURenderer) y react-three-fiber solo se descargan cuando la pieza está cerca de la pantalla
const EngravedMapScene = lazy(() => import("@/lib/gravure/scene"));

export type EngravedMapProps = {
  /** contenido encima de la escena (titular, botones): la pieza hace de fondo */
  children?: ReactNode;
  /** alto en px (o cualquier medida CSS); el ancho es el del contenedor */
  height?: number | string;
  /** semilla del paisaje: otra semilla, otro pueblo y otras parcelas */
  seed?: number;
  /** duración del vuelo de entrada en segundos; 0 = sin vuelo */
  intro?: number;
  /** false = sin paralaje con el puntero ni giro al arrastrar */
  interactive?: boolean;
  /** auto = 3D si el equipo puede y no pide reducir movimiento · static = solo la versión plana */
  render?: "auto" | "static";
  className?: string;
};

/**
 * Un paisaje de viñas y pueblo dibujado como un grabado a lápiz sobre papel: parcelas con surcos en direcciones
 * distintas y caminos en blanco, casas con tejado a dos aguas y árboles con su contorno, con un vuelo de entrada que baja
 * desde el horizonte, una bandada de pájaros, un leve paralaje con el puntero y la vista que gira al arrastrar (con
 * inercia). Para portadas de bodegas, territorio, turismo, editoriales o cualquier marca que quiera un 3D que no parezca
 * 3D. Técnica, parámetros y cámara medidos en la portada de
 * Chartogne-Taillet con cine:capture (docs/32): la escena no pinta colores sino normal, lápiz y cercanía, y una pasada final
 * pone papel, lápiz y contornos de Sobel. Colores del tema: papel de --card (o del fondo) y lápiz de --mut. Sin WebGL o
 * con movimiento reducido, un rayado plano.
 *
 * Requiere `three` y `@react-three/fiber` (dependencias opcionales del paquete): se importa por subruta, `trama-ui/EngravedMap`.
 */
export default function EngravedMap({ children, height = 560, seed = 3, intro = 3, interactive = true, render = "auto", className = "" }: EngravedMapProps) {
  const root = useRef<HTMLDivElement>(null);
  const tokens = useTokens(root);
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  const { use3d, mounted, near, fail } = useGLGate(root, { want: render === "auto" && !reduced });
  const onReady = useCallback(() => setReady(true), []);

  const papel = sobreFondo(tokens?.["--card"], tokens?.["--bg"]) || "#fff5dd";
  const lapiz = tokens?.["--mut"] || "#8c887d";
  const grabado = useMemo(() => ({ papel, lapiz }), [papel, lapiz]);
  const paisaje = useMemo(() => ({ semilla: seed }), [seed]);

  return (
    <div ref={root} className={`ui-em ${className}`.trim()} style={{ height, "--em-paper": papel, "--em-pencil": lapiz } as CSSProperties}>
      {!ready && <div className="ui-em__flat" aria-hidden />}
      {use3d && mounted && (
        <div className={`ui-em__gl ${ready ? "is-on" : ""}`} aria-hidden>
          <GLBoundary onError={fail}>
            <Suspense fallback={null}>
              <EngravedMapScene grabado={grabado} paisaje={paisaje} entrada={reduced ? 0 : intro} objetivo={interactive ? root : null} active={near} onReady={onReady} />
            </Suspense>
          </GLBoundary>
        </div>
      )}
      {children && <div className="ui-em__content">{children}</div>}
    </div>
  );
}
