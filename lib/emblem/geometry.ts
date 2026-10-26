import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

/*
 * Emblema de espinas (docs/36 B1): alas tribales simétricas de púas curvas, como el logotipo 3D de meermohsin.me, todo
 * procedural y con semilla. Cada púa es un trazo que se afila (línea central de Bézier con un ancho que cae hasta la
 * punta), extruido con bisel; las largas sacan una o dos púas secundarias. Un ala se construye y se refleja.
 * Unidades: el emblema mide unas 2 de ancho, centrado en el origen y de cara a +z.
 */

export type OpcionesEmblema = {
  semilla?: number;
  /** púas principales por ala */
  puas?: number;
  /** púas secundarias por púa larga (0–2) */
  ramas?: number;
  /** grosor de la extrusión */
  grosor?: number;
  /** cuánto se curvan las púas (0 = rectas) */
  curva?: number;
  /** cuánto se abren las púas respecto al brazo del ala, en grados: las de abajo y las de arriba */
  abanico?: [number, number];
};

export const EMBLEMA_MEER: Required<OpcionesEmblema> = { semilla: 7, puas: 7, ramas: 1, grosor: 0.05, curva: 0.55, abanico: [-55, 75] };

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

type V = THREE.Vector2;

/** el contorno de una púa: línea central de Bézier cuadrática con un ancho que cae de `ancho` a 0 en la punta */
function contornoPua(p0: V, p1: V, p2: V, ancho: number, muestras = 22) {
  const curva = new THREE.QuadraticBezierCurve(p0, p1, p2);
  const izq: V[] = [], der: V[] = [];
  for (let k = 0; k < muestras; k++) {
    const t = k / muestras;
    const p = curva.getPoint(t);
    const tg = curva.getTangent(t);
    const n = new THREE.Vector2(-tg.y, tg.x);
    // panza en el primer tercio y punta muy afilada: el perfil de las púas de la referencia
    const w = ancho * Math.pow(1 - t, 1.25) * (1 + 0.35 * Math.sin(Math.min(1, t * 2.2) * Math.PI));
    izq.push(p.clone().addScaledVector(n, w));
    der.push(p.clone().addScaledVector(n, -w));
  }
  return { puntos: [...izq, curva.getPoint(1), ...der.reverse()], curva };
}

function extruir(puntos: V[], grosor: number) {
  const forma = new THREE.Shape(puntos);
  const g = new THREE.ExtrudeGeometry(forma, { depth: grosor, bevelEnabled: true, bevelThickness: grosor * 0.45, bevelSize: 0.006, bevelSegments: 2, curveSegments: 4 });
  g.translate(0, 0, -grosor / 2);
  return g.index ? g.toNonIndexed() : g;
}

export function crearEmblema(op: OpcionesEmblema = {}) {
  const o = { ...EMBLEMA_MEER, ...op };
  const azar = generador(o.semilla);
  const ala: THREE.BufferGeometry[] = [];
  const [a0, a1] = o.abanico;
  /*
   * El ala: un brazo que sale del centro hacia fuera (algo hacia arriba) y del que brotan las púas, alternando arriba y
   * abajo: las de arriba, cuernos largos que se curvan hacia fuera; las de abajo, garfios más cortos. Un cuerno grande
   * sale cerca del centro hacia arriba (el perfil de alas de murciélago de la referencia).
   */
  const brazoLargo = 1.0 + azar() * 0.1;
  const brazo = contornoPua(new THREE.Vector2(0.04, 0), new THREE.Vector2(0.5, 0.12 + azar() * 0.08), new THREE.Vector2(brazoLargo, 0.02), 0.075);
  ala.push(extruir(brazo.puntos, o.grosor));
  const cuerno = contornoPua(new THREE.Vector2(0.1, 0.05), new THREE.Vector2(0.22, 0.55), new THREE.Vector2(0.48 + azar() * 0.08, 0.78), 0.06);
  ala.push(extruir(cuerno.puntos, o.grosor));
  // y otro hacia abajo, más corto y abierto: con el de arriba, el ala dibuja la X de la referencia
  const garfio = contornoPua(new THREE.Vector2(0.14, -0.04), new THREE.Vector2(0.3, -0.42), new THREE.Vector2(0.58 + azar() * 0.08, -0.6), 0.05);
  ala.push(extruir(garfio.puntos, o.grosor));
  for (let i = 0; i < o.puas; i++) {
    const f = (i + 0.5) / o.puas;
    const t = 0.12 + f * 0.8;
    const base = brazo.curva.getPoint(t);
    const tg = brazo.curva.getTangent(t);
    const arriba = i % 2 === 0;
    // ángulo respecto al brazo: dentro del abanico, más abierto cerca del centro
    const rango = arriba ? a1 : -a0;
    const ang = THREE.MathUtils.degToRad((arriba ? 1 : -1) * (rango * (0.95 - f * 0.45) + (azar() - 0.5) * 12));
    const dir = tg.clone().rotateAround(new THREE.Vector2(), ang);
    const n = new THREE.Vector2(-dir.y, dir.x);
    const largo = (arriba ? 0.75 : 0.6) * (1.1 - f * 0.5) * (0.8 + azar() * 0.4);
    // se curvan hacia fuera del emblema (garras)
    const doblez = -o.curva * largo * (arriba ? 1 : -1) * (0.5 + azar() * 0.5);
    const p1 = base.clone().addScaledVector(dir, largo * 0.55).addScaledVector(n, doblez * 0.45);
    const p2 = base.clone().addScaledVector(dir, largo).addScaledVector(n, doblez * 1.2);
    const ancho = (arriba ? 0.05 : 0.04) * (1.15 - f * 0.5);
    const { puntos, curva } = contornoPua(base, p1, p2, ancho);
    ala.push(extruir(puntos, o.grosor * 0.9));
    if (largo > 0.42) {
      for (let r = 0; r < o.ramas; r++) {
        const tt = 0.3 + r * 0.25 + azar() * 0.08;
        const b = curva.getPoint(tt);
        const d = curva.getTangent(tt).rotateAround(new THREE.Vector2(), THREE.MathUtils.degToRad((r % 2 ? -1 : 1) * (40 + azar() * 20)));
        const l = largo * (0.22 + azar() * 0.12);
        const lado = r % 2 ? -1 : 1;
        const q2 = b.clone().addScaledVector(d, l).addScaledVector(new THREE.Vector2(-d.y, d.x), l * 0.3 * lado);
        ala.push(extruir(contornoPua(b, b.clone().addScaledVector(d, l * 0.5), q2, ancho * 0.5, 12).puntos, o.grosor * 0.75));
      }
    }
  }
  // el núcleo: una púa vertical que sube y otra que baja, más finas, y un rombo en el centro
  const nucleo = [
    contornoPua(new THREE.Vector2(0, 0.05), new THREE.Vector2(0.015, 0.3), new THREE.Vector2(0, 0.62), 0.045).puntos,
    contornoPua(new THREE.Vector2(0, -0.05), new THREE.Vector2(-0.015, -0.25), new THREE.Vector2(0, -0.48), 0.04).puntos,
  ].map((p) => extruir(p, o.grosor * 1.2));
  const rombo = extruir([new THREE.Vector2(0, 0.14), new THREE.Vector2(0.09, 0), new THREE.Vector2(0, -0.14), new THREE.Vector2(-0.09, 0)], o.grosor * 1.6);

  const derecha = mergeGeometries(ala)!;
  const izquierda = derecha.clone().scale(-1, 1, 1);
  // reflejar invierte el sentido de las caras: se le da la vuelta al orden de los vértices de cada triángulo
  const pos = izquierda.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i += 3) {
    for (const k of [0, 1, 2]) {
      const a = pos.getComponent(i + 1, k), b = pos.getComponent(i + 2, k);
      pos.setComponent(i + 1, k, b);
      pos.setComponent(i + 2, k, a);
    }
  }
  const todo = mergeGeometries([derecha, izquierda, ...nucleo, rombo].map((g) => {
    g.deleteAttribute("uv");
    g.deleteAttribute("normal");
    return g;
  }))!;
  todo.computeVertexNormals();
  todo.computeBoundingSphere();
  return todo;
}
