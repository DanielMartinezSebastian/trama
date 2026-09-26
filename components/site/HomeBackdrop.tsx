"use client";

import RetroCanvas from "@/components/ui/RetroCanvas";
import RetroShapes, { type RetroShapesProps } from "@/components/ui/RetroShapes";

/** Lienzo 3D del fondo de la portada (three.js). Lo carga HomeStage después del primer pintado, en su propio fragmento. */
export default function HomeBackdrop({ shape, hero, wide }: { shape: NonNullable<RetroShapesProps["shape"]>; hero: boolean; wide: boolean }) {
  // en la portada la figura se aparta a la derecha del titular
  const offset: [number, number, number] = hero && wide ? [2.4, 0, 0] : [0, 0, 0];
  return (
    <RetroCanvas mode="ascii" ramp="dots" tint="scene" cellSize={6} cellAspect={1.2} scanlines={0.4} scanlineSize={1} scanlineRoll={0.5} vignette={0.5} glow={0.15} flicker={0} glitch={0.03} fov={35} cameraZ={9} pointerFx="parallax" pointerStrength={0.6} interaction="window">
      <group position={offset} scale={hero ? 0.95 : 0.8}>
        <RetroShapes shape={shape} speed={0.7} />
      </group>
    </RetroCanvas>
  );
}
