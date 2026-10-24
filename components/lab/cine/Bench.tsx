"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { PMREMGenerator as PMREMClasico, WebGLRenderer } from "three";
import * as THREE from "three/webgpu";
import { float, pass, smoothstep, uniform, uv } from "three/tsl";
import { bloom } from "three/addons/tsl/display/BloomNode.js";
import { dof } from "three/addons/tsl/display/DepthOfFieldNode.js";
import { chromaticAberration } from "three/addons/tsl/display/ChromaticAberrationNode.js";
import { film } from "three/addons/tsl/display/FilmNode.js";
import { fxaa } from "three/addons/tsl/display/FXAANode.js";
import { smaa } from "three/addons/tsl/display/SMAANode.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { HDRLoader } from "three/addons/loaders/HDRLoader.js";
import { ease, lerp3 } from "@/lib/cine/curves";
import type { Ficha, Luz, Material, Pase, Pieza, Plano, ToneMapping } from "@/lib/cine/schema";
import { COMPONENTES } from "./componentes";

/*
 * Banco de pruebas de /lab/cine (docs/26 §5): monta una ficha de escena tal cual, con WebGPURenderer (WebGL2 de reserva
 * si no hay WebGPU) y el posprocesado en TSL (RenderPipeline). Se captura con `cine:capture` igual que la referencia, así
 * que las dos dan el mismo `timeline.jsonl` y se pueden comparar.
 *
 * El tiempo sale del reloj de three (performance.now): con la captura exacta (`--exact`) avanza 1/60 s por fotograma, igual
 * que en la referencia. Con `reloj: "scroll"`, el progreso es el scroll de la página (el contenedor mide `duracion` pantallas).
 */

const TONE: Record<ToneMapping, THREE.ToneMapping> = {
  none: THREE.NoToneMapping,
  linear: THREE.LinearToneMapping,
  reinhard: THREE.ReinhardToneMapping,
  cineon: THREE.CineonToneMapping,
  aces: THREE.ACESFilmicToneMapping,
  agx: THREE.AgXToneMapping,
  neutral: THREE.NeutralToneMapping,
};

/** camino de un plano: recto, o una Catmull-Rom por sus puntos de paso recorrida por longitud de arco (getPointAt) */
const caminos = new WeakMap<Plano, { pos?: THREE.CatmullRomCurve3; mira?: THREE.CatmullRomCurve3 }>();
function camino(p: Plano) {
  let c = caminos.get(p);
  if (!c) {
    const curve = (a: number[], ruta: number[][] | undefined, b: number[]) => (ruta?.length ? new THREE.CatmullRomCurve3([a, ...ruta, b].map((v) => new THREE.Vector3(v[0], v[1], v[2])), false, "centripetal") : undefined);
    c = { pos: curve(p.camara.desde.pos, p.camara.ruta, p.camara.hasta.pos), mira: curve(p.camara.desde.mira, p.camara.rutaMira, p.camara.hasta.mira) };
    caminos.set(p, c);
  }
  return c;
}

/** pose de cámara en un instante: el plano que lo contiene, su progreso con meseta y su curva, por su camino */
export function poseAt(planos: Plano[], t: number) {
  const p = planos.find((x) => t >= x.desde && t <= x.hasta) ?? (t < planos[0].desde ? planos[0] : planos[planos.length - 1]);
  const span = Math.max(1e-6, p.hasta - p.desde);
  const raw = Math.min(1, Math.max(0, (t - p.desde) / span));
  const k = Math.min(1, Math.max(0, ease(p.camara.curva)(Math.min(1, raw / (1 - (p.camara.meseta ?? 0))))));
  const a = p.camara.desde;
  const b = p.camara.hasta;
  const c = camino(p);
  const pos = c.pos ? (c.pos.getPointAt(k).toArray() as [number, number, number]) : lerp3(a.pos, b.pos, k);
  const mira = c.mira ? (c.mira.getPointAt(k).toArray() as [number, number, number]) : lerp3(a.mira, b.mira, k);
  // alabeo: tramos lineales entre desde, los puntos de paso (a fracciones iguales del recorrido) y hasta
  const rolls = [a.alabeo ?? 0, ...(p.camara.rutaAlabeo ?? []), b.alabeo ?? 0];
  const f = k * (rolls.length - 1);
  const j = Math.min(rolls.length - 2, Math.floor(f));
  const alabeo = rolls[j] + (rolls[j + 1] - rolls[j]) * (f - j);
  return { plano: p, pos, mira, fov: a.fov + (b.fov - a.fov) * k, alabeo };
}

/*
 * Scroll virtual, como drei ScrollControls: la rueda se acumula en un objetivo de 0 a 1 sobre un recorrido de `duracion`
 * pantallas. Sin el scroll de la ventana, Chrome no añade su desplazamiento suave a cada golpe (una segunda capa de
 * suavizado que no está en la ficha), y la captura mide el banco igual que una referencia con scroll virtual.
 */
const rueda = { objetivo: 0 };
function RuedaVirtual({ ficha }: { ficha: Ficha }) {
  useEffect(() => {
    if (ficha.reloj !== "scroll") return;
    rueda.objetivo = 0;
    const onWheel = (e: WheelEvent) => {
      rueda.objetivo = Math.min(1, Math.max(0, rueda.objetivo + e.deltaY / (ficha.duracion * innerHeight)));
    };
    addEventListener("wheel", onWheel, { passive: true });
    return () => removeEventListener("wheel", onWheel);
  }, [ficha]);
  return null;
}

/** progreso del reloj de la ficha: segundos (tiempo, en bucle) o 0–1 (scroll virtual) */
function useReloj(ficha: Ficha) {
  const t = useRef(0);
  useFrame(({ clock }, delta) => {
    if (ficha.reloj === "scroll") {
      const target = rueda.objetivo;
      // amortiguado de la ficha (fracción que queda por fotograma a 60 Hz), independiente de la frecuencia real
      const r = ficha.suavizado ?? 0;
      t.current = r > 0 ? t.current + (target - t.current) * (1 - r ** (delta * 60)) : target;
    } else t.current = clock.elapsedTime % ficha.duracion;
  }, -2);
  return t;
}

function Rig({ ficha }: { ficha: Ficha }) {
  const t = useReloj(ficha);
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const mira = useMemo(() => new THREE.Vector3(), []);
  useLayoutEffect(() => {
    camera.near = ficha.camara.near;
    camera.far = ficha.camara.far;
  }, [camera, ficha]);
  useFrame(() => {
    const pose = poseAt(ficha.camara.planos, t.current);
    camera.position.set(...pose.pos);
    camera.fov = pose.fov;
    camera.lookAt(mira.set(...pose.mira));
    if (pose.alabeo) camera.rotateZ((pose.alabeo * Math.PI) / 180);
    camera.updateProjectionMatrix();
  }, -1);
  return null;
}

function luz(l: Luz, i: number) {
  const shadow = l.sombra ? { castShadow: true, "shadow-mapSize": [l.sombra.mapa, l.sombra.mapa] as [number, number] } : {};
  if (l.tipo === "ambiente") return <ambientLight key={i} color={l.color} intensity={l.intensidad} />;
  if (l.tipo === "hemisferio") return <hemisphereLight key={i} args={[l.color, l.suelo ?? "#000000", l.intensidad]} />;
  if (l.tipo === "direccional") return <directionalLight key={i} color={l.color} intensity={l.intensidad} position={l.pos} {...shadow} />;
  if (l.tipo === "foco") return <spotLight key={i} color={l.color} intensity={l.intensidad} position={l.pos} angle={l.angulo} penumbra={l.penumbra} distance={l.distancia} decay={l.decaimiento} {...shadow} />;
  return <pointLight key={i} color={l.color} intensity={l.intensidad} position={l.pos} distance={l.distancia} decay={l.decaimiento} {...shadow} />;
}

function Luces({ luces }: { luces: Luz[] }) {
  const camera = useThree((s) => s.camera);
  const enCamara = luces.filter((l) => l.deCamara);
  return (
    <>
      {luces.map((l, i) => (l.deCamara ? null : luz(l, i)))}
      {/* las pegadas a la cámara cuelgan de ella, como `camera.add(light)` en three (la cámara entra en la escena) */}
      {enCamara.length > 0 && <primitive object={camera}>{enCamara.map(luz)}</primitive>}
    </>
  );
}

function Niebla({ ficha }: { ficha: Ficha }) {
  const scene = useThree((s) => s.scene);
  const n = ficha.atmosfera.niebla;
  useLayoutEffect(() => {
    if (!n) return;
    if (n.tipo === "lineal") scene.fog = new THREE.Fog(n.color, n.near, n.far);
    else if (n.tipo === "exp2") scene.fog = new THREE.FogExp2(n.color, n.densidad);
    else console.warn("[cine] niebla por altura aún no soportada en el banco");
    return () => {
      scene.fog = null;
    };
  }, [n, scene]);
  return null;
}

function Entorno({ ficha }: { ficha: Ficha }) {
  const { gl, scene } = useThree();
  const e = ficha.luz.entorno;
  useEffect(() => {
    if (e.tipo === "ninguno") return;
    let tex: THREE.Texture | null = null;
    let live = true;
    const apply = (t: THREE.Texture) => {
      if (!live) return t.dispose();
      tex = t;
      scene.environment = t;
      scene.environmentIntensity = e.intensidad;
      if (e.fondo) {
        scene.background = t;
        scene.backgroundBlurriness = e.desenfoque ?? 0;
      }
    };
    if (e.tipo === "estudio") {
      // cada motor tiene su generador de PMREM
      const pmrem = (gl as unknown as { isWebGLRenderer?: boolean }).isWebGLRenderer ? new PMREMClasico(gl as unknown as WebGLRenderer) : new THREE.PMREMGenerator(gl as unknown as THREE.WebGPURenderer);
      apply(pmrem.fromScene(new RoomEnvironment(), 0.04).texture);
      pmrem.dispose();
    } else {
      new HDRLoader().load(e.src, (t) => {
        t.mapping = THREE.EquirectangularReflectionMapping;
        apply(t);
      });
    }
    return () => {
      live = false;
      if (scene.environment === tex) scene.environment = null;
      if (scene.background === tex) scene.background = null;
      tex?.dispose();
    };
  }, [e, gl, scene]);
  return null;
}

function material(m: Material | undefined) {
  if (!m) return new THREE.MeshStandardMaterial();
  const base = { color: m.color, roughness: m.rugosidad, metalness: m.metalico, emissive: m.emisivo, emissiveIntensity: m.intensidadEmisiva, opacity: m.opacidad, transparent: m.opacidad !== undefined && m.opacidad < 1 };
  const clean = <T extends object>(o: T) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) as T;
  if (m.modelo === "fisico")
    return new THREE.MeshPhysicalMaterial(clean({ ...base, transmission: m.transmision, thickness: m.grosor, ior: m.ior, dispersion: m.dispersion, clearcoat: m.barniz, clearcoatRoughness: m.rugosidadBarniz, sheen: m.brillo, iridescence: m.iridiscencia }));
  if (m.modelo === "basico") return new THREE.MeshBasicMaterial(clean({ color: m.color, opacity: m.opacidad, transparent: base.transparent }));
  if (m.modelo === "lambert") return new THREE.MeshLambertMaterial(clean({ color: m.color, emissive: m.emisivo }));
  return new THREE.MeshStandardMaterial(clean(base));
}

const FORMAS: Record<string, () => THREE.BufferGeometry> = {
  esfera: () => new THREE.SphereGeometry(1, 96, 64),
  caja: () => new THREE.BoxGeometry(1, 1, 1),
  toro: () => new THREE.TorusGeometry(0.8, 0.3, 64, 160),
  nudo: () => new THREE.TorusKnotGeometry(0.7, 0.24, 256, 48),
  plano: () => new THREE.PlaneGeometry(1, 1),
  cilindro: () => new THREE.CylinderGeometry(0.5, 0.5, 1, 64),
};

/**
 * Un GLB tal cual, con dos ajustes de la ficha: los materiales que se llaman como uno de `materiales` toman sus valores
 * (la captura los mide por nombre: color, rugosidad, envMapIntensity…), y con sombras en el render las piezas las dan y
 * las reciben.
 */
function Gltf({ p, mats, sombras, ficha }: { p: Extract<Pieza, { tipo: "gltf" }>; mats: Material[]; sombras: boolean; ficha: Ficha }) {
  const { scene, animations } = useGLTF(p.src, false, false) as unknown as { scene: THREE.Object3D; animations: THREE.AnimationClip[] };
  const mixer = useMemo(() => new THREE.AnimationMixer(scene), [scene]);
  useLayoutEffect(() => {
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = mesh.receiveShadow = sombras;
      for (const mat of (Array.isArray(mesh.material) ? mesh.material : [mesh.material]) as THREE.MeshStandardMaterial[]) {
        const m = mats.find((x) => x.id === mat.name);
        if (!m) continue;
        if (m.color) mat.color?.set(m.color);
        if (m.rugosidad !== undefined) mat.roughness = m.rugosidad;
        if (m.metalico !== undefined) mat.metalness = m.metalico;
        if (m.intensidadEntorno !== undefined) mat.envMapIntensity = m.intensidadEntorno;
        if (m.emisivo) mat.emissive?.set(m.emisivo);
        if (m.intensidadEmisiva !== undefined) mat.emissiveIntensity = m.intensidadEmisiva;
        if (m.opacidad !== undefined && m.opacidad < 1) (mat.opacity = m.opacidad), (mat.transparent = true);
        mat.needsUpdate = true;
      }
    });
  }, [scene, mats, sombras]);
  const actions = useRef<THREE.AnimationAction[]>([]);
  useEffect(() => {
    const clips = p.animacion === "*" ? animations.slice(0, 1) : animations.filter((a) => a.name === p.animacion);
    actions.current = clips.map((c) => {
      const a = mixer.clipAction(c.optimize()).play();
      // atada al reloj: pausada, y el tiempo lo pone cada fotograma
      a.paused = !!p.animacionReloj;
      return a;
    });
    return () => actions.current.forEach((a) => a.stop());
  }, [animations, mixer, p.animacion, p.animacionReloj]);
  const reloj = useReloj(ficha);
  useFrame((_, delta) => {
    const ar = p.animacionReloj;
    if (ar) {
      // reloj de tiempo en segundos: se normaliza con la duración de la ficha
      const k = ficha.reloj === "scroll" ? reloj.current : reloj.current / ficha.duracion;
      for (const a of actions.current) a.time = ar.desde + (ar.hasta - ar.desde) * k;
      mixer.update(0);
    } else mixer.update(delta);
  });
  return <primitive object={scene} scale={p.escala ?? 1} position={p.pos} rotation={p.rot} />;
}

function Primitiva({ p, mats }: { p: Extract<Pieza, { tipo: "primitiva" }>; mats: Material[] }) {
  const mesh = useRef<THREE.Mesh>(null);
  const geo = useMemo(() => FORMAS[p.forma](), [p.forma]);
  const mat = useMemo(() => material(mats.find((m) => m.id === p.material)), [mats, p.material]);
  useFrame((_, d) => {
    if (mesh.current && p.giro) {
      mesh.current.rotation.x += p.giro[0] * d;
      mesh.current.rotation.y += p.giro[1] * d;
      mesh.current.rotation.z += p.giro[2] * d;
    }
  });
  const s = p.escala ?? 1;
  return <mesh ref={mesh} geometry={geo} material={mat} position={p.pos} rotation={p.rot} scale={typeof s === "number" ? [s, s, s] : s} />;
}

function Escena({ ficha }: { ficha: Ficha }) {
  return (
    <>
      {ficha.escena.map((p, i) => {
        if (p.tipo === "gltf") return <Gltf key={i} p={p} ficha={ficha} mats={ficha.materiales} sombras={!!ficha.render.sombras && ficha.render.sombras !== "ninguna"} />;
        if (p.tipo === "primitiva") return <Primitiva key={i} p={p} mats={ficha.materiales} />;
        const C = COMPONENTES[p.id];
        if (!C) {
          console.warn(`[cine] componente sin registrar: ${p.id}`);
          return null;
        }
        return <C key={i} {...(p.props ?? {})} />;
      })}
    </>
  );
}

/** pila de posprocesado de la ficha en TSL, en su orden; lo que el banco aún no sabe pintar se avisa y se salta */
function Post({ pases }: { pases: Pase[] }) {
  const { gl, scene, camera } = useThree();
  const pipeline = useMemo(() => {
    const renderer = gl as unknown as THREE.WebGPURenderer;
    const p = new THREE.RenderPipeline(renderer);
    const scenePass = pass(scene, camera);
    const color = scenePass.getTextureNode("output");
    // cualquier nodo de TSL vale como salida; el tipado de cada paso cambia, así que se lleva como el de `color`
    let out = color as typeof color;
    for (const x of pases) {
      if (x.tipo === "bloom") out = out.add(bloom(color, x.fuerza, x.radio, x.umbral)) as typeof color;
      else if (x.tipo === "dof") out = dof(out, scenePass.getViewZNode(), uniform(x.foco), uniform(x.focal), uniform(x.bokeh)) as unknown as typeof color;
      else if (x.tipo === "aberracion") out = chromaticAberration(out, uniform(x.fuerza)) as unknown as typeof color;
      else if (x.tipo === "grano") out = film(out, float(x.intensidad)) as unknown as typeof color;
      else if (x.tipo === "vineta") {
        const d = uv().sub(0.5).length();
        out = out.mul(float(1).sub(smoothstep(float(0.5 - x.suavidad * 0.5), float(0.5 + x.suavidad * 0.5), d.mul(x.fuerza * 2)))) as typeof color;
      } else if (x.tipo === "aa" && x.metodo === "fxaa") out = fxaa(out) as unknown as typeof color;
      else if (x.tipo === "aa" && x.metodo === "smaa") out = smaa(out) as unknown as typeof color;
      else console.warn(`[cine] pase aún no soportado en el banco: ${x.tipo}`);
    }
    p.outputNode = out;
    return p;
  }, [gl, scene, camera, pases]);
  useEffect(() => () => pipeline.dispose(), [pipeline]);
  // prioridad 1: R3F deja de pintar por su cuenta y pinta la pila
  useFrame(() => pipeline.render(), 1);
  return null;
}

export default function Bench({ ficha }: { ficha: Ficha }) {
  const r = ficha.render;
  const p0 = ficha.camara.planos[0].camara.desde;
  return (
    <Canvas
      dpr={[1, r.dprMax]}
      camera={{ fov: p0.fov, position: p0.pos, near: ficha.camara.near, far: ficha.camara.far }}
      // R3F: "percentage" = PCFShadowMap, "soft" = PCFSoftShadowMap, "variance" = VSMShadowMap
      shadows={r.sombras && r.sombras !== "ninguna" ? (r.sombras === "vsm" ? "variance" : r.sombras === "pcf" ? "percentage" : "soft") : false}
      gl={async (props) => {
        // motor clásico: el WebGLRenderer de siempre (materiales y luces de la ruta clásica de three, sin TSL)
        if (r.motor === "clasico") return new WebGLRenderer({ ...(props as object), antialias: true }) as unknown as THREE.WebGPURenderer & { render: () => void };
        const renderer = new THREE.WebGPURenderer({ ...(props as object), antialias: true, forceWebGL: r.renderer === "webgl2" });
        await renderer.init();
        return renderer as unknown as THREE.WebGPURenderer & { render: () => void };
      }}
      // R3F pone sus valores (ACES, sRGB) después de crear el renderer: los de la ficha van aquí, cuando ya no los pisa
      onCreated={({ gl }) => {
        gl.toneMapping = TONE[r.toneMapping];
        gl.toneMappingExposure = r.exposicion;
        gl.outputColorSpace = r.colorSpace === "linear" ? THREE.LinearSRGBColorSpace : r.colorSpace === "display-p3" ? ("display-p3" as THREE.ColorSpace) : THREE.SRGBColorSpace;
      }}
      style={{ position: "fixed", inset: 0 }}
    >
      {ficha.atmosfera.fondo && <color attach="background" args={[ficha.atmosfera.fondo]} />}
      <RuedaVirtual ficha={ficha} />
      <Rig ficha={ficha} />
      <Niebla ficha={ficha} />
      <Luces luces={ficha.luz.luces} />
      <Entorno ficha={ficha} />
      <Suspense fallback={null}>
        <Escena ficha={ficha} />
      </Suspense>
      {ficha.post.length > 0 && r.motor !== "clasico" && <Post pases={ficha.post} />}
    </Canvas>
  );
}
