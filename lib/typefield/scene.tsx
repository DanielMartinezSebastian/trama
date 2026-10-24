"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo, type RefObject } from "react";
import { Color, NeutralToneMapping, PCFShadowMap, Vector3, type PerspectiveCamera } from "three";
import TypeFieldMesh, { type PalabraCampo } from "./field";

/*
 * Escena de `TypeField`: el campo tipográfico con la cámara, las luces, la sombra y la niebla medidas en Plain Sight
 * (docs/27): cámara picada con alabeo, luz de cielo desde +z, sol con sombra PCF de 2048 y caja de ±15,6, niebla lineal del
 * color del fondo y tone mapping Neutral. Los colores salen del tema: letras y niebla del fondo (las palabras están
 * escondidas a la vista), palabras de sus tokens.
 */

export type TypeFieldSceneProps = {
  fuente: string;
  /** progreso 0–1 del relato (lo escribe el componente) */
  progreso: RefObject<number>;
  palabras: PalabraCampo[];
  /** colores CSS ya resueltos desde los tokens: fondo (letras y niebla), texto (el suelo del cielo) y acento (el puntero) */
  fondo: string;
  texto: string;
  acento: string;
  /** false = fuera de pantalla: el lienzo no dibuja */
  active: boolean;
  /** con movimiento reducido: sin puntero */
  puntero: boolean;
  onReady: () => void;
};

/** cámara medida en Plain Sight: posición, punto mirado y alabeo (el horizonte inclinado 14°) */
function Camara() {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  useLayoutEffect(() => {
    camera.position.set(-2.4481, -11.5174, 17.4567);
    camera.lookAt(new Vector3(0.316, 1.482, -2.244));
    camera.rotateZ((-14.39 * Math.PI) / 180);
    camera.updateProjectionMatrix();
  }, [camera]);
  return null;
}

export default function TypeFieldScene({ fuente, progreso, palabras, fondo, texto, acento, active, puntero, onReady }: TypeFieldSceneProps) {
  const coarse = typeof matchMedia !== "undefined" && matchMedia("(pointer: coarse)").matches;
  // las letras, un pelo más claras que el fondo (como en la referencia: #e9e2d8 sobre #e4ddd3)
  const letra = useMemo(() => "#" + new Color(fondo).lerp(new Color("#ffffff"), 0.06).getHexString(), [fondo]);
  // el «suelo» de la luz de cielo: el fondo hacia el texto (#8c8177 sobre crema en la referencia)
  const sombra = useMemo(() => "#" + new Color(fondo).lerp(new Color(texto), 0.45).getHexString(), [fondo, texto]);
  // el tinte del puntero: un velo del acento sobre el fondo (lavanda en la referencia)
  const tinte = useMemo(() => "#" + new Color(fondo).lerp(new Color(acento), 0.22).getHexString(), [fondo, acento]);
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, coarse ? 1.5 : 2]}
      shadows={{ type: PCFShadowMap }}
      gl={{ antialias: true }}
      // R3F pone ACES después de crear el renderer: Neutral va aquí (docs/26 §7)
      onCreated={({ gl }) => (gl.toneMapping = NeutralToneMapping)}
      camera={{ fov: 28, near: 1, far: 400 }}
    >
      <color attach="background" args={[fondo]} />
      <fog attach="fog" args={[fondo, 20.64, 29.9]} />
      <Camara />
      <hemisphereLight args={["#ffffff", sombra, 1.6]} position={[0, 0, 1]} />
      <directionalLight
        position={[-9, 7, 11]}
        intensity={2.4}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-radius={3}
        shadow-camera-left={-15.6}
        shadow-camera-right={15.6}
        shadow-camera-top={15.6}
        shadow-camera-bottom={-15.6}
        shadow-camera-near={0.5}
        shadow-camera-far={80}
      />
      <TypeFieldMesh
        fuente={fuente}
        progreso={progreso}
        palabras={palabras}
        color={letra}
        tramo={[0.12, 0.3, 0.7, 0.88]}
        muelle={[0.018, 0.075]}
        muelleVuelta={[0.018, 0.27]}
        onda={{ origen: [0, 0], retraso: 0.0035 }}
        puntero={puntero ? { radio: 4.2, hundir: 0.27, tinte } : null}
        onReady={onReady}
      />
    </Canvas>
  );
}
