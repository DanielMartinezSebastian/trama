"use client";

import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { MEDIA } from "./data";

/** Disco con canto, bisel y agujero real; todas sus superficies están cerradas. */
function recordGeometry(hole: boolean) {
  const shape = new THREE.Shape();
  shape.absarc(0, 0, 1.3, 0, Math.PI * 2, false);
  if (hole) {
    const center = new THREE.Path();
    center.absarc(0, 0, .026, 0, Math.PI * 2, true);
    shape.holes.push(center);
  }
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: .055, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: .006, bevelThickness: .006, curveSegments: 96 });
  geometry.translate(0, 0, -.0275);
  const position = geometry.attributes.position;
  const uv = new Float32Array(position.count * 2);
  for (let i = 0; i < position.count; i++) {
    uv[i * 2] = .5 + position.getX(i) / 2.6 * .95;
    uv[i * 2 + 1] = .5 + position.getY(i) / 2.6 * .95;
  }
  geometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  return geometry;
}

function Studio() {
  const { scene, gl } = useThree();
  useEffect(() => {
    const room = new RoomEnvironment();
    const pmrem = new THREE.PMREMGenerator(gl);
    const target = pmrem.fromScene(room, .04);
    scene.environment = target.texture;
    scene.environmentIntensity = .55;
    return () => { scene.environment = null; target.dispose(); room.dispose(); pmrem.dispose(); };
  }, [scene, gl]);
  return null;
}

type Props = { active: boolean; mode: string; view: "disco" | "cubierta"; pointer: MutableRefObject<{ x: number; y: number }>; onReady?: () => void };
function Piece({ mode, view, pointer, onReady }: Props) {
  const [face, cover] = useLoader(THREE.TextureLoader, [MEDIA.record, MEDIA.cover]);
  const geometry = useMemo(() => recordGeometry(true), []);
  const coverGeometry = useMemo(() => recordGeometry(false), []);
  const root = useRef<THREE.Group>(null);
  const disk = useRef<THREE.Mesh>(null);
  const lid = useRef<THREE.Mesh>(null);
  const elapsed = useRef(0);
  const progress = useRef(0);
  const { camera } = useThree();
  useEffect(() => {
    for (const texture of [face, cover]) { texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = 4; }
    const id = requestAnimationFrame(() => onReady?.());
    return () => cancelAnimationFrame(id);
  }, [face, cover, onReady]);
  useEffect(() => () => { geometry.dispose(); coverGeometry.dispose(); }, [geometry, coverGeometry]);
  useEffect(() => {
    const update = () => { progress.current = scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight); };
    update(); addEventListener("scroll", update, { passive: true });
    return () => removeEventListener("scroll", update);
  }, [mode]);
  useFrame((_, delta) => {
    if (!root.current || !disk.current || !lid.current) return;
    const dt = Math.min(delta, .1), damping = 1 - Math.exp(-dt * 4);
    elapsed.current += dt;
    const inspection = view === "cubierta";
    const open = mode === "surcos" ? .38 + progress.current * .35 : mode === "mensaje" ? .15 : .2;
    root.current.rotation.x = THREE.MathUtils.lerp(root.current.rotation.x, -.1 + pointer.current.y * .05 + Math.sin(progress.current * Math.PI) * .12, damping);
    root.current.rotation.y = THREE.MathUtils.lerp(root.current.rotation.y, (mode === "viaje" ? .4 : -.2) + pointer.current.x * .1, damping);
    root.current.rotation.z = THREE.MathUtils.lerp(root.current.rotation.z, mode === "mensaje" ? -.12 : .06, damping);
    disk.current.position.x = THREE.MathUtils.lerp(disk.current.position.x, inspection ? .82 : .25 + open, damping);
    disk.current.position.z = THREE.MathUtils.lerp(disk.current.position.z, inspection ? -.55 : .25, damping);
    disk.current.rotation.y = THREE.MathUtils.lerp(disk.current.rotation.y, inspection ? .65 : -.12, damping);
    disk.current.rotation.z = Math.sin(elapsed.current * .12) * .08;
    lid.current.position.x = THREE.MathUtils.lerp(lid.current.position.x, inspection ? -.1 : -.48, damping);
    lid.current.position.y = THREE.MathUtils.lerp(lid.current.position.y, inspection ? 0 : .14, damping);
    lid.current.position.z = THREE.MathUtils.lerp(lid.current.position.z, inspection ? .4 : -.38 - open, damping);
    lid.current.rotation.y = THREE.MathUtils.lerp(lid.current.rotation.y, inspection ? 0 : -.16, damping);
    const zoom = inspection ? 5.7 : mode === "surcos" ? 6.1 : 5.8;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, zoom, damping);
  });
  return <group ref={root} name="voyager-record">
    <mesh ref={disk} geometry={geometry} position={[.45, 0, .25]}>
      <meshStandardMaterial map={face} color="#f6d989" metalness={.28} roughness={.42} />
    </mesh>
    <mesh ref={lid} geometry={coverGeometry} position={[-.48, .14, -.58]}>
      <meshStandardMaterial map={cover} color="#f3ead6" metalness={.23} roughness={.48} />
    </mesh>
  </group>;
}

export default function RecordScene(props: Props) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    update(); document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  return <Canvas frameloop={props.active && visible ? "always" : "never"} dpr={[1, 1.5]} camera={{ fov: 40, position: [0, 0, 5.8], near: .1, far: 40 }} gl={{ alpha: true, antialias: true }} onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.1; }}>
    <Studio />
    <ambientLight intensity={.7} color="#f3ead6" />
    <directionalLight position={[-3, 4, 5]} intensity={2.4} color="#fff2df" />
    <directionalLight position={[4, -2, -2]} intensity={1.5} color="#e8b64c" />
    <Piece {...props} />
  </Canvas>;
}
