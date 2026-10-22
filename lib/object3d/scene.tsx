"use client";

import { Suspense, useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { Box3, CapsuleGeometry, Color, IcosahedronGeometry, MeshPhysicalMaterial, PMREMGenerator, SphereGeometry, TorusGeometry, TorusKnotGeometry, Vector3, type BufferGeometry, type Group, type Mesh, type Object3D } from "three";

export const OBJECT_SHAPES = ["knot", "sphere", "torus", "capsule", "gem"] as const;
export const OBJECT_MATERIALS = ["metal", "glass", "gloss", "matte"] as const;
export type ObjectShape = (typeof OBJECT_SHAPES)[number];
export type ObjectMaterial = (typeof OBJECT_MATERIALS)[number];

export type ObjectSceneProps = {
  shape: ObjectShape;
  material: ObjectMaterial;
  /** color CSS ya resuelto desde los tokens */
  color: string;
  motion: "spin" | "float" | "pointer" | "none";
  speed: number;
  /** puntero normalizado −1…1 respecto al centro del elemento (lo actualiza el componente) */
  pointer: MutableRefObject<{ x: number; y: number }>;
  /** false = fuera de pantalla: el lienzo no dibuja */
  active: boolean;
  onReady: () => void;
  /** un modelo GLB (sin Draco: la CSP no deja compilar WebAssembly; cuantizado sí) en lugar de la forma: con sus materiales, encuadrado al lienzo */
  src?: string;
  /** giro inicial del modelo en grados «x,y,z» (para que su cara frontal mire a la cámara) */
  modelRotation?: string;
  /** cuánto gira hacia el puntero, en radianes (con `motion="pointer"`) */
  follow?: number;
  /** color CSS de una luz delante del objeto (vacío = sin ella) */
  glow?: string;
  /** studio = reflejos de estudio (`RoomEnvironment`) · none = solo las luces (para modelos con su propia iluminación horneada) */
  env?: "studio" | "none";
};

const GEOMETRY: Record<ObjectShape, () => BufferGeometry> = {
  knot: () => new TorusKnotGeometry(0.78, 0.27, 240, 36),
  sphere: () => new SphereGeometry(1.15, 72, 72),
  torus: () => new TorusGeometry(0.9, 0.4, 56, 140),
  capsule: () => new CapsuleGeometry(0.62, 1.1, 20, 56),
  gem: () => new IcosahedronGeometry(1.25, 1),
};

function makeMaterial(kind: ObjectMaterial, color: string, flat: boolean) {
  const base = { color: new Color(color), flatShading: flat, envMapIntensity: 1 };
  switch (kind) {
    case "metal":
      return new MeshPhysicalMaterial({ ...base, metalness: 1, roughness: 0.2 });
    case "glass":
      // sobre un lienzo transparente no hay nada detrás que refractar (transmission daría negro): vidrio translúcido con reflejos
      return new MeshPhysicalMaterial({ ...base, metalness: 0, roughness: 0.02, transparent: true, opacity: 0.42, clearcoat: 1, clearcoatRoughness: 0, ior: 1.5, envMapIntensity: 1.8, specularIntensity: 1 });
    case "gloss":
      return new MeshPhysicalMaterial({ ...base, metalness: 0, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.04 });
    default:
      return new MeshPhysicalMaterial({ ...base, metalness: 0, roughness: 0.85 });
  }
}

/** Reflejos de estudio sin cargar ningún HDR: `RoomEnvironment` de three convertido a mapa de entorno */
function Environment() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  useEffect(() => {
    const pmrem = new PMREMGenerator(gl);
    const env = new RoomEnvironment();
    const rt = pmrem.fromScene(env, 0.04);
    scene.environment = rt.texture;
    return () => {
      scene.environment = null;
      rt.dispose();
      pmrem.dispose();
      env.dispose();
    };
  }, [gl, scene]);
  return null;
}

/** El movimiento común de la forma y del modelo. */
function useMotion(target: MutableRefObject<Object3D | null>, { motion, speed, pointer, follow = 0.9, onReady }: ObjectSceneProps) {
  const done = useRef(false);
  useFrame((state, dt) => {
    const m = target.current;
    if (!m) return;
    const t = state.clock.elapsedTime * speed;
    if (motion === "spin") {
      m.rotation.y += dt * 0.55 * speed;
      m.rotation.x = Math.sin(t * 0.4) * 0.25;
    } else if (motion === "float") {
      m.rotation.y = Math.sin(t * 0.5) * 0.6;
      m.rotation.x = Math.cos(t * 0.4) * 0.25;
      m.position.y = Math.sin(t * 0.9) * 0.12;
    } else if (motion === "pointer") {
      const k = Math.min(1, dt * 5);
      m.rotation.y += (pointer.current.x * follow - m.rotation.y) * k;
      m.rotation.x += (pointer.current.y * follow * 0.66 - m.rotation.x) * k;
      m.position.y = Math.sin(t * 0.9) * 0.04;
    }
    if (!done.current) {
      done.current = true;
      onReady();
    }
  });
}

/**
 * Un GLB encuadrado: centrado y escalado para caber en una esfera de radio 1,35 (como las formas). `useGLTF(url, false,
 * false)`: sin Draco ni meshopt. drei activa meshopt por defecto y su decodificador compila WebAssembly nada más cargarse,
 * que la CSP de producción no permite (aunque el modelo no lo use).
 */
function Model(props: ObjectSceneProps) {
  const { scene } = useGLTF(props.src!, false, false) as unknown as { scene: Object3D };
  const obj = useMemo(() => {
    const o = scene.clone(true);
    const [rx, ry, rz] = (props.modelRotation ?? "0,0,0").split(",").map((v) => (Number(v) || 0) * (Math.PI / 180));
    o.rotation.set(rx, ry, rz);
    o.updateMatrixWorld(true);
    const box = new Box3().setFromObject(o);
    const r = box.getSize(new Vector3()).length() / 2 || 1;
    const k = 1.35 / r;
    o.scale.multiplyScalar(k);
    o.position.copy(box.getCenter(new Vector3()).multiplyScalar(-k));
    return o;
  }, [scene, props.modelRotation]);
  const g = useRef<Group>(null);
  useMotion(g as MutableRefObject<Object3D | null>, props);
  return (
    <group ref={g}>
      <primitive object={obj} />
    </group>
  );
}

function Thing(props: ObjectSceneProps) {
  const { shape, material, color } = props;
  const mesh = useRef<Mesh>(null);
  const geo = useMemo(() => GEOMETRY[shape](), [shape]);
  const mat = useMemo(() => makeMaterial(material, color, shape === "gem"), [material, color, shape]);

  useEffect(() => () => geo.dispose(), [geo]);
  useEffect(() => () => mat.dispose(), [mat]);
  useMotion(mesh as MutableRefObject<Object3D | null>, props);

  return <mesh ref={mesh} geometry={geo} material={mat} />;
}

export default function ObjectScene(props: ObjectSceneProps) {
  const coarse = typeof matchMedia !== "undefined" && matchMedia("(pointer: coarse)").matches;
  return (
    <Canvas frameloop={props.active ? "always" : "never"} dpr={[1, coarse ? 1.5 : 2]} gl={{ alpha: true, antialias: true }} camera={{ fov: 32, position: [0, 0, 5.4], near: 0.1, far: 40 }} style={{ pointerEvents: "none" }}>
      {props.env !== "none" && <Environment />}
      <ambientLight intensity={props.env === "none" ? 0.9 : 0} />
      <directionalLight position={[3, 4, 5]} intensity={1.1} />
      {props.glow && <pointLight position={[0, 0.2, 2.4]} color={props.glow} intensity={6} distance={7} decay={1.6} />}
      {props.src ? (
        <Suspense fallback={null}>
          <Model {...props} />
        </Suspense>
      ) : (
        <Thing {...props} />
      )}
    </Canvas>
  );
}
