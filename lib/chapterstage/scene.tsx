"use client";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { estadoTarjeta } from "./coreografia";

/*
 * Lienzo de `ChapterStage`: la sala en perspectiva dibujada con líneas (las aristas de un túnel de cajas y sus
 * diagonales, del color de acento) y la tarjeta central con la imagen del capítulo y un fallo de señal (separación de
 * color, desgarros horizontales, líneas de barrido y grano) que se dispara en cada relevo (docs/30 §3).
 */

export type ChapterStageSceneProps = {
  imagenes: string[];
  /** pantallas de scroll desde que la sección se fija (lo escribe el componente) y fronteras de los capítulos */
  u: RefObject<number>;
  fronteras: number[];
  acento: string;
  active: boolean;
  onReady: () => void;
};

const VERT = /* glsl */ `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const FRAG = /* glsl */ `
uniform sampler2D uMapa; uniform float uFallo; uniform float uTiempo; uniform vec3 uTinte; uniform float uAspecto;
varying vec2 vUv;
float h(float x) { return fract(sin(x * 91.17) * 43758.55); }
void main() {
  vec2 uv = vUv;
  // la imagen cubre la tarjeta (object-fit: cover)
  vec2 c = uv - 0.5; c.x *= min(1.0, uAspecto); c.y *= min(1.0, 1.0 / uAspecto); uv = c + 0.5;
  float f = uFallo;
  // desgarros: bandas horizontales que se desplazan a saltos
  float banda = floor(vUv.y * 18.0 + floor(uTiempo * 12.0) * 3.1);
  float salto = step(1.0 - f * 0.55, h(banda)) * (h(banda + 7.0) - 0.5) * 0.25 * f;
  uv.x += salto;
  // separación de color, más fuerte cuanto más fallo
  float s = 0.004 + 0.035 * f;
  vec3 col = vec3(texture2D(uMapa, uv + vec2(s, 0.0)).r, texture2D(uMapa, uv).g, texture2D(uMapa, uv - vec2(s, 0.0)).b);
  // virado al acento (la referencia es roja sobre negro) y líneas de barrido
  float l = dot(col, vec3(0.299, 0.587, 0.114));
  col = mix(col, uTinte * (0.25 + 1.2 * l), 0.55);
  col *= 0.86 + 0.14 * sin(vUv.y * 420.0);
  col += (h(vUv.x * 733.0 + vUv.y * 191.0 + uTiempo) - 0.5) * 0.08 * (0.4 + f);
  gl_FragColor = vec4(col, 1.0);
}`;

function Sala({ acento }: { acento: string }) {
  // túnel de tres cajas cada vez más hondas, con sus diagonales: la «sala» de líneas de la referencia
  const geo = useMemo(() => {
    const p: number[] = [];
    const caja = (w: number, h: number, z: number) => {
      const c = [[-w, -h], [w, -h], [w, h], [-w, h]];
      for (let i = 0; i < 4; i++) p.push(c[i][0], c[i][1], z, c[(i + 1) % 4][0], c[(i + 1) % 4][1], z);
      return c;
    };
    const a = caja(5.2, 3, 0);
    const b = caja(2.1, 1.25, -6);
    caja(1.1, 0.65, -12);
    for (let i = 0; i < 4; i++) p.push(a[i][0], a[i][1], 0, b[i][0], b[i][1], -6);
    // diagonales de la pared del fondo y del suelo
    p.push(-5.2, -3, 0, 2.1, 1.25, -6, 5.2, -3, 0, -2.1, 1.25, -6, -9, 0, 0, 9, 0, 0, 0, -5, 0, 0, 5, 0);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(p, 3));
    return g;
  }, []);
  useEffect(() => () => geo.dispose(), [geo]);
  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial color={acento} transparent opacity={0.35} />
    </lineSegments>
  );
}

function Tarjeta({ imagenes, u, fronteras, acento, onReady }: Omit<ChapterStageSceneProps, "active">) {
  const texturas = useLoader(THREE.TextureLoader, imagenes);
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        uniforms: { uMapa: { value: null }, uFallo: { value: 0 }, uTiempo: { value: 0 }, uTinte: { value: new THREE.Color(acento) }, uAspecto: { value: 1 } },
      }),
    [acento],
  );
  useEffect(() => {
    texturas.forEach((t) => (t.colorSpace = THREE.SRGBColorSpace));
    onReady();
    return () => mat.dispose();
  }, [texturas, mat, onReady]);
  const malla = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    const { activo, fallo } = estadoTarjeta(u.current ?? 0, fronteras);
    const t = texturas[Math.min(activo, texturas.length - 1)];
    mat.uniforms.uMapa.value = t;
    const img = t.image as { width?: number; height?: number } | undefined;
    // aspecto de la imagen frente al de la tarjeta (3:4): para recortarla como un cover
    mat.uniforms.uAspecto.value = img?.width && img?.height ? img.width / img.height / 0.75 : 1;
    mat.uniforms.uFallo.value = fallo;
    mat.uniforms.uTiempo.value += dt;
    // en el relevo la tarjeta tiembla un poco y se encoge
    if (malla.current) {
      malla.current.position.x = fallo * (Math.random() - 0.5) * 0.08;
      malla.current.scale.setScalar(1 - fallo * 0.06);
    }
  });
  return (
    <mesh ref={malla} position={[0, 0, 0.5]} material={mat}>
      <planeGeometry args={[1.5, 2]} />
    </mesh>
  );
}

function Camara() {
  const camera = useThree((s) => s.camera);
  useEffect(() => {
    camera.position.set(0, 0, 6.2);
    camera.lookAt(0, 0, -4);
  }, [camera]);
  return null;
}

export default function ChapterStageScene({ imagenes, u, fronteras, acento, active, onReady }: ChapterStageSceneProps) {
  return (
    <Canvas frameloop={active ? "always" : "never"} dpr={[1, 1.75]} gl={{ alpha: true, antialias: true }} camera={{ fov: 50, near: 0.1, far: 50 }}>
      <Camara />
      <Sala acento={acento} />
      <Suspense fallback={null}>{imagenes.length > 0 && <Tarjeta imagenes={imagenes} u={u} fronteras={fronteras} acento={acento} onReady={onReady} />}</Suspense>
    </Canvas>
  );
}
