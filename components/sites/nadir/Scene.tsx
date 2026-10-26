"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type MutableRefObject, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { COLORS } from "./data";
import { closedRingSegment } from "./geometry";

export type Flight = { chapter: number; progress: number; side: number; reading: number; message: number; revealed: boolean };
type Props = { flight: MutableRefObject<Flight>; onReady: () => void };
type Pose = { x: number; y: number; zoom: number; pitch: number; yaw: number; roll: number; spread: number; split: number; twist: number; core: number };
const POSES: Pose[][] = [
  [
    { x: .51, y: .09, zoom: 1.1, pitch: .25, yaw: -.38, roll: -.36, spread: 0, split: 0, twist: 0, core: .85 },
    { x: .51, y: .16, zoom: .86, pitch: .5, yaw: .2, roll: -.18, spread: .15, split: 0, twist: .3, core: .95 },
    { x: -.51, y: .12, zoom: 1.2, pitch: .9, yaw: -.6, roll: .25, spread: .35, split: 0, twist: 1.1, core: 1.1 },
    { x: .51, y: .09, zoom: 1.05, pitch: .15, yaw: .7, roll: -.4, spread: .22, split: 0, twist: 1.7, core: 1 },
  ],
  [
    { x: .51, y: .09, zoom: 1.05, pitch: .3, yaw: .7, roll: -.4, spread: .22, split: 0, twist: 1.7, core: 1 },
    { x: .51, y: .15, zoom: .86, pitch: .9, yaw: -.4, roll: .3, spread: .55, split: 0, twist: 2.1, core: 1.1 },
    { x: -.51, y: .12, zoom: 1.25, pitch: 1.3, yaw: .8, roll: -.35, spread: .95, split: 0, twist: 2.6, core: 1.25 },
    { x: .51, y: .09, zoom: 1.12, pitch: .4, yaw: -.8, roll: .6, spread: .6, split: 0, twist: 3, core: 1.35 },
  ],
  [
    { x: .51, y: .09, zoom: 1.05, pitch: .4, yaw: -.8, roll: .6, spread: .6, split: 0, twist: 3, core: 1.35 },
    { x: .51, y: .14, zoom: .9, pitch: .9, yaw: .5, roll: -.25, spread: .85, split: 0, twist: 3.5, core: 1.4 },
    { x: -.51, y: .12, zoom: 1.2, pitch: .25, yaw: -.3, roll: .8, spread: .45, split: 0, twist: 4, core: 1.5 },
    { x: 0, y: .5, zoom: .65, pitch: .15, yaw: .2, roll: 0, spread: .25, split: 0, twist: 4.5, core: 1.5 },
  ],
];
const POSE_KEYS = Object.keys(POSES[0][0]) as (keyof Pose)[];
function samplePose(chapter: number, progress: number, result: Pose) {
  const position = Math.min(3, Math.max(0, progress * 3));
  const index = Math.min(2, Math.floor(position));
  const raw = position - index;
  const t = raw * raw * (3 - 2 * raw);
  const a = POSES[chapter][index], b = POSES[chapter][index + 1];
  for (const key of POSE_KEYS) result[key] = THREE.MathUtils.lerp(a[key], b[key], t);
  // El despiece anticipa el traslado; en medio del viaje abre, se aleja y gira.
  const transit = Math.sin(raw * Math.PI) ** 2;
  result.split += transit * 1.5;
  result.spread += transit * .25;
  result.twist += transit * .35;
  if (a.x * b.x < 0) { result.y += transit * .08; result.zoom *= 1 - transit * .08; }
}

/** Una llamada por familia de piezas; las matrices se calculan solo al montar. */
function Repeated({ count, place, colored = false, instanceRef, children }: { count: number; place: (i: number, object: THREE.Object3D) => void; colored?: boolean; instanceRef?: MutableRefObject<THREE.InstancedMesh | null>; children: ReactNode }) {
  const fallbackRef = useRef<THREE.InstancedMesh>(null);
  const mesh = instanceRef ?? fallbackRef;
  useLayoutEffect(() => {
    if (!mesh.current) return;
    const object = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      object.position.set(0, 0, 0); object.rotation.set(0, 0, 0); object.scale.setScalar(1);
      place(i, object); object.updateMatrix(); mesh.current.setMatrixAt(i, object.matrix);
      if (colored) mesh.current.setColorAt(i, new THREE.Color(i % 5 === 0 ? COLORS.copper : COLORS.mist));
    }
    mesh.current.instanceMatrix.needsUpdate = true;
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true;
    mesh.current.computeBoundingSphere();
  }, [count, place, colored]);
  return <instancedMesh ref={mesh} args={[undefined, undefined, count]}>{children}</instancedMesh>;
}

function Ring({ radius, index, mechanism }: { radius: number; index: number; mechanism: MutableRefObject<Pose> }) {
  const segments = useRef<THREE.InstancedMesh>(null);
  const part = useMemo(() => new THREE.Object3D(), []);
  const pivot = useMemo(() => new THREE.Vector3(), []);
  const geometry = useMemo(() => closedRingSegment(radius, index === 0 ? .145 : .095), [radius, index]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  const placements = useMemo(() => ({
    segments: (i: number, object: THREE.Object3D) => { object.rotation.z = i * Math.PI / 4; },
    ticks: (i: number, object: THREE.Object3D) => {
      const a = i / 40 * Math.PI * 2;
      object.position.set(Math.cos(a) * (radius + 0.19), Math.sin(a) * (radius + 0.19), 0);
      object.rotation.z = a; object.scale.x = i % 5 === 0 ? 2.65 : 1;
    },
  }), [radius]);
  useFrame(() => {
    if (!segments.current) return;
    const split = mechanism.current.split;
    for (let k = 0; k < 8; k++) {
      const a = k * Math.PI / 4;
      const offset = split * (.62 + index * .08);
      const dx = Math.cos(a + Math.PI / 8) * offset;
      const dy = Math.sin(a + Math.PI / 8) * offset;
      const direction = k % 2 ? 1 : -1;
      const dz = direction * split * .38;
      part.rotation.set(split * .18 * Math.cos(a), split * .18 * Math.sin(a), a + direction * split * .12);
      // El giro ocurre alrededor del centro de la pieza, no del origen del anillo.
      pivot.set(radius * Math.cos(Math.PI / 8), radius * Math.sin(Math.PI / 8), 0).applyQuaternion(part.quaternion);
      part.position.set(radius * Math.cos(a + Math.PI / 8) + dx - pivot.x, radius * Math.sin(a + Math.PI / 8) + dy - pivot.y, dz - pivot.z);
      part.updateMatrix(); segments.current.setMatrixAt(k, part.matrix);
    }
    segments.current.instanceMatrix.needsUpdate = true;
  });
  return <>
    <Repeated count={8} place={placements.segments} instanceRef={segments}>
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial color={index % 2 ? COLORS.copper : COLORS.mist} metalness={0.86} roughness={0.34 + index * 0.035} />
    </Repeated>
    <mesh><torusGeometry args={[radius + 0.028, 0.009, 6, 128]} /><meshBasicMaterial color={index % 2 ? COLORS.copper : COLORS.signal} transparent opacity={0.35} /></mesh>
    <Repeated count={40} place={placements.ticks} colored><boxGeometry args={[0.045, 0.012, 0.018]} /><meshBasicMaterial /></Repeated>
  </>;
}

function Environment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const room = new RoomEnvironment();
    const pmrem = new THREE.PMREMGenerator(gl);
    const target = pmrem.fromScene(room, 0.04);
    scene.environment = target.texture;
    scene.environmentIntensity = 0.65;
    return () => { scene.environment = null; target.dispose(); pmrem.dispose(); room.dispose(); };
  }, [gl, scene]);
  return null;
}

function Orbital({ flight, onReady }: Props) {
  const root = useRef<THREE.Group>(null);
  const rings = useRef<(THREE.Group | null)[]>([]);
  const core = useRef<THREE.Mesh>(null);
  const stars = useRef<THREE.Points>(null);
  const fill = useRef<THREE.AmbientLight>(null);
  const key = useRef<THREE.DirectionalLight>(null);
  const rim = useRef<THREE.DirectionalLight>(null);
  const coreMaterial = useRef<THREE.MeshPhysicalMaterial>(null);
  const animationTime = useRef(0);
  const mechanism = useRef<Pose>({ ...POSES[flight.current.chapter][0] });
  const sampled = useMemo(() => [{ ...POSES[0][0] }, { ...POSES[0][0] }], []);
  const smoothed = useRef({ chapter: flight.current.chapter, progress: 0, side: 1, reading: 0, message: 0, reveal: 0 });
  const { camera, size, scene } = useThree();
  const lightColors = useMemo(() => ({ copper: new THREE.Color(COLORS.copper), signal: new THREE.Color(COLORS.signal) }), []);
  const fragments = useMemo(() => (i: number, object: THREE.Object3D) => {
    const a = i * 2.399963, r = 3.4 + (i % 4) * 0.22;
    object.position.set(Math.cos(a) * r, Math.sin(a) * r, Math.sin(i * 4) * 1.3);
    object.rotation.set(a, i, 0.4); object.scale.setScalar(0.025 + (i % 3) * 0.018);
  }, []);
  const pointPositions = useMemo(() => {
    const p = new Float32Array(540 * 3);
    for (let i = 0; i < 540; i++) {
      const a = i * 2.399963;
      const r = 6 + ((i * 73) % 101) / 9;
      p[i * 3] = Math.cos(a) * r;
      p[i * 3 + 1] = Math.sin(a) * r * 0.62;
      p[i * 3 + 2] = -3 - ((i * 37) % 113) / 9;
    }
    return p;
  }, []);
  useEffect(() => { onReady(); }, [onReady]);
  useFrame(({ pointer }, dt) => {
    if (!root.current || !core.current) return;
    const f = flight.current;
    const s = smoothed.current;
    const damping = 1 - Math.exp(-Math.min(dt, 0.1) * 4.5);
    s.chapter = THREE.MathUtils.lerp(s.chapter, f.chapter, damping);
    s.progress = THREE.MathUtils.lerp(s.progress, f.progress, damping);
    s.reveal = THREE.MathUtils.lerp(s.reveal, f.revealed ? 1 : 0, damping);
    s.side = THREE.MathUtils.lerp(s.side, f.side, damping);
    s.reading = THREE.MathUtils.lerp(s.reading, f.reading, damping);
    s.message = THREE.MathUtils.lerp(s.message, f.message, damping);
    const t = (animationTime.current += Math.min(dt, 0.1));
    const mobile = size.width <= 900;
    const chapter = Math.min(1, Math.floor(s.chapter));
    samplePose(chapter, s.progress, sampled[0]);
    samplePose(chapter + 1, s.progress, sampled[1]);
    const pose = mechanism.current;
    for (const key of POSE_KEYS) pose[key] = THREE.MathUtils.lerp(sampled[0][key], sampled[1][key], s.chapter - chapter);
    pose.spread += s.reveal * .4;
    // Cámara y escala son independientes: el dolly tiene un zoom visible.
    const referenceDistance = mobile ? 10.4 : 9.7;
    const distance = referenceDistance / (0.8 + pose.zoom * .2) - s.chapter * .18 - s.reveal * .2;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, distance, damping);
    const halfHeight = Math.tan(THREE.MathUtils.degToRad(46 / 2)) * camera.position.z;
    const halfWidth = halfHeight * size.width / size.height;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mobile ? 0 : s.side * s.progress * 0.14, damping);
    root.current.position.set(camera.position.x + (mobile ? 0 : halfWidth * pose.x), halfHeight * (mobile ? .22 + s.reading * .26 : pose.y), 0);
    root.current.rotation.set(pose.pitch + pointer.y * .035, pose.yaw + pointer.x * .06, pose.roll);
    const referenceHeight = Math.tan(THREE.MathUtils.degToRad(23)) * referenceDistance;
    const referenceWidth = referenceHeight * size.width / size.height;
    const scale = mobile
      ? Math.min(referenceWidth * .76, referenceHeight * .38) / 3.1
      : Math.min(referenceWidth * .32, referenceHeight * .54) / 3.1;
    // Esfera que contiene los cuatro anillos incluso abiertos. Se conserva el
    // centro del plano y se limita solo la escala si se acerca al borde.
    const radius = Math.hypot(2.99 + pose.split * 1.4, 1.5 * pose.spread + .4 * pose.split);
    const fitX = Math.max(0.01, halfWidth * 0.96 - Math.abs(root.current.position.x - camera.position.x)) * Math.cos(Math.atan(halfWidth / camera.position.z)) / radius;
    const topLimit = halfHeight * (1 - 2 * (mobile ? 92 : 112) / size.height);
    const verticalRoom = Math.min(topLimit - root.current.position.y, halfHeight * .96 + root.current.position.y);
    const fitY = Math.max(0.01, verticalRoom) * Math.cos(THREE.MathUtils.degToRad(23)) / radius;
    const desiredScale = scale * pose.zoom * (mobile ? 1 - s.reading * .1 : 1);
    root.current.scale.setScalar(Math.min(desiredScale, fitX, fitY));
    rings.current.forEach((ring, i) => {
      if (!ring) return;
      ring.rotation.x = i * .58 + pose.twist * (i % 2 ? -.5 : .42);
      ring.rotation.y = i * .32 + Math.sin(t * .09 + i) * .04 + pose.twist * .18;
      ring.rotation.z = t * (i % 2 ? -.018 : .014) + i * .48 + pose.twist * (i % 2 ? .3 : -.2);
      ring.position.z = (i - 1.5) * pose.spread;
    });
    core.current.rotation.set(t * 0.08, t * 0.12, s.progress);
    core.current.scale.setScalar(pose.core + Math.sin(t * 1.1) * .035 + s.reveal * .5);
    if (stars.current) stars.current.rotation.z = t * 0.002;
    if (fill.current) fill.current.intensity = 0.2 + s.chapter * 0.07;
    if (key.current) key.current.intensity = 1.3 + s.chapter * 0.5;
    if (rim.current) {
      rim.current.intensity = 3.2 - s.chapter * 0.45;
      rim.current.color.lerpColors(lightColors.copper, lightColors.signal, s.chapter / 2);
    }
    scene.environmentIntensity = 0.5 + s.chapter * 0.12;
    if (coreMaterial.current) coreMaterial.current.emissiveIntensity = 0.08 + s.chapter * 0.07 + s.reveal * 0.3 + Math.pow(Math.max(0, Math.sin(t * Math.PI / 19)), 16) * 0.14;
  }, -1);
  return <>
    <Environment />
    <ambientLight ref={fill} intensity={0.2} color={COLORS.mist} />
    <directionalLight ref={key} position={[-4, 5, 3]} intensity={1.3} color={COLORS.ice} />
    <directionalLight ref={rim} position={[4, 1, -3]} intensity={3.2} color={COLORS.copper} />
    <pointLight position={[0, 0, 2]} intensity={2} color={COLORS.signal} distance={12} />
    <points ref={stars}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[pointPositions, 3]} /></bufferGeometry>
      <pointsMaterial color={COLORS.mist} size={0.016} transparent opacity={0.6} sizeAttenuation depthWrite={false} />
    </points>
    <group ref={root} name="nadir-orbital">
      {[2.68, 2.26, 1.84, 1.42].map((radius, i) => <group key={radius} name={`nadir-ring-${i}`} ref={(el) => { rings.current[i] = el; }}>
        <Ring radius={radius} index={i} mechanism={mechanism} />
      </group>)}
      <mesh ref={core}>
        <icosahedronGeometry args={[0.67, 1]} />
        <meshPhysicalMaterial ref={coreMaterial} color={COLORS.signal} metalness={0.5} roughness={0.28} clearcoat={0.5} emissive={COLORS.signal} emissiveIntensity={0.08} />
      </mesh>
      <mesh rotation={[0.3, 0.4, 0.1]}>
        <icosahedronGeometry args={[0.91, 1]} />
        <meshBasicMaterial color={COLORS.signal} wireframe transparent opacity={0.22} />
      </mesh>
      <Repeated count={24} place={fragments} colored><octahedronGeometry args={[1]} /><meshStandardMaterial metalness={0.8} roughness={0.45} /></Repeated>
    </group>
  </>;
}

export default function Scene(props: Props) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    update(); document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  return <Canvas frameloop={visible ? "always" : "never"} camera={{ position: [0, 0, 9.7], fov: 46, near: 0.1, far: 60 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }} onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1; }}>
    <Orbital {...props} />
  </Canvas>;
}
