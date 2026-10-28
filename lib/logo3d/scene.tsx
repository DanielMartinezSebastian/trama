"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdditiveBlending, BufferAttribute, BufferGeometry, DynamicDrawUsage, ExtrudeGeometry, Mesh, ShaderMaterial, Shape, TorusGeometry, Vector3, type Group, type Material, type PerspectiveCamera, type Points } from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import RetroFX, { type RetroFXProps } from "@/components/ui/RetroFX";
import { cssToColor } from "@/lib/retro3d/color";

export type LogoSceneProps = {
  path: string;
  viewBox: string;
  strokeWidth: number;
  depth: number;
  bevel: number;
  base: "none" | "plate" | "ring";
  renderStyle: "solid" | "wire" | "ascii" | "pixel" | "both";
  /** filtro retro (solo con ascii, pixel o both) */
  fx: RetroFXProps;
  /** colores CSS ya resueltos desde los tokens */
  color: string;
  baseColor: string;
  motion: "none" | "spin" | "sway" | "float" | "pointer";
  axis: "x" | "y" | "z";
  speed: number;
  tilt: number;
  draggable: boolean;
  fps: number;
  /** lado mayor de la marca en px (0 = encuadrada al lado corto del lienzo) */
  markSize: number;
  /** centro de la marca en fracciones del lienzo */
  markX: number;
  markY: number;
  /** 0–1: partículas que se desprenden de la superficie */
  charge: number;
  /** true = la marca se deshace en partículas; al volver a false, se recompone */
  explode: boolean;
  explodeDuration: number;
  /** 0–1: brillo con el que quedan las partículas tras el estallido (> 0 = flotan a la deriva en vez de apagarse) */
  explodeRest: number;
  particles: number;
  /** tamaño de cada partícula en px CSS */
  particleSize: number;
  onExploded: () => void;
  /** false = fuera de pantalla u oculto: el lienzo no dibuja */
  active: boolean;
  root: RefObject<HTMLElement | null>;
  onReady: () => void;
};

const FOV = 32;
const rad = (deg: number) => (deg * Math.PI) / 180;
const TAN = Math.tan(rad(FOV) / 2);

/** cápsula (rectángulo de extremos redondos) a lo largo de x, centrada en el origen */
function capsule(length: number, width: number): Shape {
  const r = width / 2;
  const h = Math.max(0, length / 2 - r);
  const s = new Shape();
  s.moveTo(-h, -r);
  s.lineTo(h, -r);
  s.absarc(h, 0, r, -Math.PI / 2, Math.PI / 2, false);
  s.lineTo(-h, r);
  s.absarc(-h, 0, r, Math.PI / 2, Math.PI * 1.5, false);
  return s;
}

function roundedRect(w: number, h: number, r: number): Shape {
  const x = -w / 2;
  const y = -h / 2;
  const s = new Shape();
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
  s.lineTo(x + w, y + h - r);
  s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
  s.lineTo(x + r, y + h);
  s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
  s.lineTo(x, y + r);
  s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
  return s;
}

/**
 * La marca como sólido: el trazado SVG extruido, centrado y escalado para que su lado mayor mida 2 unidades. Con
 * `strokeWidth` > 0 el trazado es una línea: cada tramo se extruye como una cápsula (extremos y uniones redondos) y se
 * funden en una sola geometría; con 0, es una forma rellena.
 */
function buildMark(path: string, viewBox: string, strokeWidth: number, depth: number, bevel: number): BufferGeometry {
  const clean = (v: string) => v.replace(/[<>"&]/g, "");
  const data = new SVGLoader().parse(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${clean(viewBox)}"><path d="${clean(path)}"/></svg>`);
  const b = Math.max(0, Math.min(bevel, depth / 2 - 0.05, strokeWidth > 0 ? strokeWidth / 2 - 0.05 : bevel));
  const opts = { depth: Math.max(0.1, depth - 2 * b), bevelEnabled: b > 0, bevelThickness: b, bevelSize: b, bevelOffset: -b, bevelSegments: 2, curveSegments: 10 };
  const parts: BufferGeometry[] = [];
  for (const p of data.paths) {
    if (strokeWidth > 0) {
      for (const sub of p.subPaths) {
        const pts = sub.getPoints();
        for (let i = 1; i < pts.length; i++) {
          const [a, c] = [pts[i - 1], pts[i]];
          const len = a.distanceTo(c);
          if (len < 1e-4) continue;
          const g = new ExtrudeGeometry(capsule(len + strokeWidth, strokeWidth), opts);
          // el SVG tiene la y hacia abajo: se invierte al colocar cada tramo
          g.rotateZ(Math.atan2(-(c.y - a.y), c.x - a.x));
          g.translate((a.x + c.x) / 2, -(a.y + c.y) / 2, 0);
          parts.push(g);
        }
      }
    } else {
      for (const shape of SVGLoader.createShapes(p)) {
        const g = new ExtrudeGeometry(shape, opts);
        g.rotateX(Math.PI); // gira la y sin invertir las caras
        parts.push(g);
      }
    }
  }
  if (!parts.length) parts.push(new ExtrudeGeometry(roundedRect(1, 1, 0.2), opts));
  const merged = mergeGeometries(parts);
  parts.forEach((g) => g.dispose());
  merged.center();
  merged.computeBoundingBox();
  const box = merged.boundingBox!;
  const k = 2 / Math.max(box.max.x - box.min.x, box.max.y - box.min.y, 1e-3);
  merged.scale(k, k, k);
  merged.computeBoundingBox();
  return merged;
}

type Cloud = {
  points: BufferGeometry;
  material: ShaderMaterial;
  /** por partícula: punto de la superficie y su normal, en el espacio de la marca */
  origin: Float32Array;
  normal: Float32Array;
  /** dirección en la que sale despedida al estallar */
  dir: Float32Array;
  /** cuatro números al azar: umbral de carga, fase, ritmo y brío */
  rnd: Float32Array;
};

/**
 * Nube de partículas muestreada de la superficie de la marca. Las posiciones se calculan en la CPU cada fotograma (son
 * pocos miles) y la nube pasa por el mismo filtro que la malla, así que con ASCII o pixel art se ven como caracteres o
 * bloques del propio render.
 */
function buildCloud(geo: BufferGeometry, n: number): Cloud {
  const sampler = new MeshSurfaceSampler(new Mesh(geo)).build();
  const origin = new Float32Array(n * 3);
  const normal = new Float32Array(n * 3);
  const dir = new Float32Array(n * 3);
  const rnd = new Float32Array(n * 4);
  const p = new Vector3();
  const nrm = new Vector3();
  const d = new Vector3();
  for (let i = 0; i < n; i++) {
    sampler.sample(p, nrm);
    origin.set([p.x, p.y, p.z], i * 3);
    normal.set([nrm.x, nrm.y, nrm.z], i * 3);
    // hacia fuera del centro, con algo de la normal y bastante azar: una esfera que se abre, no un abanico plano
    d.copy(p).normalize().multiplyScalar(0.7).addScaledVector(nrm, 0.4).add(new Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(1.1)).normalize();
    dir.set([d.x, d.y, d.z], i * 3);
    rnd.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
  }
  const points = new BufferGeometry();
  points.setAttribute("position", new BufferAttribute(new Float32Array(n * 3), 3).setUsage(DynamicDrawUsage));
  points.setAttribute("aAlpha", new BufferAttribute(new Float32Array(n), 1).setUsage(DynamicDrawUsage));
  const material = new ShaderMaterial({
    vertexShader: "attribute float aAlpha; uniform float uSize; varying float vA; void main() { vA = aAlpha; gl_PointSize = uSize; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
    fragmentShader: "uniform vec3 uColor; varying float vA; void main() { gl_FragColor = vec4(uColor * vA, vA); }",
    uniforms: { uSize: { value: 3 }, uColor: { value: [1, 1, 1] } },
    transparent: true,
    blending: AdditiveBlending,
    depthTest: false,
    depthWrite: false,
  });
  return { points, material, origin, normal, dir, rnd };
}

/** con frameloop="demand": pide un fotograma cada 1/fps s en vez de uno por refresco de pantalla */
function Ticker({ fps }: { fps: number }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    let raf = 0;
    let last = 0;
    const step = fps > 0 ? 1000 / fps : 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (now - last >= step * 0.9) {
        last = now;
        invalidate();
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [fps, invalidate]);
  return null;
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function Mark({ path, viewBox, strokeWidth, depth, bevel, base, renderStyle, fx, color, baseColor, motion, axis, speed, tilt, draggable, markSize, markX, markY, charge, explode, explodeDuration, explodeRest, particles, particleSize, onExploded, root, onReady }: LogoSceneProps) {
  const camera = useThree((s) => s.camera);
  const gl = useThree((s) => s.gl);
  const width = useThree((s) => s.size.width);
  const height = useThree((s) => s.size.height);
  const invalidate = useThree((s) => s.invalidate);
  const spin = useRef<Group>(null);
  const float = useRef<Group>(null);
  const cloudRef = useRef<Points>(null);
  const st = useRef({ t: 0, angle: 0, extra: 0, dragging: false, px: 0, py: 0, cx: 0, cy: 0, ready: false, e: 0, told: false });
  const done = useRef(onExploded);
  done.current = onExploded;

  const geo = useMemo(() => buildMark(path, viewBox, strokeWidth, depth, bevel), [path, viewBox, strokeWidth, depth, bevel]);
  useEffect(() => () => geo.dispose(), [geo]);
  const thick = geo.boundingBox ? geo.boundingBox.max.z - geo.boundingBox.min.z : 0.3;
  const plate = useMemo(() => {
    const g = new ExtrudeGeometry(roundedRect(2.9, 2.9, 0.5), { depth: 0.1, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelOffset: -0.03, bevelSegments: 2, curveSegments: 10 });
    g.center();
    return g;
  }, []);
  const ring = useMemo(() => new TorusGeometry(1.75, 0.07, 10, 64), []);
  useEffect(
    () => () => {
      plate.dispose();
      ring.dispose();
    },
    [plate, ring],
  );

  const count = Math.max(0, Math.round(particles));
  const cloud = useMemo(() => (count > 0 ? buildCloud(geo, count) : null), [geo, count]);
  useEffect(
    () => () => {
      cloud?.points.dispose();
      cloud?.material.dispose();
    },
    [cloud],
  );

  // Encuadre. Sin `markSize`, la marca (2 unidades, o la base) cabe en el lado corto del lienzo. Con él, mide esos px y se
  // coloca en (markX, markY) desplazando la ventana de la cámara: la marca sigue en el origen y no se deforma.
  const extent = base === "none" ? 2.5 : 3.9;
  const aspect = width / Math.max(1, height);
  const dist = markSize > 0 ? height / markSize / TAN : extent / (2 * TAN) / Math.min(1, aspect);
  useLayoutEffect(() => {
    const c = camera as PerspectiveCamera;
    c.fov = FOV;
    c.near = 0.1;
    c.far = dist * 6 + 30;
    c.position.set(0, 0, dist);
    c.lookAt(0, 0, 0);
    if (markX !== 0.5 || markY !== 0.5) c.setViewOffset(width, height, (0.5 - markX) * width, (0.5 - markY) * height, width, height);
    else c.clearViewOffset();
    c.updateProjectionMatrix();
  }, [camera, dist, width, height, markX, markY]);

  useEffect(() => invalidate());

  // Puntero y arrastre: se escuchan fuera del lienzo (que no recibe eventos)
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const s = st.current;
    const cleanups: Array<() => void> = [];
    if (motion === "pointer" && !matchMedia("(pointer: coarse)").matches) {
      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const clamp = (v: number) => Math.max(-1, Math.min(1, v));
        s.px = clamp((e.clientX - (r.left + r.width * markX)) / (innerWidth / 2));
        s.py = clamp((e.clientY - (r.top + r.height * markY)) / (innerHeight / 2));
        invalidate();
      };
      addEventListener("pointermove", onMove, { passive: true });
      cleanups.push(() => removeEventListener("pointermove", onMove));
    }
    if (draggable) {
      let x = 0;
      let t = 0;
      const down = (e: PointerEvent) => {
        s.dragging = true;
        s.extra = 0;
        x = e.clientX;
        t = e.timeStamp;
        el.setPointerCapture(e.pointerId);
      };
      const move = (e: PointerEvent) => {
        if (!s.dragging) return;
        const dx = (e.clientX - x) * 0.014;
        const dt = Math.max(1, e.timeStamp - t) / 1000;
        s.angle += dx;
        s.extra = Math.max(-24, Math.min(24, dx / dt));
        x = e.clientX;
        t = e.timeStamp;
        invalidate();
      };
      const up = () => {
        s.dragging = false;
      };
      el.addEventListener("pointerdown", down);
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerup", up);
      el.addEventListener("pointercancel", up);
      cleanups.push(() => {
        el.removeEventListener("pointerdown", down);
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerup", up);
        el.removeEventListener("pointercancel", up);
        s.dragging = false;
      });
    }
    return () => {
      cleanups.forEach((f) => f());
      s.px = s.py = 0;
    };
  }, [motion, draggable, root, invalidate, markX, markY]);

  const retro = renderStyle === "ascii" || renderStyle === "pixel" || renderStyle === "both";

  useFrame((_, delta) => {
    const g = spin.current;
    const f = float.current;
    if (!g || !f) return;
    const s = st.current;
    const dt = Math.min(delta, 0.1);
    s.t += dt * speed;
    if (!s.dragging) {
      if (motion === "spin") s.angle += dt * speed * 1.05;
      s.angle += s.extra * dt;
      s.extra *= Math.exp(-dt * 1.6);
    }
    let a = s.angle;
    let rx = rad(tilt);
    let y = 0;
    if (motion === "sway") a += Math.sin(s.t * 0.9) * 0.6;
    else if (motion === "float") {
      a += Math.sin(s.t * 0.7) * 0.3;
      y = Math.sin(s.t * 1.1) * 0.09;
    } else if (motion === "pointer") {
      const k = 1 - Math.exp(-dt * 5);
      s.cx += (s.px - s.cx) * k;
      s.cy += (s.py - s.cy) * k;
      a += s.cx * 0.8;
      rx += s.cy * 0.45;
      if (Math.abs(s.px - s.cx) + Math.abs(s.py - s.cy) > 0.002) invalidate();
    }
    if (Math.abs(s.extra) > 0.01) invalidate();
    g.rotation.set(axis === "x" ? a : 0, axis === "y" ? a : 0, axis === "z" ? a : 0);
    f.rotation.x = rx;
    f.position.y = y;

    // Estallido: `e` va de 0 (entera) a 1 (deshecha) y vuelve por el mismo camino al recomponerse
    const goal = explode ? 1 : 0;
    if (s.e !== goal) {
      const step = dt / Math.max(0.05, explodeDuration);
      s.e = goal > s.e ? Math.min(1, s.e + step) : Math.max(0, s.e - step);
      invalidate();
    }
    if (s.e >= 1 && !s.told) {
      s.told = true;
      done.current();
    }
    if (s.e < 1) s.told = false;

    // la malla se apaga al principio del estallido, cuando la nube ya ha tomado el relevo
    const solidity = 1 - smooth(0.02, 0.3, s.e);
    g.traverse((o) => {
      if (!(o instanceof Mesh)) return;
      const m = o.material as Material;
      m.transparent = solidity < 1;
      m.opacity = solidity;
      o.visible = solidity > 0.01;
    });

    const pts = cloudRef.current;
    if (pts && cloud) {
      const live = s.e > 0 || charge > 0;
      pts.visible = live;
      if (live) {
        g.updateWorldMatrix(true, false);
        const m = g.matrixWorld.elements;
        const pos = cloud.points.attributes.position.array as Float32Array;
        const alpha = cloud.points.attributes.aAlpha.array as Float32Array;
        const { origin, normal, dir, rnd } = cloud;
        // el estallido llega hasta fuera del lienzo: lo que mide la pantalla a la distancia de la marca
        const reach = dist * TAN * 2 * Math.max(1, aspect) * 0.9;
        const reachCharge = 0.25 + 0.55 * charge;
        const e = s.e;
        for (let i = 0; i < count; i++) {
          const j = i * 3;
          const q = i * 4;
          const ox = origin[j];
          const oy = origin[j + 1];
          const oz = origin[j + 2];
          let x = m[0] * ox + m[4] * oy + m[8] * oz + m[12];
          let yy = m[1] * ox + m[5] * oy + m[9] * oz + m[13];
          let z = m[2] * ox + m[6] * oy + m[10] * oz + m[14];
          let al = 0;
          if (e > 0) {
            // cada una sale un poco después que la anterior y con su brío; frena al alejarse
            const k = Math.max(0, Math.min(1, e * 1.2 - rnd[q + 1] * 0.2));
            const out = (1 - (1 - k) * (1 - k) * (1 - k)) * reach * (0.3 + 0.7 * rnd[q + 3]);
            // algo de giro alrededor del eje de la vista mientras se abre
            const tw = (rnd[q + 2] - 0.5) * 1.6 * k;
            const cs = Math.cos(tw);
            const sn = Math.sin(tw);
            const dx = dir[j] * out;
            const dy = dir[j + 1] * out;
            x += dx * cs - dy * sn;
            yy += dx * sn + dy * cs;
            z += dir[j + 2] * out;
            const fade = Math.pow(1 - k, 1.4);
            if (explodeRest > 0) {
              // reposo: en vez de apagarse, cada una se queda con su brillo (algo distinto en cada una, y respira) y flota a
              // la deriva, más cuanto más lejos ha llegado; al recomponerse, la deriva se recoge con el mismo `k`
              const ph = s.t * (0.25 + rnd[q + 2] * 0.35) + rnd[q + 1] * 6.283;
              const drift = reach * 0.035 * k;
              x += Math.sin(ph) * drift;
              yy += Math.cos(ph * 0.8 + rnd[q + 3] * 3) * drift;
              const rest = explodeRest * (0.55 + 0.45 * rnd[q + 3]) * (0.75 + 0.25 * Math.sin(ph * 1.7));
              al = Math.min(1, e * 10) * Math.max(fade, rest);
            } else {
              al = Math.min(1, e * 10) * fade;
            }
          } else if (rnd[q] < charge) {
            // carga: se desprende por la normal un trecho corto y se apaga; cuanta más carga, más partículas y más lejos
            const ph = (s.t * (0.45 + rnd[q + 2] * 0.9) + rnd[q + 1]) % 1;
            const nx = m[0] * normal[j] + m[4] * normal[j + 1] + m[8] * normal[j + 2];
            const ny = m[1] * normal[j] + m[5] * normal[j + 1] + m[9] * normal[j + 2];
            const nz = m[2] * normal[j] + m[6] * normal[j + 1] + m[10] * normal[j + 2];
            const r = ph * reachCharge * (0.5 + rnd[q + 3]);
            x += nx * r;
            yy += ny * r + ph * ph * 0.12;
            z += nz * r;
            al = (1 - ph) * (0.45 + 0.55 * charge);
          }
          if (al <= 0.003) {
            // fuera de la vista: así no cuesta ni un píxel
            x = yy = z = 1e6;
            al = 0;
          }
          pos[j] = x;
          pos[j + 1] = yy;
          pos[j + 2] = z;
          alpha[i] = al;
        }
        cloud.points.attributes.position.needsUpdate = true;
        cloud.points.attributes.aAlpha.needsUpdate = true;
        // tamaño en px del lienzo donde se dibuja: con el filtro, la escena va a menor resolución (mismo cálculo que RetroFX)
        const dpr = gl.getPixelRatio();
        const cellPx = Math.max(2, fx.cellSize ?? 7) * dpr;
        const pixPx = Math.max(1, fx.pixelSize ?? 4) * dpr;
        const scale = !retro ? 1 : Math.min(1, renderStyle === "pixel" ? 2 / pixPx : renderStyle === "ascii" ? 3 / cellPx : Math.max(3 / cellPx, 2 / pixPx));
        // con el filtro, nunca menos de una celda (3 muestras): más pequeña, la partícula no llega a encender un carácter
        cloud.material.uniforms.uSize.value = Math.max(retro ? 3 : 1, particleSize * dpr * scale);
      }
    }

    if (!s.ready) {
      s.ready = true;
      onReady();
    }
  });

  // tras el filtro lo que se lee es la luz sobre la forma: material claro, salvo que se pidan los colores de la escena
  const clay = retro && fx.tint !== "scene";
  const main = useMemo(() => (clay ? cssToColor("#e6e6e6", "#e6e6e6") : cssToColor(color, "#e8ecf4")), [clay, color]);
  const second = useMemo(() => (clay ? cssToColor("#8c8c8c", "#8c8c8c") : cssToColor(baseColor, "#7cc4ff")), [clay, baseColor]);
  const wire = renderStyle === "wire";
  if (cloud) cloud.material.uniforms.uColor.value = [main.r, main.g, main.b];

  return (
    <>
      {retro && <RetroFX {...fx} mode={renderStyle as "ascii" | "pixel" | "both"} />}
      <ambientLight intensity={0.3} />
      <directionalLight position={[3, 4, 5]} intensity={2.6} />
      <directionalLight position={[-4, -2, 2]} intensity={0.7} />
      <group ref={float}>
        <group ref={spin}>
          <mesh geometry={geo}>{wire ? <meshBasicMaterial color={main} wireframe /> : <meshStandardMaterial color={main} roughness={0.42} metalness={retro ? 0.05 : 0.35} />}</mesh>
          {base === "plate" && (
            <mesh geometry={plate} position={[0, 0, -thick / 2 - 0.05]}>
              {wire ? <meshBasicMaterial color={second} wireframe /> : <meshStandardMaterial color={second} roughness={0.55} metalness={retro ? 0.05 : 0.25} />}
            </mesh>
          )}
          {base === "ring" && <mesh geometry={ring}>{wire ? <meshBasicMaterial color={second} wireframe /> : <meshStandardMaterial color={second} roughness={0.4} metalness={retro ? 0.05 : 0.4} />}</mesh>}
        </group>
      </group>
      {cloud && <points ref={cloudRef} geometry={cloud.points} material={cloud.material} frustumCulled={false} visible={false} />}
    </>
  );
}

/**
 * Escena react-three-fiber de `Logo3D`: la marca extruida a partir de un trazado SVG, con el post-proceso retro del kit
 * (`RetroFX`) cuando se pinta como caracteres o píxeles, y una nube de partículas de su superficie para la carga y el
 * estallido. Se carga bajo demanda desde el componente. Dibuja a `fps` solo mientras hay movimiento y nada cuando `active`
 * es false.
 */
export default function LogoScene(props: LogoSceneProps) {
  const retro = props.renderStyle === "ascii" || props.renderStyle === "pixel" || props.renderStyle === "both";
  // las partículas en reposo (`explodeRest`) siguen a la deriva aunque la marca esté quieta
  const moving = props.motion !== "none" || props.draggable || props.charge > 0 || (props.explode && props.explodeRest > 0);
  // en táctil, menos densidad de píxeles: el lienzo puede ocupar la pantalla entera y con el filtro la diferencia no se ve
  const coarse = typeof matchMedia !== "undefined" && matchMedia("(pointer: coarse)").matches;
  return (
    <Canvas frameloop={props.active ? "demand" : "never"} dpr={[1, coarse ? 1.5 : 2]} gl={{ alpha: !retro, antialias: !retro }} camera={{ fov: FOV, position: [0, 0, 5], near: 0.1, far: 60 }} style={{ pointerEvents: "none" }}>
      {props.active && moving && <Ticker fps={props.fps} />}
      <Mark {...props} />
    </Canvas>
  );
}
