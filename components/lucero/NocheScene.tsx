"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { PARADAS } from "./data";

/* Cielo por tramo del viaje: t, horizonte y cénit. */
const CIELO: [number, string, string][] = [
  [0, "#ff9a5c", "#4a2a6e"], [.13, "#4b2f63", "#141238"], [.3, "#141a3a", "#05060f"], [.7, "#1a2140", "#060814"],
  [.8, "#b4647a", "#2a2a5e"], [.9, "#ffc58f", "#7aa0d0"], [1, "#ffe3b8", "#9fd0ee"],
];
const a = new THREE.Color(), b = new THREE.Color();
function tono(t: number, indice: 1 | 2, salida: THREE.Color) {
  const siguiente = CIELO.findIndex((k) => k[0] > t);
  const i = siguiente < 0 ? CIELO.length - 1 : Math.max(0, siguiente - 1);
  const [t0, ...c0] = CIELO[i], [t1, ...c1] = CIELO[Math.min(i + 1, CIELO.length - 1)];
  const k = t1 > t0 ? THREE.MathUtils.clamp((t - t0) / (t1 - t0), 0, 1) : 0;
  return salida.copy(a.set(c0[indice - 1] as string)).lerp(b.set(c1[indice - 1] as string), k);
}
/* Luz de día: 1 al atardecer y al amanecer, 0 en plena noche. */
const dia = (t: number) => Math.max(1 - t / .16, (t - .74) / .2, 0);

function Cielo({ avance }: { avance: RefObject<number> }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uAbajo: { value: new THREE.Color() }, uArriba: { value: new THREE.Color() } }), []);
  useFrame(() => {
    tono(avance.current, 1, uniforms.uAbajo.value);
    tono(avance.current, 2, uniforms.uArriba.value);
  });
  return <mesh position={[0, 8, -90]}>
    <planeGeometry args={[320, 120]} />
    <shaderMaterial ref={material} uniforms={uniforms} depthWrite={false}
      vertexShader="varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }"
      fragmentShader={"varying vec2 vUv; uniform vec3 uAbajo; uniform vec3 uArriba;\nvoid main(){ gl_FragColor = vec4(mix(uAbajo, uArriba, smoothstep(.34, .78, vUv.y)), 1.0);\n#include <colorspace_fragment>\n}"} />
  </mesh>;
}

function Estrellas({ avance }: { avance: RefObject<number> }) {
  const material = useRef<THREE.PointsMaterial>(null);
  const geometria = useMemo(() => {
    const p = new Float32Array(900);
    for (let i = 0; i < 300; i++) { p[i * 3] = (((i * 137.5) % 360) / 360 - .5) * 220; p[i * 3 + 1] = ((i * 53.3) % 100) / 100 * 60 + 2; p[i * 3 + 2] = -80; }
    return new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(p, 3));
  }, []);
  useFrame(() => { if (material.current) material.current.opacity = 1 - Math.min(1, dia(avance.current) * 1.6); });
  return <points geometry={geometria}><pointsMaterial ref={material} color="#fff4d6" size={.42} transparent /></points>;
}

function Astros({ avance }: { avance: RefObject<number> }) {
  const luna = useRef<THREE.Mesh>(null), sol = useRef<THREE.Mesh>(null);
  useFrame(() => {
    const t = avance.current;
    if (luna.current) { luna.current.position.set(-34 + t * 96, 26 - Math.pow((t - .42) * 3.2, 2) * 7, -78); luna.current.visible = t < .84; }
    if (sol.current) { sol.current.position.y = -9 + Math.max(0, t - .78) * 118; sol.current.visible = t > .76; }
  });
  return <>
    <mesh ref={luna}><circleGeometry args={[3.6, 48]} /><meshBasicMaterial color="#f7ecd0" /></mesh>
    <mesh ref={sol} position={[24, -9, -78]}><circleGeometry args={[6, 64]} /><meshBasicMaterial color="#fff0c4" /></mesh>
  </>;
}

/* Sierra que se repite sin costura: la suma de senos tiene el mismo periodo que el ancho de la tira. */
const cresta = (f: number, alto: number, semilla: number) => alto * (.5 + .28 * Math.sin(f * 2 + semilla) + .16 * Math.sin(f * 5 + semilla * 2) + .06 * Math.sin(f * 13 + semilla * 3));
function sierra(ancho: number, alto: number, semilla: number) {
  const n = 220, v: number[] = [], indices: number[] = [];
  for (let i = 0; i <= n; i++) {
    const x = (i / n) * ancho, y = cresta((i / n) * Math.PI * 2, alto, semilla);
    v.push(x, y, 0, x, -30, 0);
    if (i < n) { const j = i * 2; indices.push(j, j + 1, j + 2, j + 1, j + 3, j + 2); }
  }
  return new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute(v, 3)).setIndex(indices);
}

function Tira({ avance, distancia, z, ancho, alto, semilla, mezcla, base, hundir, pueblos = 0 }: { avance: RefObject<number>; distancia: RefObject<number>; z: number; ancho: number; alto: number; semilla: number; mezcla: number; base: number; hundir: number; pueblos?: number }) {
  const grupo = useRef<THREE.Group>(null), luces = useRef<THREE.PointsMaterial>(null);
  // ventanas encendidas: racimos pequeños bajo la cresta, repartidos de forma estable
  const ventanas = useMemo(() => {
    const p: number[] = [];
    for (let i = 0; i < pueblos; i++) {
      const c = (i * 61.8 % 100) / 100 * ancho;
      for (let j = 0; j < 7; j++) {
        const x = c + ((j * 37 % 11) - 5) * .5;
        p.push(x, cresta((x / ancho) * Math.PI * 2, alto, semilla) * (.45 + (j % 3) * .1), .1);
      }
    }
    return new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute(p, 3));
  }, [pueblos, ancho, alto, semilla]);
  const geometria = useMemo(() => sierra(ancho, alto, semilla), [ancho, alto, semilla]);
  const material = useMemo(() => new THREE.MeshBasicMaterial(), []);
  const oscuro = useMemo(() => new THREE.Color("#04060c"), []);
  useFrame(() => {
    if (grupo.current) {
      grupo.current.position.x = -ancho * 1.5 - (distancia.current % ancho);
      // al final las lomas se hunden y dejan ver el mar
      grupo.current.position.y = base - Math.max(0, avance.current - .93) * hundir;
    }
    if (luces.current) luces.current.opacity = 1 - Math.min(1, dia(avance.current) * 1.6);
    tono(avance.current, 1, material.color).lerp(oscuro, mezcla);
  });
  return <group ref={grupo} position={[0, base, z]}>
    {[0, 1, 2, 3].map((i) => <mesh key={i} geometry={geometria} material={material} position={[i * ancho, 0, 0]} />)}
    {pueblos ? [0, 1, 2, 3].map((i) => <points key={i} geometry={ventanas} position={[i * ancho, 0, 0]}><pointsMaterial ref={i === 0 ? luces : undefined} color="#ffcf7a" size={.3} transparent /></points>) : null}
  </group>;
}

function Mar({ avance }: { avance: RefObject<number> }) {
  const material = useRef<THREE.MeshBasicMaterial>(null);
  const malla = useRef<THREE.Mesh>(null);
  useFrame(() => {
    tono(avance.current, 2, material.current!.color).lerp(a.set("#1f6f8b"), .55);
    malla.current!.visible = avance.current > .9;
  });
  return <mesh ref={malla} position={[0, -14, -70]}><planeGeometry args={[320, 22]} /><meshBasicMaterial ref={material} /></mesh>;
}

function Postes({ avance, distancia }: { avance: RefObject<number>; distancia: RefObject<number> }) {
  const malla = useRef<THREE.InstancedMesh>(null);
  const material = useRef<THREE.MeshBasicMaterial>(null);
  const m = useMemo(() => new THREE.Matrix4(), []);
  const SEP = 16, N = 8;
  useFrame(() => {
    if (!malla.current) return;
    const d = distancia.current * 1.9 % SEP;
    for (let i = 0; i < N; i++) { m.makeTranslation((i - N / 2) * SEP - d, 1.2, -7); malla.current.setMatrixAt(i, m); }
    malla.current.instanceMatrix.needsUpdate = true;
    material.current?.color.setRGB(.02 + dia(avance.current) * .12, .02 + dia(avance.current) * .1, .04 + dia(avance.current) * .1);
  });
  return <instancedMesh ref={malla} args={[undefined, undefined, N]} frustumCulled={false}>
    <boxGeometry args={[.07, 11, .07]} /><meshBasicMaterial ref={material} />
  </instancedMesh>;
}

function Estacion({ avance }: { avance: RefObject<number> }) {
  const grupo = useRef<THREE.Group>(null);
  // Bilbao y Cádiz quedan fuera: la toma abre con el paisaje y cierra con el mar
  const paradas = useMemo(() => PARADAS.slice(1, -1).map((p) => p.minutos / 660), []);
  useFrame(() => {
    if (!grupo.current) return;
    const t = avance.current;
    const cerca = paradas.reduce((m, p) => (Math.abs(p - t) < Math.abs(m - t) ? p : m), paradas[0]);
    grupo.current.position.x = (cerca - t) * 760;
    grupo.current.visible = Math.abs(cerca - t) < .035;
  });
  return <group ref={grupo} position={[0, -3.4, -14]} scale={.62}>
    <mesh position={[0, -.2, 0]}><boxGeometry args={[46, .7, 3]} /><meshBasicMaterial color="#2b2a33" /></mesh>
    <mesh position={[0, -1.4, -3.5]}><boxGeometry args={[60, 2, 1]} /><meshBasicMaterial color="#0c0d14" /></mesh>
    <mesh position={[3, 2.5, -2]}><boxGeometry args={[24, 5.4, 2]} /><meshBasicMaterial color="#37303a" /></mesh>
    {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[-6 + i * 1.7, 2.8, -.95]}><planeGeometry args={[.9, 1.7]} /><meshBasicMaterial color={i % 4 === 1 ? "#5d5560" : "#ffcf7a"} toneMapped={false} /></mesh>)}
    {[-20, -12, -4, 4, 12, 20].map((x) => <group key={x} position={[x, 0, 1]}>
      <mesh position={[0, 2.2, 0]}><boxGeometry args={[.1, 4.4, .1]} /><meshBasicMaterial color="#14141c" /></mesh>
      <mesh position={[0, 4.5, 0]}><sphereGeometry args={[.28, 16, 16]} /><meshBasicMaterial color="#ffe2a8" toneMapped={false} /></mesh>
    </group>)}
  </group>;
}

function Camara({ avance, distancia, quieto }: { avance: RefObject<number>; distancia: RefObject<number>; quieto: boolean }) {
  const { camera, pointer } = useThree();
  const antes = useRef(0);
  useFrame((_, dt) => {
    const paso = avance.current - antes.current;
    antes.current = avance.current;
    distancia.current += paso * 1400 + (quieto ? 0 : Math.min(dt, .05) * 3.2);
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, quieto ? 0 : pointer.x * .5, .05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, (quieto ? 0 : pointer.y * .25) + (quieto ? 0 : Math.sin(distancia.current * 3) * .012), .08);
  });
  return null;
}

export default function NocheScene({ avance }: { avance: RefObject<number> }) {
  const distancia = useRef(0);
  const quieto = useRef(false);
  useEffect(() => { quieto.current = matchMedia("(prefers-reduced-motion: reduce)").matches; }, []);
  return <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 8], fov: 42, far: 200 }} gl={{ antialias: true, alpha: false }} aria-hidden="true">
    <Cielo avance={avance} />
    <Estrellas avance={avance} />
    <Astros avance={avance} />
    <Mar avance={avance} />
    <Tira avance={avance} distancia={distancia} z={-60} ancho={160} alto={15} semilla={1.2} mezcla={.45} base={-6} hundir={380} />
    <Tira avance={avance} distancia={distancia} z={-34} ancho={120} alto={9} semilla={3.4} mezcla={.68} base={-6} hundir={200} pueblos={9} />
    <Tira avance={avance} distancia={distancia} z={-16} ancho={80} alto={3.6} semilla={5.1} mezcla={.86} base={-4.6} hundir={0} />
    <Estacion avance={avance} />
    <Postes avance={avance} distancia={distancia} />
    <Camara avance={avance} distancia={distancia} quieto={quieto.current} />
  </Canvas>;
}
