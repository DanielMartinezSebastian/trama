/** Tallas de gema como geometría de three (poliedros convexos: los lee el material con trazado de rayos, `gemMaterial.ts`). */
import { BufferGeometry, Float32BufferAttribute, Vector3 } from "three";

/**
 * Talla brillante simplificada (49 facetas): mesa octogonal, 8 estrellas, 8 cometas, 16 medias lunas de corona, faja, 16
 * facetas bajas de pabellón y 8 principales hasta la culata. Triángulos sueltos: cada faceta tiene su normal (el mosaico de
 * reflejos claros y oscuros que hace brillar una piedra).
 */
export function brilliantGeometry(R: number): BufferGeometry {
  const at = (deg: number, r: number, h: number) => new Vector3(Math.cos((deg * Math.PI) / 180) * r * R, h * R, Math.sin((deg * Math.PI) / 180) * r * R);
  const T = Array.from({ length: 8 }, (_, k) => at(k * 45, 0.55, 0.32));
  const S = Array.from({ length: 8 }, (_, k) => at(k * 45 + 22.5, 0.8, 0.2));
  const G = Array.from({ length: 16 }, (_, j) => at(j * 22.5, 1, 0.03));
  const Gb = Array.from({ length: 16 }, (_, j) => at(j * 22.5, 1, -0.03));
  const M = Array.from({ length: 8 }, (_, k) => at(k * 45, 0.46, -0.5));
  const top = new Vector3(0, 0.32 * R, 0);
  const culet = new Vector3(0, -0.86 * R, 0);
  const tris: Vector3[][] = [];
  const m8 = (i: number) => (i + 8) % 8;
  const m16 = (i: number) => (i + 16) % 16;
  for (let k = 0; k < 8; k++) {
    tris.push([top, T[k], T[m8(k + 1)]]); // mesa
    tris.push([T[k], T[m8(k + 1)], S[k]]); // estrella
    tris.push([T[k], S[m8(k - 1)], G[2 * k]], [T[k], G[2 * k], S[k]]); // cometa
    tris.push([S[k], G[2 * k], G[2 * k + 1]], [S[k], G[2 * k + 1], G[m16(2 * k + 2)]]); // medias lunas
    tris.push([Gb[m16(2 * k - 1)], Gb[2 * k], M[k]], [Gb[2 * k], Gb[2 * k + 1], M[k]], [Gb[2 * k + 1], M[m8(k + 1)], M[k]]); // pabellón bajo
    tris.push([M[k], M[m8(k + 1)], culet]); // principales
  }
  for (let j = 0; j < 16; j++) tris.push([G[j], G[m16(j + 1)], Gb[m16(j + 1)]], [G[j], Gb[m16(j + 1)], Gb[j]]); // faja
  const center = new Vector3(0, -0.2 * R, 0);
  const pos: number[] = [];
  const e1 = new Vector3();
  const e2 = new Vector3();
  for (const [a, b, c] of tris) {
    // cada faceta mirando hacia fuera
    const n = e1.subVectors(b, a).cross(e2.subVectors(c, a));
    const mid = new Vector3().add(a).add(b).add(c).divideScalar(3).sub(center);
    const [p, q, r] = n.dot(mid) < 0 ? [a, c, b] : [a, b, c];
    pos.push(p.x, p.y, p.z, q.x, q.y, q.z, r.x, r.y, r.z);
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(pos, 3));
  g.computeVertexNormals();
  return g;
}
