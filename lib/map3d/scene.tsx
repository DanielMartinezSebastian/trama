"use client";

import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  BoxGeometry,
  CanvasTexture,
  Color,
  CylinderGeometry,
  EdgesGeometry,
  Fog,
  Group,
  IcosahedronGeometry,
  LineBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  RepeatWrapping,
  SRGBColorSpace,
  Vector3,
  type BufferGeometry,
  type Material,
} from "three";

/**
 * Maqueta 3D para `ExplorableCanvas depth="3d"`: el mundo del lienzo (en px) pasa a ser un tablero de papel con volúmenes
 * (cartón, metacrilato, madera, árboles de espuma), sombras suaves y aristas a lápiz. La cámara sigue el arrastre del
 * componente (`pan`), se inclina con `tilt` y, con `intro`, empieza cenital (el plano) y se levanta mientras los volúmenes crecen
 * (la maqueta). Los puntos siguen siendo botones del DOM: la escena solo les escribe su posición en pantalla (`--sx`, `--sy`).
 *
 * Con `path` y `progress` la cámara no sigue el arrastre sino una ruta de paradas (un recorrido por scroll, como Oryzo o
 * Primland): la primera parada suele ser cenital y los volúmenes crecen durante el primer tramo. `dims` dibuja cotas sobre el
 * tablero (líneas de medida con su texto), como las anotaciones de CAD.
 */

export type MapBlock = {
  /** centro, en % del mundo */
  x: number;
  y: number;
  /** ancho y fondo, en % del ancho y del alto del mundo */
  w: number;
  d: number;
  /** alto en px del mundo (100 px ≈ el lado de una celda de la cuadrícula) */
  h: number;
  /** giro en planta, en grados */
  rot?: number;
  shape?: "box" | "cylinder" | "tree";
  /** paper = cartón pluma · accent = el acento del tema · acrylic = metacrilato · wood = madera de balsa */
  mat?: "paper" | "accent" | "acrylic" | "wood";
};

export type Map3DColors = { paper: string; bg: string; line: string; accent: string };

/** Parada de la cámara en un recorrido: mira a (x, y) en % del mundo */
export type CameraStop = {
  x: number;
  y: number;
  /** inclinación respecto a la vertical, en grados (0 = cenital) */
  tilt: number;
  /** 1 = la vista abarca el alto de la ventana · 2 = el doble de cerca */
  zoom?: number;
  /** giro alrededor del punto, en grados */
  yaw?: number;
  /** texto de la parada (lo pinta el componente) */
  title?: string;
  text?: string;
};

/** Cota dibujada en el tablero: de (x1, y1) a (x2, y2) en % del mundo */
export type MapDim = { x1: number; y1: number; x2: number; y2: number; label: string };

export type Map3DSceneProps = {
  world: { w: number; h: number };
  blocks: MapBlock[];
  markers: { id: string; x: number; y: number }[];
  /** traslación del mundo que calcula el arrastre (px, como en la vista plana) */
  pan: MutableRefObject<{ x: number; y: number }>;
  /** botones de los puntos, por id */
  markerEls: MutableRefObject<Map<string, HTMLElement>>;
  /** puntero normalizado −1…1 sobre el lienzo (para un leve giro de cámara) */
  pointer: MutableRefObject<{ x: number; y: number }>;
  colors: Map3DColors;
  /** imagen opcional que se dibuja sobre el tablero (URL o data URI) */
  groundImage?: string;
  /** cotas sobre el tablero */
  dims?: MapDim[];
  /** recorrido de cámara; con él la cámara ignora `pan` y sigue `progress` (0–1) */
  path?: CameraStop[];
  progress?: MutableRefObject<number>;
  /** inclinación de la cámara respecto a la vertical, en grados */
  tilt: number;
  intro: boolean;
  active: boolean;
  onReady: () => void;
};

const U = 0.01; // 1 px del mundo = 0,01 unidades de three
const FOV = 35;

const grain = (size: number, base: number, amp: number, fibres: number) => {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  const img = ctx.createImageData(size, size);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = base + (Math.random() - 0.5) * amp;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  ctx.globalAlpha = 0.07;
  ctx.strokeStyle = "#000";
  for (let i = 0; i < fibres; i++) {
    ctx.beginPath();
    const x = Math.random() * size, y = Math.random() * size, a = Math.random() * Math.PI;
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + Math.cos(a) * 8, y + Math.sin(a) * 8, x + Math.cos(a + 0.4) * 16, y + Math.sin(a + 0.4) * 16);
    ctx.stroke();
  }
  return c;
};

/** Grano de papel (relleno) y vetas de madera, generados: no se descarga ninguna textura. */
function useTextures() {
  return useMemo(() => {
    const paper = new CanvasTexture(grain(256, 238, 22, 140));
    paper.wrapS = paper.wrapT = RepeatWrapping;
    paper.colorSpace = SRGBColorSpace;
    const w = document.createElement("canvas");
    w.width = w.height = 256;
    const ctx = w.getContext("2d")!;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, 256, 256);
    for (let y = 0; y < 256; y += 3) {
      ctx.fillStyle = `rgba(90,55,20,${0.05 + Math.random() * 0.12})`;
      ctx.fillRect(0, y + Math.sin(y * 0.3) * 1.5, 256, 1 + Math.random() * 1.5);
    }
    const wood = new CanvasTexture(w);
    wood.wrapS = wood.wrapT = RepeatWrapping;
    wood.colorSpace = SRGBColorSpace;
    return { paper, wood };
  }, []);
}

/** El tablero: papel con cuadrícula fina, la huella de cada volumen dibujada a lápiz y, si hay, una imagen encima. */
function Ground({ world, blocks, colors, groundImage, dims = [], tex }: Pick<Map3DSceneProps, "world" | "blocks" | "colors" | "groundImage" | "dims"> & { tex: CanvasTexture }) {
  const map = useMemo(() => {
    const k = 2048 / Math.max(world.w, world.h);
    const c = document.createElement("canvas");
    c.width = Math.round(world.w * k);
    c.height = Math.round(world.h * k);
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = colors.paper;
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.globalCompositeOperation = "multiply";
    const pat = ctx.createPattern(tex.image as HTMLCanvasElement, "repeat");
    if (pat) {
      ctx.fillStyle = pat;
      ctx.fillRect(0, 0, c.width, c.height);
    }
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = colors.line;
    ctx.globalAlpha = 0.12;
    ctx.lineWidth = 1;
    for (let x = 0; x <= world.w; x += 100) {
      ctx.beginPath();
      ctx.moveTo(x * k, 0);
      ctx.lineTo(x * k, c.height);
      ctx.stroke();
    }
    for (let y = 0; y <= world.h; y += 100) {
      ctx.beginPath();
      ctx.moveTo(0, y * k);
      ctx.lineTo(c.width, y * k);
      ctx.stroke();
    }
    ctx.globalAlpha = 0.55;
    ctx.lineWidth = 1.4;
    for (const b of blocks) {
      ctx.save();
      ctx.translate((b.x / 100) * world.w * k, (b.y / 100) * world.h * k);
      ctx.rotate(((b.rot ?? 0) * Math.PI) / 180);
      const w = (b.w / 100) * world.w * k, d = (b.d / 100) * world.h * k;
      if (b.shape === "box" || !b.shape) ctx.strokeRect(-w / 2, -d / 2, w, d);
      else {
        ctx.beginPath();
        ctx.ellipse(0, 0, w / 2, d / 2, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }
    // cotas: línea discontinua, marcas oblicuas en los extremos y la medida en el centro
    ctx.globalAlpha = 1;
    ctx.strokeStyle = colors.accent;
    ctx.fillStyle = colors.accent;
    ctx.lineWidth = 2;
    ctx.font = `600 ${Math.round(40 * k)}px ui-monospace, monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    for (const d of dims) {
      const ax = (d.x1 / 100) * world.w * k, ay = (d.y1 / 100) * world.h * k, bx = (d.x2 / 100) * world.w * k, by = (d.y2 / 100) * world.h * k;
      const ang = Math.atan2(by - ay, bx - ax);
      ctx.setLineDash([10, 7]);
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      ctx.stroke();
      ctx.setLineDash([]);
      for (const [x, y] of [[ax, ay], [bx, by]]) {
        ctx.beginPath();
        ctx.moveTo(x - Math.cos(ang + 0.8) * 12, y - Math.sin(ang + 0.8) * 12);
        ctx.lineTo(x + Math.cos(ang + 0.8) * 12, y + Math.sin(ang + 0.8) * 12);
        ctx.stroke();
      }
      ctx.save();
      ctx.translate((ax + bx) / 2, (ay + by) / 2);
      ctx.rotate(Math.abs(ang) > Math.PI / 2 ? ang + Math.PI : ang);
      ctx.fillText(d.label, 0, -8);
      ctx.restore();
    }
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    t.anisotropy = 8;
    if (groundImage) {
      const img = new Image();
      img.onload = () => {
        ctx.globalAlpha = 1;
        ctx.drawImage(img, 0, 0, c.width, c.height);
        t.needsUpdate = true;
      };
      img.src = groundImage;
    }
    return t;
  }, [world.w, world.h, blocks, colors.paper, colors.line, colors.accent, groundImage, dims, tex]);
  useEffect(() => () => map.dispose(), [map]);

  return (
    <>
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[world.w * U, world.h * U]} />
        <meshStandardMaterial map={map} roughness={1} />
      </mesh>
      {/* la mesa: se extiende más allá del tablero y se funde con el fondo por la niebla */}
      <mesh rotation-x={-Math.PI / 2} position-y={-0.02} receiveShadow>
        <planeGeometry args={[world.w * U * 6, world.h * U * 6]} />
        <meshStandardMaterial color={colors.bg} roughness={1} />
      </mesh>
    </>
  );
}

type Piece = { group: Group; delay: number };

function Blocks({ world, blocks, colors, tex, pieces }: Pick<Map3DSceneProps, "world" | "blocks" | "colors"> & { tex: ReturnType<typeof useTextures>; pieces: MutableRefObject<Piece[]> }) {
  const root = useRef<Group>(null);
  const built = useMemo(() => {
    const mats: Record<NonNullable<MapBlock["mat"]>, Material> = {
      paper: new MeshStandardMaterial({ color: colors.paper, map: tex.paper, roughness: 0.95 }),
      accent: new MeshStandardMaterial({ color: colors.accent, map: tex.paper, roughness: 0.85 }),
      acrylic: new MeshPhysicalMaterial({ color: "#dff1f7", roughness: 0.08, metalness: 0, transparent: true, opacity: 0.38, clearcoat: 1 }),
      wood: new MeshStandardMaterial({ color: "#d9b183", map: tex.wood, roughness: 0.8 }),
    };
    const edge = new LineBasicMaterial({ color: colors.line, transparent: true, opacity: 0.35 });
    const geos: BufferGeometry[] = [];
    const cx = world.w / 2, cy = world.h / 2;
    const items = blocks.map((b) => {
      const w = (b.w / 100) * world.w * U, d = (b.d / 100) * world.h * U, h = Math.max(1, b.h) * U;
      const x = (b.x / 100) * world.w * U - cx * U, z = (b.y / 100) * world.h * U - cy * U;
      const shape = b.shape ?? "box";
      const parts: { geo: BufferGeometry; mat: Material; y: number; edges: boolean; edgeGeo?: BufferGeometry }[] = [];
      if (shape === "tree") {
        const r = Math.min(w, d) / 2;
        parts.push({ geo: new CylinderGeometry(r * 0.08, r * 0.08, h * 0.45, 6), mat: mats.wood, y: h * 0.225, edges: false });
        parts.push({ geo: new IcosahedronGeometry(r, 1), mat: mats[b.mat ?? "paper"], y: h * 0.45 + r * 0.8, edges: false });
      } else if (shape === "cylinder") {
        parts.push({ geo: new CylinderGeometry(w / 2, w / 2, h, 40), mat: mats[b.mat ?? "paper"], y: h / 2, edges: true });
      } else {
        parts.push({ geo: new BoxGeometry(w, h, d), mat: mats[b.mat ?? "paper"], y: h / 2, edges: b.mat !== "acrylic" });
      }
      parts.forEach((p) => {
        if (p.edges) p.edgeGeo = new EdgesGeometry(p.geo, 25);
        geos.push(p.geo, ...(p.edgeGeo ? [p.edgeGeo] : []));
      });
      return { x, z, rot: ((b.rot ?? 0) * Math.PI) / 180, parts, dist: Math.hypot(x, z) };
    });
    const far = Math.max(0.001, ...items.map((i) => i.dist));
    return { mats, edge, geos, items, far };
  }, [world.w, world.h, blocks, colors.paper, colors.accent, colors.line, tex]);

  useEffect(
    () => () => {
      Object.values(built.mats).forEach((m) => m.dispose());
      built.edge.dispose();
      built.geos.forEach((g) => g.dispose());
    },
    [built],
  );

  // grupos para la intro: crecen desde el centro hacia fuera
  useEffect(() => {
    const g = root.current;
    if (!g) return;
    pieces.current = g.children.map((c, i) => ({ group: c as Group, delay: (built.items[i].dist / built.far) * 0.55 }));
  }, [built, pieces]);

  return (
    <group ref={root}>
      {built.items.map((it, i) => (
        <group key={i} position={[it.x, 0, it.z]} rotation-y={-it.rot}>
          {it.parts.map((p, j) => (
            <group key={j} position-y={p.y}>
              <mesh geometry={p.geo} material={p.mat} castShadow receiveShadow />
              {p.edgeGeo && <lineSegments geometry={p.edgeGeo} material={built.edge} />}
            </group>
          ))}
        </group>
      ))}
    </group>
  );
}

const ease = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
const easeIO = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function Rig({ world, markers, pan, markerEls, pointer, tilt, intro, colors, path, progress, pieces, onReady }: Map3DSceneProps & { pieces: MutableRefObject<Piece[]> }) {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const size = useThree((s) => s.size);
  const scene = useThree((s) => s.scene);
  const t0 = useRef<number | null>(null);
  const yaw = useRef(0);
  const sp = useRef(progress?.current ?? 0);
  const ready = useRef(false);
  const v = useMemo(() => new Vector3(), []);
  const target = useMemo(() => new Vector3(), []);

  useEffect(() => {
    scene.fog = new Fog(new Color(colors.bg), 1, 60);
    return () => {
      scene.fog = null;
    };
  }, [scene, colors.bg]);

  useFrame((state, dt) => {
    if (t0.current === null) t0.current = state.clock.elapsedTime;
    // altura a la que la vista cenital enseña tanto como la ventana: así 1 px arrastrado ≈ 1 px del tablero
    const base = (size.height * U) / 2 / Math.tan((FOV * Math.PI) / 360);
    yaw.current += (pointer.current.x * 0.14 - yaw.current) * Math.min(1, dt * 3);
    let k: number, dist: number, pitch: number, turn = 0;
    if (path && path.length > 1 && progress) {
      // recorrido: la cámara va de parada en parada según el progreso (suavizado); los volúmenes crecen en el primer tramo
      sp.current += (progress.current - sp.current) * Math.min(1, dt * 5);
      const f = Math.min(0.9999, Math.max(0, sp.current)) * (path.length - 1);
      const i = Math.floor(f);
      const u = easeIO(f - i);
      const a = path[i], b = path[i + 1];
      k = ease(f);
      dist = base / lerp(a.zoom ?? 1, b.zoom ?? 1, u);
      pitch = (lerp(a.tilt, b.tilt, u) * Math.PI) / 180;
      turn = (lerp(a.yaw ?? 0, b.yaw ?? 0, u) * Math.PI) / 180;
      target.set(((lerp(a.x, b.x, u) / 100) * world.w - world.w / 2) * U, 0, ((lerp(a.y, b.y, u) / 100) * world.h - world.h / 2) * U);
    } else {
      k = intro ? ease((state.clock.elapsedTime - t0.current) / 2.6) : 1;
      dist = base * (1.35 - 0.35 * k);
      pitch = ((tilt * Math.PI) / 180) * k;
      const cx = size.width / 2 - pan.current.x, cy = size.height / 2 - pan.current.y;
      target.set((cx - world.w / 2) * U, 0, (cy - world.h / 2) * U);
    }
    const ry = yaw.current + turn;
    camera.position.set(target.x + Math.sin(ry) * Math.sin(pitch) * dist, target.y + Math.cos(pitch) * dist, target.z + Math.cos(ry) * Math.sin(pitch) * dist + 0.0001);
    camera.lookAt(target);
    if (state.scene.fog instanceof Fog) {
      state.scene.fog.near = dist * 1.1;
      state.scene.fog.far = dist * 3.2;
    }

    // la maqueta crece desde el plano
    for (const p of pieces.current) p.group.scale.y = Math.max(0.001, ease((k - p.delay) / 0.45));

    // los botones del DOM se colocan sobre su punto del tablero
    const W = size.width, H = size.height;
    for (const m of markers) {
      const el = markerEls.current.get(m.id);
      if (!el) continue;
      v.set(((m.x / 100) * world.w - world.w / 2) * U, 0.04, ((m.y / 100) * world.h - world.h / 2) * U).project(camera);
      const hidden = v.z > 1 || Math.abs(v.x) > 1.2 || Math.abs(v.y) > 1.2;
      el.style.setProperty("--sx", `${((v.x + 1) / 2) * W}px`);
      el.style.setProperty("--sy", `${((1 - v.y) / 2) * H}px`);
      el.style.setProperty("--so", hidden ? "0" : String(Math.min(1, k * 1.4)));
    }
    if (!ready.current) {
      ready.current = true;
      onReady();
    }
  });
  return null;
}

export default function Map3DScene(props: Map3DSceneProps) {
  const tex = useTextures();
  const pieces = useRef<Piece[]>([]);
  useEffect(() => () => Object.values(tex).forEach((t) => t.dispose()), [tex]);
  const coarse = typeof matchMedia !== "undefined" && matchMedia("(pointer: coarse)").matches;
  const span = Math.max(props.world.w, props.world.h) * U;
  return (
    <Canvas
      shadows="soft"
      flat
      frameloop={props.active ? "always" : "never"}
      dpr={[1, coarse ? 1.5 : 2]}
      gl={{ alpha: true, antialias: true }}
      camera={{ fov: FOV, near: 0.1, far: 200, position: [0, 20, 0.01] }}
      style={{ pointerEvents: "none" }}
    >
      <hemisphereLight args={["#ffffff", props.colors.paper, 1.45]} />
      <directionalLight
        position={[span * 0.35, span * 0.6, span * 0.25]}
        intensity={1.9}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-camera-left={-span * 0.6}
        shadow-camera-right={span * 0.6}
        shadow-camera-top={span * 0.6}
        shadow-camera-bottom={-span * 0.6}
        shadow-camera-far={span * 3}
      />
      <Ground world={props.world} blocks={props.blocks} colors={props.colors} groundImage={props.groundImage} dims={props.dims} tex={tex.paper} />
      <Blocks world={props.world} blocks={props.blocks} colors={props.colors} tex={tex} pieces={pieces} />
      <Rig {...props} pieces={pieces} />
    </Canvas>
  );
}
