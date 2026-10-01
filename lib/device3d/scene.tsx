"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, type DependencyList, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { BoxGeometry, ExtrudeGeometry, NoBlending, PMREMGenerator, PlaneGeometry, ShaderMaterial, Shape, ShapeGeometry, type Group, type PerspectiveCamera } from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { CSS3DObject, CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { cssToColor } from "@/lib/retro3d/color";
import { DEVICE_FOV, cameraDistance, type DeviceGeometry, type DeviceKind, type DeviceRect, type DeviceViewport } from "@/lib/ui/devices";

export type DeviceSceneProps = {
  device: DeviceKind;
  geo: DeviceGeometry;
  vp: DeviceViewport;
  /** color CSS de la carcasa (admite color-mix) */
  bodyColor: string;
  rotateX: number;
  rotateY: number;
  motion: "none" | "float" | "sway" | "spin" | "pointer";
  speed: number;
  shadow: boolean;
  glare: boolean;
  /** intensidad de brillos y reflejos: 0 = mate, 1 = normal */
  shine: number;
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

/** losa de esquinas redondeadas y canto biselado: la cara delantera queda en z = 0 y el grosor va hacia −z */
function slab(w: number, h: number, r: number, depth: number, bevel: number): ExtrudeGeometry {
  const b = Math.min(bevel, depth / 2 - 0.5);
  const g = new ExtrudeGeometry(roundedRect(w, h, r), { depth: depth - 2 * b, bevelEnabled: true, bevelThickness: b, bevelSize: b, bevelOffset: -b, bevelSegments: 3, curveSegments: 14 });
  g.translate(0, 0, -(depth - b));
  return g;
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

function Device({ device, geo, vp, bodyColor, rotateX, rotateY, motion, speed, shadow, glare, shine, screenEl, cssHost, root, onReady }: DeviceSceneProps) {
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

  // Cámara: a la distancia en la que la caja del dispositivo ocupa lo mismo que en la versión CSS
  useLayoutEffect(() => {
    const c = camera as PerspectiveCamera;
    c.fov = DEVICE_FOV;
    c.near = dist / 50;
    c.far = dist * 6;
    c.position.set(0, 0, dist);
    c.lookAt(0, 0, 0);
    c.updateProjectionMatrix();
  }, [camera, dist]);

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
      target.current = { x: clamp((e.clientX - (r.left + r.width / 2)) / (innerWidth / 2)), y: clamp((e.clientY - (r.top + r.height / 2)) / (innerHeight / 2)) };
      invalidate();
    };
    addEventListener("pointermove", onMove, { passive: true });
    return () => {
      removeEventListener("pointermove", onMove);
      target.current = { x: 0, y: 0 };
    };
  }, [motion, root, invalidate]);

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
      ry += c.x * 0.28;
      rx += c.y * 0.17;
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
  const baseDepth = f.h * 0.7;

  const bodyGeo = useDisposable(() => slab(f.w, f.h, f.r, geo.depth, bevel), [f.w, f.h, f.r, geo.depth, bevel]);
  const glassGeo = useDisposable(() => {
    const s = roundedRect(f.w - geo.ring * 2, f.h - geo.ring * 2, Math.max(1, f.r - geo.ring));
    s.holes.push(roundedRect(face.w, face.h, face.r, sx - fx, sy - fy));
    return new ShapeGeometry(s, 14);
  }, [f.w, f.h, f.r, geo.ring, face.w, face.h, face.r, sx - fx, sy - fy]);
  const holeGeo = useDisposable(() => new ShapeGeometry(roundedRect(face.w, face.h, face.r), 14), [face.w, face.h, face.r]);
  const n = geo.notch;
  const notchGeo = useDisposable(() => new ShapeGeometry(roundedRect(n?.w ?? 1, n?.h ?? 1, n?.r ?? 0), 12), [n?.w, n?.h, n?.r]);
  const baseGeo = useDisposable(() => slab(f.w, baseDepth, 28, 26, 3), [f.w, baseDepth]);
  const keysGeo = useDisposable(() => new PlaneGeometry(f.w * 0.84, baseDepth * 0.4), [f.w, baseDepth]);
  const padGeo = useDisposable(() => new PlaneGeometry(f.w * 0.26, baseDepth * 0.26), [f.w, baseDepth]);
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
  const shadowMat = useDisposable(
    () => new ShaderMaterial({ vertexShader: VERT, fragmentShader: "varying vec2 vUv; void main() { float d = length((vUv - 0.5) * 2.0); gl_FragColor = vec4(vec3(0.0), (1.0 - smoothstep(0.15, 1.0, d)) * 0.45); }", transparent: true, depthWrite: false }),
    [],
  );

  const body = useMemo(() => cssToColor(bodyColor, "#3a3f4b"), [bodyColor]);
  const dark = useMemo(() => body.clone().multiplyScalar(0.55), [body]);
  // sin brillo la carcasa pasa de metal pulido a plástico mate, y la luz ambiente compensa lo que deja de reflejar
  const gloss = Math.min(1, shine);
  const rough = (matte: number, glossy: number) => matte + (glossy - matte) * gloss;
  glareMat.uniforms.uShine.value = shine;
  const metal = <meshStandardMaterial color={body} roughness={rough(0.9, 0.36)} metalness={0.6 * gloss} />;
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
          <group position={[fx, hingeY, baseDepth / 2 - 14]}>
            <mesh geometry={baseGeo} rotation={[-Math.PI / 2, 0, 0]}>
              {metal}
            </mesh>
            <mesh geometry={keysGeo} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.8, -baseDepth * 0.2]}>
              <meshStandardMaterial color={BEZEL} roughness={0.7} metalness={0} />
            </mesh>
            <mesh geometry={padGeo} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.8, baseDepth * 0.26]}>
              <meshStandardMaterial color={dark} roughness={rough(0.9, 0.4)} metalness={0.5 * gloss} />
            </mesh>
          </group>
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
    <Canvas frameloop={props.active ? "demand" : "never"} dpr={[1, 2]} gl={{ alpha: true, antialias: true }} camera={{ fov: DEVICE_FOV, position: [0, 0, dist], near: dist / 50, far: dist * 6 }} style={{ pointerEvents: "none" }}>
      <Device {...props} />
    </Canvas>
  );
}
