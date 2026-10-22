"use client";

import { Component, Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import {
  AdditiveBlending,
  Box3,
  type Camera,
  type MeshStandardMaterial,
  type Object3D,
  type Texture,
  DoubleSide,
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
import { brilliantGeometry } from "@/lib/gems/brilliant";
import { createGemEnvironment } from "@/lib/gems/environment";
import { createGemMaterial } from "@/lib/gems/gemMaterial";
import { SHOW_DIAMOND_IOR, loadGemHdr } from "@/lib/gems/hdr";
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
  /** el sombrero pirata cae sobre la cabeza (acto del concurso de disfraces) */
  hat: number;
};

export const SKULL_REST: SkullPose = { yaw: 0, x: 0, y: 0, zoom: 1, jaw: 0, talk: 0, eye: 0.4, red: 0, close: 0, split: 0, trio: 0, hat: 0 };
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

type V3 = [number, number, number];
type SkullSource = { cranium: BufferGeometry; jaw: BufferGeometry; eyes: [V3, V3]; hinge: V3; socket: V3; teeth: boolean };

/** La calavera procedural, de respaldo (si el modelo no carga): lleva sus propios dientes. */
function proceduralSource(res: number): SkullSource {
  const g = skullGeo(res);
  return { cranium: g.cranium, jaw: g.jaw, eyes: [[-0.19, -0.05, 0.36], [0.19, -0.05, 0.36]], hinge: JAW_HINGE, socket: [-0.2, -0.05, 0.5], teeth: true };
}

/**
 * La cámara: plano general o dentro de la cuenca (`close`). El sujeto cae a un lado con un desplazamiento en paralelo (`x`,
 * `y`), y `focus` recibe dónde queda en el lienzo. La comparten la calavera pirata y la procedural.
 */
function driveCamera(camera: Camera, g: Object3D, S: SkullPose, socketLocal: Vector3, focus?: SceneProps["focus"]) {
  const far = new Vector3(0, 0.05, 3.9 * S.zoom);
  const socket = socketLocal.clone().applyEuler(g.rotation);
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
}

/** Una calavera: cráneo, mandíbula, ojos (y dientes si es la procedural). La principal mueve también la cámara. */
function Skull({ pose, focus, onReady, side = 0 }: { pose: MutableRefObject<SkullPose>; focus?: SceneProps["focus"]; onReady?: () => void; side?: -1 | 0 | 1 }) {
  const geo = useMemo(() => proceduralSource(side ? 60 : 92), [side]);
  // a dos caras: el corte entre cráneo y mandíbula deja algún hueco junto a la oreja y así se ve hueso por dentro
  const bone = useMemo(() => new MeshPhysicalMaterial({ color: "#efe6d4", roughness: 0.68, metalness: 0, sheen: 0.4, sheenColor: new Color("#fff2d8"), clearcoat: 0.15, clearcoatRoughness: 0.6, vertexColors: true, side: DoubleSide }), []);
  const toothGeo = useMemo(() => new BoxGeometry(0.046, 0.068, 0.04), []);
  // los dientes no llevan oclusión por vértice: material propio, algo más amarillento
  const toothMat = useMemo(() => new MeshPhysicalMaterial({ color: "#e8dcbf", roughness: 0.45, clearcoat: 0.3 }), []);
  const eyeMat = useMemo(() => new MeshBasicMaterial({ color: EMBER, transparent: true }), []);
  // una ascua por ojo (se apaga sola la del ojo que queda detrás)
  const eyeMats = useMemo(() => [0, 1].map(() => new MeshBasicMaterial({ color: EMBER, transparent: true })), []);
  const eyeGeo = useMemo(() => new SphereGeometry(0.032, 14, 10), []);
  // un material de halo por ojo: el del ojo que queda detrás (calavera de lado) se apaga
  const halos2 = useMemo(() => [0, 1].map(() => new SpriteMaterial({ map: radial("rgba(255,255,255,1)", "rgba(255,255,255,0)"), color: EMBER, blending: AdditiveBlending, depthWrite: false, transparent: true })), []);
  useEffect(() => () => {
    bone.dispose();
    toothMat.dispose();
    toothGeo.dispose();
    eyeMat.dispose();
    eyeMats.forEach((m) => m.dispose());
    eyeGeo.dispose();
    halos2.forEach((h) => { h.map?.dispose(); h.dispose(); });
  }, [bone, toothMat, toothGeo, eyeMat, eyeMats, eyeGeo, halos2]);

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
      for (const m of eyeMats) {
        m.color.copy(eyeMat.color);
        m.opacity = eyeMat.opacity;
      }
      for (const h of halos2) {
        h.color.copy(eyeMat.color);
        h.opacity = S.eye * 0.8;
      }
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
    // el halo de cada ojo, apagado si ese ojo queda claramente más lejos de la cámara que el otro (calavera de lado: se
    // vería a través de la pared fina de la órbita)
    const dist = halos.current.map((h) => h.getWorldPosition(new Vector3()).distanceTo(camera.position));
    halos.current.forEach((h, i) => {
      const behind = dist[i] - dist[1 - i];
      const vis = 1 - Math.min(1, Math.max(0, (behind - 0.04) / 0.12));
      halos2[i].color.copy(eyeMat.color);
      halos2[i].opacity = Math.min(0.85, 0.75 * S.eye * flick) * vis;
      eyeMats[i].color.copy(eyeMat.color);
      eyeMats[i].opacity = eyeMat.opacity * vis;
      h.scale.setScalar(0.07 + 0.06 * S.eye * flick);
    });
    for (const l of lights.current) {
      l.color.copy(eyeMat.color);
      l.intensity = 0.1 * S.eye * flick;
    }

    driveCamera(camera, g, S, new Vector3(...geo.socket), focus);
    if (!ready.current) {
      ready.current = true;
      onReady?.();
    }
  });

  const up = useMemo(() => teeth(true), []);
  const lo = useMemo(() => teeth(false), []);
  const hinge = geo.hinge;
  return (
    <group ref={root}>
      <group ref={top}>
        <mesh geometry={geo.cranium} material={bone} />
        {geo.teeth && up.map((tt, i) => (
          <mesh key={`u${i}`} geometry={toothGeo} material={toothMat} position={tt.p} rotation={[0, tt.ry, 0]} scale={tt.s} />
        ))}
        {geo.eyes.map((e, i) => (
          <group key={i} position={e}>
            <mesh geometry={eyeGeo} material={eyeMats[i]} />
            <sprite ref={(el) => { if (el) halos.current[i] = el; }} material={halos2[i]} position={[0, 0, 0.04]} scale={0.14} />
            {!side && <pointLight ref={(el) => { if (el) lights.current[i] = el; }} distance={0.9} decay={2} position={[0, 0, 0.1]} />}
          </group>
        ))}
      </group>
      <group ref={jaw} position={hinge}>
        <group position={[-hinge[0], -hinge[1], -hinge[2]]}>
          <mesh geometry={geo.jaw} material={bone} />
          {geo.teeth && lo.map((tt, i) => (
            <mesh key={`l${i}`} geometry={toothGeo} material={toothMat} position={tt.p} rotation={[0, tt.ry, 0]} scale={tt.s} />
          ))}
        </group>
      </group>
    </group>
  );
}

/* ---------- la calavera pirata (modelo de Sketchfab, por piezas) ---------- */

/**
 * «The Halloween Pirate Skull», de Machin (Sketchfab, CC BY 4.0), bajado con `npm run models:fetch` y optimizado con gltfjsx
 * (Draco y texturas WebP, sin juntar mallas: `components/models/CalaveraPirata.tsx` es su mapa de piezas). Viene por piezas:
 * cráneo, mandíbula, dientes, ojo y sombrero. Aquí la mandíbula se cuelga de un pivote en los cóndilos (su animación original
 * es una actuación de 20 s, no una bisagra), las runas y el ojo brillan con su propio mapa emisivo y el sombrero cae sobre la
 * cabeza con `hat`.
 */
export const PIRATE_URL = "/models/calavera-pirata/calavera-pirata-transformed.glb";
export const GHOST = new Color("#7dffa8");
/** color de absorción de la gema del ojo (Beer–Lambert): esmeralda y, a medianoche, rubí */
export const EMERALD = new Color(0.25, 1, 0.45);
const RUBY = new Color(1, 0.12, 0.18);
/**
 * La piedra del ojo de cada calavera (0 = la del centro; −1 y 1 = las del trío): color de absorción y cuánto absorbe. Todas
 * con el índice «de escaparate» de Quilate (`SHOW_DIAMOND_IOR`): con el índice real de una esmeralda (1,575) apenas hay
 * reflexión interna ni fuego, y el ojo se ve plano.
 */
const EYE_GEMS: Record<number, { color: Color; k: number }> = {
  0: { color: EMERALD, k: 0.16 },
  [-1]: { color: new Color(0.2, 0.4, 1), k: 0.2 },
  1: { color: new Color(1, 1, 1), k: 0 },
};

// el HDR de estudio de las gemas (lib/gems/hdr), uno para todas las calaveras de la página (no se libera)
let hdrCube: Texture | null = null;
let hdrStarted = false;
const hdrWait: ((t: Texture) => void)[] = [];
export function useGemHdr(gl: Parameters<typeof loadGemHdr>[0]) {
  const [t, setT] = useState<Texture | null>(hdrCube);
  useEffect(() => {
    if (hdrCube) return setT(hdrCube);
    hdrWait.push(setT);
    if (!hdrStarted) {
      hdrStarted = true;
      loadGemHdr(gl, (x) => {
        hdrCube = x;
        hdrWait.splice(0).forEach((f) => f(x));
      });
    }
  }, [gl]);
  return t;
}
/** cuánto hay que girar la mandíbula del modelo para cerrar la boca (viene abierta) */
export const JAW_SHUT = -0.42;

export type PirateRig = { holder: Group; pivot: Group; hat: Object3D; hatY: number; hatDrop: number; skin: MeshStandardMaterial[]; eye: MeshStandardMaterial; eyeMap: Texture | null; eyeLocal: Vector3; eyeSize: number; eyeNode: Object3D };

export function buildPirate(scene: Object3D): PirateRig {
  const root = scene.clone(true);
  root.updateMatrixWorld(true);
  // materiales propios por calavera (el brillo cambia por pose); el ojo, aparte (pasa a rojo sin su mapa)
  const skin: MeshStandardMaterial[] = [];
  let eye: MeshStandardMaterial | null = null;
  root.traverse((o) => {
    const m = o as Mesh;
    if (!m.isMesh) return;
    const mat = (m.material as MeshStandardMaterial).clone();
    m.material = mat;
    if (m.name.startsWith("Eye")) eye = mat;
    else skin.push(mat);
  });
  const jaw = root.getObjectByName("Jaw_low")!, hat = root.getObjectByName("Hat_low")!, eyeNode = root.getObjectByName("Eye_low")!;
  // medida y centro de la calavera sin el sombrero: solo cráneo y mandíbula (Box3.setFromObject cuenta también lo oculto,
  // así que esconder el sombrero no basta; con él, el centro subía y la calavera quedaba descolgada bajo el HUD)
  const box = new Box3().setFromObject(root.getObjectByName("Skull_low")!).union(new Box3().setFromObject(jaw));
  const size = box.getSize(new Vector3()), center = box.getCenter(new Vector3());
  // bisagra: arriba y atrás de la mandíbula (los cóndilos); el pivote toma la mandíbula sin moverla
  const jb = new Box3().setFromObject(jaw);
  const hinge = new Vector3((jb.min.x + jb.max.x) / 2, jb.max.y - (jb.max.y - jb.min.y) * 0.08, jb.min.z + (jb.max.z - jb.min.z) * 0.12);
  const pivot = new Group();
  jaw.parent!.add(pivot);
  pivot.position.copy(jaw.parent!.worldToLocal(hinge));
  pivot.updateMatrixWorld(true);
  pivot.attach(jaw);
  // a las unidades de la escena: 1,15 de alto (cráneo y mandíbula), centrada: cabe en el círculo del HUD
  const k = 1.15 / size.y;
  root.scale.setScalar(k);
  root.position.copy(center).multiplyScalar(-k);
  const holder = new Group();
  holder.add(root);
  holder.updateMatrixWorld(true);
  // el ojo original (una esfera con textura, borrosa de cerca) se oculta: su sitio lo ocupa una gema tallada
  const eb = new Box3().setFromObject(eyeNode);
  const eyeLocal = holder.worldToLocal(eb.getCenter(new Vector3()));
  const eyeSize = eb.getSize(new Vector3()).multiplyScalar(k).length() / Math.sqrt(3);
  eyeNode.visible = false;
  const e = eye as MeshStandardMaterial | null;
  if (!e) throw new Error("calavera pirata sin ojo");
  return { holder, pivot, hat, hatY: hat.position.y, hatDrop: size.y * 0.9, skin, eye: e, eyeMap: e.emissiveMap, eyeLocal, eyeSize, eyeNode };
}

function PirateSkull({ pose, focus, onReady, side = 0 }: { pose: MutableRefObject<SkullPose>; focus?: SceneProps["focus"]; onReady?: () => void; side?: -1 | 0 | 1 }) {
  const { scene } = useGLTF(PIRATE_URL, false, false) as unknown as { scene: Object3D };
  const rig = useMemo(() => buildPirate(scene), [scene]);
  useEffect(() => () => { rig.skin.forEach((m) => m.dispose()); rig.eye.dispose(); }, [rig]);
  // el ojo: una talla brillante que llena la cuenca, con el material de gema de trazado de rayos del kit (lib/gems). Una
  // piedra por calavera (`EYE_GEMS`: la del centro, esmeralda, que pasa a rubí a medianoche; en el trío, zafiro y
  // diamante a los lados), con luz interior que se enciende a ratos
  const gl = useThree((st) => st.gl);
  const stone = EYE_GEMS[side];
  const gem = useMemo(() => {
    const env = createGemEnvironment(gl);
    const R = rig.eyeSize * 2;
    const geo = brilliantGeometry(R);
    const mat = createGemMaterial(env.texture, geo, true);
    mat.uniforms.uIor.value.copy(SHOW_DIAMOND_IOR);
    mat.uniforms.uAbsorbK.value = stone.k / R;
    mat.uniforms.uAbsorb.value.copy(stone.color);
    mat.uniforms.uKeyI.value = 4;
    return { env, geo, mat };
  }, [gl, rig, stone]);
  useEffect(() => () => { gem.env.dispose(); gem.geo.dispose(); gem.mat.dispose(); }, [gem]);
  // con el HDR cargado, las facetas devuelven un taller de verdad (el de Quilate) en vez de la caja de luz
  const hdr = useGemHdr(gl);
  useEffect(() => {
    gem.mat.uniforms.uEnv.value = hdr ?? gem.env.texture;
  }, [gem, hdr]);
  const root = useRef<Group>(null);
  const glow = useRef<PointLight>(null);
  const gemMesh = useRef<Mesh>(null);
  // el puntero (−1…1, y hacia arriba), hacia dónde mira, y los dos muelles: mandíbula y retroceso de la cabeza
  const { camera } = useThree();
  const pointerRef = useRef({ x: 0, y: 0 });
  const look = useRef({ x: 0, y: 0 });
  const spring = useRef({ x: 0, v: 0 });
  const recoil = useRef({ x: 0, v: 0 });
  const size = useThree((st) => st.size);
  useEffect(() => {
    if (side) return;
    const cv = gl.domElement;
    let last = { x: 0, y: 0, t: 0 };
    // ¿el puntero está sobre la calavera? Su centro y su radio en pantalla, proyectados con la cámara actual
    const over = (cx: number, cy: number) => {
      const g = root.current;
      if (!g) return 0;
      const r = cv.getBoundingClientRect();
      const c = new Vector3().setFromMatrixPosition(g.matrixWorld);
      const top = c.clone().add(new Vector3(0, 0.62, 0)).project(camera);
      c.project(camera);
      const px = r.left + ((c.x + 1) / 2) * r.width, py = r.top + ((1 - c.y) / 2) * r.height;
      const rad = Math.abs(((1 - top.y) / 2) * r.height + r.top - py);
      const d = Math.hypot(cx - px, cy - py);
      return d < rad ? Math.sign(cx - px) || 1 : 0;
    };
    const hit = (dir: number, force: number) => {
      spring.current.v += 9 * force;
      recoil.current.v += 3.2 * force * dir;
    };
    const move = (e: PointerEvent) => {
      pointerRef.current.x = (e.clientX / innerWidth) * 2 - 1;
      pointerRef.current.y = -((e.clientY / innerHeight) * 2 - 1);
      // una pasada rápida por encima también es un golpe (más flojo)
      const now = performance.now(), dtm = Math.max(1, now - last.t);
      const speed = Math.hypot(e.clientX - last.x, e.clientY - last.y) / dtm;
      last = { x: e.clientX, y: e.clientY, t: now };
      if (speed > 2.2) {
        const side2 = over(e.clientX, e.clientY);
        if (side2) hit(side2, Math.min(1, speed / 5) * 0.6);
      }
    };
    const down = (e: PointerEvent) => {
      const side2 = over(e.clientX, e.clientY);
      if (side2) hit(side2, 1);
    };
    addEventListener("pointermove", move, { passive: true });
    addEventListener("pointerdown", down, { passive: true });
    return () => {
      removeEventListener("pointermove", move);
      removeEventListener("pointerdown", down);
    };
  }, [side, gl, camera, size]);
  const s = useRef<SkullPose>({ ...SKULL_REST });
  const ready = useRef(false);
  const red = useRef(false);
  const seed = side * 1.7;

  useFrame((state, dt) => {
    const P = pose.current, S = s.current, t = state.clock.elapsedTime;
    const k = Math.min(1, dt * 7);
    for (const key of KEYS) S[key] = lerp(S[key], P[key], k);
    const g = root.current;
    if (!g) return;
    const flick = 0.85 + Math.sin(t * 13) * 0.05 + Math.sin(t * 7.3) * 0.06 + Math.sin(t * 23.1) * 0.04;
    // runas y ojo: su propio brillo; el ojo pasa a rojo (sin su mapa) en la medianoche
    // con la cámara dentro de la cuenca, el hueso se apaga: que mande la gema
    for (const m of rig.skin) m.emissiveIntensity = (0.08 + 0.55 * S.eye * flick) * (1 - 0.8 * S.close);
    const wantRed = S.red > 0.5;
    if (wantRed !== red.current) {
      red.current = wantRed;
      rig.eye.emissiveMap = wantRed ? null : rig.eyeMap;
      rig.eye.emissive.set(wantRed ? BLOOD : "#ffffff");
      rig.eye.needsUpdate = true;
    }
    rig.eye.emissiveIntensity = 0.3 + 2.2 * S.eye * flick;
    // la gema: esmeralda → rubí; un destello interior cada ~7 s (sube en 0,35 s y se apaga en 1,2 s), más el pulso de vela
    const cyc = (t + seed * 2.3) % 7, flare = cyc < 0.35 ? cyc / 0.35 : Math.max(0, 1 - (cyc - 0.35) / 1.2);
    const gu = gem.mat.uniforms;
    if (!side) gu.uAbsorb.value.copy(EMERALD).lerp(RUBY, S.red);
    gu.uTint.value.setRGB(1, 1, 1);
    gu.uEnvI.value = hdr ? 0.75 : 1.5;
    // la piedra gira despacio sobre su eje: las facetas centellean
    if (gemMesh.current) gemMesh.current.rotation.y = t * 0.35 + seed;
    // el foco que saca los destellos: barre despacio por delante y por arriba (como las tomas de luz de Quilate), así cada
    // faceta se enciende un momento
    gu.uKeyDir.value.set(Math.cos(t * 0.7 + seed) * 0.9, 0.55 + Math.sin(t * 0.5) * 0.35, 1).normalize();
    gu.uKeyColor.value.setRGB(1, 0.95, 0.9);
    gu.uKeyI.value = 7;
    gu.uGlow.value.setScalar(S.eye * (0.25 + 4 * flare * flare) * flick);
    if (glow.current) {
      if (side) glow.current.color.copy(stone.color);
      else glow.current.color.copy(GHOST).lerp(BLOOD, S.red);
      glow.current.intensity = 0.45 * S.eye * flick * (1 + 4 * flare * flare) * (1 - 0.7 * S.close);
    }

    if (side) {
      // acompañantes del trío: suben a los lados, con sombrero, y castañetean a destiempo
      const e = S.trio;
      g.visible = e > 0.02;
      g.position.set(side * 1.75, -0.15 - (1 - e) * 2.2, -1.2);
      g.scale.setScalar(Math.max(0.001, 0.7 * e));
      g.rotation.set(0.05, -side * 0.45 + Math.sin(t * 0.7 + seed) * 0.15, side * 0.06);
      rig.pivot.rotation.x = JAW_SHUT + 0.1 + Math.max(0, Math.sin(t * 9 + seed)) * 0.25 * e;
      rig.hat.visible = true;
      rig.hat.position.y = rig.hatY;
      return;
    }

    // mira al puntero (con retraso), cabecea hacia abajo de vez en cuando y retrocede si se la golpea
    const ptr = pointerRef.current, kk = Math.min(1, dt * 3);
    look.current.x += (ptr.x * 0.32 - look.current.x) * kk;
    look.current.y += (-ptr.y * 0.18 - look.current.y) * kk;
    const nod = 0.16 * Math.pow(Math.max(0, Math.sin(t * 0.21 - 1)), 6);
    // la mandíbula y el golpe: un muelle amortiguado (sin motor de físicas; docs/20 §2f). x'' = −k·x − c·x' + impulsos
    const sp = spring.current, dts = Math.min(dt, 1 / 30);
    sp.v += (-140 * sp.x - 7 * sp.v) * dts;
    sp.x += sp.v * dts;
    const hr = recoil.current;
    hr.v += (-90 * hr.x - 9 * hr.v) * dts;
    hr.x += hr.v * dts;
    g.rotation.y = S.yaw + Math.sin(t * 0.45) * 0.12 + look.current.x + hr.x * 0.6;
    g.rotation.x = 0.06 + Math.sin(t * 0.33) * 0.04 + nod + look.current.y - hr.x * 0.35;
    // un pelín más abajo que el centro (la cabeza tiende a quedar alta) y un respiro arriba y abajo
    g.position.y = -0.07 + Math.sin(t * 0.8) * 0.02;
    // el modelo viene con la boca abierta: JAW_SHUT la cierra y desde ahí abre la pose (y el muelle la balancea)
    rig.pivot.rotation.x = JAW_SHUT + S.jaw * 0.5 + Math.max(0, Math.sin(t * 10)) * 0.16 * S.talk + Math.max(-0.12, sp.x);
    // el sombrero cae desde arriba y se asienta
    rig.hat.visible = S.hat > 0.01;
    rig.hat.position.y = rig.hatY + (1 - S.hat) * (1 - S.hat) * rig.hatDrop;
    driveCamera(camera, g, S, rig.eyeLocal, focus);
    if (!ready.current) {
      ready.current = true;
      onReady?.();
    }
  });

  return (
    <group ref={root}>
      <primitive object={rig.holder} />
      <pointLight ref={glow} position={[rig.eyeLocal.x, rig.eyeLocal.y, rig.eyeLocal.z + 0.15]} distance={1.6} decay={2} />
      {/* la mesa de la talla (+y) mira hacia fuera de la cuenca (+z) */}
      <group position={rig.eyeLocal} rotation={[Math.PI / 2 - 0.2, 0, 0]}>
        <mesh ref={gemMesh} geometry={gem.geo} material={gem.mat} />
      </group>
    </group>
  );
}

/** Si el modelo no carga (red, Draco), la calavera procedural ocupa su sitio. */
class SkullFallback extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
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
      <SkullFallback
        fallback={
          <>
            <Skull pose={pose} focus={focus} onReady={onReady} />
            <Skull pose={pose} side={-1} />
            <Skull pose={pose} side={1} />
          </>
        }
      >
        <Suspense fallback={null}>
          <PirateSkull pose={pose} focus={focus} onReady={onReady} />
          <PirateSkull pose={pose} side={-1} />
          <PirateSkull pose={pose} side={1} />
        </Suspense>
      </SkullFallback>
    </Canvas>
  );
}
