import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

/*
 * Máscara tribal (docs/41 P4): la de la portada de meermohsin.me, que va sobre los ojos. Dos anillos con el hueco del
 * ojo, y de cada uno salen trazos que se afilan siguiendo curvas suaves y acaban en rizo:
 *   - un cuerno que sube y se abre;
 *   - dos alas hacia fuera;
 *   - un garfio que baja;
 *   - una lágrima bajo el ojo;
 *   - una ceja que se enrosca hacia dentro;
 *   - lenguas de fuego sobre la ceja.
 * En el centro, el puente de la nariz con una púa arriba y otra abajo. Se dibuja un lado y se refleja. Todo es procedural:
 * la semilla mueve cada punto un poco, así cada marca tiene la suya. Unidades: unas 2,4 de ancho, de cara a +z.
 */

export type OpcionesMascara = { semilla?: number; grosor?: number; rizo?: number };

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
const v = (x: number, y: number) => new THREE.Vector2(x, y);

/**
 * un trazo: curva suave (Catmull-Rom) por los puntos, con un rizo en espiral al final si `rizo` ≠ 0 (vueltas, con signo
 * = sentido); el ancho cae de `a0` a 0 con panza en el primer tercio
 */
function trazo(puntos: V[], a0: number, rizo = 0, muestras = 40) {
  const pts = puntos.map((p) => new THREE.Vector3(p.x, p.y, 0));
  // la guía: la línea principal sin el rizo (para colocar púas a lo largo, por longitud)
  const guia = new THREE.CatmullRomCurve3(pts.map((p) => p.clone()), false, "centripetal");
  if (rizo) {
    // la espiral sigue la dirección del último tramo y se cierra hacia el lado del giro
    const n = pts.length;
    const fin = pts[n - 1].clone(), dir = fin.clone().sub(pts[n - 2]).normalize();
    const largo = pts[n - 1].distanceTo(pts[n - 2]);
    let ang = Math.atan2(dir.y, dir.x), r = largo * 0.55;
    let p = fin.clone();
    for (let k = 0; k < 6; k++) {
      ang += (Math.sign(rizo) * Math.PI * Math.abs(rizo)) / 3;
      r *= 0.72;
      p = p.clone().add(new THREE.Vector3(Math.cos(ang) * r, Math.sin(ang) * r, 0));
      pts.push(p);
    }
  }
  const curva = new THREE.CatmullRomCurve3(pts, false, "centripetal");
  const izq: V[] = [], der: V[] = [];
  for (let k = 0; k <= muestras; k++) {
    const t = k / muestras;
    const p = curva.getPoint(t), tg = curva.getTangent(t);
    const n = v(-tg.y, tg.x).normalize();
    const w = a0 * Math.pow(1 - t, 0.9) * (1 + 0.45 * Math.sin(Math.min(1, t * 2.6) * Math.PI)) + 0.002;
    izq.push(v(p.x + n.x * w, p.y + n.y * w));
    der.push(v(p.x - n.x * w, p.y - n.y * w));
  }
  return Object.assign([...izq, ...der.reverse()], { curva: guia });
}

/** anillo del ojo: elipse con su hueco, más grueso arriba (la ceja) */
function anillo(c: V, rx: number, ry: number, giro: number, grueso: number) {
  const fuera: V[] = [], dentro: V[] = [];
  for (let k = 0; k < 64; k++) {
    const a = (k / 64) * Math.PI * 2;
    const g = grueso * (1 + 0.9 * Math.max(0, Math.sin(a)));
    const p = (r1: number, r2: number) => v(Math.cos(a) * r1, Math.sin(a) * r2).rotateAround(v(0, 0), giro).add(c);
    fuera.push(p(rx + g, ry + g));
    dentro.push(p(rx, ry));
  }
  const forma = new THREE.Shape(fuera);
  forma.holes.push(new THREE.Path(dentro.reverse()));
  return forma;
}

function extruir(forma: THREE.Shape, grosor: number) {
  const g = new THREE.ExtrudeGeometry(forma, { depth: grosor, bevelEnabled: true, bevelThickness: grosor * 0.6, bevelSize: 0.008, bevelSegments: 3, curveSegments: 6 });
  g.translate(0, 0, -grosor / 2);
  return g.index ? g.toNonIndexed() : g;
}

export function crearMascara(op: OpcionesMascara = {}) {
  const o = { semilla: 7, grosor: 0.05, rizo: 0.7, ...op };
  const azar = generador(o.semilla);
  const j = (x: number, y: number, k = 0.04) => v(x + (azar() - 0.5) * k, y + (azar() - 0.5) * k);
  const R = o.rizo;
  const lado: THREE.BufferGeometry[] = [];
  const pon = (pts: V[], z = 1) => lado.push(extruir(new THREE.Shape(pts), o.grosor * z));
  /** púas afiladas a lo largo de un trazo, hacia un lado (como las espinas de la referencia) */
  const puas = (t: ReturnType<typeof trazo>, en: number[], lado1: 1 | -1, largo: number, ancho: number) => {
    for (const u of en) {
      const p = t.curva.getPointAt(u), tg = t.curva.getTangentAt(u);
      const d = v(tg.x, tg.y).rotateAround(v(0, 0), lado1 * (0.9 + azar() * 0.3)).normalize();
      const b = v(p.x, p.y);
      pon(trazo([b, b.clone().addScaledVector(d, largo * 0.55).addScaledVector(v(tg.x, tg.y), largo * 0.2), b.clone().addScaledVector(d, largo).addScaledVector(v(tg.x, tg.y), largo * 0.45)], ancho), 0.8);
    }
  };
  // el ojo
  lado.push(extruir(anillo(v(0.43, 0.0), 0.2, 0.085, -0.12, 0.035), o.grosor * 1.2));
  // cuerno que sube y se abre, con dos púas en el lomo
  const cuerno = [j(0.3, 0.13), j(0.48, 0.36), j(0.74, 0.6), j(0.95, 0.86)];
  const tc = trazo(cuerno, 0.085, R * 1.1);
  pon(tc);
  puas(tc, [0.25, 0.5], -1, 0.16, 0.03);
  pon(trazo([j(0.55, 0.43), j(0.7, 0.42), j(0.82, 0.48)], 0.03, -R * 0.6));
  pon(trazo([j(0.68, 0.56), j(0.86, 0.56), j(0.98, 0.64)], 0.026, -R * 0.5));
  // alas hacia fuera: la de arriba acaba en rizo hacia abajo; la de en medio, en púa
  const ta = trazo([j(0.6, 0.08), j(0.86, 0.22), j(1.08, 0.27), j(1.2, 0.2)], 0.07, -R * 0.9);
  pon(ta);
  puas(ta, [0.35, 0.6], 1, 0.13, 0.026);
  pon(trazo([j(0.64, -0.02), j(0.92, -0.04), j(1.24, 0.02)], 0.05));
  // garfio que baja y se enrosca hacia dentro
  const tg = trazo([j(0.56, -0.08), j(0.74, -0.3), j(0.86, -0.56), j(0.78, -0.78)], 0.075, -R * 1.1);
  pon(tg);
  puas(tg, [0.3, 0.55], 1, 0.14, 0.028);
  // lágrima bajo el ojo
  pon(trazo([j(0.36, -0.08), j(0.4, -0.24), j(0.34, -0.42)], 0.042, R * 0.7));
  // ceja que se enrosca hacia dentro, por encima del puente
  pon(trazo([j(0.24, 0.1), j(0.16, 0.26), j(0.2, 0.42)], 0.04, R * 0.8));
  // lenguas de fuego sobre la ceja
  for (let k = 0; k < 3; k++) {
    const x = 0.36 + k * 0.1;
    pon(trazo([j(x, 0.11, 0.01), j(x + 0.02, 0.2), j(x - 0.02, 0.28 + k * 0.04)], 0.028, (k % 2 ? 1 : -1) * R * 0.5), 0.8);
  }
  const derecha = mergeGeometries(lado.map((g) => (g.deleteAttribute("uv"), g.deleteAttribute("normal"), g)))!;
  const izquierda = derecha.clone().scale(-1, 1, 1);
  // reflejar invierte el sentido de las caras
  const pos = izquierda.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i += 3)
    for (const k of [0, 1, 2]) {
      const a = pos.getComponent(i + 1, k), b = pos.getComponent(i + 2, k);
      pos.setComponent(i + 1, k, b);
      pos.setComponent(i + 2, k, a);
    }
  // el centro: el puente que une los ojos, la púa de arriba y la de abajo
  const centro = [
    extruir(new THREE.Shape([v(-0.26, 0.03), v(0, 0.09), v(0.26, 0.03), v(0.24, -0.01), v(0, 0.02), v(-0.24, -0.01)]), o.grosor * 1.3),
    extruir(new THREE.Shape(trazo([v(0, 0.05), v(0.01, 0.3), v(0, 0.56)], 0.035)), o.grosor),
    extruir(new THREE.Shape(trazo([v(0, 0.0), v(-0.01, -0.18), v(0, -0.34)], 0.04)), o.grosor * 1.1),
  ].map((g) => (g.deleteAttribute("uv"), g.deleteAttribute("normal"), g));
  const todo = mergeGeometries([derecha, izquierda, ...centro])!;
  todo.computeVertexNormals();
  todo.computeBoundingSphere();
  return todo;
}
