"use client";

import { Suspense, lazy, useEffect, useRef, useState } from "react";
import type { DistortPointer } from "@/lib/distort/scene";
import { hasWebGL, lowPower } from "@/lib/ui/capability";
import { GLBoundary } from "@/lib/ui/gl";
import { useReducedMotion } from "@/lib/ui/useReducedMotion";

// three y react-three-fiber solo se descargan cuando el puntero entra por primera vez
const DistortScene = lazy(() => import("@/lib/distort/scene"));

export const DISTORT_EFFECTS = ["ripple", "liquid", "rgb", "lens"] as const;

export type DistortImageProps = {
  src: string;
  /** texto alternativo (vacío = decorativa) */
  alt?: string;
  /** relación de aspecto «ancho / alto» del recuadro */
  ratio?: string;
  /** ripple = ondas desde el puntero · liquid = desplazamiento orgánico · rgb = separación de canales · lens = lupa */
  effect?: (typeof DISTORT_EFFECTS)[number];
  /** intensidad (1 = normal) */
  strength?: number;
  /** radio de influencia del puntero, en fracción del alto (0,1–1) */
  radius?: number;
  className?: string;
};

/**
 * Imagen que se deforma con un shader alrededor del puntero (ondas, líquido, separación RGB o lupa).
 * Se pinta siempre como `<img>` normal; el lienzo WebGL se crea solo al pasar el puntero (o enfocar) y se destruye al
 * apagarse el efecto, así que una rejilla de muchas imágenes no agota los contextos de WebGL. Sin WebGL, en táctil, en
 * equipos modestos o con `prefers-reduced-motion` se queda la imagen plana.
 *
 * Requiere `three` y `@react-three/fiber` (dependencias opcionales del paquete): se importa por subruta, `trama-ui/DistortImage`.
 */
export default function DistortImage({ src, alt = "", ratio = "4 / 5", effect = "ripple", strength = 1, radius = 0.45, className = "" }: DistortImageProps) {
  const root = useRef<HTMLDivElement>(null);
  const pointer = useRef<DistortPointer>({ x: 0.5, y: 0.5, target: 0 });
  const reduced = useReducedMotion();
  const [capable, setCapable] = useState(false);
  const [gl, setGl] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    setCapable(fine && hasWebGL() && !lowPower());
  }, []);

  const on = capable && !reduced;
  const aim = (e: { clientX: number; clientY: number }) => {
    const r = root.current?.getBoundingClientRect();
    if (!r) return;
    pointer.current.x = (e.clientX - r.left) / r.width;
    pointer.current.y = 1 - (e.clientY - r.top) / r.height;
  };
  const enter = (e: React.PointerEvent) => {
    if (!on || e.pointerType !== "mouse") return;
    aim(e);
    pointer.current.target = 1;
    setGl(true);
  };
  const leave = () => {
    pointer.current.target = 0;
  };

  return (
    <div
      ref={root}
      className={`ui-dimg ${className}`.trim()}
      style={{ aspectRatio: ratio }}
      onPointerEnter={enter}
      onPointerMove={(e) => on && e.pointerType === "mouse" && aim(e)}
      onPointerLeave={leave}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="ui-dimg__img" src={src} alt={alt} loading="lazy" decoding="async" />
      {gl && (
        <div className={`ui-dimg__gl ${ready ? "is-on" : ""}`}>
          <GLBoundary onError={() => { setGl(false); setCapable(false); }}>
            <Suspense fallback={null}>
              <DistortScene
                src={src}
                effect={effect}
                strength={strength}
                radius={radius}
                pointer={pointer}
                onReady={() => setReady(true)}
                onIdle={() => { setGl(false); setReady(false); }}
              />
            </Suspense>
          </GLBoundary>
        </div>
      )}
    </div>
  );
}
