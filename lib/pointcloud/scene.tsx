"use client";

import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { dampFactor } from "@/lib/motion/scroll-feel";
import { AdditiveBlending, BufferAttribute, BufferGeometry, Color, Line, LineBasicMaterial, Plane, Points, Raycaster, ShaderMaterial, Vector2, Vector3 } from "three";

/**
 * Lo que se le pide a la nube (todo 0–1 salvo giros, distancia y desplazamientos). Lo puede mover el componente solo
 * (`motion`) o el scroll de una web (`state`).
 */
export type PointCloudState = {
  /** cuánto del terreno ha barrido el escáner (0 = nada, 1 = todo) */
  reveal: number;
  /** 0 = un color (`--fg`) · 1 = color por cota (valle `--acc2` → cumbre `--acc`) */
  heightColor: number;
  /** 0 = los edificios aplastados contra el suelo · 1 = levantados */
  lift: number;
  /** la línea de medida (0 = oculta) */
  measure: number;
  /** giro alrededor del eje vertical y cabeceo de la cámara (radianes), distancia (1 = normal) */
  yaw: number;
  pitch: number;
  zoom: number;
  /** dónde cae la nube en pantalla, en fracción del ancho y del alto desde el centro */
  x: number;
  y: number;
};
export const POINTCLOUD_REST: PointCloudState = { reveal: 1, heightColor: 1, lift: 1, measure: 0, yaw: 0.6, pitch: 0.75, zoom: 1, x: 0, y: 0 };
const KEYS = Object.keys(POINTCLOUD_REST) as (keyof PointCloudState)[];

export type PointCloudSceneProps = {
  state: MutableRefObject<PointCloudState>;
  /** colores ya resueltos de los tokens */
  colors: { fg: string; acc: string; acc2: string };
  /** puntos por lado del terreno (el total es ~ lado² + edificios) */
  density: number;
  /** semilla del terreno */
  seed: number;
  /** la lupa: radio en unidades del terreno (0 = sin lupa) */
  lens: number;
  /** la nube se inclina un poco hacia el puntero */
  follow: number;
  /** extremos de la línea de medida, en coordenadas del terreno (−1…1) */
  measureFrom: [number, number];
  measureTo: [number, number];
  /** escribe aquí el punto bajo el puntero (cota en metros) y el centro de la medida en pantalla, para el DOM */
  readout: MutableRefObject<{ x: number; y: number; z: number; on: boolean; sx: number; sy: number; mx: number; my: number; md: number; mh: number; mon: boolean }>;
  /** escala de las cotas que se leen (el terreno va de 0 a 1: metros = altura × esto) */
  meters: number;
  active: boolean;
  onReady: () => void;
};

/* ---------- el terreno: ruido de valor fractal, un río y un solar plano con edificios ---------- */
function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
function noise2(seed: number) {
  const r = rng(seed), P = new Float32Array(512);
  for (let i = 0; i < 512; i++) P[i] = r();
  const h = (x: number, y: number) => P[((x * 31 + y * 17) & 511 + 512) % 512];
  const n = (x: number, y: number) => {
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
    const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    const a = h(xi, yi), b = h(xi + 1, yi), c = h(xi, yi + 1), d = h(xi + 1, yi + 1);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  };
  return (x: number, y: number) => {
    let v = 0, amp = 0.5, f = 1;
    for (let o = 0; o < 5; o++) {
      v += amp * n(x * f + o * 7.3, y * f - o * 3.1);
      f *= 2.03;
      amp *= 0.5;
    }
    return v;
  };
}
/** el solar (plano, sin relieve) donde van los edificios: x 0,15–0,75, z −0,55–0,05 del terreno */
const LOT = { x0: 0.12, x1: 0.78, z0: -0.6, z1: 0.08 };
const inLot = (x: number, z: number, m = 0) => x > LOT.x0 - m && x < LOT.x1 + m && z > LOT.z0 - m && z < LOT.z1 + m;

/** altura del terreno (0–1) en un punto (−1…1) */
export function terrainHeight(fbm: (x: number, y: number) => number, x: number, z: number) {
  let h = fbm(x * 1.6 + 3, z * 1.6 - 2);
  h = Math.pow(h, 1.6) * 1.25;
  // un cerro al fondo a la izquierda
  h += 0.35 * Math.exp(-((x + 0.55) ** 2 + (z + 0.5) ** 2) / 0.12);
  // un río que cruza en diagonal
  const d = Math.abs(z - 0.35 * Math.sin(x * 2.2) - 0.45);
  h *= 0.35 + 0.65 * Math.min(1, d / 0.18);
  // el solar, aplanado (con un borde suave)
  const lotLevel = 0.18;
  const e = Math.min(1, Math.max(0, Math.min(x - LOT.x0, LOT.x1 - x, z - LOT.z0, LOT.z1 - z) / 0.08 + 0.001));
  if (inLot(x, z, 0.08)) h = h + (lotLevel - h) * Math.min(1, 0.3 + e);
  return Math.max(0, h);
}

type Cloud = { geo: BufferGeometry; lotLevel: number; height: (x: number, z: number) => number };
function buildCloud(side: number, seed: number): Cloud {
  const fbm = noise2(seed);
  const r = rng(seed * 7 + 3);
  const pos: number[] = [], hgt: number[] = [], kind: number[] = [], rnd: number[] = [], base: number[] = [];
  const H = 0.5; // el terreno, de 0 a 0,5 de alto en la escena (va de −1 a 1 de lado)
  for (let i = 0; i < side; i++)
    for (let j = 0; j < side; j++) {
      const x = -1 + (2 * (i + r() * 0.9)) / side, z = -1 + (2 * (j + r() * 0.9)) / side;
      // un borde redondeado: el terreno es una «isla» de datos
      if (x * x * 0.7 + z * z > 1.05) continue;
      const h = terrainHeight(fbm, x, z);
      pos.push(x, h * H, z);
      hgt.push(h);
      kind.push(0);
      rnd.push(r());
      base.push(h * H);
    }
  // edificios: cajas de puntos sobre el solar (fachadas y cubierta), con alturas distintas
  const lotY = terrainHeight(fbm, (LOT.x0 + LOT.x1) / 2, (LOT.z0 + LOT.z1) / 2) * H;
  const blocks: [number, number, number, number, number][] = [
    [0.2, -0.5, 0.14, 0.16, 0.32], [0.42, -0.48, 0.12, 0.1, 0.22], [0.62, -0.52, 0.1, 0.14, 0.44],
    [0.22, -0.18, 0.16, 0.12, 0.16], [0.46, -0.2, 0.12, 0.14, 0.28], [0.66, -0.16, 0.1, 0.1, 0.12],
  ];
  for (const [cx, cz, w, d, hb] of blocks) {
    const n = Math.round(900 * (w + d) * (1 + hb * 3) * (side / 160) ** 2);
    for (let k = 0; k < n; k++) {
      const face = r();
      let x = cx + (r() - 0.5) * w, z = cz + (r() - 0.5) * d, y = lotY + r() * hb;
      if (face < 0.22) y = lotY + hb; // cubierta
      else if (face < 0.48) x = cx + (r() < 0.5 ? -w / 2 : w / 2);
      else if (face < 0.74) z = cz + (r() < 0.5 ? -d / 2 : d / 2);
      else continue;
      pos.push(x, y, z);
      hgt.push(y / H);
      kind.push(1);
      rnd.push(r());
      base.push(lotY);
    }
  }
  const geo = new BufferGeometry();
  geo.setAttribute("position", new BufferAttribute(new Float32Array(pos), 3));
  geo.setAttribute("aH", new BufferAttribute(new Float32Array(hgt), 1));
  geo.setAttribute("aKind", new BufferAttribute(new Float32Array(kind), 1));
  geo.setAttribute("aRnd", new BufferAttribute(new Float32Array(rnd), 1));
  geo.setAttribute("aBase", new BufferAttribute(new Float32Array(base), 1));
  geo.computeBoundingSphere();
  return { geo, lotLevel: lotY, height: (x, z) => terrainHeight(fbm, x, z) * H };
}

const VERT = /* glsl */ `
attribute float aH, aKind, aRnd, aBase;
uniform float uReveal, uLift, uTime, uLens, uSize, uPulseT;
uniform vec3 uPointer, uPulse;
uniform float uPointerOn;
varying float vH, vGlow, vAlpha, vLens, vKind;
void main() {
  vec3 p = position;
  vKind = aKind;
  // edificios: se levantan desde la cota del solar
  if (aKind > 0.5) p.y = mix(aBase, position.y, uLift);
  // barrido: avanza por x (de −1,1 a 1,1); por delante del frente no hay puntos, en el frente brillan
  float front = mix(-1.15, 1.15, uReveal);
  float ahead = p.x - front;
  vAlpha = smoothstep(0.02, -0.02, ahead + aRnd * 0.04);
  vGlow = exp(-abs(ahead) * 28.0) * step(ahead, 0.04);
  // lupa: cerca del puntero, los puntos suben un poco y se encienden
  float dl = distance(p.xz, uPointer.xz);
  vLens = uPointerOn * smoothstep(uLens, 0.0, dl);
  p.y += vLens * 0.025;
  // pulso de escaneo (clic): un anillo que se expande desde el punto pulsado
  float pr = (uTime - uPulseT) * 0.9;
  float pd = abs(distance(p.xz, uPulse.xz) - pr);
  vGlow += exp(-pd * 40.0) * smoothstep(1.6, 0.0, pr) * step(0.0, pr);
  vH = aH;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * (1.0 + vGlow * 1.6 + vLens * 0.9) * (1.0 / -mv.z);
}`;
const FRAG = /* glsl */ `
uniform vec3 uFg, uLow, uHigh;
uniform float uHeightColor, uLift;
varying float vH, vGlow, vAlpha, vLens, vKind;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float r = length(c);
  if (r > 0.5) discard;
  vec3 ramp = mix(uLow, uHigh, smoothstep(0.05, 0.75, vH));
  vec3 col = mix(uFg, ramp, max(uHeightColor, vLens));
  // los edificios del gemelo, en blanco y más presentes cuanto más levantados
  col = mix(col, vec3(1.0), vKind * uLift * 0.8);
  col += vec3(1.0) * (vGlow * 0.9 + vLens * 0.35);
  float a = vAlpha * smoothstep(0.5, 0.25, r) * (0.55 + 0.45 * max(max(vGlow, vLens), vKind * uLift));
  gl_FragColor = vec4(col * a, a);
}`;

function Cloud(props: PointCloudSceneProps) {
  const { state, colors, density, seed, lens, follow, measureFrom, measureTo, readout, meters, onReady } = props;
  const cloud = useMemo(() => buildCloud(density, seed), [density, seed]);
  const mat = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        uniforms: {
          uReveal: { value: 1 }, uLift: { value: 1 }, uTime: { value: 0 }, uLens: { value: lens }, uSize: { value: 6 },
          uPointer: { value: new Vector3() }, uPointerOn: { value: 0 }, uPulse: { value: new Vector3(9, 0, 9) }, uPulseT: { value: -9 },
          uFg: { value: new Color() }, uLow: { value: new Color() }, uHigh: { value: new Color() }, uHeightColor: { value: 1 },
        },
      }),
    [lens],
  );
  useEffect(() => {
    mat.uniforms.uFg.value.set(colors.fg);
    mat.uniforms.uLow.value.set(colors.acc2);
    mat.uniforms.uHigh.value.set(colors.acc);
  }, [mat, colors]);
  useEffect(() => () => { cloud.geo.dispose(); mat.dispose(); }, [cloud, mat]);

  // la línea de medida: dos extremos sobre el terreno, a ras
  const line = useMemo(() => {
    const a = new Vector3(measureFrom[0], cloud.height(measureFrom[0], measureFrom[1]) + 0.01, measureFrom[1]);
    const b = new Vector3(measureTo[0], cloud.height(measureTo[0], measureTo[1]) + 0.01, measureTo[1]);
    const g = new BufferGeometry().setFromPoints([a, b]);
    // un objeto de three (en JSX, <line> sería el del SVG)
    const obj = new Line(g, new LineBasicMaterial({ transparent: true, opacity: 0, depthTest: false }));
    obj.renderOrder = 2;
    return { a, b, g, obj, len: a.distanceTo(b) };
  }, [cloud, measureFrom, measureTo]);
  useEffect(() => () => { line.g.dispose(); (line.obj.material as LineBasicMaterial).dispose(); }, [line]);
  useEffect(() => { (line.obj.material as LineBasicMaterial).color.set(colors.fg); }, [line, colors]);

  const { camera, gl, size } = useThree();
  const pts = useRef<Points>(null);
  const S = useRef<PointCloudState>({ ...POINTCLOUD_REST, ...state.current });
  const ptr = useRef({ x: 0, y: 0, on: false });
  const ready = useRef(false);
  const ray = useMemo(() => new Raycaster(), []);
  const plane = useMemo(() => new Plane(new Vector3(0, 1, 0), -0.1), []);
  useEffect(() => {
    const el = gl.domElement;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      ptr.current.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      ptr.current.y = -((e.clientY - r.top) / r.height) * 2 + 1;
      ptr.current.on = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    };
    const down = (e: PointerEvent) => {
      move(e);
      if (!ptr.current.on) return;
      ray.setFromCamera(new Vector2(ptr.current.x, ptr.current.y), camera);
      const hit = new Vector3();
      if (ray.ray.intersectPlane(plane, hit)) {
        mat.uniforms.uPulse.value.copy(hit);
        mat.uniforms.uPulseT.value = mat.uniforms.uTime.value;
      }
    };
    addEventListener("pointermove", move, { passive: true });
    addEventListener("pointerdown", down, { passive: true });
    return () => {
      removeEventListener("pointermove", move);
      removeEventListener("pointerdown", down);
    };
  }, [gl, camera, ray, plane, mat]);

  useFrame((st, dt) => {
    // la pose se sigue a 5/s, igual a cualquier frecuencia. Con 9/s (el de la sensación cinematic) la nube copiaba la cola
    // del scroll: acoplamiento 0,43 frente a 0,29 medido con cine:ritmo (docs/42 §7)
    const P = state.current, s = S.current, k = dampFactor(5, Math.min(dt, 0.1));
    for (const key of KEYS) s[key] += (P[key] - s[key]) * k;
    const u = mat.uniforms;
    u.uTime.value = st.clock.elapsedTime;
    u.uReveal.value = s.reveal;
    u.uLift.value = s.lift;
    u.uHeightColor.value = s.heightColor;
    u.uSize.value = (size.height / 900) * 9 * (220 / density) ** 0.5;
    // cámara en órbita alrededor del centro, inclinada un poco hacia el puntero
    const yaw = s.yaw + ptr.current.x * follow, pitch = s.pitch + ptr.current.y * follow * 0.4;
    const dist = 4.4 * s.zoom;
    const target = new Vector3(0, 0.12, 0);
    camera.position.set(Math.sin(yaw) * Math.cos(pitch) * dist, Math.sin(pitch) * dist + 0.12, Math.cos(yaw) * Math.cos(pitch) * dist);
    camera.lookAt(target);
    // los ejes de la cámara, los de este fotograma: sin actualizar la matriz salían los del anterior y el desplazamiento
    // oscilaba en cada fotograma (temblor de 20 cambios por segundo medido con cine:ritmo, docs/42)
    camera.updateMatrixWorld();
    // la nube cae a un lado: desplazamiento en paralelo de la cámara
    const cam = camera as unknown as { fov: number; aspect: number };
    const halfH = dist * Math.tan(((cam.fov || 35) * Math.PI) / 360);
    const right = new Vector3().setFromMatrixColumn(camera.matrixWorld, 0), up = new Vector3().setFromMatrixColumn(camera.matrixWorld, 1);
    const shift = right.multiplyScalar(-s.x * 2 * halfH * (cam.aspect || 1)).addScaledVector(up, -s.y * 2 * halfH);
    camera.position.add(shift);
    camera.updateMatrixWorld();
    // la lupa: dónde corta el rayo del puntero el terreno (plano y una corrección por la cota)
    const ro = readout.current;
    if (ptr.current.on && lens > 0) {
      ray.setFromCamera(new Vector2(ptr.current.x, ptr.current.y), camera);
      const hit = new Vector3();
      if (ray.ray.intersectPlane(plane, hit) && Math.abs(hit.x) < 1.05 && Math.abs(hit.z) < 1.05) {
        const h = cloud.height(hit.x, hit.z);
        plane.constant = -h;
        ray.ray.intersectPlane(plane, hit);
        plane.constant = -0.1;
        u.uPointer.value.copy(hit);
        u.uPointerOn.value += (1 - u.uPointerOn.value) * Math.min(1, dt * 8);
        ro.x = hit.x;
        ro.z = hit.z;
        ro.y = cloud.height(hit.x, hit.z) / 0.5 * meters;
        ro.on = hit.x < -1.15 + s.reveal * 2.3;
        const sp = hit.clone().project(camera);
        ro.sx = (sp.x + 1) / 2;
        ro.sy = (1 - sp.y) / 2;
      } else ro.on = false;
    } else ro.on = false;
    if (!ro.on) u.uPointerOn.value *= 1 - Math.min(1, dt * 6);
    // la medida: visible con `measure`; su centro en pantalla para la etiqueta del DOM
    const l = line.obj;
    {
      l.visible = s.measure > 0.02;
      (l.material as { opacity: number }).opacity = s.measure;
      const mid = line.a.clone().add(line.b).multiplyScalar(0.5).project(camera);
      ro.mx = (mid.x + 1) / 2;
      ro.my = (1 - mid.y) / 2;
      ro.md = line.len;
      ro.mh = (Math.abs(line.a.y - line.b.y) / 0.5) * meters;
      ro.mon = s.measure > 0.5;
    }
    if (!ready.current) {
      ready.current = true;
      onReady();
    }
  });

  return (
    <>
      <points ref={pts} geometry={cloud.geo} material={mat} />
      <primitive object={line.obj} />
    </>
  );
}

export default function PointCloudScene(props: PointCloudSceneProps) {
  return (
    <Canvas frameloop={props.active ? "always" : "never"} dpr={[1, 1.75]} gl={{ alpha: true, antialias: false }} camera={{ fov: 35, near: 0.05, far: 40, position: [2, 2, 2] }} style={{ pointerEvents: "none" }}>
      <Cloud {...props} />
    </Canvas>
  );
}
