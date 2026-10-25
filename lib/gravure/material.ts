import * as THREE from "three";
import { MeshBasicNodeMaterial, type Node } from "three/webgpu";
import {
  Fn, If, Loop, abs, clamp, cos, dot, float, floor, fract, length, max, min, mix, normalView, normalWorld, normalize, positionLocal, positionView, positionWorld, pow,
  sin, vec2, vec3, vec4,
} from "three/tsl";

/*
 * Material de lápiz de `lib/gravure` (docs/32 §1), traducido de chartogne-taillet.com (three r122). No pinta colores:
 * deja en cada píxel tres datos que la composición (`post.ts`) convierte en grabado:
 *   r · la normal de vista en x (de ahí salen los contornos, con Sobel)
 *   g · la fuerza del lápiz: un rayado cuyas líneas engordan con la sombra (bandas de `fract(distancia · subdivisión)`
 *       sumadas a la oscuridad y casi binarizadas con `pow(x, 0,1)`), que se funde con el tono plano a lo lejos
 *   b · la cercanía (1 cerca, 0 a 2,5 m): engorda los contornos de lo cercano
 * Luz de la referencia: dos direccionales blancas, 3,75 desde (−0,96, 1,68, 4,61) y 2,1 desde (2,08, 3,2, −3,23).
 */

export type DireccionTrazo =
  /** anillos alrededor del origen: casi paralelos de cerca (el terreno y las casas de la referencia) */
  | "origen"
  /** bandas horizontales (los árboles: el punto lejano está arriba) */
  | "arriba"
  /** surcos de viña: una dirección distinta en cada parcela (celdas de Voronoi), caminos en blanco entre ellas */
  | "parcelas";

export type OpcionesLapiz = {
  direccion?: DireccionTrazo;
  /** trazos por metro */
  subdivision?: number;
  /** cuánta luz refleja la superficie (el color de vértice de la referencia, 0–1) */
  tono?: number;
  /** desplazamiento y multiplicador de la oscuridad antes de sumarla a las bandas */
  luzDesplazamiento?: number;
  luzMultiplicador?: number;
  /** tope del lápiz (0–1) */
  umbral?: number;
  /** a partir de qué profundidad (m) el rayado se funde con el tono plano, y en cuánto; 0 = rayado siempre */
  fundidoDesde?: number;
  fundidoEn?: number;
  /** parcelas: tamaño de celda (m), ancho de camino (fracción de celda), fracción de prados sin surcos y zona sin surcos (pueblo) */
  parcela?: number;
  camino?: number;
  prados?: number;
  sinSurcos?: { centro: [number, number]; radio: number };
};

/** los ajustes medidos en la referencia para cada tipo de pieza */
export const LAPIZ_TERRENO: OpcionesLapiz = { direccion: "parcelas", subdivision: 70, tono: 0.25, luzDesplazamiento: -0.5, luzMultiplicador: 3, umbral: 0.7, fundidoDesde: 0, fundidoEn: 0 };
export const LAPIZ_ARBOL: OpcionesLapiz = { direccion: "arriba", subdivision: 9, tono: 0.2, luzDesplazamiento: -0.7, luzMultiplicador: 3, umbral: 0.75, fundidoDesde: 0.7, fundidoEn: 1.5 };
export const LAPIZ_CASA: OpcionesLapiz = { direccion: "origen", subdivision: 7, tono: 0.3, luzDesplazamiento: -0.7, luzMultiplicador: 3, umbral: 0.75, fundidoDesde: 0.7, fundidoEn: 1.5 };

const L1 = new THREE.Vector3(-0.9641, 1.6817, 4.609).normalize();
const L2 = new THREE.Vector3(2.0754, 3.2009, -3.2322).normalize();

type V2 = Node<"vec2">;
type V3 = Node<"vec3">;
type F = Node<"float">;
// bucle doble de TSL ({ i, j }): el tipado de Loop solo conoce `i`
type Indices = { i: F; j: F };
const Loop2 = Loop as unknown as (a: { start: number; end: number }, b: { start: number; end: number }, f: (x: Indices) => void) => void;

const hash2 = (p: V2) => fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))).mul(43758.5453));
const hash1 = (p: V2) => fract(sin(dot(p, vec2(12.9898, 78.233))).mul(43758.5453));

/** Voronoi con distancia al borde (Íñigo Quílez): devuelve (azar de la celda, distancia al borde, segundo azar) */
const voronoi = Fn(([p]: [V2]) => {
  const ip = floor(p);
  const fp = fract(p);
  const md = float(8).toVar();
  const mr = vec2(0).toVar();
  const mg = vec2(0).toVar();
  Loop2({ start: -1, end: 2 }, { start: -1, end: 2 }, ({ i, j }) => {
    const g = vec2(float(i), float(j));
    const r = g.add(hash2(ip.add(g))).sub(fp);
    const d = dot(r, r);
    If(d.lessThan(md), () => {
      md.assign(d);
      mr.assign(r);
      mg.assign(g);
    });
  });
  const borde = float(8).toVar();
  Loop2({ start: -2, end: 3 }, { start: -2, end: 3 }, ({ i, j }) => {
    const g = mg.add(vec2(float(i), float(j)));
    const r = g.add(hash2(ip.add(g))).sub(fp);
    const dif = r.sub(mr);
    If(dot(dif, dif).greaterThan(0.00001), () => {
      borde.assign(min(borde, dot(mr.add(r).mul(0.5), normalize(dif))));
    });
  });
  const celda = ip.add(mg);
  return vec3(hash1(celda), borde, hash1(celda.add(17.3)));
});

/** material de lápiz para mallas (también InstancedMesh): ver la cabecera */
export function materialLapiz(op: OpcionesLapiz = {}) {
  const o = { parcela: 0.16, camino: 0.028, prados: 0.22, ...LAPIZ_CASA, ...op } as Required<Omit<OpcionesLapiz, "sinSurcos">> & Pick<OpcionesLapiz, "sinSurcos">;
  const m = new MeshBasicNodeMaterial();
  m.fog = false;
  m.colorNode = Fn(() => {
    const N = normalize(normalWorld);
    const luz = max(dot(N, vec3(L1.x, L1.y, L1.z)), 0).mul(3.75).add(max(dot(N, vec3(L2.x, L2.y, L2.z)), 0).mul(2.1));
    const base = float(1).sub(luz.mul(o.tono));
    const profundidad = positionView.z.negate();
    const fuerte = base.add(o.luzDesplazamiento).mul(o.luzMultiplicador).toVar();

    // las bandas: distancia a un punto lejano (o, en las parcelas, a lo largo de los surcos de cada una)
    const banda = float(0).toVar();
    const papel = float(0).toVar();
    if (o.direccion === "parcelas") {
      const xz = vec2(positionWorld.x, positionWorld.z);
      // parcelas en franjas: la celda se estira 2,6 veces a lo largo de una dirección que cambia despacio por el terreno
      const giro = float(0.5);
      const xr = vec2(xz.x.mul(cos(giro)).sub(xz.y.mul(sin(giro))), xz.x.mul(sin(giro)).add(xz.y.mul(cos(giro))));
      const v = voronoi(xr.div(vec2(o.parcela * 2.6, o.parcela))) as unknown as V3;
      const a = v.x.mul(Math.PI);
      const surco = dot(xz, vec2(cos(a), sin(a))).mul(o.subdivision);
      // prados (sin surcos: el anillo suave del origen) y el pueblo, sin viña
      const sinViña = v.z.lessThan(o.prados).toFloat();
      const pueblo = o.sinSurcos ? clamp(float(1).sub(length(xz.sub(vec2(o.sinSurcos.centro[0], o.sinSurcos.centro[1]))).div(o.sinSurcos.radio)).mul(4), 0, 1) : float(0);
      const anillo = length(positionWorld).mul(o.subdivision);
      banda.assign(abs(fract(mix(surco, anillo, max(sinViña, pueblo))).sub(0.5)).mul(2));
      // los prados y el pueblo, más claros
      fuerte.addAssign(max(sinViña, pueblo).mul(-0.9));
      // caminos: papel entre parcelas, con un trazo a cada lado
      const ancho = float(o.camino);
      papel.assign(v.y.lessThan(ancho).toFloat().mul(float(1).sub(pueblo.mul(0.7))));
      fuerte.addAssign(v.y.sub(ancho).abs().lessThan(0.012).toFloat().mul(1.4).mul(float(1).sub(pueblo)));
    } else {
      // en las coordenadas del modelo, como la referencia (vModelPosition): cada casa y cada árbol lleva sus propias
      // bandas, del mismo número sea cual sea su tamaño en pantalla
      const lejos = o.direccion === "arriba" ? vec3(0, 100, 0) : vec3(0, 0, 0);
      banda.assign(abs(fract(length(positionLocal.sub(lejos)).mul(o.subdivision)).sub(0.5)).mul(2));
    }
    const trazo0 = clamp(banda.add(fuerte), 0, 1);
    const trazo = mix(float(0), float(o.umbral), pow(trazo0, float(0.1)));
    const fundido = o.fundidoEn ? float(1).sub(clamp(profundidad.sub(o.fundidoDesde).div(o.fundidoEn), 0, 1)) : float(1);
    const lapiz = mix(clamp(base, 0, 1), trazo, fundido).mul(float(1).sub(papel));

    const r = normalize(normalView).x.mul(0.5).add(0.5);
    const cerca = float(1).sub(clamp(profundidad.mul(0.4), 0, 1));
    return vec4(r, lapiz, cerca, 1);
  })();
  return m;
}
