"use client";

import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { HDRLoader } from "three/examples/jsm/loaders/HDRLoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { CanvasTexture, Color, CustomBlending, EquirectangularReflectionMapping, Group, HalfFloatType, Mesh, OneFactor, PlaneGeometry, ShaderMaterial, Vector2, Vector3, WebGLCubeRenderTarget, type BufferGeometry, type Texture } from "three";
import { createGemMaterial, setGemGeometry } from "./gemMaterial";
import { loadPiece } from "./pieces";
import { KIT_BASE, kitPiece } from "./ring";
import { brilliantGeometry } from "./ringScene";

/*
 * La portada de Quilate: un brillante grande, centrado, y un haz de luz que sale del puntero. Toma de los ejemplos de pmndrs
 * (diamond-refraction y nextjs-prism) lo que los hace espectaculares, sin drei ni postprocessing:
 *   - un entorno HDR real y con mucho contraste (Aerodynamics Workshop de Poly Haven, CC0) como lo que «ve» la piedra;
 *   - ior alto con aberración por canal (2,65 · 2,75 · 2,88, como el `ior 2.75` del ejemplo) en el material trazado de
 *     Quilate (refracción, reflexión interna total, hasta 6 rebotes), sin mapeo tonal: los brillos pasan de 1;
 *   - bloom (UnrealBloomPass, que trae three) con umbral 1: solo brillan los destellos y el haz;
 *   - el brillante de 57 facetas del kit de Blender.
 * El haz: luz blanca cálida del puntero al diamante, un destello en el punto de impacto y, por el otro lado, unos rayos
 * blancos que salen abiertos (la luz que la piedra devuelve), sin arcoíris.
 *
 * Créditos: la colocación del haz como un plano estirado entre dos puntos (punto medio, largo y giro con atan2) sigue la de
 * `Beam.tsx` del ejemplo https://github.com/pmndrs/examples/tree/main/examples/nextjs-prism (MIT © Poimandres). El resto
 * (material de la gema, destello, rayos de salida y fusión) es propio.
 *
 * `progress` (0–1) lo mueve la página con el scroll: el diamante se encoge y se desplaza hacia la piedra del anillo del
 * recorrido siguiente, y los haces se apagan (la fusión con la escena siguiente).
 */

export type PrismSceneProps = {
  /** puntero en coordenadas normalizadas −1…1 respecto al lienzo; `active` = false hace que el haz se mueva solo */
  pointer: MutableRefObject<{ x: number; y: number; active: boolean }>;
  /** 0 = portada · 1 = el diamante ya ha bajado al anillo */
  progress: MutableRefObject<number>;
  /** a dónde va el diamante al final, en fracción del lienzo (−0,5…0,5) */
  landing: { x: number; y: number };
  /** tamaño final del diamante */
  scaleTo: number;
  active: boolean;
  onReady: () => void;
};

const HDR = "/models/hdr/aerodynamics_workshop_1k.hdr";
const BG = new Color("#0d0b09");
const RAYS = 5;
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
/** Suma luz (color y alfa). */
const LIGHT_BLEND = { blending: CustomBlending, blendSrc: OneFactor, blendDst: OneFactor, blendSrcAlpha: OneFactor, blendDstAlpha: OneFactor } as const;

/** Textura del haz: núcleo blanco y halo que cae rápido a los lados (se estira a lo largo del haz). */
function beamTexture() {
  const c = document.createElement("canvas");
  c.width = 4;
  c.height = 128;
  const x = c.getContext("2d")!;
  const g = x.createLinearGradient(0, 0, 0, 128);
  g.addColorStop(0, "rgba(255,255,255,0)");
  g.addColorStop(0.4, "rgba(255,236,205,0.12)");
  g.addColorStop(0.485, "rgba(255,248,236,0.85)");
  g.addColorStop(0.5, "rgba(255,255,255,1)");
  g.addColorStop(0.515, "rgba(255,248,236,0.85)");
  g.addColorStop(0.6, "rgba(255,236,205,0.12)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  x.fillStyle = g;
  x.fillRect(0, 0, 4, 128);
  return new CanvasTexture(c);
}

/** Destello de impacto: punto, halo y una estrella de cuatro brazos. */
function flareTexture() {
  const S = 256;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const x = c.getContext("2d")!;
  const g = x.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.08, "rgba(255,244,225,0.85)");
  g.addColorStop(0.3, "rgba(255,220,170,0.14)");
  g.addColorStop(1, "rgba(255,200,150,0)");
  x.fillStyle = g;
  x.fillRect(0, 0, S, S);
  x.globalCompositeOperation = "lighter";
  for (const [w, h] of [
    [S, 3],
    [3, S],
  ]) {
    const lg = x.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
    lg.addColorStop(0, "rgba(255,255,255,0.9)");
    lg.addColorStop(1, "rgba(255,255,255,0)");
    x.fillStyle = lg;
    x.fillRect((S - w) / 2, (S - h) / 2, w, h);
  }
  return new CanvasTexture(c);
}

const quadVertex = "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }";
/** el haz: la textura, apagándose en los extremos; `uI` > 1 hace que el bloom lo recoja */
const beamFragment =
  "uniform sampler2D map; uniform float uI; uniform vec3 uColor; varying vec2 vUv; void main(){ vec4 t = texture2D(map, vUv); float fade = smoothstep(0.0, 0.15, vUv.x) * smoothstep(1.0, 0.85, vUv.x); vec3 c = t.rgb * t.a * uI * fade * uColor; gl_FragColor = vec4(c, max(c.r, max(c.g, c.b))); }";
const flareFragment = "uniform sampler2D map; uniform float uI; varying vec2 vUv; void main(){ vec4 t = texture2D(map, vUv); vec3 c = t.rgb * t.a * uI; gl_FragColor = vec4(c, max(c.r, max(c.g, c.b))); }";

/** Bloom con el EffectComposer de three: sustituye al render normal (prioridad 1). */
function Bloom() {
  const { gl, scene, camera, size } = useThree();
  const composer = useMemo(() => {
    const c = new EffectComposer(gl);
    c.addPass(new RenderPass(scene, camera));
    c.addPass(new UnrealBloomPass(new Vector2(size.width, size.height), 0.55, 0.35, 1.05));
    c.addPass(new OutputPass());
    return c;
  }, [gl, scene, camera]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => composer.setSize(size.width, size.height), [composer, size]);
  useEffect(() => () => composer.dispose(), [composer]);
  useFrame(() => composer.render(), 1);
  return null;
}

/** El HDR como cubemap (lo que muestrea el shader de la gema con la dirección de cada rayo). */
function useHdrCube() {
  const gl = useThree((s) => s.gl);
  const [cube, setCube] = useState<Texture | null>(null);
  useEffect(() => {
    let rt: WebGLCubeRenderTarget | null = null;
    let live = true;
    new HDRLoader().load(HDR, (tex) => {
      if (!live) return tex.dispose();
      tex.mapping = EquirectangularReflectionMapping;
      rt = new WebGLCubeRenderTarget(512, { type: HalfFloatType }).fromEquirectangularTexture(gl, tex);
      tex.dispose();
      setCube(rt.texture);
    });
    return () => {
      live = false;
      rt?.dispose();
    };
  }, [gl]);
  return cube;
}

function Prism({ pointer, progress, landing, scaleTo, onReady }: Omit<PrismSceneProps, "active">) {
  const { viewport } = useThree();
  const cube = useHdrCube();
  const coarse = typeof matchMedia !== "undefined" && matchMedia("(pointer: coarse)").matches;
  // mientras carga el brillante del kit, la talla procedural
  const fallback = useMemo(() => brilliantGeometry(1.5), []);
  const [geo, setGeo] = useState<BufferGeometry>(fallback);
  useEffect(() => {
    const k = kitPiece("piedra-brillante");
    if (!k) return;
    let live = true;
    // 6,5 mm de diámetro → 3 unidades
    loadPiece(KIT_BASE + k.archivo, 3 / 6.5).then((p) => live && p.gem && setGeo(p.gem));
    return () => {
      live = false;
    };
  }, []);
  const mat = useMemo(() => {
    const m = createGemMaterial(null, fallback, !coarse);
    m.uniforms.uIor.value.set(2.65, 2.75, 2.88);
    m.toneMapped = false;
    return m;
  }, [fallback, coarse]);
  useEffect(() => setGemGeometry(mat, geo), [mat, geo]);
  useEffect(() => {
    mat.uniforms.uEnv.value = cube;
  }, [mat, cube]);

  const tex = useMemo(() => ({ beam: beamTexture(), flare: flareTexture() }), []);
  const plane = useMemo(() => new PlaneGeometry(1, 1), []);
  const mkBeam = () => new ShaderMaterial({ transparent: true, depthWrite: false, toneMapped: false, ...LIGHT_BLEND, uniforms: { map: { value: tex.beam }, uI: { value: 1 }, uColor: { value: new Color(1, 0.94, 0.84) } }, vertexShader: quadVertex, fragmentShader: beamFragment });
  const beamMat = useMemo(mkBeam, [tex]); // eslint-disable-line react-hooks/exhaustive-deps
  const rayMats = useMemo(() => Array.from({ length: RAYS }, mkBeam), [tex]); // eslint-disable-line react-hooks/exhaustive-deps
  const flareMat = useMemo(() => new ShaderMaterial({ transparent: true, depthWrite: false, toneMapped: false, ...LIGHT_BLEND, uniforms: { map: { value: tex.flare }, uI: { value: 0 } }, vertexShader: quadVertex, fragmentShader: flareFragment }), [tex]);
  useEffect(
    () => () => {
      [fallback, plane].forEach((g) => g.dispose());
      [mat, beamMat, flareMat, ...rayMats].forEach((m) => m.dispose());
      tex.beam.dispose();
      tex.flare.dispose();
    },
    [fallback, plane, mat, beamMat, flareMat, rayMats, tex],
  );

  const diamond = useRef<Group>(null);
  const beam = useRef<Mesh>(null);
  const flare = useRef<Mesh>(null);
  const rays = useRef<(Mesh | null)[]>([]);
  const src = useRef(new Vector3(-6, 3, 0));
  const ready = useRef(false);
  const hit = useRef(0);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const p = progress.current;
    const w = viewport.width;
    const h = viewport.height;
    const k = p * p * (3 - 2 * p);
    // centrado y algo por encima del medio (el texto va debajo); con el scroll baja al anillo del recorrido
    const narrow = w / h < 0.9;
    const land = narrow ? { x: 0, y: 0.41 } : landing;
    const g = diamond.current!;
    g.position.set(lerp(0, land.x * w, k), lerp(h * (narrow ? 0.2 : 0.14), land.y * h, k), 0);
    g.scale.setScalar(lerp(narrow ? 0.7 : 1, narrow ? scaleTo * 0.7 : scaleTo, k));
    // la mesa casi de frente, girando despacio; sigue un poco al puntero
    const pt = pointer.current;
    g.rotation.x = lerp(g.rotation.x, 1.15 + (pt.active ? -pt.y * 0.25 : 0), Math.min(1, dt * 3));
    g.rotation.y += dt * 0.22;
    g.rotation.z = lerp(g.rotation.z, pt.active ? pt.x * 0.18 : Math.sin(t * 0.3) * 0.08, Math.min(1, dt * 3));

    // el origen del haz: el puntero; sin puntero (táctil, o fuera de la ventana) describe un arco lento por arriba
    const target = pt.active ? new Vector3((pt.x * w) / 2, (pt.y * h) / 2, 0) : new Vector3(Math.cos(t * 0.35) * w * 0.4, h * 0.42 + Math.sin(t * 0.5) * h * 0.06, 0);
    src.current.lerp(target, Math.min(1, dt * (pt.active ? 9 : 2)));
    const c = g.position;
    const rad = 1.45 * g.scale.x;
    const d = new Vector3().subVectors(c, src.current);
    const dir = d.clone().normalize();
    const outside = d.length() > rad;
    const hitPoint = outside ? c.clone().addScaledVector(dir, -rad) : c.clone();
    const fade = 1 - k;
    hit.current = lerp(hit.current, outside ? 1 : 0, Math.min(1, dt * 6));

    // el haz, del origen al punto de impacto
    const bm = beam.current!;
    const len = src.current.distanceTo(hitPoint);
    bm.position.copy(src.current).add(hitPoint).multiplyScalar(0.5);
    bm.scale.set(len, 0.3, 1);
    bm.rotation.set(0, 0, Math.atan2(dir.y, dir.x));
    beamMat.uniforms.uI.value = 2.2 * fade;

    // destello en el punto de impacto
    const fl = flare.current!;
    fl.position.copy(hitPoint);
    fl.scale.setScalar((1.6 + Math.sin(t * 5) * 0.12) * (0.6 + 0.4 * fade));
    flareMat.uniforms.uI.value = hit.current * 1.8 * fade;

    // la luz que devuelve la piedra: rayos blancos abiertos en abanico por el otro lado, que se mueven con las facetas
    // cortos: la luz que devuelve la piedra no debe cruzar el titular
    const L = Math.max(w, h) * 0.32;
    rays.current.forEach((r, i) => {
      if (!r) return;
      const spread = (i - (RAYS - 1) / 2) * 0.32 + Math.sin(t * 0.6 + i * 1.7 + g.rotation.y) * 0.12;
      const out = dir.clone().applyAxisAngle(new Vector3(0, 0, 1), spread);
      // nunca hacia abajo, donde está el titular: los rayos que bajarían se reflejan hacia arriba y se abren a los lados
      if (out.y < 0.05) out.set(out.x * 1.4, Math.abs(out.y) * 0.5 + 0.05, 0).normalize();
      const from = c.clone().addScaledVector(out, rad * 0.7);
      const l = L * (0.55 + 0.45 * Math.abs(Math.sin(i * 2.3 + t * 0.2)));
      r.position.copy(from).addScaledVector(out, l / 2);
      r.scale.set(l, 0.16 + 0.08 * (i % 2), 1);
      r.rotation.set(0, 0, Math.atan2(out.y, out.x));
      const twinkle = 0.55 + 0.45 * Math.sin(t * 2.2 + i * 2.1 + g.rotation.y * 3);
      rayMats[i].uniforms.uI.value = hit.current * fade * (0.35 + 0.6 * twinkle);
    });

    // la piedra: el haz es su foco; el HDR, su entorno
    const u = mat.uniforms;
    u.uKeyDir.value.copy(dir).negate().add(new Vector3(0, 0, 0.6)).normalize();
    u.uKeyColor.value.setRGB(1, 0.95, 0.86);
    u.uKeyI.value = 1.2 + hit.current * 3;
    u.uEnvI.value = 0.62 + hit.current * 0.12;
    u.uTint.value.setRGB(1, 0.98, 0.95);

    if (!ready.current && cube) {
      ready.current = true;
      onReady();
    }
  });

  return (
    <>
      {Array.from({ length: RAYS }, (_, i) => (
        <mesh key={i} ref={(m) => { rays.current[i] = m; }} geometry={plane} material={rayMats[i]} renderOrder={1} />
      ))}
      <mesh ref={beam} geometry={plane} material={beamMat} renderOrder={2} />
      <group ref={diamond}>
        <mesh geometry={geo} material={mat} />
      </group>
      <mesh ref={flare} geometry={plane} material={flareMat} renderOrder={3} />
    </>
  );
}

export default function PrismScene({ active, ...props }: PrismSceneProps) {
  const coarse = typeof matchMedia !== "undefined" && matchMedia("(pointer: coarse)").matches;
  return (
    <Canvas frameloop={active ? "always" : "never"} dpr={[1, coarse ? 1.5 : 2]} gl={{ antialias: true }} camera={{ fov: 30, position: [0, 0, 14], near: 0.1, far: 60 }} style={{ pointerEvents: "none" }}>
      <color attach="background" args={[BG]} />
      <Prism {...props} />
      <Bloom />
    </Canvas>
  );
}
