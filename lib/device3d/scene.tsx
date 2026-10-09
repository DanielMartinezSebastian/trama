"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, type DependencyList, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { BoxGeometry, BufferGeometry, CylinderGeometry, DoubleSide, ExtrudeGeometry, NoBlending, PMREMGenerator, PlaneGeometry, ShaderMaterial, Shape, ShapeGeometry, type Group, type PerspectiveCamera } from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { CSS3DObject, CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { cssToColor } from "@/lib/retro3d/color";
import { cameraDistance, deviceBleed, pointerSideClamp, type DevicePointerSide, type DeviceGeometry, type DeviceKind, type DeviceRect, type DeviceViewport } from "@/lib/ui/devices";

export type DeviceSceneProps = {
  device: DeviceKind;
  geo: DeviceGeometry;
  vp: DeviceViewport;
  /** color CSS de la carcasa (admite color-mix) */
  bodyColor: string;
  rotateX: number;
  rotateY: number;
  motion: "none" | "float" | "sway" | "spin" | "pointer";
  /** grados máximos de giro horizontal y de inclinación vertical al seguir al puntero, y lado permitido */
  pointerX: number;
  pointerY: number;
  pointerSide: DevicePointerSide;
  speed: number;
  shadow: boolean;
  glare: boolean;
  /** intensidad de brillos y reflejos de la carcasa: 0 = mate, 1 = normal */
  shine: number;
  /** intensidad del reflejo del cristal sobre la pantalla */
  screenShine: number;
  /** false = fuera de pantalla: el lienzo no dibuja */
  active: boolean;
  /** elemento DOM con el contenido de la pantalla; se coloca con CSS 3D detrás del lienzo */
  screenEl: HTMLElement;
  /** contenedor de la capa CSS 3D (mismo tamaño que el lienzo) */
  cssHost: HTMLElement;
  /** raíz del componente: referencia para el movimiento con el puntero */
  root: RefObject<HTMLElement | null>;
  /** primer fotograma dibujado */
  onReady: () => void;
};

const BEZEL = "#05060a";
const rad = (deg: number) => (deg * Math.PI) / 180;
/** campo de visión con el que la caja del aparato mide lo mismo que en CSS aunque el lienzo sobresalga más o menos de ella */
const fovFor = (device: DeviceKind, geo: DeviceGeometry) => (Math.atan(((1 + 2 * deviceBleed(device)) * geo.th) / (2 * cameraDistance(geo))) * 360) / Math.PI;

/** rectángulo redondeado centrado en (ox, oy), en sentido antihorario */
function roundedRect(w: number, h: number, r: number, ox = 0, oy = 0): Shape {
  const k = Math.max(0.01, Math.min(r, w / 2, h / 2));
  const x = ox - w / 2;
  const y = oy - h / 2;
  const s = new Shape();
  s.moveTo(x + k, y);
  s.lineTo(x + w - k, y);
  s.absarc(x + w - k, y + k, k, -Math.PI / 2, 0, false);
  s.lineTo(x + w, y + h - k);
  s.absarc(x + w - k, y + h - k, k, 0, Math.PI / 2, false);
  s.lineTo(x + k, y + h);
  s.absarc(x + k, y + h - k, k, Math.PI / 2, Math.PI, false);
  s.lineTo(x, y + k);
  s.absarc(x + k, y + k, k, Math.PI, Math.PI * 1.5, false);
  return s;
}

/** losa de canto biselado a partir de una forma (con sus agujeros): la cara delantera queda en z = 0 y el grosor va hacia −z */
function slabOf(shape: Shape, depth: number, bevel: number): ExtrudeGeometry {
  const b = Math.min(bevel, depth / 2 - 0.5);
  const g = new ExtrudeGeometry(shape, { depth: depth - 2 * b, bevelEnabled: true, bevelThickness: b, bevelSize: b, bevelOffset: -b, bevelSegments: 3, curveSegments: 14 });
  g.translate(0, 0, -(depth - b));
  return g;
}

/** losa de esquinas redondeadas y canto biselado */
const slab = (w: number, h: number, r: number, depth: number, bevel: number) => slabOf(roundedRect(w, h, r), depth, bevel);

/** varias piezas en una sola geometría: una llamada de dibujo */
function bake(parts: BufferGeometry[]): BufferGeometry {
  const g = mergeGeometries(parts);
  parts.forEach((p) => p.dispose());
  return g;
}

/** grosor de la base del portátil y hondo del hueco del teclado */
const BASE_T = 26;
const WELL = 5;
/** filas del teclado en anchos de tecla (todas suman 14,5); la última acaba con las flechas, que ocupan 3 más */
const ones = (n: number) => Array<number>(n).fill(1);
const KEY_ROWS = [[1.5, ...ones(12), 1], [...ones(13), 1.5], [1.5, ...ones(13)], [1.75, ...ones(11), 1.75], [2.25, ...ones(10), 2.25], [1, 1, 1, 1.25, 5, 1.25, 1]];

/**
 * Teclado del portátil: una tecla de canto biselado por posición, fundidas en una geometría. Ocupa `kw` × `kh` centrado en
 * el origen, con la base de las teclas en z = 0 y la cara de arriba en z = `WELL`.
 */
function keyboard(kw: number, kh: number): BufferGeometry {
  const pad = 7;
  const gap = 6;
  const px = (kw - 2 * pad + gap) / 14.5;
  const py = (kh - 2 * pad + gap) / KEY_ROWS.length;
  const h = py - gap;
  const parts: BufferGeometry[] = [];
  const key = (w: number, kh2: number, x: number, y: number) =>
    parts.push(new ExtrudeGeometry(roundedRect(w, kh2, Math.min(6, kh2 * 0.2)), { depth: WELL - 2, bevelEnabled: true, bevelThickness: 1, bevelSize: 1, bevelOffset: -1, bevelSegments: 1, curveSegments: 3 }).translate(x, y, 1));
  KEY_ROWS.forEach((row, r) => {
    const y = kh / 2 - pad - h / 2 - r * py;
    let x = -kw / 2 + pad;
    for (const u of row) {
      key(u * px - gap, h, x + (u * px - gap) / 2, y);
      x += u * px;
    }
    if (r === KEY_ROWS.length - 1) {
      // flechas en T invertida: media tecla a cada lado y dos medias en el centro
      const hh = (h - 3) / 2;
      const w = px - gap;
      const lo = y - h / 2 + hh / 2;
      key(w, hh, x + w / 2, lo);
      key(w, hh, x + px + w / 2, lo);
      key(w, hh, x + px + w / 2, y + h / 2 - hh / 2);
      key(w, hh, x + 2 * px + w / 2, lo);
    }
  });
  return bake(parts);
}

/** crea un recurso de three y lo libera al cambiar o desmontar */
function useDisposable<T extends { dispose: () => void }>(make: () => T, deps: DependencyList): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const value = useMemo(make, deps);
  useEffect(() => () => value.dispose(), [value]);
  return value;
}

const VERT = "varying vec2 vP; varying vec2 vUv; void main() { vP = position.xy; vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }";

/** centro de un rectángulo de la geometría en coordenadas de escena (origen en el centro de la caja, y hacia arriba) */
const center = (r: DeviceRect, geo: DeviceGeometry): [number, number] => [r.x + r.w / 2 - geo.tw / 2, geo.th / 2 - (r.y + r.h / 2)];

function Device({ device, geo, vp, bodyColor, rotateX, rotateY, motion, pointerX, pointerY, pointerSide, speed, shadow, glare, shine, screenShine, screenEl, cssHost, root, onReady }: DeviceSceneProps) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  const width = useThree((s) => s.size.width);
  const height = useThree((s) => s.size.height);
  const invalidate = useThree((s) => s.invalidate);
  const rig = useRef<Group>(null);
  const clock = useRef(0);
  const target = useRef({ x: 0, y: 0 });
  const cur = useRef({ x: 0, y: 0 });
  const ready = useRef(false);
  const dist = cameraDistance(geo);
  const fov = fovFor(device, geo);

  // Cámara: a la distancia en la que la caja del dispositivo ocupa lo mismo que en la versión CSS
  useLayoutEffect(() => {
    const c = camera as PerspectiveCamera;
    c.fov = fov;
    c.near = dist / 50;
    c.far = dist * 6;
    c.position.set(0, 0, dist);
    c.lookAt(0, 0, 0);
    c.updateProjectionMatrix();
  }, [camera, dist, fov]);

  // Reflejos de la carcasa y del cristal: un entorno de estudio generado, sin descargar ningún HDR
  useEffect(() => {
    const pmrem = new PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const env = pmrem.fromScene(room, 0.04).texture;
    scene.environment = env;
    invalidate();
    return () => {
      scene.environment = null;
      env.dispose();
      room.dispose();
      pmrem.dispose();
    };
  }, [gl, scene, invalidate]);

  // `shine` gradúa los reflejos del entorno; los materiales y el reflejo del cristal lo siguen más abajo
  useEffect(() => {
    scene.environmentIntensity = 1.15 * shine;
  }, [scene, shine]);

  // Capa CSS 3D con la pantalla: misma cámara y mismo tamaño que el lienzo, colocada detrás de él
  const css = useMemo(() => new CSS3DRenderer(), []);
  const screen = useMemo(() => new CSS3DObject(screenEl), [screenEl]);
  useEffect(() => {
    const el = css.domElement;
    el.style.position = "absolute";
    el.style.inset = "0";
    cssHost.appendChild(el);
    return () => el.remove();
  }, [css, cssHost]);
  useEffect(() => {
    css.setSize(width, height);
  }, [css, width, height]);

  // Con frameloop="demand" cada cambio de props pide un fotograma
  useEffect(() => invalidate());

  useEffect(() => {
    if (motion !== "pointer" || matchMedia("(pointer: coarse)").matches) return;
    const onMove = (e: PointerEvent) => {
      const el = root.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const clamp = (v: number) => Math.max(-1, Math.min(1, v));
      target.current = { x: pointerSideClamp(clamp((e.clientX - (r.left + r.width / 2)) / (innerWidth / 2)), pointerSide), y: clamp((e.clientY - (r.top + r.height / 2)) / (innerHeight / 2)) };
      invalidate();
    };
    addEventListener("pointermove", onMove, { passive: true });
    return () => {
      removeEventListener("pointermove", onMove);
      target.current = { x: 0, y: 0 };
    };
  }, [motion, pointerSide, root, invalidate]);

  useFrame((_, delta) => {
    const g = rig.current;
    if (!g) return;
    const dt = Math.min(delta, 0.1);
    let rx = rad(rotateX);
    let ry = rad(rotateY);
    let y = 0;
    if (motion === "float" || motion === "sway" || motion === "spin") {
      clock.current += dt * speed;
      const t = clock.current;
      if (motion === "float") {
        y = Math.sin(t * 1.05) * geo.th * 0.012;
        ry += Math.sin(t * 0.7) * 0.05;
        rx += Math.sin(t * 0.9) * 0.02;
      } else if (motion === "sway") ry += Math.sin(t * 0.9) * 0.26;
      else ry += t * 0.7;
      invalidate();
    } else if (motion === "pointer") {
      const k = 1 - Math.exp(-dt * 5);
      const c = cur.current;
      c.x += (target.current.x - c.x) * k;
      c.y += (target.current.y - c.y) * k;
      ry += c.x * rad(pointerX);
      rx += c.y * rad(pointerY);
      if (Math.abs(target.current.x - c.x) + Math.abs(target.current.y - c.y) > 0.002) invalidate();
    }
    g.rotation.set(rx, ry, 0);
    g.position.y = y;
    css.render(scene, camera);
    if (!ready.current) {
      ready.current = true;
      onReady();
    }
  });

  const f = geo.frame;
  const face = geo.face;
  const [fx, fy] = center(f, geo);
  const [sx, sy] = center(face, geo);
  const laptop = device === "laptop";
  const desktop = device === "desktop";
  const bevel = Math.max(2, geo.ring);
  const framed = face.w < f.w;
  const baseDepth = f.h * 0.74;
  // Tapa de la base del portátil, vista desde arriba (x a la derecha, y hacia la bisagra): teclado, altavoces y trackpad
  const kb = { w: f.w * 0.8, h: baseDepth * 0.46, y: baseDepth * 0.2 };
  const pad = { w: f.w * 0.34, h: baseDepth * 0.34, y: -baseDepth * 0.27 };
  const grille = { w: f.w * 0.045, x: f.w * 0.45 };

  const bodyGeo = useDisposable(() => slab(f.w, f.h, f.r, geo.depth, bevel), [f.w, f.h, f.r, geo.depth, bevel]);
  const glassGeo = useDisposable(() => {
    const s = roundedRect(f.w - geo.ring * 2, f.h - geo.ring * 2, Math.max(1, f.r - geo.ring));
    s.holes.push(roundedRect(face.w, face.h, face.r, sx - fx, sy - fy));
    return new ShapeGeometry(s, 14);
  }, [f.w, f.h, f.r, geo.ring, face.w, face.h, face.r, sx - fx, sy - fy]);
  const holeGeo = useDisposable(() => new ShapeGeometry(roundedRect(face.w, face.h, face.r), 14), [face.w, face.h, face.r]);
  const n = geo.notch;
  const notchGeo = useDisposable(() => new ShapeGeometry(roundedRect(n?.w ?? 1, n?.h ?? 1, n?.r ?? 0), 12), [n?.w, n?.h, n?.r]);
  // la base lleva el hueco del teclado calado: las teclas quedan a ras de la tapa, como en un portátil de aluminio
  const baseGeo = useDisposable(() => {
    const s = roundedRect(f.w, baseDepth, 30);
    s.holes.push(roundedRect(kb.w, kb.h, 10, 0, kb.y));
    return slabOf(s, BASE_T, 3);
  }, [f.w, baseDepth]);
  const wellGeo = useDisposable(() => new ShapeGeometry(roundedRect(kb.w + 10, kb.h + 10, 12), 6), [f.w, baseDepth]);
  const keysGeo = useDisposable(() => (laptop ? keyboard(kb.w, kb.h) : new BufferGeometry()), [laptop, f.w, baseDepth]);
  const padGeo = useDisposable(() => new ShapeGeometry(roundedRect(pad.w, pad.h, 14), 8), [f.w, baseDepth]);
  const padRimGeo = useDisposable(() => {
    const s = roundedRect(pad.w + 5, pad.h + 5, 16);
    s.holes.push(roundedRect(pad.w, pad.h, 14));
    return new ShapeGeometry(s, 8);
  }, [f.w, baseDepth]);
  const grilleGeo = useDisposable(() => new PlaneGeometry(grille.w, kb.h * 0.9), [f.w, baseDepth]);
  const scoopGeo = useDisposable(() => new ShapeGeometry(roundedRect(f.w * 0.11, 9, 4.5), 6), [f.w]);
  // puertos en los cantos (cerca de la bisagra) y cuatro tacos de goma debajo
  const trimGeo = useDisposable(() => {
    const port = (side: number, len: number, hgt: number, y: number) => new BoxGeometry(1.2, len, hgt).translate(side * (f.w / 2 + 0.1), y, -BASE_T / 2);
    const back = baseDepth / 2;
    const parts: BufferGeometry[] = [port(-1, 44, 7, back - 90), port(-1, 26, 8, back - 150), port(-1, 26, 8, back - 196), port(-1, 12, 12, back - 240), port(1, 40, 11, back - 90), port(1, 26, 8, back - 150), port(1, 56, 5, back - 215)];
    for (const x of [-1, 1]) for (const y of [-1, 1]) parts.push(new CylinderGeometry(20, 20, 3, 20).rotateX(Math.PI / 2).translate(x * (f.w / 2 - 110), y * (baseDepth / 2 - 80), -BASE_T - 1.5));
    return bake(parts);
  }, [f.w, baseDepth]);
  const neck = geo.parts[0];
  const foot = geo.parts[1];
  const neckGeo = useDisposable(() => new BoxGeometry(neck?.w ?? 1, (neck?.h ?? 1) + 90, 30), [neck?.w, neck?.h]);
  const footGeo = useDisposable(() => slab(foot?.w ?? 10, 420, 60, foot?.h ?? 10, 4), [foot?.w, foot?.h]);
  const shadowGeo = useDisposable(() => new PlaneGeometry(1, 1), []);

  // Agujero: escribe píxeles transparentes en el lienzo para que se vea el DOM de detrás, y sí escribe profundidad
  const holeMat = useDisposable(() => new ShaderMaterial({ vertexShader: VERT, fragmentShader: "void main() { gl_FragColor = vec4(0.0); }", blending: NoBlending }), []);
  const glareMat = useDisposable(
    () =>
      new ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: "uniform vec2 uSize; uniform float uShine; varying vec2 vP; void main() { vec2 u = vP / uSize + 0.5; float d = (1.0 - u.x) * 0.55 + u.y * 0.45; gl_FragColor = vec4(vec3(1.0), smoothstep(0.5, 1.0, d) * 0.16 * uShine); }",
        uniforms: { uSize: { value: [face.w, face.h] }, uShine: { value: 1 } },
        transparent: true,
        depthWrite: false,
      }),
    [face.w, face.h],
  );
  // rejilla de los altavoces: puntos oscuros sobre la tapa
  const grilleMat = useDisposable(
    () => new ShaderMaterial({ vertexShader: VERT, fragmentShader: "varying vec2 vP; void main() { vec2 g = fract(vP / 6.5) - 0.5; gl_FragColor = vec4(vec3(0.0), (1.0 - smoothstep(0.2, 0.3, length(g))) * 0.8); }", transparent: true, depthWrite: false }),
    [],
  );
  const shadowMat = useDisposable(
    () => new ShaderMaterial({ vertexShader: VERT, fragmentShader: "varying vec2 vUv; void main() { float d = length((vUv - 0.5) * 2.0); gl_FragColor = vec4(vec3(0.0), (1.0 - smoothstep(0.15, 1.0, d)) * 0.45); }", transparent: true, depthWrite: false }),
    [],
  );

  const body = useMemo(() => cssToColor(bodyColor, "#3a3f4b"), [bodyColor]);
  const dark = useMemo(() => body.clone().multiplyScalar(0.55), [body]);
  // sin brillo la carcasa pasa de metal pulido a plástico mate, y la luz ambiente compensa lo que deja de reflejar
  const gloss = Math.min(1, shine);
  const rough = (matte: number, glossy: number) => matte + (glossy - matte) * gloss;
  glareMat.uniforms.uShine.value = screenShine;
  // Un metal refleja con su propio color: una carcasa muy oscura (acabado negro) no devolvería luz y se perdería sobre un
  // fondo oscuro. Cuanto más oscura, menos metal: así conserva el brillo blanco de un plástico o un anodizado negro.
  const metalness = 0.6 * gloss * Math.max(0.25, Math.min(1, (0.2126 * body.r + 0.7152 * body.g + 0.0722 * body.b) / 0.04));
  const metal = <meshStandardMaterial color={body} roughness={rough(0.9, 0.36)} metalness={metalness} />;
  const hingeY = fy - f.h / 2;
  // el portátil se abre un poco hacia atrás, girando sobre la bisagra; el resto no gira
  const open = laptop ? rad(-10) : 0;
  const floating = !laptop && !desktop;
  const floorY = -geo.th / 2 - (floating ? geo.th * 0.05 : 1);
  const shadowDepth = laptop ? baseDepth * 1.5 : geo.tw * 0.45;

  return (
    <>
      <ambientLight intensity={0.35 + (1 - gloss) * 1.1} />
      <directionalLight position={[-geo.tw, geo.th, dist]} intensity={1.5} />
      <group ref={rig}>
        <group position={[fx, hingeY, 0]} rotation={[open, 0, 0]}>
          <group position={[0, f.h / 2, 0]}>
            <mesh geometry={bodyGeo}>{metal}</mesh>
            {laptop && (
              // emblema pulido en la trasera de la tapa: se ve cuando el portátil gira
              <mesh position={[0, 0, -geo.depth - 0.4]} rotation={[0, Math.PI, 0]}>
                <circleGeometry args={[f.h * 0.055, 48]} />
                <meshStandardMaterial color={body} roughness={rough(0.6, 0.06)} metalness={gloss} />
              </mesh>
            )}
            {framed && (
              <mesh geometry={glassGeo} position={[0, 0, 1]}>
                <meshStandardMaterial color={BEZEL} roughness={rough(0.95, 0.16)} metalness={0.1} />
              </mesh>
            )}
            <mesh geometry={holeGeo} material={holeMat} position={[sx - fx, sy - fy, 1]} />
            <primitive object={screen} position={[sx - fx, sy - fy, 1]} scale={1 / vp.s} />
            {glare && <mesh geometry={holeGeo} material={glareMat} position={[sx - fx, sy - fy, 2]} />}
            {n && (
              <mesh geometry={notchGeo} position={[center(n, geo)[0] - fx, center(n, geo)[1] - fy, 3]}>
                {/* la isla y las cámaras no reflejan nada: negro plano, sin luz ni entorno */}
                <meshBasicMaterial color={n.kind === "dot" ? "#10131b" : BEZEL} />
              </mesh>
            )}
          </group>
        </group>
        {laptop && (
          <>
            {/* bisagra: una barra oscura entre la tapa y la base */}
            <mesh position={[fx, hingeY + 5, 3]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[9, 9, f.w * 0.8, 20]} />
              <meshStandardMaterial color={BEZEL} roughness={rough(0.9, 0.35)} metalness={0.2} />
            </mesh>
            {/* la base, tumbada: x a la derecha, y hacia la bisagra, z hacia arriba (0 = la tapa) */}
            <group position={[fx, hingeY, baseDepth / 2 - 14]} rotation={[-Math.PI / 2, 0, 0]}>
              <mesh geometry={baseGeo}>{metal}</mesh>
              <mesh geometry={wellGeo} position={[0, kb.y, -WELL - 0.05]}>
                <meshStandardMaterial color="#020203" roughness={0.95} metalness={0} />
              </mesh>
              <mesh geometry={wellGeo} position={[0, kb.y, -BASE_T - 0.1]}>
                <meshStandardMaterial color={body} roughness={rough(0.9, 0.36)} metalness={metalness} side={DoubleSide} />
              </mesh>
              <mesh geometry={keysGeo} position={[0, kb.y, -WELL]}>
                <meshStandardMaterial color="#14161b" roughness={rough(0.85, 0.5)} metalness={0.1} />
              </mesh>
              <mesh geometry={padRimGeo} position={[0, pad.y, 0.3]}>
                <meshStandardMaterial color={dark} roughness={0.8} metalness={0.3 * gloss} />
              </mesh>
              <mesh geometry={padGeo} position={[0, pad.y, 0.3]}>
                <meshStandardMaterial color={body} roughness={rough(0.8, 0.3)} metalness={0.35 * gloss} />
              </mesh>
              {[-1, 1].map((side) => (
                <mesh key={side} geometry={grilleGeo} material={grilleMat} position={[side * grille.x, kb.y, 0.3]} />
              ))}
              <mesh geometry={scoopGeo} position={[0, -baseDepth / 2 + 7, 0.3]}>
                <meshStandardMaterial color={dark} roughness={0.85} metalness={0.3 * gloss} />
              </mesh>
              <mesh geometry={trimGeo}>
                <meshStandardMaterial color={BEZEL} roughness={0.8} metalness={0.1} />
              </mesh>
            </group>
          </>
        )}
        {desktop && neck && foot && (
          <>
            <mesh geometry={neckGeo} position={[center(neck, geo)[0], center(neck, geo)[1] + 45, -geo.depth - 6]}>
              {metal}
            </mesh>
            <mesh geometry={footGeo} rotation={[-Math.PI / 2, 0, 0]} position={[center(foot, geo)[0], geo.th / 2 - foot.y, -geo.depth + 40]}>
              {metal}
            </mesh>
          </>
        )}
        {shadow && <mesh geometry={shadowGeo} material={shadowMat} rotation={[-Math.PI / 2, 0, 0]} position={[0, floorY, laptop ? baseDepth / 2 : -geo.depth / 2]} scale={[geo.tw * 1.3, shadowDepth, 1]} />}
      </group>
    </>
  );
}

/**
 * Escena react-three-fiber de `DeviceMockup3D`: la carcasa es geometría generada (sin modelos que descargar) y la pantalla,
 * DOM real colocado con `CSS3DRenderer` detrás de un agujero del lienzo. Se carga bajo demanda desde el componente, así
 * `three` no entra en el primer pintado. Dibuja solo cuando algo cambia (`frameloop="demand"`).
 */
export default function DeviceScene(props: DeviceSceneProps) {
  const dist = cameraDistance(props.geo);
  return (
    <Canvas frameloop={props.active ? "demand" : "never"} dpr={[1, 2]} gl={{ alpha: true, antialias: true }} camera={{ fov: fovFor(props.device, props.geo), position: [0, 0, dist], near: dist / 50, far: dist * 6 }} style={{ pointerEvents: "none" }}>
      <Device {...props} />
    </Canvas>
  );
}
