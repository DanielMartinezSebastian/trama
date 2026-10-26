"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

/*
 * Decorado de juguete para `ToyDrive` (docs/36 B2): lo que rodea al coche en el portfolio de Bruno Simon. Matas de
 * hierba de hojas finas que van de oscuro en la raíz a claro en la punta, árboles de copa esponjosa hecha de bultos
 * facetados, estanques de borde irregular con su orilla de espuma y piedras sueltas. Todo procedural y con semilla,
 * instanciado (unas pocas llamadas de dibujo) y con materiales estándar, así vale igual en WebGL y en WebGPU. Deja libre
 * un círculo alrededor de la salida del coche y de la palabra.
 */

export type ColoresDecorado = { hierba: string; hierbaPunta: string; copa: string; copaLuz: string; tronco: string; agua: string; espuma: string; piedra: string };

// medidos a ojo en los fotogramas de la referencia, más oscuros de lo que se ven: la luz de 5 sin tone mapping los sube
export const DECORADO_BRUNO: ColoresDecorado = { hierba: "#3d3a0e", hierbaPunta: "#a8842c", copa: "#9c1438", copaLuz: "#d94a6e", tronco: "#4a2016", agua: "#0e6f78", espuma: "#7fb8b0", piedra: "#6e566f" };

export type OpcionesDecorado = {
  semilla?: number;
  /** radio de la zona decorada alrededor del centro (m) */
  radio?: number;
  /** matas de hierba, árboles, estanques y piedras */
  matas?: number;
  arboles?: number;
  estanques?: number;
  piedras?: number;
  colores?: Partial<ColoresDecorado>;
};

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

/** una mata: N hojas finas (dos triángulos que se afilan) que se abren desde el centro, con el color de la raíz a la punta */
function geometriaMata(azar: () => number, hojas: number, base: THREE.Color, punta: THREE.Color) {
  const pos: number[] = [], col: number[] = [];
  for (let i = 0; i < hojas; i++) {
    const a = azar() * Math.PI * 2, r = Math.sqrt(azar()) * 0.55;
    const x = Math.cos(a) * r, z = Math.sin(a) * r;
    const alto = 0.22 + azar() * 0.3, ancho = 0.05 + azar() * 0.03;
    // la hoja se inclina hacia fuera
    const inc = 0.1 + azar() * 0.25, gx = Math.cos(a) * inc, gz = Math.sin(a) * inc;
    const giro = azar() * Math.PI;
    const ox = Math.cos(giro) * ancho, oz = Math.sin(giro) * ancho;
    const v = [
      [x - ox, 0, z - oz],
      [x + ox, 0, z + oz],
      [x + gx * 0.5 + ox * 0.5, alto * 0.5, z + gz * 0.5 + oz * 0.5],
      [x + gx * 0.5 - ox * 0.5, alto * 0.5, z + gz * 0.5 - oz * 0.5],
      [x + gx, alto, z + gz],
    ];
    const c = [0, 0, 0.5, 0.5, 1].map((t) => base.clone().lerp(punta, t));
    for (const [k0, k1, k2] of [[0, 1, 2], [0, 2, 3], [3, 2, 4]]) {
      for (const k of [k0, k1, k2]) {
        pos.push(...v[k]);
        col.push(c[k].r, c[k].g, c[k].b);
      }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
  g.computeVertexNormals();
  return g;
}

/** el árbol: tronco corto y una copa de bultos facetados, con los de arriba más claros (la luz del atardecer) */
function geometriaArbol(azar: () => number, copa: THREE.Color, luz: THREE.Color, tronco: THREE.Color) {
  const partes: THREE.BufferGeometry[] = [];
  const pinta = (g: THREE.BufferGeometry, c: THREE.Color) => {
    const n = g.attributes.position.count;
    const col = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) col.set([c.r, c.g, c.b], i * 3);
    g.setAttribute("color", new THREE.BufferAttribute(col, 3));
    return g;
  };
  partes.push(pinta(new THREE.CylinderGeometry(0.12, 0.18, 1.4, 6).translate(0, 0.7, 0).toNonIndexed(), tronco));
  const bultos = 6 + Math.floor(azar() * 4);
  for (let i = 0; i < bultos; i++) {
    const a = azar() * Math.PI * 2, r = azar() * 0.9;
    const y = 1.6 + azar() * 1.1;
    const s = 0.55 + azar() * 0.45;
    const g = new THREE.IcosahedronGeometry(s, 0).translate(Math.cos(a) * r, y, Math.sin(a) * r).toNonIndexed();
    partes.push(pinta(g, copa.clone().lerp(luz, Math.min(1, (y - 1.4) / 1.4) * 0.8 + azar() * 0.15)));
  }
  const g = mergeGeometries(partes.map((p) => (p.deleteAttribute("uv"), p)))!;
  g.computeVertexNormals();
  return g;
}

/** un estanque: forma cerrada de borde irregular (radio que ondula), y su orilla un poco mayor */
function formaEstanque(azar: () => number, radio: number, crece = 0) {
  const fases = [azar() * 6, azar() * 6, azar() * 6];
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * Math.PI * 2;
    const r = radio * (1 + 0.22 * Math.sin(a * 2 + fases[0]) + 0.12 * Math.sin(a * 3 + fases[1]) + 0.06 * Math.sin(a * 5 + fases[2])) + crece;
    pts.push(new THREE.Vector2(Math.cos(a) * r, Math.sin(a) * r));
  }
  return new THREE.ShapeGeometry(new THREE.Shape(pts)).rotateX(-Math.PI / 2);
}

export default function Decorado({ centro, suelo, libres, opciones = {} }: { centro: [number, number]; suelo: number; libres: { x: number; z: number; r: number }[]; opciones?: OpcionesDecorado }) {
  const o = { semilla: 5, radio: 42, matas: 1600, arboles: 70, estanques: 3, piedras: 90, ...opciones };
  const col = { ...DECORADO_BRUNO, ...opciones.colores };
  const todo = useMemo(() => {
    const azar = generador(o.semilla);
    const libre = (x: number, z: number, margen: number) => libres.every((l) => Math.hypot(x - l.x, z - l.z) > l.r + margen);
    const punto = (margen: number) => {
      for (let k = 0; k < 40; k++) {
        const a = azar() * Math.PI * 2, r = Math.sqrt(azar()) * o.radio;
        const x = centro[0] + Math.cos(a) * r, z = centro[1] + Math.sin(a) * r;
        if (libre(x, z, margen)) return [x, z] as [number, number];
      }
      return null;
    };
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), eje = new THREE.Vector3(0, 1, 0);
    const objetos: THREE.Object3D[] = [];
    const geos: THREE.BufferGeometry[] = [];
    const mats: THREE.Material[] = [];

    // estanques primero: la hierba y los árboles los evitan
    const charcos: { x: number; z: number; r: number }[] = [];
    const matAgua = new THREE.MeshStandardMaterial({ color: col.agua, roughness: 0.35, metalness: 0 });
    const matEspuma = new THREE.MeshStandardMaterial({ color: col.espuma, roughness: 0.6 });
    mats.push(matAgua, matEspuma);
    for (let i = 0; i < o.estanques; i++) {
      const p = punto(6);
      if (!p) continue;
      const r = 2.5 + azar() * 3.5;
      const sub = generador(o.semilla * 31 + i);
      const agua = formaEstanque(sub, r);
      const orilla = formaEstanque(generador(o.semilla * 31 + i), r, 0.35);
      geos.push(agua, orilla);
      const ma = new THREE.Mesh(agua, matAgua);
      ma.position.set(p[0], suelo + 0.02, p[1]);
      ma.receiveShadow = true;
      const mo = new THREE.Mesh(orilla, matEspuma);
      mo.position.set(p[0], suelo + 0.012, p[1]);
      objetos.push(mo, ma);
      charcos.push({ x: p[0], z: p[1], r: r * 1.3 });
    }
    const fuera = (x: number, z: number, m0: number) => charcos.every((c) => Math.hypot(x - c.x, z - c.z) > c.r + m0);

    // hierba: matas agrupadas en manchas (como en la referencia, la hierba crece a rodales)
    const geoMata = geometriaMata(azar, 40, new THREE.Color(col.hierba), new THREE.Color(col.hierbaPunta));
    const matHierba = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9, side: THREE.DoubleSide });
    geos.push(geoMata);
    mats.push(matHierba);
    const matas: THREE.Matrix4[] = [];
    const rodales = Math.max(1, Math.round(o.matas / 14));
    for (let i = 0; i < rodales; i++) {
      const p = punto(2);
      if (!p) continue;
      const n = 8 + Math.floor(azar() * 14), ext = 1.2 + azar() * 2.2;
      for (let k = 0; k < n && matas.length < o.matas; k++) {
        const x = p[0] + (azar() - 0.5) * ext * 2, z = p[1] + (azar() - 0.5) * ext * 2;
        if (!libre(x, z, 0.5) || !fuera(x, z, 0.3)) continue;
        const s = 0.8 + azar() * 0.9;
        q.setFromAxisAngle(eje, azar() * Math.PI * 2);
        matas.push(m.compose(new THREE.Vector3(x, suelo, z), q, new THREE.Vector3(s, s * (0.8 + azar() * 0.5), s)).clone());
      }
    }
    const hierba = new THREE.InstancedMesh(geoMata, matHierba, Math.max(1, matas.length));
    matas.forEach((mm, i) => hierba.setMatrixAt(i, mm));
    hierba.count = matas.length;
    hierba.receiveShadow = true;
    objetos.push(hierba);

    // árboles: tres modelos y copias
    const matArbol = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85, flatShading: true });
    mats.push(matArbol);
    const modelos = [0, 1, 2].map(() => geometriaArbol(azar, new THREE.Color(col.copa), new THREE.Color(col.copaLuz), new THREE.Color(col.tronco)));
    geos.push(...modelos);
    const porModelo: THREE.Matrix4[][] = [[], [], []];
    for (let i = 0; i < o.arboles; i++) {
      const p = punto(3);
      if (!p || !fuera(p[0], p[1], 1.5)) continue;
      const s = 0.9 + azar() * 0.8;
      q.setFromAxisAngle(eje, azar() * Math.PI * 2);
      porModelo[i % 3].push(m.compose(new THREE.Vector3(p[0], suelo, p[1]), q, new THREE.Vector3(s, s, s)).clone());
    }
    porModelo.forEach((ms, k) => {
      if (!ms.length) return;
      const im = new THREE.InstancedMesh(modelos[k], matArbol, ms.length);
      ms.forEach((mm, i) => im.setMatrixAt(i, mm));
      im.castShadow = true;
      im.receiveShadow = true;
      objetos.push(im);
    });

    // piedras sueltas
    const geoPiedra = new THREE.DodecahedronGeometry(0.3, 0);
    const matPiedra = new THREE.MeshStandardMaterial({ color: col.piedra, roughness: 0.9, flatShading: true });
    geos.push(geoPiedra);
    mats.push(matPiedra);
    const piedras = new THREE.InstancedMesh(geoPiedra, matPiedra, o.piedras);
    let np = 0;
    for (let i = 0; i < o.piedras; i++) {
      const p = punto(1);
      if (!p || !fuera(p[0], p[1], 0.2)) continue;
      const s = 0.4 + azar() * 1.1;
      q.setFromEuler(new THREE.Euler(azar() * 3, azar() * 3, azar() * 3));
      piedras.setMatrixAt(np++, m.compose(new THREE.Vector3(p[0], suelo + 0.05 * s, p[1]), q, new THREE.Vector3(s, s * 0.6, s)));
    }
    piedras.count = np;
    piedras.castShadow = true;
    objetos.push(piedras);
    return { objetos, geos, mats };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(o), JSON.stringify(col), centro[0], centro[1], suelo, JSON.stringify(libres)]);
  useEffect(
    () => () => {
      todo.geos.forEach((g) => g.dispose());
      todo.mats.forEach((m) => m.dispose());
    },
    [todo],
  );
  return (
    <group>
      {todo.objetos.map((x, i) => (
        <primitive key={i} object={x} />
      ))}
    </group>
  );
}
