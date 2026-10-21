"use client";

import { Suspense, useRef, type MutableRefObject, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { ModelNavPointerContext, type ModelNavPointer } from "./pointer";

/** El modelo se inclina hacia el puntero (con retraso) y respira un poco; `follow` en radianes. */
function Lean({ pointer, follow, children }: { pointer: MutableRefObject<ModelNavPointer>; follow: number; children: ReactNode }) {
  const g = useRef<Group>(null);
  useFrame((state, dt) => {
    const o = g.current;
    if (!o) return;
    const p = pointer.current, k = Math.min(1, dt * 5), t = state.clock.elapsedTime;
    o.rotation.y += (p.x * follow + Math.sin(t * 0.6) * 0.05 - o.rotation.y) * k;
    o.rotation.x += (-p.y * follow * 0.6 - o.rotation.x) * k;
    o.position.y = Math.sin(t * 1.1) * 0.02;
  });
  return <group ref={g}>{children}</group>;
}

/** El lienzo del medallón de `ModelNav` (se carga aparte: three solo baja cuando hay modelo). */
export default function ModelNavScene({ pointer, follow, active, children }: { pointer: MutableRefObject<ModelNavPointer>; follow: number; active: boolean; children: ReactNode }) {
  return (
    <Canvas frameloop={active ? "always" : "never"} dpr={[1, 2]} gl={{ alpha: true, antialias: true }} camera={{ fov: 30, position: [0, 0, 4.2], near: 0.1, far: 30 }} style={{ pointerEvents: "none" }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 3, 4]} intensity={1.6} />
      <directionalLight position={[-3, -1, 2]} intensity={0.4} color="#9fb6ff" />
      <ModelNavPointerContext.Provider value={pointer}>
        <Lean pointer={pointer} follow={follow}>
          <Suspense fallback={null}>{children}</Suspense>
        </Lean>
      </ModelNavPointerContext.Provider>
    </Canvas>
  );
}
