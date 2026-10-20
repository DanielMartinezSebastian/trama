/**
 * Cargador de las piezas del kit de anillos (public/models/anillos, modeladas por script en Blender, CC0). Cada .glb trae
 * mallas con material «metal» o «gem» y Empties de anclaje (attach_head, attach_shank, seat, seat_side_L/R, pave_NN,
 * halo_NN). Aquí se hornean las transformaciones, se pasan las posiciones cuantizadas (KHR_mesh_quantization) a float y de
 * milímetros a las unidades de la escena (radio interior ≈ 1), y los anclajes quedan como matrices. Una carga por archivo.
 */
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { BufferGeometry, Float32BufferAttribute, Matrix4, Mesh, type Material } from "three";

export type Piece = {
  /** todo lo metálico, ya fusionado */
  metal: BufferGeometry | null;
  /** la piedra (en las piezas «piedra») */
  gem: BufferGeometry | null;
  /** anclajes por nombre, en las unidades de la escena */
  anchors: Record<string, Matrix4>;
};

const cache = new Map<string, Promise<Piece>>();
let loader: GLTFLoader | null = null;

/** Copia en float32 de posiciones y normales (desnormaliza las cuantizadas) y sin índice, para poder fusionar. */
function toFloat(src: BufferGeometry, m: Matrix4): BufferGeometry {
  const g = src.index ? src.toNonIndexed() : src.clone();
  const out = new BufferGeometry();
  for (const name of ["position", "normal"] as const) {
    const a = g.getAttribute(name);
    if (!a) continue;
    const arr = new Float32Array(a.count * 3);
    for (let i = 0; i < a.count; i++) arr.set([a.getX(i), a.getY(i), a.getZ(i)], i * 3);
    out.setAttribute(name, new Float32BufferAttribute(arr, 3));
  }
  out.applyMatrix4(m);
  if (!out.getAttribute("normal")) out.computeVertexNormals();
  g.dispose();
  return out;
}

/** Carga una pieza; `scale` pasa de mm a unidades de la escena. */
export function loadPiece(url: string, scale: number): Promise<Piece> {
  const key = `${url}@${scale}`;
  const hit = cache.get(key);
  if (hit) return hit;
  loader ??= new GLTFLoader();
  const p = loader.loadAsync(url).then((gltf) => {
    const root = gltf.scene;
    root.updateMatrixWorld(true);
    const S = new Matrix4().makeScale(scale, scale, scale);
    const groups: Record<"metal" | "gem", BufferGeometry[]> = { metal: [], gem: [] };
    const anchors: Record<string, Matrix4> = {};
    root.traverse((o) => {
      if ((o as Mesh).isMesh) {
        const mesh = o as Mesh;
        const mats = (Array.isArray(mesh.material) ? mesh.material : [mesh.material]) as Material[];
        const kind = mats.some((m) => /gem/i.test(m.name)) ? "gem" : "metal";
        groups[kind].push(toFloat(mesh.geometry, new Matrix4().multiplyMatrices(S, mesh.matrixWorld)));
      } else if (/^(attach_|seat|pave_|halo_)/.test(o.name)) {
        const m = o.matrixWorld.clone();
        m.elements[12] *= scale;
        m.elements[13] *= scale;
        m.elements[14] *= scale;
        anchors[o.name] = m;
      }
    });
    const merge = (list: BufferGeometry[]) => (list.length === 0 ? null : list.length === 1 ? list[0] : mergeGeometries(list, false));
    return { metal: merge(groups.metal), gem: merge(groups.gem), anchors };
  });
  cache.set(key, p);
  // si falla (404, red), que se pueda volver a intentar
  p.catch(() => cache.delete(key));
  return p;
}

/** Los anclajes de un prefijo en orden (pave_00, pave_01…). */
export const anchorsOf = (piece: Piece | null, prefix: string) =>
  piece
    ? Object.keys(piece.anchors)
        .filter((k) => k.startsWith(prefix))
        .sort()
        .map((k) => piece.anchors[k])
    : [];
