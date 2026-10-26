import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

/*
 * Alas tribales (docs/41 P4): el emblema de meermohsin.me, en dos piezas, ala derecha y ala izquierda, que casi se tocan
 * en el puente. La referencia pinta 2 mallas de 42 542 vértices, blancas y facetadas, iluminadas por tres luces puntuales
 * rojas. Va sobre los ojos en la portada y luego da vueltas por el relato.
 *
 * Estilo de tatuaje tribal gótico: todo acaba en punta, sin rizos. Cada ala lleva:
 *   - el ojo, una almendra con las puntas afiladas;
 *   - un cuerno alto que sube;
 *   - dos púas largas hacia fuera;
 *   - un garfio exterior que baja y se vuelve;
 *   - una cola larga hacia abajo y otra corta por dentro;
 *   - lenguas de fuego con la punta vuelta encima del ojo;
 *   - púas pequeñas junto al puente.
 * Procedural y con semilla. Unidades: cada ala, ~1,5 de ancho y ~2,2 de alto; el puente en x = 0, de cara a +z.
 */

export type OpcionesAlas = { semilla?: number; grosor?: number };

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

/** un trazo que se afila hasta una punta: curva suave por los puntos y ancho que cae de `a0` a 0 (`afilado` > 1: nace ancho y se afila antes) */
function punta(puntos: V[], a0: number, muestras = 36, afilado = 1.25) {
  const curva = new THREE.CatmullRomCurve3(puntos.map((p) => new THREE.Vector3(p.x, p.y, 0)), false, "centripetal");
  const izq: V[] = [], der: V[] = [];
  for (let k = 0; k <= muestras; k++) {
    const t = k / muestras;
    const p = curva.getPointAt(t), tg = curva.getTangentAt(t);
    const n = v(-tg.y, tg.x);
    // panza en el primer cuarto y punta muy afilada (potencia > 1)
    const w = a0 * Math.pow(1 - t, afilado) * (1 + 0.3 * Math.sin(Math.min(1, t * 3.2) * Math.PI)) + 0.0012;
    izq.push(v(p.x + n.x * w, p.y + n.y * w));
    der.push(v(p.x - n.x * w, p.y - n.y * w));
  }
  return [...izq, ...der.reverse()];
}

/** el ojo: una almendra con las puntas afiladas (entre `a` y `b`), con su hueco; el borde, más grueso por arriba */
function ojo(a: V, b: V, alto: number, grueso: number) {
  const dir = b.clone().sub(a), largo = dir.length(), ang = Math.atan2(dir.y, dir.x);
  const borde = (h: number, extra: number) => {
    const pts: V[] = [];
    for (let k = 0; k <= 40; k++) {
      const s = k / 40;
      // por arriba
      pts.push(v(s * largo, Math.sin(Math.PI * s) ** 0.8 * (h + extra * 1.6)));
    }
    for (let k = 39; k >= 1; k--) {
      const s = k / 40;
      // por abajo, menos alto
      pts.push(v(s * largo, -(Math.sin(Math.PI * s) ** 0.8) * (h * 0.7 + extra)));
    }
    return pts.map((p) => p.rotateAround(v(0, 0), ang).add(a));
  };
  // el borde exterior sobresale un poco de las puntas: la almendra acaba en punta también por fuera
  const fuera = borde(alto, grueso).map((p, i) => (i === 0 ? p.clone().addScaledVector(dir.clone().normalize(), -grueso * 1.2) : i === 40 ? p.clone().addScaledVector(dir.clone().normalize(), grueso * 1.6) : p));
  const forma = new THREE.Shape(fuera);
  forma.holes.push(new THREE.Path(borde(alto, 0).reverse()));
  return forma;
}

function extruir(forma: THREE.Shape, grosor: number) {
  const g = new THREE.ExtrudeGeometry(forma, { depth: grosor, bevelEnabled: true, bevelThickness: grosor * 0.55, bevelSize: 0.006, bevelSegments: 2, curveSegments: 8 });
  g.translate(0, 0, -grosor / 2);
  const ng = g.index ? g.toNonIndexed() : g;
  ng.deleteAttribute("uv");
  ng.deleteAttribute("normal");
  return ng;
}

/** el ala derecha (x ≥ 0); la izquierda es su reflejo */
function ala(o: Required<OpcionesAlas>) {
  const azar = generador(o.semilla);
  const j = (x: number, y: number, k = 0.03) => v(x + (azar() - 0.5) * k, y + (azar() - 0.5) * k);
  const piezas: THREE.BufferGeometry[] = [];
  const pon = (pts: V[], z = 1) => piezas.push(extruir(new THREE.Shape(pts), o.grosor * z));
  /** un trazo con espinas pequeñas a lo largo, hacia un lado (las púas de la referencia están erizadas) */
  const conEspinas = (puntos: V[], a0: number, espinas: number[], lado: 1 | -1, largo: number) => {
    // las púas principales nacen anchas desde el ala y se afilan pronto
    pon(punta(puntos, a0 * 1.7, 36, 2.1));
    const guia = new THREE.CatmullRomCurve3(puntos.map((p) => new THREE.Vector3(p.x, p.y, 0)), false, "centripetal");
    for (const u of espinas) {
      const p = guia.getPointAt(u), tg = guia.getTangentAt(u);
      const d = v(tg.x, tg.y).rotateAround(v(0, 0), lado * (0.75 + azar() * 0.35));
      const b = v(p.x, p.y);
      const l = largo * (0.7 + azar() * 0.6) * (1 - u * 0.5);
      pon(punta([b, b.clone().addScaledVector(d, l * 0.5).addScaledVector(v(tg.x, tg.y), l * 0.25), b.clone().addScaledVector(d, l).addScaledVector(v(tg.x, tg.y), l * 0.6)], a0 * 0.4), 0.8);
    }
  };
  // el ojo, grande e inclinado hacia arriba y hacia fuera
  piezas.push(extruir(ojo(v(0.12, -0.03), v(0.86, 0.16), 0.12, 0.058), o.grosor * 1.25));
  // cuerno alto, casi vertical, que se abre al final
  conEspinas([j(0.22, 0.12), j(0.26, 0.42), j(0.34, 0.74), j(0.46, 1.08)], 0.05, [0.3, 0.55], 1, 0.12);
  // púas largas, casi horizontales, hacia fuera (las que dan a las alas su anchura)
  conEspinas([j(0.5, 0.2), j(0.8, 0.44), j(1.1, 0.62), j(1.42, 0.78)], 0.048, [0.25, 0.5, 0.72], 1, 0.13);
  conEspinas([j(0.74, 0.16), j(1.02, 0.27), j(1.3, 0.34), j(1.55, 0.38)], 0.04, [0.35, 0.65], -1, 0.1);
  // hoja que baja desde el rabillo del ojo y se abre hacia fuera
  conEspinas([j(0.72, 0.0), j(0.92, -0.18), j(1.08, -0.42), j(1.12, -0.66)], 0.042, [0.3, 0.6], -1, 0.11);
  // garfio exterior corto, que vuelve la punta
  pon(punta([j(0.86, 0.06), j(1.06, 0.02), j(1.2, -0.08), j(1.16, -0.18)], 0.03));
  // cola larga hacia abajo
  conEspinas([j(0.38, -0.12), j(0.42, -0.42), j(0.52, -0.76), j(0.64, -1.08)], 0.042, [0.25, 0.5], 1, 0.1);
  // cola corta por dentro, con la punta vuelta
  pon(punta([j(0.2, -0.08), j(0.21, -0.28), j(0.28, -0.46), j(0.23, -0.58)], 0.03));
  // lenguas de fuego sobre el ojo: suben y vuelven la punta
  for (let k = 0; k < 5; k++) {
    const x = 0.3 + k * 0.1, y = 0.17 + k * 0.03;
    const vuelta = k % 2 ? 1 : -1;
    pon(punta([j(x, y, 0.01), j(x + 0.03, y + 0.1), j(x - 0.015 * vuelta, y + 0.19 + k * 0.02), j(x + 0.045 * vuelta, y + 0.26 + k * 0.03)], 0.026), 0.85);
  }
  // púas pequeñas junto al puente, hacia dentro y abajo (el borde dentado de la referencia)
  for (let k = 0; k < 5; k++) {
    const x = 0.05 + k * 0.03, y = 0.03 - k * 0.006;
    pon(punta([v(x + 0.02, y), v(x - 0.005, y - 0.03), v(x - 0.02, y - 0.06 - (k % 2) * 0.025)], 0.012), 0.7);
  }
  // el arranque del ala en el puente: une el ojo con el centro
  pon(punta([j(0.15, 0.02, 0.005), j(0.09, 0.035), j(0.03, 0.025)], 0.036), 1.1);
  const g = mergeGeometries(piezas)!;
  g.computeVertexNormals();
  return g;
}

/** las dos alas por separado (para batir o separarlas), con el puente en el origen */
export function crearAlas(op: OpcionesAlas = {}) {
  const o = { semilla: 7, grosor: 0.05, ...op };
  const derecha = ala(o);
  const izquierda = derecha.clone().scale(-1, 1, 1);
  // reflejar invierte el sentido de las caras
  const pos = izquierda.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i += 3)
    for (const k of [0, 1, 2]) {
      const a = pos.getComponent(i + 1, k), b = pos.getComponent(i + 2, k);
      pos.setComponent(i + 1, k, b);
      pos.setComponent(i + 2, k, a);
    }
  izquierda.computeVertexNormals();
  for (const g of [derecha, izquierda]) g.computeBoundingSphere();
  return { derecha, izquierda };
}
