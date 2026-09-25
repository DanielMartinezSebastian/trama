"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { Box3, DoubleSide, Mesh, MeshBasicMaterial, MeshStandardMaterial, Vector3, type Group, type Material, type Object3D } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

export type RetroModelProps = {
  /** URL del modelo: `.glb`, `.gltf` u `.obj` (misma web o con CORS). Se centra y se escala solo */
  src: string;
  /** tamaño final de su dimensión mayor, en unidades de escena (la cámara de `RetroCanvas` ve unas 5 a z = 8) */
  extent?: number;
  /** original = materiales del archivo · clay = gris mate uniforme (lo que mejor se lee como ASCII) · wire = solo aristas */
  material?: "original" | "clay" | "wire";
  /** sombreado facetado en `clay`: marca cada cara, útil en modelos con pocos polígonos */
  flat?: boolean;
  /** giro continuo en vueltas por minuto aprox. (0 = quieto) */
  spin?: number;
  /** eje del giro, en los ejes propios del modelo (tras `rotation`): una turbina o un disco giran sobre z */
  spinAxis?: "x" | "y" | "z";
  /** balanceo suave arriba y abajo */
  float?: boolean;
  /** orientación inicial en grados: «x,y,z» */
  rotation?: string;
  /** luces de ejemplo (clave + relleno + ambiente); desactívalas si la escena ya trae las suyas */
  lights?: boolean;
};

const ext = (src: string) => (src.split("?")[0].split("#")[0].split(".").pop() || "").toLowerCase();

function Model({ src, extent = 4, material = "clay", flat = false, spin = 6, spinAxis = "y", float = true, rotation = "0,0,0" }: RetroModelProps) {
  const isObj = ext(src) === "obj";
  // useLoader cachea por URL: el mismo modelo en varias escenas se descarga una vez
  const loaded = useLoader(isObj ? OBJLoader : GLTFLoader, src) as Object3D | { scene: Object3D };
  const source = "scene" in loaded ? loaded.scene : loaded;
  const spinGroup = useRef<Group>(null);
  const floatGroup = useRef<Group>(null);

  // copia normalizada: centrada en el origen y con su lado mayor = extent
  const object = useMemo(() => {
    const o = source.clone(true);
    const box = new Box3().setFromObject(o);
    const dim = box.getSize(new Vector3());
    const k = extent / (Math.max(dim.x, dim.y, dim.z) || 1);
    const c = box.getCenter(new Vector3());
    o.position.set(-c.x * k, -c.y * k, -c.z * k);
    o.scale.setScalar(k);
    return o;
  }, [source, extent]);

  const override = useMemo<Material | null>(() => {
    if (material === "wire") return new MeshBasicMaterial({ color: "#ffffff", wireframe: true });
    if (material === "clay") return new MeshStandardMaterial({ color: "#d8d8d8", roughness: 0.62, metalness: 0.08, flatShading: flat, side: DoubleSide });
    return null;
  }, [material, flat]);

  useEffect(() => {
    object.traverse((n) => {
      if (!(n instanceof Mesh)) return;
      if (!n.userData.trama) n.userData.trama = { original: n.material };
      if (!n.geometry.attributes.normal) n.geometry.computeVertexNormals(); // OBJ sin normales
      n.material = override ?? n.userData.trama.original;
    });
  }, [object, override]);
  useEffect(() => () => override?.dispose(), [override]);

  const [rx, ry, rz] = rotation.split(",").map((v) => ((Number(v) || 0) * Math.PI) / 180);

  useFrame(({ clock }, dt) => {
    const g = spinGroup.current;
    const f = floatGroup.current;
    if (!g || !f) return;
    g.rotation[spinAxis] += (spin / 60) * Math.PI * 2 * dt;
    f.position.y = float ? Math.sin(clock.elapsedTime * 0.8) * 0.12 : 0;
  });

  return (
    <group ref={floatGroup} rotation={[rx, ry, rz]}>
      <group ref={spinGroup}>
        <primitive object={object} />
      </group>
    </group>
  );
}

/**
 * Modelo 3D (`.glb`, `.gltf` u `.obj`) para `RetroCanvas`: lo carga, lo centra, lo escala a `extent` y, por defecto, le pone un
 * material gris mate («clay»), que es lo que mejor se lee como caracteres o píxeles; `material="original"` conserva el del
 * archivo. Mientras carga no dibuja nada (el lienzo queda con el color de fondo).
 *
 * Requiere `three` y `@react-three/fiber`, como `RetroCanvas`.
 */
export default function RetroModel({ lights = true, ...props }: RetroModelProps) {
  return (
    <>
      {lights && (
        <>
          <ambientLight intensity={0.25} />
          <directionalLight position={[3, 4, 5]} intensity={2.6} />
          <directionalLight position={[-4, -2, 2]} intensity={0.6} />
        </>
      )}
      <Suspense fallback={null}>
        <Model key={props.src} {...props} />
      </Suspense>
    </>
  );
}
