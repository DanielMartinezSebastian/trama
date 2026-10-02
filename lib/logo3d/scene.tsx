"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ExtrudeGeometry, Shape, TorusGeometry, type BufferGeometry, type Group, type PerspectiveCamera } from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
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
  /** false = fuera de pantalla u oculto: el lienzo no dibuja */
  active: boolean;
  root: RefObject<HTMLElement | null>;
  onReady: () => void;
};

const FOV = 32;
const rad = (deg: number) => (deg * Math.PI) / 180;

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

function Mark({ path, viewBox, strokeWidth, depth, bevel, base, renderStyle, fx, color, baseColor, motion, axis, speed, tilt, draggable, root, onReady }: LogoSceneProps) {
  const camera = useThree((s) => s.camera);
  const aspect = useThree((s) => s.size.width / Math.max(1, s.size.height));
  const invalidate = useThree((s) => s.invalidate);
  const spin = useRef<Group>(null);
  const float = useRef<Group>(null);
  const st = useRef({ t: 0, angle: 0, extra: 0, dragging: false, px: 0, py: 0, cx: 0, cy: 0, ready: false });

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

  // Encuadre: la marca (2 unidades, o la base) cabe en el lado corto del lienzo
  const extent = base === "none" ? 2.5 : 3.9;
  useLayoutEffect(() => {
    const c = camera as PerspectiveCamera;
    c.fov = FOV;
    c.position.set(0, 0, extent / (2 * Math.tan(rad(FOV) / 2)) / Math.min(1, aspect));
    c.lookAt(0, 0, 0);
    c.updateProjectionMatrix();
  }, [camera, aspect, extent]);

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
        s.px = clamp((e.clientX - (r.left + r.width / 2)) / (innerWidth / 2));
        s.py = clamp((e.clientY - (r.top + r.height / 2)) / (innerHeight / 2));
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
  }, [motion, draggable, root, invalidate]);

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
    if (!s.ready) {
      s.ready = true;
      onReady();
    }
  });

  const retro = renderStyle === "ascii" || renderStyle === "pixel" || renderStyle === "both";
  // tras el filtro lo que se lee es la luz sobre la forma: material claro, salvo que se pidan los colores de la escena
  const clay = retro && fx.tint !== "scene";
  const main = useMemo(() => (clay ? cssToColor("#e6e6e6", "#e6e6e6") : cssToColor(color, "#e8ecf4")), [clay, color]);
  const second = useMemo(() => (clay ? cssToColor("#8c8c8c", "#8c8c8c") : cssToColor(baseColor, "#7cc4ff")), [clay, baseColor]);
  const wire = renderStyle === "wire";

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
    </>
  );
}

/**
 * Escena react-three-fiber de `Logo3D`: la marca extruida a partir de un trazado SVG, con el post-proceso retro del kit
 * (`RetroFX`) cuando se pinta como caracteres o píxeles. Se carga bajo demanda desde el componente. Dibuja a `fps` solo
 * mientras hay movimiento y nada cuando `active` es false.
 */
export default function LogoScene(props: LogoSceneProps) {
  const retro = props.renderStyle === "ascii" || props.renderStyle === "pixel" || props.renderStyle === "both";
  const moving = props.motion !== "none" || props.draggable;
  return (
    <Canvas frameloop={props.active ? "demand" : "never"} dpr={[1, 2]} gl={{ alpha: !retro, antialias: !retro }} camera={{ fov: FOV, position: [0, 0, 5], near: 0.1, far: 60 }} style={{ pointerEvents: "none" }}>
      {props.active && moving && <Ticker fps={props.fps} />}
      <Mark {...props} />
    </Canvas>
  );
}
