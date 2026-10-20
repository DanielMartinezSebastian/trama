"use client";

import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
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
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  RepeatWrapping,
  SRGBColorSpace,
  Vector3,
  type BufferGeometry,
  type Material,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/**
 * Maqueta 3D para `ExplorableCanvas depth="3d"`: el mundo del lienzo (en px) pasa a ser un tablero de papel con volúmenes
 * (cartón, metacrilato, madera, árboles de espuma), sombras suaves y aristas a lápiz. La cámara sigue el arrastre del
 * componente (`pan`), se inclina con `tilt` y, con `intro`, empieza cenital (el plano) y se levanta mientras los volúmenes crecen
 * (la maqueta). Los puntos siguen siendo botones del DOM: la escena solo les escribe su posición en pantalla (`--sx`, `--sy`).
 *
 * Con `path` y `progress` la cámara no sigue el arrastre sino una ruta de paradas (un recorrido por scroll, como Oryzo o
 * Primland): la primera parada suele ser cenital y los volúmenes crecen durante el primer tramo. `dims` dibuja cotas sobre el
 * tablero (líneas de medida con su texto), como las anotaciones de CAD.
 *
 * Cada parada puede además separar la maqueta por capas (`explode`, el despiece de Atlas), dejar sólida una sola capa y el
 * resto en alambre (`focusLayer`), barrer la maqueta con un plano de luz que descubre los puntos (`scan`), encuadrar un punto
 * y atenuar los demás (`focus`, las salas de Cartier) y cambiar el color del fondo (`bg`).
 *
 * Con `model` la maqueta sale de un modelo real (GLB, p. ej. convertido de un IFC o de OpenStreetMap con
 * `scripts/maqueta/`): cada nodo lleva en `extras` su capa y su material, y se pinta con los mismos materiales, aristas,
 * crecimiento y despiece que los bloques.
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
  /** altura a la que empieza (px del mundo; 0 = sobre el tablero): vigas, conductos, forjados */
  z?: number;
  /** giro en planta, en grados */
  rot?: number;
  shape?: "box" | "cylinder" | "tree";
  /** paper = cartón pluma · accent = el acento del tema · acrylic = metacrilato · wood = madera de balsa · wire = solo aristas */
  mat?: "paper" | "accent" | "acrylic" | "wood" | "wire";
  /** capa del despiece (0 = la base): las paradas con `explode` separan las capas en vertical */
  layer?: number;
};

/** Modelo real para la maqueta: un GLB cuyos nodos llevan `extras: { layer?: number, mat?: MapBlock["mat"] }` */
export type MapModel = {
  /** URL del GLB (mismo origen o con CORS) */
  src: string;
  /** px del mundo por unidad del modelo (con un modelo en metros: px por metro) */
  scale: number;
  /** dónde cae el origen del modelo, en % del mundo (por defecto, el centro) */
  x?: number;
  y?: number;
  /** giro en planta, en grados */
  rot?: number;
  /** capas del modelo que no se pintan (p. ej. la cubierta, para ver dentro) */
  hide?: number[];
  /** planta del modelo (imagen centrada en su origen; `w` × `h` en unidades del modelo): el tablero la dibuja debajo y
   * es la vista 2D mientras carga o sin WebGL */
  plan?: { src: string; w: number; h: number };
};

export type Map3DColors = { paper: string; bg: string; line: string; accent: string; wood?: string };

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
  /** separación vertical entre capas (`MapBlock.layer`), en px del mundo */
  explode?: number;
  /** capa que se queda sólida; las demás pasan a alambre */
  focusLayer?: number;
  /** al llegar a esta parada, un plano de luz barre la maqueta y los puntos aparecen cuando los alcanza */
  scan?: boolean;
  /** id del punto que se resalta (los demás se atenúan) */
  focus?: string;
  /** color de fondo (y de la niebla) en esta parada */
  bg?: string;
  /** texto de la parada (lo pinta el componente) */
  title?: string;
  text?: string;
};

/** Cota dibujada en el tablero: de (x1, y1) a (x2, y2) en % del mundo */
export type MapDim = { x1: number; y1: number; x2: number; y2: number; label: string };

export type Map3DSceneProps = {
  world: { w: number; h: number };
  blocks: MapBlock[];
  /** modelo real (GLB) que se suma a los bloques */
  model?: MapModel;
  /** puntos; `z` = altura sobre el tablero en px del mundo (una incidencia en planta 1) */
  markers: { id: string; x: number; y: number; z?: number }[];
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
  /** sin recorrido: separación fija entre capas (px del mundo) */
  explode?: number;
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

/** Lo que el `Rig` toca en cada fotograma sin pasar por React */
type Fx = {
  /** la mesa (su color sigue al fondo de la parada) */
  table: MeshStandardMaterial | null;
  /** el plano de luz del barrido */
  scan: Group | null;
  /** materiales por capa: para pasar de sólido a alambre */
  layers: Map<number, { mats: Material[]; edge: LineBasicMaterial; meshes: Mesh[] }>;
  /** aristas de los bloques en alambre */
  wire: LineBasicMaterial | null;
  /** la lámina del barrido (se estira hasta lo más alto de la maqueta) */
  blade: Mesh | null;
  /** altura de la maqueta, en unidades de three */
  top: number;
};

/** El tablero: papel con cuadrícula fina, la huella de cada volumen dibujada a lápiz y, si hay, una imagen encima. */
function Ground({ world, blocks, model, colors, groundImage, dims = [], tex, fx }: Pick<Map3DSceneProps, "world" | "blocks" | "model" | "colors" | "groundImage" | "dims"> & { tex: CanvasTexture; fx: MutableRefObject<Fx> }) {
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
      if (b.z) continue; // lo que no apoya en el tablero no deja huella
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
    // la planta del modelo, a lápiz bajo la maqueta
    const plan = model?.plan;
    if (plan) {
      const img = new Image();
      img.onload = () => {
        ctx.save();
        ctx.globalAlpha = 0.8;
        ctx.translate((((model.x ?? 50) / 100) * world.w) * k, (((model.y ?? 50) / 100) * world.h) * k);
        ctx.rotate(((model.rot ?? 0) * Math.PI) / 180);
        const w = plan.w * model.scale * k, h = plan.h * model.scale * k;
        ctx.drawImage(img, -w / 2, -h / 2, w, h);
        ctx.restore();
        t.needsUpdate = true;
      };
      img.src = plan.src;
    }
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
  }, [world.w, world.h, blocks, model, colors.paper, colors.line, colors.accent, groundImage, dims, tex]);
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
        <meshStandardMaterial
          ref={(m) => {
            fx.current.table = m;
          }}
          color={colors.bg}
          roughness={1}
        />
      </mesh>
    </>
  );
}

type Piece = { group: Group; delay: number; layer: number };

type BlocksProps = Pick<Map3DSceneProps, "world" | "blocks" | "colors" | "model"> & { tex: ReturnType<typeof useTextures>; pieces: MutableRefObject<Piece[]>; fx: MutableRefObject<Fx>; nodes?: Group };

/** Carga el GLB de `model` (la escena espera a tenerlo) y se lo pasa a `Blocks` */
function ModelBlocks(props: BlocksProps & { model: MapModel }) {
  const gltf = useLoader(GLTFLoader, props.model.src);
  return <Blocks {...props} nodes={gltf.scene} />;
}

function Blocks({ world, blocks, colors, tex, pieces, fx, model, nodes }: BlocksProps) {
  const root = useRef<Group>(null);
  const built = useMemo(() => {
    // un juego de materiales por capa, para poder dejar una capa sólida y las demás en alambre
    const set = () => ({
      paper: new MeshStandardMaterial({ color: colors.paper, map: tex.paper, roughness: 0.95 }),
      accent: new MeshStandardMaterial({ color: colors.accent, map: tex.paper, roughness: 0.85 }),
      acrylic: new MeshPhysicalMaterial({ color: "#dff1f7", roughness: 0.08, metalness: 0, transparent: true, opacity: 0.38, clearcoat: 1 }),
      wood: new MeshStandardMaterial({ color: colors.wood ?? "#d9b183", map: tex.wood, roughness: 0.8 }),
      edge: new LineBasicMaterial({ color: colors.line, transparent: true, opacity: 0.35 }),
    });
    const sets = new Map<number, ReturnType<typeof set>>();
    const of = (layer: number) => {
      if (!sets.has(layer)) sets.set(layer, set());
      return sets.get(layer)!;
    };
    const wire = new LineBasicMaterial({ color: colors.line, transparent: true, opacity: 0.85 });
    const geos: BufferGeometry[] = [];
    const cx = world.w / 2, cy = world.h / 2;
    const items = blocks.map((b) => {
      const layer = b.layer ?? 0;
      const m = of(layer);
      const w = (b.w / 100) * world.w * U, d = (b.d / 100) * world.h * U, h = Math.max(1, b.h) * U, z = (b.z ?? 0) * U;
      const x = (b.x / 100) * world.w * U - cx * U, y = (b.y / 100) * world.h * U - cy * U;
      const shape = b.shape ?? "box";
      const isWire = b.mat === "wire";
      const mat = b.mat === "wire" ? null : m[b.mat ?? "paper"];
      const parts: { geo: BufferGeometry; mat: Material | null; y: number; edges: boolean; edgeGeo?: BufferGeometry }[] = [];
      if (shape === "tree") {
        const r = Math.min(w, d) / 2;
        parts.push({ geo: new CylinderGeometry(r * 0.08, r * 0.08, h * 0.45, 6), mat: isWire ? null : m.wood, y: z + h * 0.225, edges: isWire });
        parts.push({ geo: new IcosahedronGeometry(r, 1), mat, y: z + h * 0.45 + r * 0.8, edges: isWire });
      } else if (shape === "cylinder") {
        parts.push({ geo: new CylinderGeometry(w / 2, w / 2, h, 40), mat, y: z + h / 2, edges: true });
      } else {
        parts.push({ geo: new BoxGeometry(w, h, d), mat, y: z + h / 2, edges: b.mat !== "acrylic" });
      }
      parts.forEach((p) => {
        if (p.edges) p.edgeGeo = new EdgesGeometry(p.geo, 25);
        geos.push(p.geo, ...(p.edgeGeo ? [p.edgeGeo] : []));
      });
      return { x, z: y, rot: ((b.rot ?? 0) * Math.PI) / 180, parts, dist: Math.hypot(x, y), layer, edge: isWire ? wire : m.edge, top: z + h };
    });
    // el modelo real: cada nodo, con su capa y su material, es una pieza más, con la geometría ya en su sitio del mundo
    if (model && nodes) {
      const k = model.scale * U;
      const ox = (((model.x ?? 50) / 100) * world.w - cx) * U, oz = (((model.y ?? 50) / 100) * world.h - cy) * U;
      nodes.updateMatrixWorld(true);
      nodes.traverse((o) => {
        if (!(o instanceof Mesh)) return;
        const layer = Number(o.userData.layer ?? 0);
        if (model.hide?.includes(layer)) return;
        const kind = (o.userData.mat ?? "paper") as NonNullable<MapBlock["mat"]>;
        const m = of(layer);
        const geo = (o.geometry as BufferGeometry).clone().applyMatrix4(o.matrixWorld);
        geo.scale(k, k, k);
        geo.rotateY((-(model.rot ?? 0) * Math.PI) / 180);
        geo.translate(ox, 0, oz);
        // caras planas: aristas vivas, como cartón cortado
        const flat = geo.index ? geo.toNonIndexed() : geo;
        if (flat !== geo) geo.dispose();
        flat.computeVertexNormals();
        flat.computeBoundingBox();
        const bb = flat.boundingBox!;
        const x = (bb.min.x + bb.max.x) / 2, z = (bb.min.z + bb.max.z) / 2;
        flat.translate(-x, 0, -z);
        const isWire = kind === "wire";
        const edgeGeo = kind === "acrylic" ? undefined : new EdgesGeometry(flat, 25);
        geos.push(flat, ...(edgeGeo ? [edgeGeo] : []));
        items.push({ x, z, rot: 0, parts: [{ geo: flat, mat: isWire ? null : m[kind], y: 0, edges: !!edgeGeo, edgeGeo }], dist: Math.hypot(x, z), layer, edge: isWire ? wire : m.edge, top: bb.max.y });
      });
    }
    const far = Math.max(0.001, ...items.map((i) => i.dist));
    const top = Math.max(1.2, ...items.map((i) => i.top));
    return { sets, wire, geos, items, far, top };
  }, [world.w, world.h, blocks, model, nodes, colors.paper, colors.accent, colors.line, colors.wood, tex]);

  useEffect(
    () => () => {
      built.sets.forEach((s) => Object.values(s).forEach((m) => m.dispose()));
      built.wire.dispose();
      built.geos.forEach((g) => g.dispose());
    },
    [built],
  );

  // grupos para la intro (crecen desde el centro hacia fuera) y materiales por capa para el despiece
  useEffect(() => {
    const g = root.current;
    if (!g) return;
    pieces.current = g.children.map((c, i) => ({ group: c as Group, delay: (built.items[i].dist / built.far) * 0.55, layer: built.items[i].layer }));
    const layers: Fx["layers"] = new Map();
    built.sets.forEach((s, l) => {
      const mats = [s.paper, s.accent, s.acrylic, s.wood];
      mats.forEach((m) => (m.userData.base = m.opacity));
      layers.set(l, { mats, edge: s.edge, meshes: [] });
    });
    g.children.forEach((c, i) => c.traverse((o) => o instanceof Mesh && layers.get(built.items[i].layer)?.meshes.push(o)));
    fx.current.layers = layers;
    fx.current.wire = built.wire;
    fx.current.top = built.top;
  }, [built, pieces, fx]);

  return (
    <group ref={root}>
      {built.items.map((it, i) => (
        <group key={i} position={[it.x, 0, it.z]} rotation-y={-it.rot}>
          {it.parts.map((p, j) => (
            <group key={j} position-y={p.y}>
              {p.mat && <mesh geometry={p.geo} material={p.mat} castShadow receiveShadow />}
              {p.edgeGeo && <lineSegments geometry={p.edgeGeo} material={it.edge} />}
            </group>
          ))}
        </group>
      ))}
    </group>
  );
}

/** El plano de luz del barrido: una lámina del acento que recorre la maqueta de oeste a este, con su línea en el tablero */
function Scan({ world, colors, fx }: Pick<Map3DSceneProps, "world" | "colors"> & { fx: MutableRefObject<Fx> }) {
  return (
    <group
      ref={(g) => {
        fx.current.scan = g;
      }}
      visible={false}
    >
      {/* alto 1: el Rig la estira hasta lo más alto de la maqueta */}
      <mesh
        ref={(m) => {
          fx.current.blade = m;
        }}
      >
        <boxGeometry args={[0.012, 1, world.h * U]} />
        <meshBasicMaterial color={colors.accent} transparent opacity={0.22} depthWrite={false} />
      </mesh>
      <mesh position-y={0.006} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[0.05, world.h * U]} />
        <meshBasicMaterial color={colors.accent} transparent opacity={0.9} depthWrite={false} />
      </mesh>
    </group>
  );
}

const ease = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
const easeIO = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
/** 1 = la capa está sólida en esta parada, 0 = en alambre */
const solidIn = (s: CameraStop, layer: number) => (s.focusLayer === undefined || s.focusLayer === layer ? 1 : 0);
/** peso de un punto en esta parada: resaltado, atenuado o normal */
const weightIn = (s: CameraStop, id: string) => (s.focus === undefined ? 1 : s.focus === id ? 1 : 0.18);

function Rig({ world, markers, pan, markerEls, pointer, tilt, intro, colors, path, progress, explode = 0, pieces, fx, onReady }: Map3DSceneProps & { pieces: MutableRefObject<Piece[]>; fx: MutableRefObject<Fx> }) {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const size = useThree((s) => s.size);
  const scene = useThree((s) => s.scene);
  const t0 = useRef<number | null>(null);
  const yaw = useRef(0);
  const sp = useRef(progress?.current ?? 0);
  const ready = useRef(false);
  const v = useMemo(() => new Vector3(), []);
  const target = useMemo(() => new Vector3(), []);
  // colores por parada (fondo) y los dos tonos de las aristas: tinta sobre claro, papel sobre oscuro
  const tones = useMemo(() => {
    const bg = new Color(colors.bg);
    return {
      stops: (path ?? []).map((s) => (s.bg ? new Color(s.bg) : bg)),
      bg,
      line: new Color(colors.line),
      paper: new Color(colors.paper),
      now: new Color(),
      ink: new Color(),
    };
  }, [path, colors.bg, colors.line, colors.paper]);
  const scanAt = useMemo(() => (path ?? []).findIndex((s) => s.scan), [path]);

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
    let k: number, dist: number, pitch: number, turn = 0, gap = explode, f = 0, u = 0;
    let a: CameraStop | null = null, b: CameraStop | null = null;
    if (path && path.length > 1 && progress) {
      // recorrido: la cámara va de parada en parada según el progreso (suavizado); los volúmenes crecen en el primer tramo
      sp.current += (progress.current - sp.current) * Math.min(1, dt * 5);
      f = Math.min(0.9999, Math.max(0, sp.current)) * (path.length - 1);
      const i = Math.floor(f);
      u = easeIO(f - i);
      a = path[i];
      b = path[i + 1];
      k = ease(f);
      // en vertical (móvil) la vista se aleja para que la maqueta quepa a lo ancho
      const fit = Math.min(2.6, Math.max(1, (size.height / size.width) * 1.1));
      dist = (base * fit) / lerp(a.zoom ?? 1, b.zoom ?? 1, u);
      pitch = (lerp(a.tilt, b.tilt, u) * Math.PI) / 180;
      turn = (lerp(a.yaw ?? 0, b.yaw ?? 0, u) * Math.PI) / 180;
      gap = lerp(a.explode ?? 0, b.explode ?? 0, u);
      target.set(((lerp(a.x, b.x, u) / 100) * world.w - world.w / 2) * U, 0, ((lerp(a.y, b.y, u) / 100) * world.h - world.h / 2) * U);
      // fondo de la parada
      tones.now.lerpColors(tones.stops[i], tones.stops[i + 1], u);
    } else {
      k = intro ? ease((state.clock.elapsedTime - t0.current) / 2.6) : 1;
      dist = base * (1.35 - 0.35 * k);
      pitch = ((tilt * Math.PI) / 180) * k;
      const cx = size.width / 2 - pan.current.x, cy = size.height / 2 - pan.current.y;
      target.set((cx - world.w / 2) * U, 0, (cy - world.h / 2) * U);
      tones.now.copy(tones.bg);
    }
    // con el despiece, la cámara mira a media altura de la torre de capas
    const top = Math.max(0, ...pieces.current.map((p) => p.layer)) * gap * U;
    target.y = top / 2;
    const ry = yaw.current + turn;
    camera.position.set(target.x + Math.sin(ry) * Math.sin(pitch) * dist, target.y + Math.cos(pitch) * dist, target.z + Math.cos(ry) * Math.sin(pitch) * dist + 0.0001);
    camera.lookAt(target);
    if (state.scene.fog instanceof Fog) {
      state.scene.fog.near = dist * 1.1 + top;
      state.scene.fog.far = dist * 3.2 + top;
      state.scene.fog.color.copy(tones.now);
    }
    fx.current.table?.color.copy(tones.now);
    // aristas: tinta sobre fondo claro, color papel sobre fondo oscuro
    const lum = 0.2126 * tones.now.r + 0.7152 * tones.now.g + 0.0722 * tones.now.b;
    tones.ink.lerpColors(tones.line, tones.paper, clamp01((0.42 - lum) / 0.22));

    // la maqueta crece desde el plano y, con el despiece, cada capa sube a su altura
    for (const p of pieces.current) {
      p.group.scale.y = Math.max(0.001, ease((k - p.delay) / 0.45));
      // aplastada no se pinta: en la planta cenital del principio manda el dibujo del tablero
      p.group.visible = p.group.scale.y > 0.004;
      p.group.position.y = p.layer * gap * U;
    }

    // sólido o alambre por capa
    fx.current.layers.forEach((L, layer) => {
      const s = a && b ? lerp(solidIn(a, layer), solidIn(b, layer), u) : 1;
      for (const m of L.mats) {
        const t = s < 0.995;
        if (m.transparent !== (t || m.userData.base < 1)) {
          m.transparent = t || m.userData.base < 1;
          m.needsUpdate = true;
        }
        m.opacity = m.userData.base * (0.04 + 0.96 * s);
        m.depthWrite = s > 0.5;
      }
      for (const mesh of L.meshes) mesh.castShadow = s > 0.5;
      L.edge.opacity = 0.35 + 0.55 * (1 - s);
      L.edge.color.copy(tones.ink);
    });
    fx.current.wire?.color.copy(tones.ink);

    // barrido: en el tramo que llega a la parada con `scan`, la lámina cruza la maqueta
    const sweeping = scanAt > 0 && f > scanAt - 1 && f < scanAt;
    const sweep = sweeping ? u : f >= scanAt ? 1 : 0;
    if (fx.current.scan) {
      fx.current.scan.visible = sweeping && u > 0.01 && u < 0.99;
      fx.current.scan.position.x = ((-0.04 + sweep * 1.08) * world.w - world.w / 2) * U;
    }
    if (fx.current.blade) {
      fx.current.blade.scale.y = fx.current.top * 1.25;
      fx.current.blade.position.y = (fx.current.top * 1.25) / 2;
    }

    // los botones del DOM se colocan sobre su punto del tablero
    const W = size.width, H = size.height;
    const exploded = clamp01(1 - gap / 40);
    for (const m of markers) {
      const el = markerEls.current.get(m.id);
      if (!el) continue;
      v.set(((m.x / 100) * world.w - world.w / 2) * U, 0.04 + (m.z ?? 0) * U * k, ((m.y / 100) * world.h - world.h / 2) * U).project(camera);
      const hidden = v.z > 1 || Math.abs(v.x) > 1.2 || Math.abs(v.y) > 1.2;
      // con barrido, cada punto aparece cuando la lámina lo pasa
      const found = scanAt < 0 ? 1 : (m.x / 100 + 0.04) / 1.08 <= sweep ? 1 : 0;
      const w = a && b ? lerp(weightIn(a, m.id), weightIn(b, m.id), u) : 1;
      const on = a && b ? lerp(a.focus === m.id ? 1 : 0, b.focus === m.id ? 1 : 0, u) : 0;
      el.style.setProperty("--sx", `${((v.x + 1) / 2) * W}px`);
      el.style.setProperty("--sy", `${((1 - v.y) / 2) * H}px`);
      el.style.setProperty("--so", hidden ? "0" : (Math.min(1, k * 1.4) * found * w * exploded).toFixed(3));
      el.style.setProperty("--sf", on.toFixed(3));
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
  const fx = useRef<Fx>({ table: null, scan: null, layers: new Map(), wire: null, blade: null, top: 1.2 });
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
        shadow-mapSize={[coarse ? 1024 : 2048, coarse ? 1024 : 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-camera-left={-span * 0.6}
        shadow-camera-right={span * 0.6}
        shadow-camera-top={span * 0.6}
        shadow-camera-bottom={-span * 0.6}
        shadow-camera-far={span * 3}
      />
      <Ground world={props.world} blocks={props.blocks} model={props.model} colors={props.colors} groundImage={props.groundImage} dims={props.dims} tex={tex.paper} fx={fx} />
      {props.model ? (
        <ModelBlocks world={props.world} blocks={props.blocks} model={props.model} colors={props.colors} tex={tex} pieces={pieces} fx={fx} />
      ) : (
        <Blocks world={props.world} blocks={props.blocks} colors={props.colors} tex={tex} pieces={pieces} fx={fx} />
      )}
      {props.path?.some((s) => s.scan) && <Scan world={props.world} colors={props.colors} fx={fx} />}
      <Rig {...props} pieces={pieces} fx={fx} />
    </Canvas>
  );
}
