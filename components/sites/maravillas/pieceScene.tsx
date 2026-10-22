"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import type { RoomSlug } from "./data";
import type { PieceMode, PiecePose } from "./pose";

/*
 * El lienzo de una pieza del gabinete. Cada modelo viene de Sketchfab con su propia orientación (escaneos de museo
 * incluidos): se gira para que la cara de la pieza mire a la cámara (la normal de su plano, medida con PCA de los
 * vértices, va a +z) y quede derecha, se centra y se escala a la misma medida. Los modelos van sin Draco ni meshopt (CSP).
 */

type Fit = { src: string; normal: [number, number, number]; up: [number, number, number]; size: number; mirror?: boolean };
const FIT: Record<RoomSlug, Fit> = {
  mar: { src: "/models/nautilo/nautilo-transformed.glb", normal: [0.15, 0.042, 0.988], up: [-0.533, 0.845, 0.045], size: 1.85 },
  tierra: { src: "/models/amonites/amonites-transformed.glb", normal: [0.018, 0, 1], up: [0.557, 0.83, -0.011], size: 1.9 },
  cielo: { src: "/models/astrolabio/astrolabio-transformed.glb", normal: [0.853, 0.522, -0.005], up: [-0.52, 0.851, -0.074], size: 1.95 },
  // la esfera mira a −z (por +z se ve la tapa trasera grabada) y viene en espejo: se refleja en x para leer los números
  tiempo: { src: "/models/reloj-bolsillo/reloj-bolsillo-transformed.glb", normal: [0, 0, -1], up: [0, 1, 0], size: 1.9, mirror: true },
};
/** dónde cae el eje de la alidada, en unidades de la escena ya escalada (el disco, no la anilla de arriba) */
const ALIDADE_AT = new THREE.Vector3(0, -0.071, 0);
/** segundo de la animación del reloj en el que la tapa ya está abierta del todo */
const LID_OPEN = 2.6;

/** Reflejos de estudio sin descargar un HDR: `RoomEnvironment` de three convertido a mapa de entorno. */
function Studio() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pm = new THREE.PMREMGenerator(gl);
    const env = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    return () => {
      scene.environment = null;
      env.dispose();
      pm.dispose();
    };
  }, [gl, scene]);
  return null;
}

const wrapPi = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

type Hand = { pivot: THREE.Object3D; from: number; undo: () => void };
/**
 * Mete una aguja en un pivote situado en el eje de la esfera (el pasador central). Hace falta porque al cuantizar el GLB
 * (sin Draco, por la CSP) cada malla se recentra en su caja: el origen de la aguja ya no está en el eje y girarla sobre sí
 * misma la movería entera. `from` es el ángulo al que apunta de origen (en el plano de la esfera, desde +x).
 */
function pivotHand(root: THREE.Object3D, hand: THREE.Object3D, pin: THREE.Object3D): Hand {
  root.updateMatrixWorld(true);
  const local = (o: THREE.Object3D) => root.worldToLocal(new THREE.Box3().setFromObject(o).getCenter(new THREE.Vector3()));
  const c = local(pin), h = local(hand);
  const parent = hand.parent!;
  const pivot = new THREE.Object3D();
  pivot.position.copy(parent.worldToLocal(pin.getWorldPosition(new THREE.Vector3())));
  parent.add(pivot);
  pivot.updateMatrixWorld(true);
  pivot.attach(hand);
  return {
    pivot,
    from: Math.atan2(h.y - c.y, h.x - c.x),
    undo: () => {
      parent.attach(hand);
      parent.remove(pivot);
    },
  };
}

type Anchor = MutableRefObject<{ x: number; y: number }>;

/** Aparta la cámara lo justo para que la esfera de la pieza quepa en el lado más estrecho del lienzo. */
function FitCamera({ radius }: { radius: number }) {
  const { camera, size } = useThree();
  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const v = (cam.fov * Math.PI) / 180;
    const h = 2 * Math.atan(Math.tan(v / 2) * (size.width / Math.max(1, size.height)));
    // + el vaivén vertical (0,03) y un margen
    cam.position.set(0, 0, ((radius + 0.03) * 1.04) / Math.sin(Math.min(v, h) / 2));
    cam.near = 0.05;
    cam.far = cam.position.z + radius * 4;
    cam.updateProjectionMatrix();
  }, [camera, size, radius]);
  return null;
}

function Piece({ room, pose, mode, pointer, anchor, onReady }: { room: RoomSlug; pose: MutableRefObject<PiecePose>; mode: PieceMode; pointer: MutableRefObject<{ x: number; y: number }>; anchor?: Anchor; onReady?: () => void }) {
  const fit = FIT[room];
  const { scene, animations } = useGLTF(fit.src, false, false);
  const outer = useRef<THREE.Group>(null);
  /** las agujas, cada una dentro de un pivote en el eje de la esfera, y el ángulo al que apuntan de origen */
  const hands = useRef<{ long?: Hand; little?: Hand }>({});
  const alidade = useRef<THREE.Mesh>(null);
  const axis = useRef<THREE.Group>(null);
  const pinRef = useRef<THREE.Object3D | null>(null);
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const cur = useRef({ yaw: pose.current.yaw, pitch: pose.current.pitch, roll: pose.current.roll, minute: pose.current.minute, alidade: pose.current.alidade, spin: 0 });

  // orientar, centrar y escalar una vez, y medir la ESFERA que envuelve la pieza (el vértice más lejano del centro): la
  // cámara se aparta lo justo para que quepa entera gire como gire y sea cual sea la proporción del lienzo (`FitCamera`).
  // Se mide sobre un clon (comparte geometrías): el `scene` de la caché no se toca aquí, porque en desarrollo React
  // ejecuta este cálculo dos veces y un `add` le quitaría el modelo al primer contenedor. El reloj, con la tapa abierta.
  const { quat, scale, offset, depth, radius } = useMemo(() => {
    const n = new THREE.Vector3(...fit.normal).normalize();
    const up = new THREE.Vector3(...fit.up);
    up.sub(n.clone().multiplyScalar(up.dot(n))).normalize();
    const right = new THREE.Vector3().crossVectors(up, n).normalize();
    const q = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(right, up, n).invert());
    const probe = new THREE.Group();
    probe.quaternion.copy(q);
    const inner = new THREE.Group();
    if (fit.mirror) inner.scale.x = -1;
    const clone = scene.clone(true);
    inner.add(clone);
    probe.add(inner);
    if (room === "tiempo" && animations.length) {
      const mixer = new THREE.AnimationMixer(clone);
      const a = mixer.clipAction(animations[0]);
      a.play();
      a.time = LID_OPEN;
      mixer.update(0);
    }
    probe.updateMatrixWorld(true);
    const pts: THREE.Vector3[] = [];
    clone.traverse((o) => {
      const pos = (o as THREE.Mesh).geometry?.getAttribute("position");
      if (!pos) return;
      const step = Math.max(1, Math.floor(pos.count / 6000));
      for (let i = 0; i < pos.count; i += step) pts.push(new THREE.Vector3().fromBufferAttribute(pos, i).applyMatrix4(o.matrixWorld));
    });
    const box = new THREE.Box3().setFromPoints(pts);
    const size = box.getSize(new THREE.Vector3());
    const c = box.getCenter(new THREE.Vector3());
    const s = fit.size / Math.max(size.x, size.y);
    let r = 0;
    for (const p of pts) r = Math.max(r, p.distanceTo(c));
    return { quat: q, scale: s, offset: c.multiplyScalar(-s), depth: size.z * s, radius: r * s };
  }, [scene, animations, fit, room]);
  useEffect(() => {
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      m.frustumCulled = false;
      (Array.isArray(m.material) ? m.material : [m.material]).forEach((mt) => {
        if ("envMapIntensity" in mt) (mt as THREE.MeshStandardMaterial).envMapIntensity = 1.1;
      });
    });
  }, [scene]);

  // el reloj: su única animación aprieta la corona (≈1 s), abre la tapa (2,4 s) y la vuelve a cerrar (5,5 s). Se reproduce
  // hasta tenerla abierta y ahí se queda: la esfera, con sus agujas, queda a la vista
  // (en un efecto y no en un memo: el doble montaje de desarrollo pararía la acción en la limpieza y no la reanudaría)
  const lidRef = useRef<{ mixer: THREE.AnimationMixer; action: THREE.AnimationAction; t: number } | null>(null);
  useEffect(() => {
    if (room !== "tiempo" || !animations.length) return;
    const mixer = new THREE.AnimationMixer(scene);
    const action = mixer.clipAction(animations[0]);
    action.play();
    lidRef.current = { mixer, action, t: 0 };
    return () => {
      mixer.stopAllAction();
      lidRef.current = null;
    };
  }, [room, scene, animations]);

  useLayoutEffect(() => {
    const pin = scene.getObjectByName("Cylinder006_decor_0");
    pinRef.current = pin ?? null;
    const made = (["long", "little"] as const).map((k) => {
      const hand = scene.getObjectByName(`arrow_${k}_decor_0`);
      return hand && pin ? ([k, pivotHand(scene, hand, pin)] as const) : null;
    });
    for (const m of made) if (m) hands.current[m[0]] = m[1];
    onReady?.();
    return () => {
      for (const m of made) m?.[1].undo();
      hands.current = {};
    };
    // solo al montar el modelo
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene]);

  useFrame((state, dt) => {
    // el eje del juego (pasador del reloj, eje de la alidada) en fracciones del lienzo: la página mide ahí los ángulos
    const target = room === "tiempo" ? pinRef.current : room === "cielo" ? axis.current : null;
    if (anchor && target) {
      target.getWorldPosition(tmp).project(state.camera);
      anchor.current.x = (tmp.x + 1) / 2;
      anchor.current.y = (1 - tmp.y) / 2;
    }
    const g = outer.current;
    if (!g) return;
    const p = pose.current, c = cur.current, k = 1 - Math.exp(-dt * 7);
    const showing = mode !== "game";
    if (p.ticking) p.minute += dt / 60;
    // exhibiendo: de frente, girando despacio; jugando: la pose del juego
    c.spin = showing ? c.spin + dt * (mode === "shelf" ? 0.5 : 0.28) : wrapPi(c.spin) * (1 - k);
    const ty = showing ? Math.sin(c.spin) * 0.55 : p.yaw;
    const tp = showing ? -0.12 : p.pitch;
    c.yaw += wrapPi(ty - c.yaw) * k;
    c.pitch += (tp - c.pitch) * k;
    c.roll += (p.roll - c.roll) * k;
    c.minute += (p.minute - c.minute) * Math.min(1, k * 1.6);
    c.alidade += wrapPi(p.alidade - c.alidade) * Math.min(1, k * 1.6);
    const lean = mode === "shelf" ? 0 : 0.12;
    g.rotation.set(c.pitch - pointer.current.y * lean, c.yaw + pointer.current.x * lean, c.roll);
    g.position.y = Math.sin(state.clock.elapsedTime * 0.9) * 0.03;
    // el reloj: la minutera da una vuelta por hora y la horaria una cada doce (en el sentido del reloj = ángulo negativo)
    const { long, little } = hands.current;
    if (long) long.pivot.rotation.z = Math.PI / 2 - (c.minute / 60) * Math.PI * 2 - long.from;
    if (little) little.pivot.rotation.z = Math.PI / 2 - (c.minute / 720) * Math.PI * 2 - little.from;
    if (alidade.current) alidade.current.rotation.z = c.alidade;
    const lid = lidRef.current;
    if (lid && lid.t < LID_OPEN) {
      lid.t = Math.min(LID_OPEN, lid.t + dt);
      lid.action.time = lid.t;
      lid.mixer.update(0);
    }
  });

  return (
    <group ref={outer}>
      <FitCamera radius={radius} />
      <group position={offset} scale={scale}>
        <group quaternion={quat}>
          <group scale={fit.mirror ? [-1, 1, 1] : 1}>
            <primitive object={scene} />
          </group>
        </group>
      </group>
      {room === "cielo" && (
        <group ref={axis} position={[ALIDADE_AT.x, ALIDADE_AT.y, depth / 2 + 0.03]}>
          <mesh ref={alidade}>
            <boxGeometry args={[1.5, 0.05, 0.02]} />
            <meshStandardMaterial color="#a8823a" metalness={0.9} roughness={0.38} />
            {/* la pínula: la mira del extremo con el que se apunta */}
            <mesh position={[0.68, 0, 0.03]}>
              <boxGeometry args={[0.05, 0.11, 0.06]} />
              <meshStandardMaterial color="#a8823a" metalness={0.9} roughness={0.36} />
            </mesh>
          </mesh>
          <mesh position={[0, 0, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 0.04, 20]} />
            <meshStandardMaterial color="#8a6a12" metalness={1} roughness={0.4} />
          </mesh>
        </group>
      )}
    </group>
  );
}

export type PieceSceneProps = {
  room: RoomSlug;
  pose: MutableRefObject<PiecePose>;
  mode: PieceMode;
  active: boolean;
  pointer: MutableRefObject<{ x: number; y: number }>;
  /** dónde cae el eje del juego en el lienzo (lo escribe la escena; cambia con el encuadre de cada pantalla) */
  anchor?: Anchor;
  onReady?: () => void;
};

export default function PieceScene({ room, pose, mode, active, pointer, anchor, onReady }: PieceSceneProps) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={mode === "shelf" ? 1.5 : [1, 2]}
      gl={{ alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      camera={{ fov: 30, position: [0, 0, 4.4], near: 0.1, far: 40 }}
      style={{ pointerEvents: "none" }}
    >
      <Studio />
      <ambientLight intensity={0.35} />
      <directionalLight position={[2.5, 3, 4]} intensity={2.2} color="#fff3e2" />
      <directionalLight position={[-3, -1.5, 2]} intensity={0.6} color="#b9d4ff" />
      <Piece room={room} pose={pose} mode={mode} pointer={pointer} anchor={anchor} onReady={onReady} />
    </Canvas>
  );
}
