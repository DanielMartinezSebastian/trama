"use client";

import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  AdditiveBlending,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  DirectionalLight,
  Group,
  HemisphereLight,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  PointLight,
  Points,
  PointsMaterial,
  SphereGeometry,
  SpriteMaterial,
  Vector3,
  type Sprite,
} from "three";
import { JAW_HINGE, buildSkull, teeth } from "./skullGeometry";

/** Lo que el scroll le pide a la calavera (todo de 0 a 1 salvo giro y desplazamientos). */
export type SkullPose = {
  /** giro alrededor del eje vertical (radianes) */
  yaw: number;
  /** dónde cae en la pantalla, en fracción del ancho desde el centro */
  x: number;
  /** en vertical, fracción del alto (positivo = más arriba) */
  y: number;
  /** distancia de la cámara (1 = normal, menos = más cerca) */
  zoom: number;
  /** mandíbula abierta */
  jaw: number;
  /** castañeteo: la mandíbula «habla» al ritmo */
  talk: number;
  /** brillo de los ojos */
  eye: number;
  /** color de los ojos: 0 = ascua naranja · 1 = rojo */
  red: number;
  /** la cámara entra en la cuenca izquierda */
  close: number;
  /** el cráneo se abre: la tapa sube, la mandíbula baja */
  split: number;
  /** dos calaveras más a los lados */
  trio: number;
};

export const SKULL_REST: SkullPose = { yaw: 0, x: 0, y: 0, zoom: 1, jaw: 0, talk: 0, eye: 0.4, red: 0, close: 0, split: 0, trio: 0 };
const KEYS = Object.keys(SKULL_REST) as (keyof SkullPose)[];

type SceneProps = {
  pose: MutableRefObject<SkullPose>;
  /** lo rellena la escena: dónde cae en el lienzo lo que enseña la cámara (0–1) */
  focus?: MutableRefObject<{ x: number; y: number } | null>;
  active: boolean;
  onReady: () => void;
};

const EMBER = new Color("#ff7a1a");
const BLOOD = new Color("#ff1f2e");
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Halo suave (textura radial) para los ojos y la niebla. */
function radial(inner: string, outer: string) {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, inner);
  grd.addColorStop(1, outer);
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  return new CanvasTexture(c);
}

// la geometría se triangula una vez por resolución y la comparten todas las calaveras (no se libera: vive con la página)
const SKULLS = new Map<number, ReturnType<typeof buildSkull>>();
const skullGeo = (res: number) => {
  if (!SKULLS.has(res)) SKULLS.set(res, buildSkull(res));
  return SKULLS.get(res)!;
};

/** Una calavera: cráneo, mandíbula, dientes y ojos. `main` mueve también la cámara y las luces. */
function Skull({ pose, focus, onReady, side = 0 }: { pose: MutableRefObject<SkullPose>; focus?: SceneProps["focus"]; onReady?: () => void; side?: -1 | 0 | 1 }) {
  const geo = useMemo(() => skullGeo(side ? 60 : 92), [side]);
  const bone = useMemo(() => new MeshPhysicalMaterial({ color: "#efe6d4", roughness: 0.68, metalness: 0, sheen: 0.4, sheenColor: new Color("#fff2d8"), clearcoat: 0.15, clearcoatRoughness: 0.6, vertexColors: true }), []);
  const toothGeo = useMemo(() => new BoxGeometry(0.046, 0.068, 0.04), []);
  // los dientes no llevan oclusión por vértice: material propio, algo más amarillento
  const toothMat = useMemo(() => new MeshPhysicalMaterial({ color: "#e8dcbf", roughness: 0.45, clearcoat: 0.3 }), []);
  const eyeMat = useMemo(() => new MeshBasicMaterial({ color: EMBER, transparent: true }), []);
  const eyeGeo = useMemo(() => new SphereGeometry(0.032, 14, 10), []);
  const halo = useMemo(() => new SpriteMaterial({ map: radial("rgba(255,255,255,1)", "rgba(255,255,255,0)"), color: EMBER, blending: AdditiveBlending, depthWrite: false, transparent: true }), []);
  useEffect(() => () => {
    bone.dispose();
    toothMat.dispose();
    toothGeo.dispose();
    eyeMat.dispose();
    eyeGeo.dispose();
    halo.map?.dispose();
    halo.dispose();
  }, [bone, toothMat, toothGeo, eyeMat, eyeGeo, halo]);

  const root = useRef<Group>(null);
  const top = useRef<Group>(null);
  const jaw = useRef<Group>(null);
  const halos = useRef<Sprite[]>([]);
  const lights = useRef<PointLight[]>([]);
  const s = useRef<SkullPose>({ ...SKULL_REST });
  const ready = useRef(false);
  const { camera } = useThree();
  const seed = side * 1.7;

  useFrame((state, dt) => {
    const P = pose.current, S = s.current, t = state.clock.elapsedTime;
    const k = Math.min(1, dt * 7);
    for (const key of KEYS) S[key] = lerp(S[key], P[key], k);
    const g = root.current;
    if (!g) return;

    // acompañantes: suben a los lados, más atrás y más pequeños; castañetean a destiempo
    if (side) {
      const e = S.trio;
      g.visible = e > 0.02;
      g.position.set(side * 1.75, -0.15 - (1 - e) * 2.2, -1.2);
      g.scale.setScalar(Math.max(0.001, 0.7 * e));
      g.rotation.set(0.05, -side * 0.45 + Math.sin(t * 0.7 + seed) * 0.15, side * 0.06);
      if (jaw.current) jaw.current.rotation.x = 0.12 + Math.max(0, Math.sin(t * 9 + seed)) * 0.22 * e;
      eyeMat.color.copy(EMBER).lerp(BLOOD, S.red);
      eyeMat.opacity = 0.35 + 0.65 * S.eye;
      halo.color.copy(eyeMat.color);
      halo.opacity = S.eye * 0.8;
      return;
    }

    // giro con un balanceo leve, y un respiro arriba y abajo para que no parezca una foto
    g.rotation.y = S.yaw + Math.sin(t * 0.45) * 0.12;
    g.rotation.x = 0.08 + Math.sin(t * 0.33) * 0.04;
    g.position.y = Math.sin(t * 0.8) * 0.02;
    // la tapa sube y la mandíbula baja al abrirse; la mandíbula también habla (castañeteo al ritmo)
    if (top.current) top.current.position.y = S.split * 0.32;
    if (jaw.current) {
      jaw.current.position.y = -S.split * 0.28;
      jaw.current.rotation.x = S.jaw * 0.5 + Math.max(0, Math.sin(t * 10)) * 0.16 * S.talk;
    }
    // ojos: de ascua a sangre, con un pulso de vela
    const flick = 0.85 + Math.sin(t * 13) * 0.05 + Math.sin(t * 7.3) * 0.06 + Math.sin(t * 23.1) * 0.04;
    eyeMat.color.copy(EMBER).lerp(BLOOD, S.red);
    eyeMat.opacity = 0.25 + 0.75 * S.eye;
    halo.color.copy(eyeMat.color);
    halo.opacity = Math.min(0.85, 0.75 * S.eye * flick);
    for (const h of halos.current) h.scale.setScalar(0.07 + 0.06 * S.eye * flick);
    for (const l of lights.current) {
      l.color.copy(eyeMat.color);
      l.intensity = 0.1 * S.eye * flick;
    }

    // cámara: plano general o dentro de la cuenca izquierda; el sujeto cae a un lado con un desplazamiento en paralelo
    const far = new Vector3(0, 0.05, 3.9 * S.zoom);
    const socket = new Vector3(-0.2, -0.05, 0.5).applyEuler(g.rotation);
    const near = socket.clone().add(new Vector3(0.05, 0.04, 0.75));
    const pos = far.lerp(near, S.close);
    const aim = new Vector3(0, -0.05, 0).lerp(socket, S.close);
    const subject = aim.clone();
    const cam = camera as unknown as { fov: number; aspect: number };
    const dir = new Vector3().subVectors(aim, pos);
    const halfH = dir.length() * Math.tan(((cam.fov || 32) * Math.PI) / 360);
    const right = new Vector3().crossVectors(dir, new Vector3(0, 1, 0)).normalize();
    const up = new Vector3().crossVectors(right, dir).normalize();
    const shift = right.multiplyScalar(-S.x * 2 * halfH * (cam.aspect || 1)).addScaledVector(up, -S.y * 2 * halfH);
    camera.position.copy(pos.add(shift));
    camera.lookAt(aim.add(shift));
    if (focus) {
      camera.updateMatrixWorld();
      subject.project(camera);
      focus.current = { x: (subject.x + 1) / 2, y: (1 - subject.y) / 2 };
    }
    if (!ready.current) {
      ready.current = true;
      onReady?.();
    }
  });

  const up = useMemo(() => teeth(true), []);
  const lo = useMemo(() => teeth(false), []);
  return (
    <group ref={root}>
      <group ref={top}>
        <mesh geometry={geo.cranium} material={bone} />
        {up.map((tt, i) => (
          <mesh key={`u${i}`} geometry={toothGeo} material={toothMat} position={tt.p} rotation={[0, tt.ry, 0]} scale={tt.s} />
        ))}
        {[-1, 1].map((sx, i) => (
          <group key={sx} position={[sx * 0.19, -0.05, 0.36]}>
            <mesh geometry={eyeGeo} material={eyeMat} />
            <sprite ref={(el) => { if (el) halos.current[i] = el; }} material={halo} position={[0, 0, 0.04]} scale={0.14} />
            {!side && <pointLight ref={(el) => { if (el) lights.current[i] = el; }} distance={0.9} decay={2} position={[0, 0, 0.1]} />}
          </group>
        ))}
      </group>
      <group ref={jaw} position={JAW_HINGE}>
        <group position={[-JAW_HINGE[0], -JAW_HINGE[1], -JAW_HINGE[2]]}>
          <mesh geometry={geo.jaw} material={bone} />
          {lo.map((tt, i) => (
            <mesh key={`l${i}`} geometry={toothGeo} material={toothMat} position={tt.p} rotation={[0, tt.ry, 0]} scale={tt.s} />
          ))}
        </group>
      </group>
    </group>
  );
}

/** Ascuas que suben despacio, balanceándose, y se apagan arriba. */
function Embers() {
  const N = 220;
  const { geo, speed } = useMemo(() => {
    const g = new BufferGeometry();
    const p = new Float32Array(N * 3);
    const sp = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      p[i * 3] = (Math.random() - 0.5) * 6;
      p[i * 3 + 1] = (Math.random() - 0.5) * 4;
      p[i * 3 + 2] = (Math.random() - 0.5) * 3 - 0.5;
      sp[i] = 0.08 + Math.random() * 0.22;
    }
    g.setAttribute("position", new BufferAttribute(p, 3));
    return { geo: g, speed: sp };
  }, []);
  const mat = useMemo(() => new PointsMaterial({ color: "#ff8a2a", size: 0.035, transparent: true, opacity: 0.85, blending: AdditiveBlending, depthWrite: false, map: radial("rgba(255,255,255,1)", "rgba(255,255,255,0)") }), []);
  useEffect(() => () => { geo.dispose(); mat.map?.dispose(); mat.dispose(); }, [geo, mat]);
  const pts = useRef<Points>(null);
  useFrame((state, dt) => {
    const a = geo.getAttribute("position") as BufferAttribute;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < N; i++) {
      let y = a.getY(i) + speed[i] * dt;
      if (y > 2.2) y = -2.2;
      a.setY(i, y);
      a.setX(i, a.getX(i) + Math.sin(t * 0.8 + i) * 0.0015);
    }
    a.needsUpdate = true;
  });
  return <points ref={pts} geometry={geo} material={mat} />;
}

/** Bancos de niebla: planos con un halo blanco muy tenue que derivan despacio delante y detrás de la calavera. */
function Fog() {
  const tex = useMemo(() => radial("rgba(220,230,255,0.55)", "rgba(220,230,255,0)"), []);
  const banks = useMemo(
    () => Array.from({ length: 7 }, (_, i) => ({ x: (i - 3) * 1.1, y: -1.1 + (i % 3) * 0.25, z: i % 2 ? -1.6 : 0.9, s: 3 + (i % 3), v: 0.05 + (i % 4) * 0.02 })),
    [],
  );
  const mats = useMemo(() => banks.map(() => new MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.16, depthWrite: false })), [banks, tex]);
  useEffect(() => () => { tex.dispose(); mats.forEach((m) => m.dispose()); }, [tex, mats]);
  const refs = useRef<Mesh[]>([]);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    banks.forEach((b, i) => {
      const m = refs.current[i];
      if (!m) return;
      m.position.x = ((b.x + t * b.v + 4) % 8) - 4;
      mats[i].opacity = 0.12 + Math.sin(t * 0.3 + i) * 0.05;
    });
  });
  return (
    <>
      {banks.map((b, i) => (
        <mesh key={i} ref={(el) => { if (el) refs.current[i] = el; }} position={[b.x, b.y, b.z]} material={mats[i]}>
          <planeGeometry args={[b.s * 1.6, b.s * 0.7]} />
        </mesh>
      ))}
    </>
  );
}

/** Luz de luna fría arriba, vela cálida abajo que parpadea y un relleno violeta muy bajo. */
function Lights() {
  const candle = useRef<PointLight>(null);
  const moon = useRef<DirectionalLight>(null);
  const hemi = useRef<HemisphereLight>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (candle.current) candle.current.intensity = 4.5 + Math.sin(t * 11) * 0.6 + Math.sin(t * 17.3) * 0.45 + Math.sin(t * 5.1) * 0.7;
  });
  return (
    <>
      <hemisphereLight ref={hemi} args={["#5b4a86", "#120a08", 0.35]} />
      <directionalLight ref={moon} position={[-3, 4, 2.5]} intensity={1.6} color="#c9d4ff" />
      <directionalLight position={[2.5, 0.5, 3]} intensity={0.45} color="#fff1dc" />
      <pointLight ref={candle} position={[0.4, -1.4, 1.6]} color="#ff9a3c" distance={8} decay={1.6} />
      <pointLight position={[2.5, 1.2, -2]} color="#7cff9a" intensity={3} distance={6} decay={2} />
    </>
  );
}

export default function SkullScene({ pose, focus, active, onReady }: SceneProps) {
  return (
    <Canvas frameloop={active ? "always" : "never"} dpr={[1, 2]} gl={{ alpha: true, antialias: true }} camera={{ fov: 32, position: [0, 0.05, 3.9], near: 0.05, far: 40 }} style={{ pointerEvents: "none" }}>
      <Lights />
      <Fog />
      <Embers />
      <Skull pose={pose} focus={focus} onReady={onReady} />
      <Skull pose={pose} side={-1} />
      <Skull pose={pose} side={1} />
    </Canvas>
  );
}
