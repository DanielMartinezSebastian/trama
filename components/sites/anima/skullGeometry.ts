/**
 * La calavera de Ánima, modelada con una función de distancia (SDF) y triangulada con MarchingCubes de three: el cráneo y la
 * mandíbula por separado (la mandíbula se abre), con uniones y restas suaves (cuencas, nariz, sienes, el hueco de la nuca).
 * Cada vértice lleva su oclusión ambiental, calculada con la misma SDF (se oscurecen cuencas, nariz y juntas), como color.
 * Sin modelos que descargar: todo sale de aquí en unos milisegundos.
 */
import { BufferAttribute, BufferGeometry, MeshBasicMaterial } from "three";
import { MarchingCubes } from "three/examples/jsm/objects/MarchingCubes.js";

type V = [number, number, number];

const len = (x: number, y: number, z: number) => Math.sqrt(x * x + y * y + z * z);
/** elipsoide (aproximada pero estable) */
function ell(p: V, c: V, r: V) {
  const x = (p[0] - c[0]) / r[0], y = (p[1] - c[1]) / r[1], z = (p[2] - c[2]) / r[2];
  return (len(x, y, z) - 1) * Math.min(r[0], r[1], r[2]);
}
/** cápsula entre a y b */
function cap(p: V, a: V, b: V, r: number) {
  const pa = [p[0] - a[0], p[1] - a[1], p[2] - a[2]], ba = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const h = Math.min(1, Math.max(0, (pa[0] * ba[0] + pa[1] * ba[1] + pa[2] * ba[2]) / (ba[0] * ba[0] + ba[1] * ba[1] + ba[2] * ba[2])));
  return len(pa[0] - ba[0] * h, pa[1] - ba[1] * h, pa[2] - ba[2] * h) - r;
}
/** unión suave */
function smin(a: number, b: number, k: number) {
  const h = Math.max(k - Math.abs(a - b), 0) / k;
  return Math.min(a, b) - h * h * k * 0.25;
}
/** resta suave (quita b de a) */
const ssub = (a: number, b: number, k: number) => -smin(-a, b, k);
/** simetría izquierda/derecha */
const mx = (p: V): V => [Math.abs(p[0]), p[1], p[2]];

/** El cráneo (sin mandíbula), con la cara hacia +z. */
export function craniumSdf(p: V) {
  const q = mx(p);
  let d = ell(p, [0, 0.24, -0.14], [0.52, 0.54, 0.64]); // bóveda
  d = smin(d, ell(p, [0, -0.12, 0.22], [0.42, 0.42, 0.42]), 0.14); // la cara
  d = smin(d, ell(q, [0.19, 0.08, 0.45], [0.16, 0.05, 0.1]), 0.05); // arco de las cejas
  d = smin(d, ell(q, [0.31, -0.15, 0.33], [0.12, 0.08, 0.17]), 0.06); // pómulos
  d = smin(d, cap(q, [0.35, -0.16, 0.28], [0.44, -0.14, -0.02], 0.045), 0.05); // arco cigomático
  d = smin(d, ell(p, [0, -0.4, 0.34], [0.24, 0.15, 0.19]), 0.07); // maxilar
  d = ssub(d, ell(p, [0, -0.76, -0.26], [0.54, 0.42, 0.56]), 0.12); // el hueco de la nuca
  d = ssub(d, ell(q, [0.58, -0.04, -0.02], [0.12, 0.2, 0.28]), 0.12); // sienes
  d = ssub(d, ell(q, [0.29, -0.33, 0.3], [0.1, 0.1, 0.16]), 0.08); // el hundido bajo los pómulos
  d = ssub(d, ell(q, [0.19, -0.04, 0.5], [0.15, 0.14, 0.27]), 0.03); // cuencas
  d = ssub(d, ell(p, [0, -0.22, 0.56], [0.07, 0.11, 0.26]), 0.03); // nariz
  d = ssub(d, ell(q, [0.035, -0.26, 0.56], [0.045, 0.075, 0.26]), 0.03);
  return d;
}

/** La mandíbula, en las mismas coordenadas (gira sobre la bisagra `JAW_HINGE`). */
export function jawSdf(p: V) {
  const q = mx(p);
  let d = ell(p, [0, -0.66, 0.3], [0.22, 0.09, 0.16]); // barbilla
  d = smin(d, cap(q, [0.16, -0.63, 0.27], [0.3, -0.58, 0.0], 0.06), 0.07); // cuerpo
  d = smin(d, cap(q, [0.3, -0.58, 0.0], [0.36, -0.3, -0.06], 0.05), 0.06); // rama
  d = ssub(d, ell(p, [0, -0.6, 0.12], [0.17, 0.2, 0.2]), 0.03); // el hueco de dentro (forma de U)
  return d;
}

export const JAW_HINGE: V = [0, -0.36, -0.07];

/** Dientes: posiciones (arco), giro y tamaño. Los de arriba van con el cráneo; los de abajo, con la mandíbula. Delante los
 * incisivos, luego los colmillos (más largos) y atrás las muelas (más anchas y más cortas). */
export function teeth(upper: boolean) {
  const out: { p: V; ry: number; s: V }[] = [];
  const n = 12, y = upper ? -0.53 : -0.6, cz = upper ? 0.24 : 0.245, r = upper ? 0.235 : 0.215;
  for (let i = 0; i < n; i++) {
    const a = -1.15 + (2.3 * i) / (n - 1);
    const k = Math.abs(i - (n - 1) / 2); // 0,5 delante … 5,5 atrás
    const canine = k > 1.6 && k < 2.6;
    const molar = k > 2.6;
    const h = canine ? 1.25 : molar ? 0.8 : 1;
    const w = molar ? 1.35 : 0.9;
    // los de arriba cuelgan del maxilar; los de abajo salen de la mandíbula
    const dy = ((h - 1) * 0.068 * (upper ? -1 : 1)) / 2;
    out.push({ p: [Math.sin(a) * r, y + dy, cz + Math.cos(a) * r], ry: a, s: [w, h, 1] });
  }
  return out;
}

/** Triangula una SDF con MarchingCubes y copia el resultado a una geometría estática con oclusión ambiental por vértice. */
function mesh(sdf: (p: V) => number, res: number) {
  const mc = new MarchingCubes(res, new MeshBasicMaterial(), false, false, 80000);
  mc.isolation = 0;
  const half = mc.size / 2;
  for (let z = 0; z < mc.size; z++)
    for (let y = 0; y < mc.size; y++)
      for (let x = 0; x < mc.size; x++) {
        const p: V = [(x - half) / half, (y - half) / half, (z - half) / half];
        mc.field[z * mc.size2 + y * mc.size + x] = -sdf(p) * 40;
      }
  mc.update();
  const n = mc.count;
  const pos = mc.positionArray.slice(0, n * 3);
  const nor = mc.normalArray.slice(0, n * 3);
  // oclusión ambiental con la propia SDF: se mira a lo largo de la normal cuánto «espacio libre» hay
  const col = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const px = pos[i * 3], py = pos[i * 3 + 1], pz = pos[i * 3 + 2];
    let nx = nor[i * 3], ny = nor[i * 3 + 1], nz = nor[i * 3 + 2];
    const l = len(nx, ny, nz) || 1;
    nx /= l; ny /= l; nz /= l;
    let occ = 0, w = 1;
    for (let s = 1; s <= 6; s++) {
      const h = 0.045 * s;
      occ += w * (h - sdf([px + nx * h, py + ny * h, pz + nz * h]));
      w *= 0.7;
    }
    const ao = Math.min(1, Math.max(0.05, 1 - occ * 2.6));
    col[i * 3] = col[i * 3 + 1] = col[i * 3 + 2] = ao;
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new BufferAttribute(pos, 3));
  g.setAttribute("normal", new BufferAttribute(nor, 3));
  g.setAttribute("color", new BufferAttribute(col, 3));
  g.computeBoundingSphere();
  mc.geometry.dispose();
  return g;
}

export function buildSkull(res = 72) {
  return { cranium: mesh(craniumSdf, res), jaw: mesh(jawSdf, Math.round(res * 0.8)) };
}
