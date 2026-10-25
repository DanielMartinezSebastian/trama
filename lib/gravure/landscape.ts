import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

/*
 * El paisaje de `EngravedMap` (docs/32 §2): un terreno de 10 × 10 m con lomas suaves (la referencia: 10 m y 0,75 de
 * elevación máxima), un pueblo de casas con tejado a dos aguas y árboles (en bosquecillos, alrededor del pueblo y a lo
 * largo de setos), todo procedural y con semilla. Las viñas no son geometría: las dibuja el material del terreno.
 */

export type OpcionesPaisaje = {
  semilla?: number;
  /** centro y radio del pueblo (m, en el plano xz) */
  pueblo?: { centro: [number, number]; radio: number };
  casas?: number;
  arboles?: number;
};

export const PAISAJE_CHARTOGNE = { semilla: 3, pueblo: { centro: [-0.7, 0.35] as [number, number], radio: 1.5 }, casas: 900, arboles: 5000 };

function generador(semilla: number) {
  let s = semilla >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** ruido de valor 2D suave (para las lomas y la densidad) */
function ruido2(semilla: number) {
  const h = (x: number, y: number) => {
    const s = Math.sin(x * 127.1 + y * 311.7 + semilla * 74.7) * 43758.5453;
    return s - Math.floor(s);
  };
  const suave = (t: number) => t * t * (3 - 2 * t);
  return (x: number, y: number) => {
    const ix = Math.floor(x), iy = Math.floor(y);
    const fx = suave(x - ix), fy = suave(y - iy);
    const a = h(ix, iy), b = h(ix + 1, iy), c = h(ix, iy + 1), d = h(ix + 1, iy + 1);
    return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
  };
}

export function crearPaisaje(op: OpcionesPaisaje = {}) {
  const o = { ...PAISAJE_CHARTOGNE, ...op };
  const azar = generador(o.semilla);
  const n = ruido2(o.semilla);
  /** altura del terreno: dos octavas de lomas, más bajas en el pueblo (los pueblos se asientan en lo llano) */
  const altura = (x: number, z: number) => {
    const lomas = (n(x * 0.25 + 3, z * 0.25 + 7) - 0.5) * 0.9 + (n(x * 0.7, z * 0.7) - 0.5) * 0.25;
    const dp = Math.hypot(x - o.pueblo.centro[0], z - o.pueblo.centro[1]) / o.pueblo.radio;
    return lomas * (0.45 + 0.55 * Math.min(1, dp));
  };

  // terreno
  const terreno = new THREE.PlaneGeometry(10, 10, 220, 220);
  terreno.rotateX(-Math.PI / 2);
  const P = terreno.attributes.position;
  for (let i = 0; i < P.count; i++) P.setY(i, altura(P.getX(i), P.getZ(i)));
  terreno.computeVertexNormals();

  // la casa: un cubo de 1 m con tejado a dos aguas, apoyada en y = 0
  const muro = new THREE.BoxGeometry(1, 0.62, 0.62).translate(0, 0.31, 0);
  // tejado a dos aguas: prisma triangular a lo largo de x con la arista arriba (el vértice que sale en +z va a +y)
  const tejado = new THREE.CylinderGeometry(0.5, 0.5, 1.04, 3, 1).rotateZ(Math.PI / 2).rotateX(-Math.PI / 2).scale(1, 0.7, 0.72).translate(0, 0.62 + 0.25 * 0.7, 0);
  const casa = mergeGeometries([muro.toNonIndexed(), tejado.index ? tejado.toNonIndexed() : tejado])!;
  casa.computeVertexNormals();

  // el árbol: copa de dos bultos y tronco corto
  const copa1 = new THREE.IcosahedronGeometry(0.5, 1).scale(1, 0.85, 1).translate(0, 0.95, 0);
  // la copa pequeña con 20 caras: a la distancia de la vista no se distingue, y deja el paisaje en ~110 triángulos por
  // árbol, como la referencia (521 000 triángulos con 5084 instancias, medido con el gancho gl.js, docs/34 §2)
  const copa2 = new THREE.IcosahedronGeometry(0.34, 0).translate(0.22, 1.25, 0.08);
  const tronco = new THREE.CylinderGeometry(0.07, 0.09, 0.55, 4, 1, true).translate(0, 0.27, 0);
  const arbol = mergeGeometries([copa1, copa2, tronco].map((g) => (g.index ? g.toNonIndexed() : g)))!;
  arbol.computeVertexNormals();

  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const eje = new THREE.Vector3(0, 1, 0);
  const pos = new THREE.Vector3();
  const esc = new THREE.Vector3();

  // casas: alineadas con calles (dos direcciones por barrio), más juntas en el centro
  const casas: THREE.Matrix4[] = [];
  for (let k = 0; casas.length < o.casas && k < o.casas * 20; k++) {
    const r = Math.sqrt(azar()) * o.pueblo.radio;
    const a = azar() * Math.PI * 2;
    const x = o.pueblo.centro[0] + Math.cos(a) * r * 1.25, z = o.pueblo.centro[1] + Math.sin(a) * r * 0.85;
    if (azar() > 1.15 - r / o.pueblo.radio) continue;
    const barrio = n(x * 2.3, z * 2.3);
    const rumbo = barrio * Math.PI + (azar() < 0.5 ? 0 : Math.PI / 2);
    const s = 0.045 + azar() * 0.03;
    q.setFromAxisAngle(eje, rumbo);
    pos.set(x, altura(x, z) - 0.005, z);
    esc.set(s * (1 + azar() * 0.9), s * (0.9 + azar() * 0.5), s);
    casas.push(m.compose(pos, q, esc).clone());
  }

  // árboles: bosquecillos (ruido), corona del pueblo y setos a lo largo de líneas al azar
  const arboles: THREE.Matrix4[] = [];
  const setos = Array.from({ length: 14 }, () => ({ x: (azar() - 0.5) * 8, z: (azar() - 0.5) * 8, a: azar() * Math.PI, l: 0.8 + azar() * 2.2 }));
  for (let k = 0; arboles.length < o.arboles && k < o.arboles * 30; k++) {
    let x: number, z: number;
    const tipo = azar();
    if (tipo < 0.22) {
      // en el pueblo y su borde
      const r = Math.sqrt(azar()) * o.pueblo.radio * 1.3;
      const a = azar() * Math.PI * 2;
      x = o.pueblo.centro[0] + Math.cos(a) * r * 1.25;
      z = o.pueblo.centro[1] + Math.sin(a) * r * 0.85;
    } else if (tipo < 0.55) {
      const s = setos[Math.floor(azar() * setos.length)];
      const t = (azar() - 0.5) * s.l;
      x = s.x + Math.cos(s.a) * t + (azar() - 0.5) * 0.04;
      z = s.z + Math.sin(s.a) * t + (azar() - 0.5) * 0.04;
    } else {
      x = (azar() - 0.5) * 9.6;
      z = (azar() - 0.5) * 9.6;
      if (n(x * 0.9 + 11, z * 0.9 + 5) < 0.62) continue;
    }
    const s = 0.035 + azar() * 0.03;
    q.setFromAxisAngle(eje, azar() * Math.PI * 2);
    pos.set(x, altura(x, z) - 0.004, z);
    esc.set(s, s * (0.85 + azar() * 0.4), s);
    arboles.push(m.compose(pos, q, esc).clone());
  }

  return { terreno, casa, arbol, casas, arboles, altura };
}

export type Paisaje = ReturnType<typeof crearPaisaje>;
