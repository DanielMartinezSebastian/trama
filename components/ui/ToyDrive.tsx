"use client";

import { Suspense, lazy, useCallback, useRef, useState, type CSSProperties } from "react";
import { GLBoundary, useGLGate } from "@/lib/ui/gl";
import { useReducedMotion } from "@/lib/ui/useReducedMotion";
import { useTokens } from "@/lib/ui/useTokens";
import { sobreFondo } from "@/lib/ui/color";

// three y react-three-fiber solo se descargan cuando la pieza está cerca de la pantalla
const ToyDriveScene = lazy(() => import("@/lib/toydrive/scene"));

export type ToyDriveProps = {
  /** la palabra que se derriba: sus letras son objetos con física (hasta 8) */
  word?: string;
  /** alto en px; el ancho es el del contenedor */
  height?: number;
  /** pista de uso; pasa "" para ocultarla */
  hint?: string;
  /** false = escena quieta, sin mandos (se ve, no se conduce) */
  interactive?: boolean;
  /** auto = 3D si el equipo puede y no pide reducir movimiento · static = solo la versión plana */
  render?: "auto" | "static";
  /** fuente en formato typeface de three (JSON); por defecto, Anton (OFL), servida con el kit */
  font?: string;
  /** decorado alrededor: hierba a rodales, árboles, estanques y piedras (procedural, con semilla) */
  scenery?: boolean;
  /** intro de la referencia: un vacío con rejilla oculta el mundo salvo una isla; un clic lo descubre y deja conducir */
  intro?: boolean;
  className?: string;
};

/**
 * Un coche de juguete que se conduce y derriba las letras de una palabra y una pila de cajas, todo con física, visto
 * desde una cámara isométrica que lo persigue: para portadas de juego, de agencia o de producto que quieren que el
 * visitante juegue. Flechas o WASD (con la pieza enfocada), espacio frena, R lo devuelve todo a su sitio; con el ratón o el dedo,
 * mantener pulsado lleva el coche hacia ese punto. Concepto, cámara y dinámica medidos en el portfolio de Bruno Simon
 * con cine:capture (docs/29); la física es la del kit (`lib/physics`, sin WebAssembly). Colores del tema: suelo de
 * --card (o del fondo), coche del acento, letras del texto. Sin WebGL o con movimiento reducido, la palabra en plano.
 *
 * Requiere `three` y `@react-three/fiber` (dependencias opcionales del paquete): se importa por subruta, `trama-ui/ToyDrive`.
 */
export default function ToyDrive({ word = "PLAY", height = 520, hint = "Flechas o WASD para conducir · mantén pulsado para ir hacia un punto · R vuelve", interactive = true, render = "auto", font = "/fonts/anton/anton.typeface.json", scenery = false, intro = false, className = "" }: ToyDriveProps) {
  const root = useRef<HTMLDivElement>(null);
  const tokens = useTokens(root);
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  const { use3d, mounted, near, fail } = useGLGate(root, { want: render === "auto" && !reduced });
  const onReady = useCallback(() => setReady(true), []);
  const palabra = word.toUpperCase().replace(/[^A-Z0-9ÁÉÍÓÚÑ]/g, "").slice(0, 8) || "PLAY";

  const colores = {
    suelo: sobreFondo(tokens?.["--card"], tokens?.["--bg"]) || "#1b1420",
    coche: tokens?.["--acc"] || "#d0262c",
    letras: tokens?.["--fg"] || "#efe9f5",
    cajas: tokens?.["--mut"] || "#a69cb8",
    acento: tokens?.["--acc2"] || "#ff3b3b",
  };

  return (
    <div
      ref={root}
      className={`ui-td ${className}`.trim()}
      style={{ height } as CSSProperties}
      // enfocable para recibir las flechas sin mover la página; al hacer clic se enfoca
      tabIndex={use3d && interactive ? 0 : -1}
      role={use3d && interactive ? "application" : undefined}
      aria-label={use3d && interactive ? `Juego: conduce un coche y derriba la palabra ${palabra}` : undefined}
      onPointerDown={() => root.current?.focus({ preventScroll: true })}
    >
      {!ready && (
        <div className="ui-td__flat" aria-hidden>
          <span>{palabra}</span>
        </div>
      )}
      {use3d && mounted && (
        <div className={`ui-td__gl ${ready ? "is-on" : ""}`} aria-hidden>
          <GLBoundary onError={fail}>
            <Suspense fallback={null}>
              <ToyDriveScene palabra={palabra} colores={colores} fuente={font} objetivo={root} interactivo={interactive} decorado={scenery} intro={intro} active={near} onReady={onReady} />
            </Suspense>
          </GLBoundary>
        </div>
      )}
      {hint && use3d && interactive && ready && <p className="ui-td__hint">{hint}</p>}
    </div>
  );
}
