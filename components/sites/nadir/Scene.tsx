"use client";

import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { COLORS } from "./data";
import { createSeedArtifact, poseSeed } from "./seed-model";
import { seedOpening, seedStory, seedFlash, seedSignalFlash } from "./seed-motion";
import { createSeedOptics } from "./seed-optics";
import { seedFraming } from "./seed-framing";

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
  const seed = useMemo(() => createSeedArtifact(), []);
  const optics = useMemo(() => createSeedOptics(), []);
  useEffect(() => { seed.core.add(optics.flare); return () => optics.dispose(); }, [seed, optics]);
  useEffect(() => () => seed.dispose(), [seed]);
  const framingGeometry = useMemo(() => {
    const meshes: THREE.Mesh[] = [];
    seed.root.traverse(object => {
      if (!(object as THREE.Mesh).isMesh || object.userData.previewOnly) return;
      const mesh = object as THREE.Mesh;
      mesh.geometry.computeBoundingBox(); meshes.push(mesh);
    });
    return { meshes, box: new THREE.Box3(), part: new THREE.Box3(), size: new THREE.Vector3(), center: new THREE.Vector3(), focus: new THREE.Vector3() };
  }, [seed]);
  const stars = useRef<THREE.Points>(null);
  const fill = useRef<THREE.AmbientLight>(null);
  const key = useRef<THREE.DirectionalLight>(null);
  const rim = useRef<THREE.DirectionalLight>(null);
  const animationTime = useRef(0);
  const interaction = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, rest: 0, lastMove: 0, progress: flight.current.progress, chapter: flight.current.chapter });
  useEffect(() => {
    const reset = () => { interaction.current.targetX = 0; interaction.current.targetY = 0; };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      interaction.current.targetX = THREE.MathUtils.clamp(event.clientX / innerWidth * 2 - 1, -1, 1);
      interaction.current.targetY = THREE.MathUtils.clamp(event.clientY / innerHeight * 2 - 1, -1, 1);
    };
    const leave = (event: PointerEvent) => { if (!event.relatedTarget) reset(); };
    // Listen above the decorative canvas too: the story text receives the pointer events.
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerout", leave);
    window.addEventListener("blur", reset);
    window.addEventListener("resize", reset);
    return () => {
      window.removeEventListener("pointermove", move); window.removeEventListener("pointerout", leave);
      window.removeEventListener("blur", reset); window.removeEventListener("resize", reset);
    };
  }, []);
  const cue = useRef({ key: -1, start: -10, reveal: false, strength: 0 });
  const mechanism = useRef<Pose>({ ...POSES[flight.current.chapter][0] });
  const sampled = useMemo(() => [{ ...POSES[0][0] }, { ...POSES[0][0] }], []);
  const smoothed = useRef({ chapter: flight.current.chapter, progress: 0, side: 1, reading: 0, message: 0, reveal: 0 });
  const { camera, size, scene, gl } = useThree();
  useEffect(() => () => { gl.domElement.style.maskImage = ""; }, [gl]);
  const lightColors = useMemo(() => ({ copper: new THREE.Color(COLORS.copper), signal: new THREE.Color(COLORS.signal) }), []);
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
  useFrame((_, dt) => {
    if (!root.current) return;
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
    const input = interaction.current;
    if (Math.abs(f.progress - input.progress) > .0002 || f.chapter !== input.chapter) input.lastMove = t;
    input.progress = f.progress; input.chapter = f.chapter;
    const follow = 1 - Math.exp(-Math.min(dt, .1) * 3);
    input.x = THREE.MathUtils.lerp(input.x, input.targetX, follow);
    input.y = THREE.MathUtils.lerp(input.y, input.targetY, follow);
    input.rest = THREE.MathUtils.lerp(input.rest, t - input.lastMove > .6 ? 1 : 0, follow);
    const chapter = Math.min(1, Math.floor(s.chapter));
    samplePose(chapter, s.progress, sampled[0]);
    samplePose(chapter + 1, s.progress, sampled[1]);
    const pose = mechanism.current;
    for (const key of POSE_KEYS) pose[key] = THREE.MathUtils.lerp(sampled[0][key], sampled[1][key], s.chapter - chapter);
    pose.spread += s.reveal * .4;
    const story = seedStory(s.chapter, s.progress);
    const cueKey = f.chapter * 4 + Math.round(s.progress * 3);
    if (cueKey !== cue.current.key) {
      cue.current.key = cueKey;
      if (cueKey % 4 > 0) { cue.current.start = t; cue.current.strength = .65 + f.chapter * .23 + (cueKey % 4 === 2 ? .25 : 0); }
    }
    if (f.revealed && !cue.current.reveal) { cue.current.start = t; cue.current.strength = 1.5; }
    cue.current.reveal = f.revealed;
    const flash = Math.max(seedSignalFlash(t) * (.6 + s.chapter * .25), seedFlash(t - cue.current.start) * cue.current.strength);
    const open = seedOpening(s.chapter, s.progress, t);
    const explode = story.explode;
    poseSeed(seed, { open, explode, twist: pose.twist, pulse: Math.pow(Math.max(0, Math.sin(t * Math.PI / 19)), 16), reveal: Math.max(s.reveal, story.reveal), energy: story.energy, flash });
    optics.update(flash, size.width, size.height, gl.getPixelRatio());
    seed.root.userData.motionTime = t;
    seed.root.userData.story = { ...story, flash, cue: cueKey };
    // Cámara y escala son independientes: el dolly tiene un zoom visible.
    const referenceDistance = mobile ? 10.4 : 9.7;
    const distance = referenceDistance / (0.8 + pose.zoom * .2) - s.chapter * .18 - s.reveal * .2;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, distance, damping);
    const halfHeight = Math.tan(THREE.MathUtils.degToRad(46 / 2)) * camera.position.z;
    const halfWidth = halfHeight * size.width / size.height;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mobile ? 0 : s.side * s.progress * 0.14, damping);
    const frame = seedFraming(s.chapter, s.progress, mobile);
    const subtle = (1 - frame.detail * .5) * (mobile ? .55 : 1);
    const idleYaw = Math.sin(t * .23) * .055 * input.rest * subtle;
    const idlePitch = Math.sin(t * .17) * .012 * input.rest * subtle;
    const mouseWeight = (.25 + input.rest * .75) * subtle;
    const mouseYaw = input.x * .055 * mouseWeight, mousePitch = input.y * .028 * mouseWeight;
    root.current.position.set(0, 0, 0); root.current.scale.setScalar(1);
    root.current.rotation.set((pose.pitch * .28 + story.pitch) * (mobile ? .6 : 1) + idlePitch + mousePitch, (mobile ? pose.yaw * .1 + story.yaw * .12 : pose.yaw * .3 + story.yaw) + idleYaw + mouseYaw, pose.roll * .42 + story.transit * .16);
    seed.root.userData.interaction = { rest: input.rest, x: input.x, y: input.y, idleYaw, idlePitch, mouseYaw, mousePitch };
    root.current.updateMatrixWorld(true);
    // Measure only physical parts. Optical quads and glow are not framing constraints.
    const geometry = framingGeometry;
    geometry.box.makeEmpty();
    for (const mesh of geometry.meshes) geometry.box.union(geometry.part.copy(mesh.geometry.boundingBox!).applyMatrix4(mesh.matrixWorld));
    geometry.box.getSize(geometry.size); geometry.box.getCenter(geometry.center);
    const header = mobile ? (size.width <= 600 ? 96 : 104) : 124;
    const top = 1 - 2 * header / size.height;
    const bottom = mobile ? 1 - 2 * size.height * (.58 - s.reading * .12) / size.height : -.94;
    const height = Math.max(.25, top - bottom);
    const center = frame.interlude;
    const availableWidth = mobile ? 1.82 : THREE.MathUtils.lerp(.9, 1.86, center);
    const overview = Math.min(halfWidth * availableWidth / geometry.size.x, halfHeight * height / geometry.size.y);
    // Account for perspective depth in general shots; detail shots deliberately crop the shell.
    const fit = overview / (1 + Math.max(0, geometry.box.max.z) * overview / camera.position.z);
    const detailHeight = mobile ? .29 : THREE.MathUtils.lerp(.64, .72, center);
    const close = halfHeight * 2 * detailHeight / 2.7;
    const scale = THREE.MathUtils.lerp(fit, close, frame.detail);
    const x = mobile ? 0 : THREE.MathUtils.lerp(pose.x, 0, center);
    const y = THREE.MathUtils.lerp((top + bottom) / 2, -.02, center * (mobile ? .1 : 1));
    geometry.focus.set(0, seed.core.position.y + frame.focusY, 0).applyEuler(root.current.rotation);
    geometry.center.lerp(geometry.focus, frame.detail);
    root.current.scale.setScalar(scale);
    root.current.position.set(camera.position.x + halfWidth * x - geometry.center.x * scale, halfHeight * y - geometry.center.y * scale, -geometry.center.z * scale * frame.detail);
    seed.root.userData.framing = { ...frame, scale, x, y, mode: center > .5 ? "interlude" : frame.detail > .28 ? "detail" : "overview" };
    // A soft editorial crop protects the reading column while allowing large foreground pieces.
    if (mobile) {
      const edge = (46 + (1 - s.reading) * 16).toFixed(2);
      gl.domElement.style.maskImage = "linear-gradient(to bottom, transparent 0px, black " + header + "px, black " + (Number(edge) - 5) + "%, transparent " + edge + "%)";
    } else {
      const alpha = (1 - frame.detail * (1 - center)).toFixed(3);
      gl.domElement.style.maskImage = x < 0
        ? "linear-gradient(to right, black 0%, black 43%, rgba(0,0,0," + alpha + ") 55%, rgba(0,0,0," + alpha + ") 100%)"
        : "linear-gradient(to right, rgba(0,0,0," + alpha + ") 0%, rgba(0,0,0," + alpha + ") 45%, black 57%, black 100%)";
    }
    if (stars.current) stars.current.rotation.z = t * 0.002;
    if (fill.current) fill.current.intensity = 0.2 + s.chapter * 0.07;
    if (key.current) key.current.intensity = 1.3 + s.chapter * 0.5;
    if (rim.current) {
      rim.current.intensity = 3.2 - s.chapter * 0.45;
      rim.current.color.lerpColors(lightColors.copper, lightColors.signal, s.chapter / 2);
    }
    scene.environmentIntensity = 0.5 + s.chapter * 0.12;
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
      <primitive object={seed.root} dispose={null} />
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
  return <Canvas shadows frameloop={visible ? "always" : "never"} camera={{ position: [0, 0, 9.7], fov: 46, near: 0.1, far: 60 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }} onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1; }}>
    <Orbital {...props} />
  </Canvas>;
}
