"use client";

import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { CanvasTexture, CustomBlending, OneFactor, Color, DoubleSide, Group, Mesh, PlaneGeometry, ShaderMaterial, Vector3 } from "three";
import { createGemMaterial } from "./gemMaterial";
import { brilliantGeometry, useGemEnvironment } from "./ringScene";

/*
 * La portada de Quilate: un brillante grande y un haz de luz que sale del puntero (como el ejemplo «prism» de pmndrs, sin
 * drei ni postprocesado). El haz va del puntero al diamante; donde lo toca salta un destello; por el otro lado sale un
 * abanico de colores (la dispersión) que se desvía según lo lejos del centro que entre el haz, como en un prisma. El diamante
 * es el material trazado de Quilate (refracción, reflexión interna total, dispersión por canal) y su foco principal es el
 * propio haz. Todo en el plano z = 0; la cámara mira de frente.
 *
 * `progress` (0–1) lo mueve la página con el scroll: el diamante se encoge y se desplaza hacia donde aparece el anillo del
 * recorrido siguiente, y el haz y el abanico se apagan (la fusión con la escena siguiente).
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

const R = 1.55;
/** Suma luz (color y alfa): sobre un lienzo transparente, las zonas negras de los haces no tapan la página. */
const LIGHT_BLEND = { blending: CustomBlending, blendSrc: OneFactor, blendDst: OneFactor, blendSrcAlpha: OneFactor, blendDstAlpha: OneFactor } as const;
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

/** Textura del haz: núcleo blanco y halo que cae rápido a los lados (se estira a lo largo del haz). */
function beamTexture() {
  const c = document.createElement("canvas");
  c.width = 4;
  c.height = 128;
  const x = c.getContext("2d")!;
  const g = x.createLinearGradient(0, 0, 0, 128);
  g.addColorStop(0, "rgba(255,255,255,0)");
  g.addColorStop(0.38, "rgba(255,236,205,0.18)");
  g.addColorStop(0.48, "rgba(255,248,236,0.9)");
  g.addColorStop(0.5, "rgba(255,255,255,1)");
  g.addColorStop(0.52, "rgba(255,248,236,0.9)");
  g.addColorStop(0.62, "rgba(255,236,205,0.18)");
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
  g.addColorStop(0.3, "rgba(255,220,170,0.16)");
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

/** El abanico de colores: un sector en coordenadas polares que va del rojo al violeta y se difumina con la distancia. */
const rainbowShader = {
  uniforms: { uSpread: { value: 0.32 }, uI: { value: 0 }, uTime: { value: 0 } },
  vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
  fragmentShader: `
    uniform float uSpread; uniform float uI; uniform float uTime; varying vec2 vUv;
    vec3 spectrum(float t){ return clamp(vec3(abs(t*6.0-3.0)-1.0, 2.0-abs(t*6.0-2.0), 2.0-abs(t*6.0-4.0)), 0.0, 1.0); }
    void main(){
      // origen en el borde izquierdo, centro vertical; el sector se abre hacia la derecha
      vec2 p = vec2(vUv.x, vUv.y - 0.5);
      float r = length(p);
      float a = atan(p.y, max(p.x, 1e-4));
      float t = clamp(a / uSpread + 0.5, 0.0, 1.0);
      float inside = smoothstep(0.0, 0.08, 0.5 - abs(a / uSpread));
      float fall = exp(-r * 2.2) * smoothstep(0.0, 0.04, r);
      float shimmer = 0.85 + 0.15 * sin(r * 40.0 - uTime * 3.0);
      // espectro algo lavado (la luz real de una piedra no es un arcoíris de póster) y bordes que se funden
      vec3 col = mix(spectrum(1.0 - t), vec3(1.0, 0.95, 0.88), 0.3) * inside * fall * shimmer * uI * 0.7;
      gl_FragColor = vec4(col, max(col.r, max(col.g, col.b)));
    }`,
};

function Prism({ pointer, progress, landing, scaleTo, onReady }: Omit<PrismSceneProps, "active">) {
  const { viewport } = useThree();
  const gemEnv = useGemEnvironment();
  const coarse = typeof matchMedia !== "undefined" && matchMedia("(pointer: coarse)").matches;
  const geo = useMemo(() => brilliantGeometry(R), []);
  const mat = useMemo(() => {
    const m = createGemMaterial(gemEnv, geo, !coarse);
    // un poco más de separación de colores que el diamante real: el fuego tiene que leerse a esta escala
    m.uniforms.uIor.value.set(2.38, 2.42, 2.5);
    return m;
  }, [gemEnv, geo, coarse]);
  const tex = useMemo(() => ({ beam: beamTexture(), flare: flareTexture() }), []);
  const plane = useMemo(() => new PlaneGeometry(1, 1), []);
  const beamMat = useMemo(() => new ShaderMaterial({ transparent: true, depthWrite: false, ...LIGHT_BLEND, uniforms: { map: { value: tex.beam }, uI: { value: 1 } }, vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);}", fragmentShader: "uniform sampler2D map; uniform float uI; varying vec2 vUv; void main(){ vec4 t = texture2D(map, vUv); float fade = smoothstep(0.0, 0.12, vUv.x); vec3 c = t.rgb * t.a * uI * fade * vec3(1.0,0.95,0.86); gl_FragColor = vec4(c, max(c.r, max(c.g, c.b))); }" }), [tex]);
  const flareMat = useMemo(() => new ShaderMaterial({ transparent: true, depthWrite: false, ...LIGHT_BLEND, uniforms: { map: { value: tex.flare }, uI: { value: 0 } }, vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);}", fragmentShader: "uniform sampler2D map; uniform float uI; varying vec2 vUv; void main(){ vec4 t = texture2D(map, vUv); vec3 c = t.rgb * t.a * uI; gl_FragColor = vec4(c, max(c.r, max(c.g, c.b))); }" }), [tex]);
  const rainbowMat = useMemo(() => new ShaderMaterial({ ...rainbowShader, uniforms: { uSpread: { value: 0.32 }, uI: { value: 0 }, uTime: { value: 0 } }, transparent: true, depthWrite: false, ...LIGHT_BLEND, side: DoubleSide }), []);
  useEffect(
    () => () => {
      [geo, plane].forEach((g) => g.dispose());
      [mat, beamMat, flareMat, rainbowMat].forEach((m) => m.dispose());
      tex.beam.dispose();
      tex.flare.dispose();
    },
    [geo, plane, mat, beamMat, flareMat, rainbowMat, tex],
  );

  const diamond = useRef<Group>(null);
  const beam = useRef<Mesh>(null);
  const flare = useRef<Mesh>(null);
  const rainbow = useRef<Mesh>(null);
  const src = useRef(new Vector3(-6, 3, 0));
  const ready = useRef(false);
  const hit = useRef(0);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const p = progress.current;
    const w = viewport.width;
    const h = viewport.height;
    // el diamante: centrado; con el scroll baja y se encoge hacia el anillo siguiente
    const g = diamond.current!;
    const k = p * p * (3 - 2 * p);
    // en pantallas estrechas el texto va abajo: el diamante empieza arriba y aterriza en el anillo centrado
    const narrow = w / h < 0.9;
    const land = narrow ? { x: 0, y: 0.41 } : landing;
    g.position.set(lerp(narrow ? 0 : w * 0.16, land.x * w, k), lerp(narrow ? h * 0.2 : -0.1, land.y * h, k), 0);
    g.scale.setScalar(lerp(narrow ? 0.62 : 1, narrow ? scaleTo * 0.7 : scaleTo, k));
    // gira despacio con la mesa hacia la cámara (ligeramente inclinada) y sigue un poco al puntero
    const pt = pointer.current;
    g.rotation.x = lerp(g.rotation.x, 1.05 + (pt.active ? -pt.y * 0.25 : 0), Math.min(1, dt * 3));
    g.rotation.y += dt * 0.18;
    g.rotation.z = lerp(g.rotation.z, pt.active ? pt.x * 0.2 : Math.sin(t * 0.3) * 0.1, Math.min(1, dt * 3));

    // el origen del haz: el puntero; sin puntero (táctil, o fuera de la ventana) describe un arco lento
    const target = pt.active ? new Vector3((pt.x * w) / 2, (pt.y * h) / 2, 0) : new Vector3(Math.cos(t * 0.35) * w * 0.42 - w * 0.08, Math.sin(t * 0.5) * h * 0.3 + h * 0.12, 0);
    src.current.lerp(target, Math.min(1, dt * (pt.active ? 9 : 2)));
    const c = g.position;
    const rad = R * g.scale.x * 0.92;
    const d = new Vector3().subVectors(c, src.current);
    const dist = d.length();
    const dir = d.clone().normalize();
    // punto de impacto en la silueta (un círculo) y parámetro de impacto (lo lejos del centro que entra el haz, −1…1)
    const inside = dist > rad;
    const hitPoint = inside ? c.clone().addScaledVector(dir, -rad) : c.clone();
    // «parámetro de impacto»: depende del ángulo de entrada respecto a la faceta que gira; al mover la luz, el abanico barre
    const b = Math.sin(Math.atan2(dir.y, dir.x) * 2 + g.rotation.y * 1.5);
    const fade = 1 - k;
    hit.current = lerp(hit.current, inside ? 1 : 0, Math.min(1, dt * 6));

    // el haz, del origen al punto de impacto
    const bm = beam.current!;
    const len = src.current.distanceTo(hitPoint);
    bm.position.copy(src.current).add(hitPoint).multiplyScalar(0.5);
    bm.scale.set(len, 0.34 * (0.8 + 0.2 * fade), 1);
    bm.rotation.set(0, 0, Math.atan2(dir.y, dir.x));
    beamMat.uniforms.uI.value = 1.15 * fade;

    // destello en el punto de impacto: late un poco
    const fl = flare.current!;
    fl.position.copy(hitPoint);
    fl.scale.setScalar((1.5 + Math.sin(t * 5) * 0.12) * (0.6 + 0.4 * fade));
    flareMat.uniforms.uI.value = hit.current * 1.4 * fade;

    // el abanico sale por el otro lado, desviado según dónde entra el haz (la refracción de un prisma)
    const out = dir.clone().applyAxisAngle(new Vector3(0, 0, 1), -b * 0.55 - 0.18);
    const exit = c.clone().addScaledVector(out, rad * 0.85);
    const rb = rainbow.current!;
    const L = Math.max(w, h) * 1.4;
    rb.position.copy(exit).addScaledVector(out, L / 2);
    rb.scale.set(L, L * 0.9, 1);
    rb.rotation.set(0, 0, Math.atan2(out.y, out.x));
    rainbowMat.uniforms.uI.value = hit.current * 1.6 * fade;
    rainbowMat.uniforms.uTime.value = t;
    rainbowMat.uniforms.uSpread.value = 0.26 + Math.abs(b) * 0.16;

    // el foco del diamante es el haz: entra de donde viene la luz
    const u = mat.uniforms;
    u.uKeyDir.value.copy(dir).negate().add(new Vector3(0, 0, 0.6)).normalize();
    u.uKeyColor.value.set(new Color(1, 0.94, 0.84));
    u.uKeyI.value = 1.5 + hit.current * 4;
    u.uEnvI.value = 0.62 + hit.current * 0.2;
    u.uTint.value.setRGB(1, 0.97, 0.92);

    if (!ready.current) {
      ready.current = true;
      onReady();
    }
  });

  return (
    <>
      <mesh ref={rainbow} geometry={plane} material={rainbowMat} renderOrder={1} />
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
    <Canvas frameloop={active ? "always" : "never"} dpr={[1, coarse ? 1.5 : 2]} gl={{ alpha: true, antialias: true }} camera={{ fov: 30, position: [0, 0, 14], near: 0.1, far: 60 }} style={{ pointerEvents: "none" }}>
      <Prism {...props} />
    </Canvas>
  );
}
