"use client";

import { Suspense, lazy, useRef, useState, type MutableRefObject } from "react";
import { GLBoundary, useGLGate } from "@/lib/ui/gl";
import { useReducedMotion } from "@/lib/ui/useReducedMotion";
import type { SkullPose } from "./skullScene";

// three y react-three-fiber solo se descargan cuando la calavera está cerca de la pantalla
const SkullScene = lazy(() => import("./skullScene"));

/** La calavera plana (SVG): lo que se ve antes de que cargue el 3D, sin WebGL o con movimiento reducido. */
export function SkullFlat({ className = "" }: { className?: string }) {
  return (
    <svg className={`an-flat ${className}`.trim()} viewBox="-100 -110 200 220" aria-hidden>
      <path d="M0-100c-55 0-88 36-88 82 0 26 10 44 24 56v26c0 10 8 16 18 16h12v-16h10v16h14v-16h10v16h14v-16h10v16h12c10 0 18-6 18-16v-26c14-12 24-30 24-56 0-46-33-82-88-82z" fill="currentColor" opacity="0.92" />
      <ellipse cx="-34" cy="-4" rx="22" ry="20" fill="var(--bg)" />
      <ellipse cx="34" cy="-4" rx="22" ry="20" fill="var(--bg)" />
      <circle cx="-34" cy="-2" r="5" fill="var(--acc)" />
      <circle cx="34" cy="-2" r="5" fill="var(--acc)" />
      <path d="M0 22l-10 18h20z" fill="var(--bg)" />
    </svg>
  );
}

/**
 * El escenario de la calavera de Ánima: primero el dibujo plano y three solo si el equipo puede, no se pide reducir
 * movimiento y está cerca de la pantalla (el mismo patrón que el anillo de Quilate).
 */
export default function SkullStage({ pose, focus, alt, className = "" }: { pose: MutableRefObject<SkullPose>; focus?: MutableRefObject<{ x: number; y: number } | null>; alt: string; className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  const { use3d, mounted, near, fail } = useGLGate(root, { want: !reduced, margin: "200px" });
  return (
    <div ref={root} className={`an-stage ${className}`.trim()} role="img" aria-label={alt}>
      {!ready && <SkullFlat />}
      {use3d && mounted && (
        <div className={`an-stage__gl ${ready ? "is-on" : ""}`}>
          <GLBoundary onError={fail}>
            <Suspense fallback={null}>
              <SkullScene pose={pose} focus={focus} active={near} onReady={() => setReady(true)} />
            </Suspense>
          </GLBoundary>
        </div>
      )}
    </div>
  );
}
