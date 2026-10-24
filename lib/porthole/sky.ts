import { DataTexture, FloatType, LinearFilter, RGBAFormat, ClampToEdgeWrapping } from "three";
import type { Node } from "three/webgpu";
import {
  Fn,
  abs,
  asin,
  atan,
  clamp,
  cos,
  dot,
  exp,
  float,
  floor,
  fract,
  fwidth,
  max,
  mix,
  normalize,
  positionWorldDirection,
  pow,
  sin,
  smoothstep,
  step,
  texture,
  time,
  uniform,
  vec2,
  vec3,
} from "three/tsl";

/*
 * Cielo y suelo de un vuelo al alba, como nodo de fondo (scene.backgroundNode), en TSL portable (WebGPU y su reserva
 * WebGL2). Medido en Hublot (darkroom.engineering, docs/28): el color del cielo es una rampa por elevación sobre el
 * horizonte sacada de la captura (mediana por franjas, en lineal), con un resplandor que depende del acimut; el horizonte
 * está a −2,49° (altitud ≈ 6 km) y el avión sube 5° (el horizonte baja hacia delante). Debajo, el suelo: campos oscuros y
 * luces de ciudad prefiltradas por la huella del píxel (una farola reparte su luz en el área que cubre el píxel; cuando el
 * píxel abarca muchas, queda su media), y la bruma del horizonte. Arriba, estrellas por magnitud que titilan.
 */

/** rampa medida con cine:rampa (franjas de 0,15° junto al horizonte, donde está el pico casi blanco): [elevación sobre el horizonte en grados, r, g, b lineales] */
export const RAMPA_ALBA: [number, number, number, number][] = [
  [-20, 0.0002, 0.0003, 0.0003], [-14, 0.0003, 0.00121, 0.00091], [-6, 0.00121, 0.00335, 0.00243], [-3.25, 0.00561, 0.00972, 0.00651],
  [-2.25, 0.01033, 0.01521, 0.01096], [-1.75, 0.01521, 0.01938, 0.01229], [-1.25, 0.02519, 0.02956, 0.01681], [-0.8, 0.0319, 0.03434, 0.01938],
  [-0.53, 0.03689, 0.0382, 0.02217], [-0.38, 0.26225, 0.08438, 0.02519], [-0.22, 0.38643, 0.13843, 0.03071], [-0.07, 0.46208, 0.20508, 0.0382],
  [0.07, 0.57758, 0.29177, 0.04971], [0.22, 0.6105, 0.33245, 0.06848], [0.38, 0.76815, 0.46778, 0.0999], [0.53, 0.83077, 0.57112, 0.14413],
  [0.68, 0.78354, 0.60383, 0.18782], [0.82, 0.84687, 0.68669, 0.24228], [0.98, 0.85499, 0.7454, 0.30499], [1.13, 0.86316, 0.81485, 0.38133],
  [1.27, 0.85499, 0.86316, 0.46208], [1.43, 0.83077, 0.88792, 0.53948], [1.63, 0.78354, 0.89627, 0.63076], [1.88, 0.73046, 0.88792, 0.7454],
  [2.25, 0.62396, 0.8388, 0.89627], [2.75, 0.50289, 0.72306, 0.93011], [3.25, 0.40724, 0.61721, 0.92158], [3.75, 0.34191, 0.54572, 0.9131],
  [4.5, 0.26225, 0.45079, 0.8388], [5.5, 0.14703, 0.2705, 0.55834], [6.5, 0.0865, 0.16827, 0.37124], [7.5, 0.04817, 0.10224, 0.24228],
  [9, 0.01681, 0.04667, 0.12744], [11, 0.00518, 0.02029, 0.05951], [13, 0.00212, 0.01096, 0.0331], [15.5, 0.00121, 0.0075, 0.02519],
  [18.5, 0.00061, 0.00518, 0.0185], [22, 0.0003, 0.00304, 0.01229], [26, 0.0003, 0.00152, 0.00605], [30.5, 0, 0.00061, 0.00152],
  [39, 0.0003, 0.0003, 0],
];

const E0 = -20;
const E1 = 41;
const N = 256;

/** la rampa remuestreada a pasos iguales en una textura de 256 × 1 (interpolación lineal entre medidas) */
export function texturaRampa(rampa = RAMPA_ALBA, ganancia = 1) {
  const data = new Float32Array(N * 4);
  for (let i = 0; i < N; i++) {
    const e = E0 + ((E1 - E0) * i) / (N - 1);
    let k = 0;
    while (k < rampa.length - 2 && rampa[k + 1][0] < e) k++;
    const [ea, ...a] = rampa[k];
    const [eb, ...b] = rampa[k + 1];
    const t = Math.min(1, Math.max(0, (e - ea) / (eb - ea)));
    for (let c = 0; c < 3; c++) data[i * 4 + c] = (a[c] + (b[c] - a[c]) * t) * ganancia;
    data[i * 4 + 3] = 1;
  }
  const tex = new DataTexture(data, N, 1, RGBAFormat, FloatType);
  tex.magFilter = tex.minFilter = LinearFilter;
  tex.wrapS = tex.wrapT = ClampToEdgeWrapping;
  tex.needsUpdate = true;
  return tex;
}

export type CieloOpciones = {
  /** horizonte aparente en grados (−2,49: unos 6 km de altitud) */
  horizonte?: number;
  /** cabeceo del avión en grados: el horizonte baja hacia delante (+x) */
  morro?: number;
  /** acimut del resplandor (el sol bajo el horizonte), en grados desde −z hacia +x, y su anchura */
  sol?: number;
  anchoResplandor?: number;
  /** altitud en km (para proyectar el suelo) */
  altitud?: number;
  /** densidad de las ciudades (0–1) y brillo de las farolas */
  ciudades?: number;
  brilloLuces?: number;
  /** brillo de las estrellas */
  estrellas?: number;
  rampa?: [number, number, number, number][];
};

// los nodos de TSL no tienen un tipo común cómodo: se llevan como el de un vec2 o un vec3 (las funciones de ruido son
// funciones que construyen nodos, en línea en el shader)
type V2 = Node<"vec2">;
type Nodo = Node<"vec3">;

const hash22 = (p: V2) => fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))).mul(43758.5453));

const vnoise = (p: V2) => {
  const i = floor(p);
  const f = fract(p);
  const u = f.mul(f).mul(float(3).sub(f.mul(2)));
  const a = hash22(i).x;
  const b = hash22(i.add(vec2(1, 0))).x;
  const c = hash22(i.add(vec2(0, 1))).x;
  const d = hash22(i.add(vec2(1, 1))).x;
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
};

/** ruido fractal de cuatro octavas (0–1) */
const fbm4 = (p: V2) => {
  const q = vec2(p).toVar();
  const s = float(0).toVar();
  s.addAssign(vnoise(q).mul(0.5));
  q.assign(q.mul(2.03).add(vec2(1.7, 9.2)));
  s.addAssign(vnoise(q).mul(0.25));
  q.assign(q.mul(2.01).add(vec2(8.3, 2.8)));
  s.addAssign(vnoise(q).mul(0.125));
  q.assign(q.mul(2.02).add(vec2(3.1, 7.7)));
  s.addAssign(vnoise(q).mul(0.0625));
  return s.div(0.9375);
};

/** tono de una farola: sodio (naranja) a led (blanco frío) */
const tonoFarola = (u: Node<"float">) => mix(vec3(1.0, 0.55, 0.22), vec3(1.0, 0.86, 0.7), smoothstep(0.55, 0.95, u));

export function cieloAlba(op: CieloOpciones = {}) {
  const horizonte = uniform(op.horizonte ?? -2.49);
  const morro = uniform(((op.morro ?? 5.03) * Math.PI) / 180);
  const sol = uniform(((op.sol ?? 0) * Math.PI) / 180);
  const ancho = uniform(((op.anchoResplandor ?? 27) * Math.PI) / 180);
  const altitud = uniform(op.altitud ?? 6);
  const ciudades = uniform(op.ciudades ?? 0.35);
  const brilloLuces = uniform(op.brilloLuces ?? 1);
  const estrellas = uniform(op.estrellas ?? 1);
  const rampa = texturaRampa(op.rampa);

  // el avión sube: giro del mundo alrededor de z (el horizonte baja hacia +x)
  const alMundo = (d: Nodo) => {
    const cm = cos(morro);
    const sm = sin(morro);
    return vec3(d.x.mul(cm).sub(d.y.mul(sm)), d.y.mul(cm).add(d.x.mul(sm)), d.z);
  };
  // la rampa medida y el resplandor por acimut (meseta ancha alrededor del sol), en una dirección ya girada
  const rampaEn = (dir: Nodo) => {
    const az = atan(dir.x, dir.z.negate());
    const e = asin(clamp(dir.y, -1, 1)).mul(180 / Math.PI).sub(horizonte);
    const base = texture(rampa, vec2(clamp(e.sub(E0).div(E1 - E0), 0, 1), 0.5)).rgb;
    const dAz = abs(atan(sin(az.sub(sol)), cos(az.sub(sol)))).div(ancho);
    // con la rampa fina (franjas de 0,15°) el pico de la banda ya está en la rampa: el resplandor no lo sube
    return base.mul(float(0.08).add(float(0.92).mul(exp(dAz.mul(dAz).mul(dAz).mul(-0.5)))));
  };
  /** el color del cielo (sin estrellas ni luces) en una dirección del mundo: para reflejos (el ala, el cristal) */
  const reflejo = (d: Nodo) => rampaEn(alMundo(normalize(d)));

  const nodo = Fn(() => {
    const dir = alMundo(normalize(positionWorldDirection)).toVar();
    const az = atan(dir.x, dir.z.negate());
    const e = asin(clamp(dir.y, -1, 1)).mul(180 / Math.PI).sub(horizonte);
    const col = rampaEn(dir).toVar();

    // estrellas: celdas de 0,4° en (longitud·cos latitud, latitud); un 3,5 % lleva una, con magnitud y titileo
    const lat = asin(clamp(dir.y, -1, 1));
    const cs = float(0.007);
    const p = vec2(az.mul(cos(lat)), lat).div(cs);
    const c = floor(p);
    const h = hash22(c);
    const h2 = hash22(c.add(vec2(5.1, 3.3)));
    const pixAng = fwidth(p).length().mul(cs).max(1e-4);
    const mag = max(float(6.5).add(float(0.87).mul(h2.y.max(1e-4).log())), -1.5);
    const irr = pow(float(10), mag.mul(-0.4)).mul(2e-9);
    const sp = c.add(0.2).add(h.mul(0.6)).sub(p).mul(cs);
    const s = pixAng.mul(0.8);
    const titila = float(0.93).add(float(0.07).mul(sin(time.mul(float(6).add(h.x.mul(9))).add(h.y.mul(40)))));
    const tinte = mix(vec3(1.0, 0.8, 0.6), vec3(0.75, 0.85, 1.0), h.y);
    const estrella = tinte.mul(irr).mul(titila).div(s.mul(s).mul(Math.PI)).mul(exp(dot(sp, sp).div(s.mul(s)).negate()));
    col.addAssign(estrella.mul(step(h2.x, 0.035)).mul(smoothstep(1.5, 6, e)).mul(estrellas));

    // nubes bajas sobre el horizonte: siluetas oscuras contra el resplandor (jirones alargados en acimut)
    const nubeRuido = fbm4(vec2(az.mul(16), e.mul(1.4)).add(vec2(11.3, 4.1)));
    const banda = smoothstep(-0.2, 0.3, e).mul(smoothstep(2.2, 0.8, e));
    const nube = smoothstep(0.66, 0.76, nubeRuido).mul(banda).mul(0.8);
    col.assign(mix(col, col.mul(0.12).add(vec3(0.004, 0.006, 0.01)), nube));

    // suelo: el rayo contra el plano a `altitud` km; luces de ciudad prefiltradas por la huella del píxel
    const bajo = smoothstep(0.0, -0.4, e);
    const t = altitud.div(max(dir.y.negate(), 1e-4));
    const g = vec2(dir.x, dir.z).mul(t);
    const fw = fwidth(g).max(vec2(1e-5));
    const area = fw.x.mul(fw.y);
    // densidad de población: manchas de ~20 km, más densas en su centro
    const mancha = fbm4(g.div(22)).toVar();
    const pob = smoothstep(float(0.78).sub(ciudades.mul(0.25)), 0.85, mancha);
    const nucleo = smoothstep(0.82, 0.95, mancha);
    const dens = pob.mul(0.35).add(nucleo).add(0.0008);
    // farolas: celdas de 80 m, una por celda con probabilidad = densidad; la gaussiana mide un píxel
    const a = float(0.08);
    const base2 = floor(g.div(a).sub(0.5));
    const luces = vec3(0).toVar();
    for (const [i, j] of [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ]) {
      const cc = base2.add(vec2(i, j));
      const hc = hash22(cc);
      const hc2 = hash22(cc.add(vec2(37.3, 71.9)));
      const lp = cc.add(hc).mul(a);
      const pix = lp.sub(g).div(fw);
      // unas pocas mucho más brillantes (estadios, polígonos, faros): con el bloom quedan como puntos blancos
      const intensidad = float(0.5).add(hc.x).mul(mix(float(1), float(6), step(hc2.y, 0.04))).mul(mix(float(1), float(60), step(hc2.y, 0.004)));
      luces.addAssign(tonoFarola(hc2.y).mul(intensidad).mul(step(hc2.x, dens)).mul(exp(dot(pix, pix).div(0.6).negate())));
    }
    // energía constante: cada farola reparte a²·brillo en el área del píxel; lejos, la media de la celda
    const cerca = luces.mul(a.mul(a)).div(area.mul(Math.PI * 0.6));
    const media = vec3(1.0, 0.63, 0.36).mul(dens).mul(0.9);
    const lucesFiltradas = mix(cerca, media, smoothstep(a.mul(0.6), a.mul(2.5), max(fw.x, fw.y)));
    // la bruma se come las luces hacia el horizonte (extinción con la distancia)
    const extincion = exp(t.div(-140));
    col.addAssign(lucesFiltradas.mul(brilloLuces).mul(0.15).mul(extincion).mul(bajo));
    // el resplandor de las manzanas (fachadas, patios) bajo las farolas: las manchas cálidas de las fotos nocturnas
    col.addAssign(vec3(1.0, 0.62, 0.32).mul(nucleo.mul(0.7).add(pob.mul(0.15))).mul(brilloLuces).mul(0.06).mul(extincion).mul(bajo));

    // agua: ríos (crestas de un ruido) y lagos que reflejan el cielo como un espejo, más con el ángulo rasante
    const crestas = float(1).sub(abs(fbm4(g.div(38)).mul(2).sub(1)));
    const anchoRio = float(0.012).add(fbm4(g.div(70).add(vec2(5, 2))).mul(0.02));
    const aa = max(fw.x, fw.y).div(38).mul(4);
    const rio = smoothstep(float(1).sub(anchoRio).sub(aa), float(1).sub(anchoRio).add(aa), crestas);
    const lago = smoothstep(0.79, 0.81, fbm4(g.div(55).add(vec2(3, 8))));
    const agua = max(rio, lago);
    const espejo = rampaEn(vec3(dir.x, dir.y.negate(), dir.z));
    const fresnelAgua = float(0.02).add(float(0.98).mul(pow(float(1).sub(dir.y.negate()), 5)));
    col.assign(mix(col, espejo.mul(fresnelAgua).mul(0.6), agua.mul(bajo).mul(extincion.mul(0.7).add(0.3))));
    return col;
  })();

  return { nodo, reflejo, uniforms: { horizonte, morro, sol, ancho, altitud, ciudades, brilloLuces, estrellas }, rampa };
}

export { hash22, vnoise, fbm4 };
