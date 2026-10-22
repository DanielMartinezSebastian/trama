"use client";

import { Suspense, lazy, useEffect, useRef, type ReactNode } from "react";
import { GLBoundary, useGLGate } from "@/lib/ui/gl";
import { useReducedMotion } from "@/lib/ui/useReducedMotion";
import type { ModelNavPointer } from "@/lib/modelnav/pointer";
import IslandNav, { type IslandNavProps } from "./IslandNav";

export { useModelNavPointer } from "@/lib/modelnav/pointer";

// three y react-three-fiber solo se descargan cuando hay un modelo que dibujar
const ModelNavScene = lazy(() => import("@/lib/modelnav/scene"));

export type ModelNavProps = IslandNavProps & {
  /**
   * Contenido de react-three-fiber (una malla, un `useGLTF`…) que va en el medallón del centro, en lugar de la marca. Sin él
   * (p. ej. en la portada, si allí ya hay un 3D grande), la isla enseña `brand`. La marca sigue siendo el enlace (el medallón
   * no recibe clics) y el nombre accesible.
   */
  model?: ReactNode;
  /**
   * En lugar de `model`, cualquier nodo DOM dentro del medallón: p. ej. un `TravelSlot` para que un `Traveler` (un modelo 3D
   * que vive en el layout y viaja entre rutas) se coloque en el navbar. El medallón no dibuja nada propio.
   */
  emblem?: ReactNode;
  /** clave del modelo: al cambiar, el medallón vuelve a entrar con su animación */
  modelKey?: string;
  /** diámetro del medallón en px (sobresale de la isla por arriba y por abajo) */
  emblemSize?: number;
  /** cuánto se inclina hacia el puntero (radianes) */
  follow?: number;
};

/**
 * Navegación «isla» con un **modelo 3D acoplado en el centro**: un medallón de vidrio que sobresale de la píldora y lleva una
 * escena de react-three-fiber. El modelo se inclina hacia el puntero; con `useModelNavPointer()` (dentro del modelo) sabe
 * además dónde está y lo cerca que pasa, para reaccionar a su manera. Sin modelo es una `IslandNav` normal. Sin WebGL o con
 * movimiento reducido, se ve la marca. Hereda todas las props de `IslandNav`.
 */
export default function ModelNav({ model, emblem: emblemNode, modelKey = "model", emblemSize = 84, follow = 0.45, brand, className = "", ...nav }: ModelNavProps) {
  const reduced = useReducedMotion();
  const emblem = useRef<HTMLSpanElement>(null);
  const pointer = useRef<ModelNavPointer>({ x: 0, y: 0, near: 0 });
  const { use3d, mounted, near, fail } = useGLGate(emblem, { want: !!model && !reduced, margin: "0px", optimistic: true });
  const on = (!!model && use3d) || !!emblemNode;

  useEffect(() => {
    if (!on || !model) return;
    const move = (e: PointerEvent) => {
      const r = emblem.current?.getBoundingClientRect();
      if (!r) return;
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const dx = e.clientX - cx, dy = e.clientY - cy;
      pointer.current.x = Math.max(-1, Math.min(1, dx / (innerWidth / 2)));
      pointer.current.y = Math.max(-1, Math.min(1, -dy / (innerHeight / 2)));
      pointer.current.near = Math.max(0, Math.min(1, 1 - (Math.hypot(dx, dy) - r.width / 2) / 180));
    };
    addEventListener("pointermove", move, { passive: true });
    return () => removeEventListener("pointermove", move);
  }, [on, model]);

  return (
    <IslandNav
      {...nav}
      className={`ui-mnav ${className}`.trim()}
      brand={
        <span className="ui-mnav__c" data-model={on ? "" : undefined} style={{ ["--mnav-size" as string]: `${emblemSize}px` }}>
          <span className="ui-mnav__brand">{brand}</span>
          {emblemNode && (
            <span key={modelKey} className="ui-mnav__emblem ui-mnav__emblem--slot">
              {emblemNode}
            </span>
          )}
          {model && !emblemNode && (
            <span ref={emblem} key={modelKey} className="ui-mnav__emblem" aria-hidden>
              {on && mounted && (
                <GLBoundary onError={fail}>
                  <Suspense fallback={null}>
                    <ModelNavScene pointer={pointer} follow={follow} active={near}>
                      {model}
                    </ModelNavScene>
                  </Suspense>
                </GLBoundary>
              )}
            </span>
          )}
        </span>
      }
    />
  );
}
