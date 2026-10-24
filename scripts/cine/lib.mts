/**
 * Utilidades de `cine:capture`, `cine:analyze` y `cine:compare` (docs/26): la muestra de cada fotograma, el paso de una
 * captura a ficha (`fichaDesdeCaptura`) y la segmentación de la cámara en planos con su movimiento y su curva.
 */
import { fitCurve } from "../../lib/cine/curves";
import type { Ficha, Flotacion, Luz, Material, Movimiento, Oscilacion, Pase, Plano, ToneMapping, Vec3 } from "../../lib/cine/schema";

export type Camara = { type: string; fov: number; focalMM: number | null; zoom: number; near: number; far: number; aspect: number; pos: Vec3; dir: Vec3; quat: number[] | null; up: Vec3 | null };
export type Pasada = { kind: string; cam: string | null; target: string | null; size: number[] | null; name: string | null; mat: string | null; scale?: number | null };
export type Muestra = {
  i: number;
  t: number;
  shot: number | null;
  input: { wheel?: number; step?: number; pointer?: [number, number] };
  frame: number;
  revision: string | null;
  renderer: null | { type: string; backend: string | null; toneMapping: string; exposure: number; outputColorSpace: string; pixelRatio: number; canvas: number[]; shadows: { enabled: boolean; type: string } | null; calls: number | null; triangles: number | null; textures: number | null; geometries: number | null; programs: number | null };
  camera: Camara | null;
  passes: Pasada[];
  rendersPerFrame: number;
  scroll: { y: number; max: number };
  acciones?: { clip: string; t: number; dur: number | null; paused: boolean; peso: number }[];
  /** pose de cada pieza: origen (p), cuaternión del mundo (q) y centro de su caja en el mundo (c, dónde se ve) */
  piezas?: { n: string; p: Vec3; q: number[]; c?: Vec3 | null }[];
  /** color, emisivo y opacidad de cada material con nombre */
  mats?: { n: string; c: string | null; e: string | null; o: number }[];
  /** movimiento de las instancias de cada InstancedMesh respecto a su posición inicial */
  inst?: { i: number; movidas: number; max: number; dir: number[] | null }[];
};
type Inv = {
  counts: Record<string, number>;
  bounds: { min: Vec3; max: Vec3 } | null;
  background: { kind: string; value?: string } | null;
  environment: { kind: string } | null;
  environmentIntensity: number;
  fog: null | { type: string; color: string; near: number; far: number; density: number };
  lights: { type: string; color: string; groundColor: string | null; intensity: number; pos: Vec3; distance?: number; decay?: number; angle?: number; penumbra?: number; castShadow: boolean; shadowMap?: number[]; onCamera?: boolean; local?: Vec3; shadowCam?: number[]; shadowBias?: number[] }[];
  materials: Record<string, unknown> & { type: string; id: string }[];
  post: { pass: string; material: string; params: { name: string; value: unknown }[] }[];
  camaraCadena?: string[];
  clips?: { clip: string; nodos: string[] }[];
};
export type Inventario = { frame: number; t: number; inv: Inv | null };

const sub = (a: number[], b: number[]) => a.map((x, i) => x - b[i]);
const len = (a: number[]) => Math.hypot(...a);
const dot = (a: number[], b: number[]) => a.reduce((s, x, i) => s + x * b[i], 0);
const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  return s.length ? s[Math.floor(s.length / 2)] : 0;
};
const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
const r3 = (v: number[]) => v.map((x) => Math.round(x * 1000) / 1000) as Vec3;

/** centro de la escena (caja de las mallas) o el origen */
export const centro = (inv: Inv | null): Vec3 => (inv?.bounds ? (inv.bounds.min.map((m, i) => (m + inv.bounds!.max[i]) / 2) as Vec3) : [0, 0, 0]);

/** punto mirado: el del rayo de la cámara más cercano al centro de la escena */
/**
 * Alabeo de la cámara en grados: el ángulo que hay que girar sobre el eje de mirada, después de un lookAt con el arriba del
 * mundo (0, 1, 0), para dejar la cámara como estaba (rotateZ de three). Sale del cuaternión capturado.
 */
export function alabeo(c: Camara): number {
  if (!c.quat) return 0;
  const [x, y, z, w] = c.quat;
  // arriba de la cámara en el mundo: el cuaternión aplicado a (0, 1, 0)
  const up = [2 * (x * y - w * z), 1 - 2 * (x * x + z * z), 2 * (y * z + w * x)];
  const f = c.dir;
  let right = [f[1] * 0 - f[2] * 1, f[2] * 0 - f[0] * 0, f[0] * 1 - f[1] * 0];
  const rl = len(right);
  if (rl < 1e-6) return 0;
  right = right.map((v) => v / rl);
  const upNoRoll = [right[1] * f[2] - right[2] * f[1], right[2] * f[0] - right[0] * f[2], right[0] * f[1] - right[1] * f[0]];
  return Math.round(((Math.atan2(-dot(up, right), dot(up, upNoRoll)) * 180) / Math.PI) * 100) / 100;
}

/** alabeo de cada muestra, desenrollado: cada valor a menos de 180° del anterior (un giro continuo no salta de 179 a −179) */
export function alabeos(ms: Muestra[]): Map<number, number> {
  const out = new Map<number, number>();
  let prev: number | null = null;
  for (const m of ms) {
    if (!m.camera) continue;
    let a = alabeo(m.camera);
    if (prev !== null) a += 360 * Math.round((prev - a) / 360);
    out.set(m.i, Math.round(a * 100) / 100);
    prev = a;
  }
  return out;
}

export function mira(c: Camara, centroEscena: Vec3): Vec3 {
  const d = Math.max(0.01, dot(sub(centroEscena, c.pos), c.dir));
  return r3(c.pos.map((p, i) => p + c.dir[i] * d));
}

export type Tramo = {
  desde: number;
  hasta: number;
  i0: number;
  i1: number;
  movimientos: Movimiento[];
  curvas: { curva: string; rmse: number }[];
  meseta: number;
  medidas: { recorrido: number; giroGrados: number; cambioFov: number; cambioDistancia: number; lateral: number; vertical: number };
};

/**
 * Corta la cámara en planos (saltos bruscos de posición o de dirección entre dos fotogramas) y clasifica cada uno:
 * dolly (cambia la distancia al centro), órbita (gira alrededor manteniendo la distancia), travelling lateral o pedestal
 * (se desplaza de lado o en vertical), zoom (cambia el fov), panorámica o inclinación (gira sin moverse) o fijo. La curva
 * sale de ajustar el avance normalizado del tramo a las familias de easing (`fitCurve`).
 */
export function tramos(ms: Muestra[], c0: Vec3, reloj: (m: Muestra) => number): Tramo[] {
  const cams = ms.filter((m) => m.camera);
  if (cams.length < 2) return [];
  const steps = cams.slice(1).map((m, k) => len(sub(m.camera!.pos, cams[k].camera!.pos)));
  const typical = Math.max(1e-4, median(steps.filter((s) => s > 1e-6)));
  const size = Math.max(1, len(c0));
  const cuts = [0];
  cams.slice(1).forEach((m, k) => {
    const a = cams[k].camera!;
    const b = m.camera!;
    const jump = len(sub(b.pos, a.pos));
    const turn = (Math.acos(Math.max(-1, Math.min(1, dot(a.dir, b.dir)))) * 180) / Math.PI;
    if ((jump > typical * 12 && jump > size * 0.05) || turn > 20) cuts.push(k + 1);
  });
  cuts.push(cams.length);

  /*
   * Dentro de cada plano, un tramo por movimiento: se corta cuando la cámara se para (velocidad < 3 % de la máxima del
   * plano durante un cuarto de segundo, que queda como tramo «fijo») y cuando la distancia al centro cambia de sentido
   * (alejarse y luego acercarse son dos movimientos).
   */
  const segs: Muestra[][] = [];
  // un cuarto de segundo en fotogramas de captura (60 Hz): no en unidades del reloj, que con scroll pueden ser diminutas
  const minRest = 15;
  for (let s = 0; s < cuts.length - 1; s++) {
    const seg = cams.slice(cuts[s], cuts[s + 1]);
    if (seg.length < 3) {
      if (seg.length) segs.push(seg);
      continue;
    }
    const speed = seg.map((m, k) => {
      if (!k) return 0;
      const a = seg[k - 1].camera!, b = m.camera!;
      return len(sub(b.pos, a.pos)) / size + Math.abs(b.fov - a.fov) / Math.max(1, a.fov) + Math.acos(Math.max(-1, Math.min(1, dot(a.dir, b.dir))));
    });
    // media móvil de 9 fotogramas: el scroll llega a golpes de rueda y el amortiguado de la página deja pulsos sueltos
    const smooth = speed.map((_, k) => avg(speed.slice(Math.max(0, k - 4), k + 5)));
    const vmax = Math.max(...smooth);
    const still = smooth.map((v) => v < vmax * 0.05);
    const bounds = [0];
    let k = 1;
    while (k < seg.length) {
      // tramo quieto largo: empieza y acaba un corte
      if (still[k]) {
        let e = k;
        while (e < seg.length && still[e]) e++;
        if (e - k >= minRest) {
          if (k > bounds[bounds.length - 1]) bounds.push(k);
          if (e < seg.length) bounds.push(e);
        }
        k = e;
        continue;
      }
      k++;
    }
    bounds.push(seg.length);
    // cambio de sentido de la distancia al centro: se corta en su extremo si a los dos lados cambia al menos un 10 % del
    // recorrido de la distancia en ese tramo (alejarse y luego acercarse son dos movimientos)
    const dist = seg.map((m) => len(sub(c0, m.camera!.pos)));
    for (let b = 0; b < bounds.length - 1; b++) {
      const [i0, i1] = [bounds[b], bounds[b + 1]];
      if (i1 - i0 < minRest * 2) continue;
      const part = dist.slice(i0, i1);
      const span = Math.max(...part) - Math.min(...part);
      if (span < size * 0.01) continue;
      const iMax = i0 + part.indexOf(Math.max(...part));
      const iMin = i0 + part.indexOf(Math.min(...part));
      for (const ext of [iMax, iMin]) {
        if (ext - i0 < minRest || i1 - ext < minRest) continue;
        const before = Math.abs(dist[ext] - dist[i0]);
        const after = Math.abs(dist[ext] - dist[i1 - 1]);
        if (before > span * 0.1 && after > span * 0.1 && !bounds.includes(ext)) {
          bounds.splice(b + 1, 0, ext);
          break;
        }
      }
    }
    for (let b = 0; b < bounds.length - 1; b++) if (bounds[b + 1] > bounds[b]) segs.push(seg.slice(bounds[b], bounds[b + 1]));
  }

  const out: Tramo[] = [];
  for (const seg of segs) {
    if (!seg.length) continue;
    const A = seg[0].camera!;
    const B = seg[seg.length - 1].camera!;
    const dist = (c: Camara) => len(sub(c0, c.pos));
    let recorrido = 0;
    const acum = [0];
    for (let k = 1; k < seg.length; k++) {
      recorrido += len(sub(seg[k].camera!.pos, seg[k - 1].camera!.pos));
      acum.push(recorrido);
    }
    const giro = (Math.acos(Math.max(-1, Math.min(1, dot(A.dir, B.dir)))) * 180) / Math.PI;
    const dFov = B.fov - A.fov;
    const dDist = dist(B) - dist(A);
    const delta = sub(B.pos, A.pos);
    // ejes de la cámara al empezar: derecha = dir × arriba
    const up = A.up ?? [0, 1, 0];
    const right = [A.dir[1] * up[2] - A.dir[2] * up[1], A.dir[2] * up[0] - A.dir[0] * up[2], A.dir[0] * up[1] - A.dir[1] * up[0]];
    const lateral = Math.abs(dot(delta, right)) / Math.max(1e-6, len(right));
    const vertical = Math.abs(delta[1]);
    const eps = size * 0.01;
    const mov: Movimiento[] = [];
    const moved = recorrido > eps;
    if (moved && Math.abs(dDist) > Math.max(eps, recorrido * 0.5)) mov.push("dolly");
    if (moved && Math.abs(dDist) < recorrido * 0.3 && giro > 5) {
      mov.push("orbita");
      // órbita con acercamiento o alejamiento: la distancia cambia más de un 10 %
      if (Math.abs(dDist) > dist(A) * 0.1) mov.push("dolly");
    }
    else {
      if (moved && lateral > Math.max(eps, recorrido * 0.5)) mov.push("truck");
      if (moved && vertical > Math.max(eps, recorrido * 0.5) && !mov.includes("dolly")) mov.push("pedestal");
    }
    if (Math.abs(dFov) > 0.5) mov.push(mov.includes("dolly") && Math.sign(dFov) === Math.sign(dDist) ? "dolly-zoom" : "zoom");
    if (!moved && giro > 2) mov.push(Math.abs(B.dir[1] - A.dir[1]) > Math.abs(B.dir[0] - A.dir[0]) ? "inclinacion" : "panoramica");
    if (!mov.length) mov.push("fijo");

    // avance normalizado: por recorrido, o por giro / fov si la cámara no se desplaza
    const prog = moved
      ? acum.map((x) => x / recorrido)
      : seg.map((m) => {
          const c = m.camera!;
          const g = Math.abs(dFov) > 0.5 ? (c.fov - A.fov) / dFov : giro > 0.5 ? (Math.acos(Math.max(-1, Math.min(1, dot(A.dir, c.dir)))) * 180) / Math.PI / giro : 0;
          return g;
        });
    const t0 = reloj(seg[0]);
    const t1 = reloj(seg[seg.length - 1]);
    const span = Math.max(1e-6, t1 - t0);
    // meseta: lo que queda al final con el avance ya en el 99,5 %
    let endMove = seg.length - 1;
    while (endMove > 0 && prog[endMove - 1] > 0.995) endMove--;
    const meseta = mov[0] === "fijo" ? 0 : Math.max(0, (t1 - reloj(seg[endMove])) / span);
    const tEnd = reloj(seg[endMove]);
    const samples = seg.slice(0, endMove + 1).map((m, k) => ({ t: (reloj(m) - t0) / Math.max(1e-6, tEnd - t0), v: prog[k] }));
    out.push({
      desde: t0,
      hasta: t1,
      i0: seg[0].i,
      i1: seg[seg.length - 1].i,
      movimientos: mov,
      curvas: mov[0] === "fijo" ? [] : fitCurve(samples).slice(0, 4),
      meseta: Math.round(meseta * 1000) / 1000,
      medidas: { recorrido: +recorrido.toFixed(3), giroGrados: +giro.toFixed(2), cambioFov: +dFov.toFixed(2), cambioDistancia: +dDist.toFixed(3), lateral: +lateral.toFixed(3), vertical: +vertical.toFixed(3) },
    });
  }
  // dos tramos fijos seguidos son uno (un pulso suelto de movimiento puede partir una quietud)
  return out.reduce<Tramo[]>((acc, t) => {
    const prev = acc[acc.length - 1];
    if (prev && prev.movimientos[0] === "fijo" && t.movimientos[0] === "fijo") {
      prev.hasta = t.hasta;
      prev.i1 = t.i1;
    } else acc.push(t);
    return acc;
  }, []);
}

const TONE: Record<string, ToneMapping> = { none: "none", linear: "linear", reinhard: "reinhard", cineon: "cineon", aces: "aces", agx: "agx", neutral: "neutral" };
const LUZ: Record<string, Luz["tipo"]> = { AmbientLight: "ambiente", HemisphereLight: "hemisferio", DirectionalLight: "direccional", PointLight: "puntual", SpotLight: "foco", RectAreaLight: "rectangular" };
const MODELO = (type: string): Material["modelo"] =>
  /Physical/.test(type) ? "fisico" : /Standard/.test(type) ? "estandar" : /Basic/.test(type) ? "basico" : /Lambert/.test(type) ? "lambert" : /Toon/.test(type) ? "toon" : /Matcap/.test(type) ? "matcap" : "shader";

/** pases reconocibles por el nombre del cuadrado o de su material (TSL los nombra; EffectComposer, a veces) */
const PASES: [RegExp, Pase["tipo"]][] = [
  [/gtao|ssao|ambient ?occlusion|\bao\b/i, "ao"],
  [/ssr|screen ?space ?refl/i, "ssr"],
  [/bloom/i, "bloom"],
  [/depth ?of ?field|bokeh|\bdof\b/i, "dof"],
  [/motion ?blur/i, "desenfoque-movimiento"],
  [/\blut\b|lut3d/i, "lut"],
  [/chromatic|rgb ?shift/i, "aberracion"],
  [/lens ?flare/i, "destello"],
  [/film|grain|noise/i, "grano"],
  [/vignette/i, "vineta"],
  [/fxaa|smaa|traa|taa/i, "aa"],
];

/** pasadas que no son posprocesado: generación del entorno (PMREM) y copias */
const NO_POST = /pmrem|cubeuv|equirect|cubemap|render ?pipeline|output|copy/i;
/** pasadas auxiliares de otro efecto (el desenfoque de un DOF o el de limpiar un volumétrico) */
const AUXILIAR = /gaussian|kawase|blur|downsample|upsample|mip/i;

export function pasesDesde(passes: Pasada[], post: Inv["post"]): { pases: Pase[]; sinIdentificar: string[]; auxiliares: string[]; entornoGenerado: boolean } {
  const tipos: Pase["tipo"][] = [];
  const sinIdentificar: string[] = [];
  const auxiliares: string[] = [];
  let entornoGenerado = false;
  for (const p of passes) {
    if (p.kind === "scene") continue;
    const label = `${p.name ?? ""} ${p.mat ?? ""}`.trim();
    if (/pmrem|cubeuv|equirect|cubemap/i.test(label)) entornoGenerado = true;
    const hit = PASES.find(([re]) => re.test(label));
    if (hit) {
      if (!tipos.includes(hit[1])) tipos.push(hit[1]);
    } else if (!label || NO_POST.test(label)) continue;
    else if (AUXILIAR.test(label)) auxiliares.push(label);
    else sinIdentificar.push(label);
  }
  const param = (name: string) => {
    for (const p of post) {
      const x = p.params.find((q) => q.name === name && typeof q.value === "number");
      if (x) return x.value as number;
    }
    return undefined;
  };
  const pases: Pase[] = tipos.map((tipo): Pase => {
    if (tipo === "bloom") return { tipo, fuerza: param("strength") ?? NaN, radio: param("radius") ?? NaN, umbral: param("threshold") ?? NaN };
    if (tipo === "dof") return { tipo, foco: param("focusDistance") ?? NaN, focal: param("focalLength") ?? NaN, bokeh: param("bokehScale") ?? NaN };
    if (tipo === "aberracion") return { tipo, fuerza: param("strength") ?? NaN };
    if (tipo === "grano") return { tipo, intensidad: param("intensity") ?? NaN };
    if (tipo === "vineta") return { tipo, fuerza: NaN, suavidad: NaN };
    if (tipo === "aa") {
      const l = passes.map((p) => `${p.name} ${p.mat}`).join(" ").toLowerCase();
      return { tipo, metodo: l.includes("smaa") ? "smaa" : l.includes("traa") || l.includes("taa") ? "traa" : "fxaa" };
    }
    if (tipo === "ao") return { tipo, metodo: "gtao", radio: param("radius") ?? NaN, intensidad: NaN };
    if (tipo === "lut") return { tipo, src: "?", intensidad: param("intensity") ?? NaN };
    if (tipo === "ssr") return { tipo, intensidad: NaN };
    if (tipo === "desenfoque-movimiento") return { tipo, fuerza: NaN };
    return { tipo: "destello" };
  });
  return { pases, sinIdentificar: [...new Set(sinIdentificar)], auxiliares: [...new Set(auxiliares)], entornoGenerado };
}

/**
 * Firmas en el código de los shaders capturados: la segunda vía para reconocer técnicas cuando las pasadas no tienen
 * nombre (EffectComposer de pmndrs, motores propios). Cada firma cuenta en cuántos shaders aparece; es un indicio, no una
 * prueba (docs/26 §3): se confirma mirando el vídeo.
 */
export const FIRMAS: [string, RegExp][] = [
  ["bloom", /bloom|luminosityhighpass|luminance(?:threshold|material)|kawase/i],
  ["dof", /bokeh|circleofconfusion|\bcoc\b|depthoffield/i],
  ["viñeta", /vignette/i],
  // también la lleva el material de transmisión de drei (separa canales al refractar): mirar en qué shader aparece
  ["aberración cromática (post o material)", /chromatic|aberration|rgbshift/i],
  ["grano", /\bgrain\b|filmgrain|film_noise|noiseintensity/i],
  ["aa (fxaa/smaa)", /fxaa|smaa/i],
  // N8AO no se nombra en sus shaders: se reconoce por la oclusión muestreada con ruido azul
  ["ao (ssao/gtao/n8ao)", /ssao|gtao|n8ao|\bao(?:pass|node)\b|aoradius|bluenoise[\s\S]{0,6000}occlusion|occlusion[\s\S]{0,6000}bluenoise/i],
  ["ssr", /\bssr\b|screenspacereflection/i],
  // sin firmas de tone mapping: three define todas sus funciones en cada shader; el que se usa lo mide el gancho
  ["transmisión / refracción", /transmission|refract/i],
  ["iridiscencia", /iridescence/i],
  ["sheen", /\bsheen/i],
  ["clearcoat", /clearcoat/i],
  ["raymarching / volumen", /raymarch|volumenode|marchsteps/i],
  ["ruido procedural (fbm/simplex/perlin)", /fbm|simplex|perlin|snoise|cnoise/i],
  ["fresnel", /fresnel/i],
  ["sombras", /shadowmap|getshadow/i],
  ["niebla", /\bfog/i],
  ["instancias", /instancematrix|instance_?id|instanceindex/i],
  ["esqueleto", /skinning|bonematrix|bonemat/i],
  ["morph targets", /morphtarget/i],
  ["SDF / MSDF (texto)", /msdf|\bsdf\b/i],
  ["dither", /dither/i],
  ["partículas (puntos)", /gl_pointsize|pointsize/i],
  ["cáusticas", /caustic/i],
];

/**
 * GLSL sin los bloques inactivos: three manda el shader antes del preprocesador, con todos los #ifdef de sus trozos
 * (USE_TRANSMISSION, USE_IRIDESCENCE…) aunque no se usen. Se resuelven #define, #ifdef, #ifndef, #if defined(X), #else y
 * #endif; un #if con otra expresión se da por activo. WGSL no tiene preprocesador y pasa tal cual.
 */
export function glslActivo(code: string): string {
  const defs = new Set<string>();
  const stack: boolean[] = [];
  const out: string[] = [];
  const activo = () => stack.every(Boolean);
  for (const line of code.split("\n")) {
    const t = line.trim();
    let m: RegExpExecArray | null;
    if ((m = /^#\s*ifdef\s+(\w+)/.exec(t))) stack.push(defs.has(m[1]));
    else if ((m = /^#\s*ifndef\s+(\w+)/.exec(t))) stack.push(!defs.has(m[1]));
    else if ((m = /^#\s*if\s+!?\s*defined\s*\(?\s*(\w+)\s*\)?\s*$/.exec(t))) stack.push(t.includes("!") ? !defs.has(m[1]) : defs.has(m[1]));
    else if (/^#\s*if\b/.test(t)) stack.push(true);
    else if (/^#\s*elif\b/.test(t)) stack[stack.length - 1] = !stack[stack.length - 1];
    else if (/^#\s*else\b/.test(t)) stack[stack.length - 1] = !stack[stack.length - 1];
    else if (/^#\s*endif\b/.test(t)) stack.pop();
    else if (activo()) {
      if ((m = /^#\s*define\s+(\w+)/.exec(t))) defs.add(m[1]);
      else if ((m = /^#\s*undef\s+(\w+)/.exec(t))) defs.delete(m[1]);
      out.push(line);
    }
  }
  return out.join("\n");
}

export function firmas(shaders: { code: string; lang?: string }[]): Record<string, number> {
  const codes = shaders.map((x) => (x.lang === "wgsl" ? x.code : glslActivo(x.code)));
  const out: Record<string, number> = {};
  for (const [nombre, re] of FIRMAS) {
    const n = codes.filter((c) => re.test(c)).length;
    if (n) out[nombre] = n;
  }
  return out;
}

/**
 * Firmas en el JavaScript publicado: los nombres de clases y componentes sobreviven al minificado (son exportaciones y
 * cadenas). Es la tercera vía (docs/26 §3), y la única con webs que no usan three o lo ocultan. Indicio, no prueba: un
 * bundle puede traer código que no se usa.
 */
export const FIRMAS_JS: [string, RegExp][] = [
  // posprocesado (pmndrs postprocessing / @react-three/postprocessing, three EffectComposer)
  ["post · N8AO", /\bN8AO\b/],
  ["post · Bloom", /\bBloomEffect\b|\bUnrealBloomPass\b|SelectiveBloom/],
  ["post · DepthOfField", /DepthOfFieldEffect|BokehPass|\bBokehEffect\b/],
  ["post · ChromaticAberration", /ChromaticAberrationEffect/],
  ["post · Vignette", /VignetteEffect/],
  ["post · Noise / grano", /\bNoiseEffect\b|FilmPass/],
  ["post · SMAA", /SMAAEffect|SMAAPass/],
  ["post · ToneMapping", /ToneMappingEffect/],
  ["post · SSR", /\bSSREffect\b|SSRPass/],
  ["post · LUT", /LUT3DEffect|LUTPass/],
  ["post · GodRays", /GodRaysEffect/],
  ["post · EffectComposer", /\bEffectComposer\b/],
  // drei y materiales
  ["drei · Environment / Lightformer", /\bLightformer\b/],
  ["drei · MeshTransmissionMaterial", /MeshTransmissionMaterial/],
  ["drei · MeshReflectorMaterial", /MeshReflectorMaterial/],
  ["drei · ContactShadows", /ContactShadows/],
  ["drei · AccumulativeShadows", /AccumulativeShadows/],
  ["drei · ScrollControls", /ScrollControls/],
  ["drei · CameraControls", /\bCameraControls\b/],
  ["drei · Float", /\bFloat\b.*floatIntensity|floatIntensity/],
  ["drei · Text (troika)", /troika/i],
  ["drei · Caustics", /\bCaustics\b/],
  // motores y librerías
  ["física · Rapier", /rapier/i],
  ["física · cannon", /cannon(?:-es)?\b/i],
  ["animación · GSAP", /\bgsap\b|GreenSock/],
  ["animación · ScrollTrigger", /ScrollTrigger/],
  ["animación · Theatre.js", /@theatre|theatrejs/i],
  ["animación · framer-motion / motion", /framer-motion|motion\.dev/],
  ["scroll · Lenis", /\blenis\b/i],
  ["three · WebGPURenderer", /WebGPURenderer/],
  // propiedades que solo existen en los materiales de nodos (el nombre «NodeMaterial» viaja en bundles que no lo usan)
  ["three · TSL", /\.(?:colorNode|positionNode|outputNode|fragmentNode)\s*=/],
  ["three · three-mesh-bvh", /MeshBVH|acceleratedRaycast/],
  ["three · KTX2 / Basis", /KTX2Loader|basis_transcoder/],
  ["three · Draco", /DRACOLoader|draco_decoder/],
  ["three · meshopt", /MeshoptDecoder/],
  ["audio · Howler", /\bHowler\b/],
];

export function firmasJs(code: string): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [nombre, re] of FIRMAS_JS) {
    const g = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
    const n = (code.match(g) || []).length;
    if (n) out[nombre] = n;
  }
  return out;
}

/**
 * Ficha a partir de lo medido. Todo lo que rellena lleva `origen: "medido"`; lo que no se puede medir (el contenido de la
 * escena, la rúbrica, los principios del movimiento) queda vacío para completarlo mirando el vídeo (`cine:analyze`).
 */
export function fichaDesdeCaptura(meta: { url: string; slug: string; fecha: string; drive: string; size: number[] }, ms: Muestra[], invs: Inventario[], shaders: { code: string; lang?: string; label?: string | null }[] = [], js = "") {
  const first = ms.find((m) => m.renderer) ?? ms[0];
  const inv = invs.find((x) => x.inv)?.inv ?? null;
  // estado asentado: el último inventario (los materiales pueden cambiar al empezar: resaltados, fundidos)
  const invFinal = [...invs].reverse().find((x) => x.inv)?.inv ?? inv;
  const transiciones = transicionesMateriales(ms);
  const c0 = centro(inv);
  const scroll = meta.drive === "scroll";
  /*
   * Reloj del scroll: el de la ventana si se desplaza; si no (drei ScrollControls, Lenis sobre un contenedor, scroll
   * virtual), la rueda acumulada hasta la saturación (el último golpe que aún movía algo: la página tiene su propio
   * recorrido y a partir de ahí no responde), de 0 a 1. Es lo que el visitante ha pedido, aunque la página lo suavice.
   */
  const windowScrolls = ms.some((m) => m.scroll.max > 0 && m.scroll.y > 0);
  const totalWheel = (scroll && !windowScrolls ? saturacionRueda(ms) : 0) || ms.reduce((acc, m) => acc + (m.input.wheel ?? 0), 0) || 1;
  const wheelAt = new Map<number, number>();
  let rueda = 0;
  for (const m of ms) {
    rueda += m.input.wheel ?? 0;
    wheelAt.set(m.i, rueda);
  }
  const crudo = (m: Muestra) => (!scroll ? m.t : windowScrolls ? (m.scroll.max > 0 ? m.scroll.y / m.scroll.max : 0) : Math.min(1, (wheelAt.get(m.i) ?? 0) / totalWheel));
  const suavizado = scroll ? amortiguado(ms) : null;
  // con amortiguado, el reloj es el scroll suavizado igual que lo suaviza la página: s += (objetivo − s)·(1 − r)
  const suave = new Map<number, number>();
  if (suavizado) {
    let s = 0;
    for (const m of ms) {
      s += (crudo(m) - s) * (1 - suavizado);
      suave.set(m.i, s);
    }
  }
  const reloj = (m: Muestra) => (suavizado ? (suave.get(m.i) ?? 0) : crudo(m));
  const tr = tramos(ms, c0, reloj);
  const camOf = (i: number) => ms.find((m) => m.i === i)?.camera ?? first.camera;
  const rolls = alabeos(ms);
  const rollDe = (c: Camara) => rolls.get(ms.find((m) => m.camera === c)?.i ?? -1) ?? alabeo(c);
  /** puntos de paso de un tramo: 6 por dentro, a distancias recorridas iguales (lo que el banco recorre con getPointAt) */
  const ruta = (i0: number, i1: number) => {
    const cams = ms.filter((m) => m.i >= i0 && m.i <= i1 && m.camera).map((m) => m.camera!);
    const acc = [0];
    for (let k = 1; k < cams.length; k++) acc.push(acc[k - 1] + len(sub(cams[k].pos, cams[k - 1].pos)));
    const tot = acc[acc.length - 1];
    if (cams.length < 8 || tot < 1e-4) return null;
    const pick = (f: number) => cams[Math.max(0, acc.findIndex((x) => x >= f * tot))];
    const puntos = [1, 2, 3, 4, 5, 6].map((j) => pick(j / 7));
    return { ruta: puntos.map((c) => r3(c.pos)), rutaMira: puntos.map((c) => mira(c, c0)), rutaAlabeo: puntos.map(rollDe) };
  };
  const planos: Plano[] = tr.map((x, k) => {
    const a = camOf(x.i0)!;
    const b = camOf(x.i1)!;
    const camino = x.movimientos[0] === "fijo" ? null : ruta(x.i0, x.i1);
    return {
      id: `p${k + 1}`,
      desde: +x.desde.toFixed(4),
      hasta: +x.hasta.toFixed(4),
      movimientos: x.movimientos,
      camara: { desde: { pos: a.pos, mira: mira(a, c0), fov: a.fov, alabeo: rollDe(a) || undefined }, hasta: { pos: b.pos, mira: mira(b, c0), fov: b.fov, alabeo: rollDe(b) || undefined }, curva: x.curvas[0]?.curva ?? "linear", meseta: x.meseta || undefined, ...(camino ?? {}) },
    };
  });
  const r = first.renderer;
  const calls = ms.map((m) => m.renderer?.calls ?? 0).filter(Boolean);
  const tris = ms.map((m) => m.renderer?.triangles ?? 0).filter(Boolean);
  const { pases, sinIdentificar, auxiliares, entornoGenerado } = pasesDesde(first.passes.length ? first.passes : (ms.find((m) => m.passes.length)?.passes ?? []), inv?.post ?? []);
  const bg = inv?.background;
  const ficha: Ficha = {
    id: meta.slug,
    titulo: meta.url,
    fuente: { url: meta.url, fecha: meta.fecha.slice(0, 10) },
    reloj: scroll ? "scroll" : "tiempo",
    suavizado: suavizado ?? undefined,
    duracion: scroll ? Math.round(((windowScrolls ? (ms[ms.length - 1]?.scroll.max ?? 0) : totalWheel) / meta.size[1]) * 10) / 10 : +(ms[ms.length - 1]?.t ?? 0).toFixed(2),
    aspecto: +(meta.size[0] / meta.size[1]).toFixed(4),
    render: {
      renderer: r?.backend === "webgpu" ? "webgpu" : "webgl2",
      toneMapping: TONE[r?.toneMapping ?? "none"] ?? "none",
      exposicion: r?.exposure ?? 1,
      colorSpace: r?.outputColorSpace === "srgb" ? "srgb" : r?.outputColorSpace === "display-p3" ? "display-p3" : "linear",
      dprMax: r?.pixelRatio ?? 1,
      sombras: !r?.shadows?.enabled ? "ninguna" : r.shadows.type === "vsm" ? "vsm" : r.shadows.type === "pcf-soft" ? "pcf-soft" : "pcf",
    },
    camara: { near: first.camera?.near ?? 0.1, far: first.camera?.far ?? 100, planos, deModelo: camaraDeModelo(inv) },
    luz: {
      entorno: !inv?.environment ? { tipo: "ninguno" } : { tipo: "hdri", src: "?", intensidad: inv.environmentIntensity ?? 1, fondo: inv.background?.kind === inv.environment.kind },
      luces: (inv?.lights ?? []).map((l) => ({ tipo: LUZ[l.type] ?? "puntual", color: l.color, suelo: l.groundColor ?? undefined, intensidad: l.intensity, pos: l.onCamera ? l.local : l.pos, deCamara: l.onCamera || undefined, distancia: l.distance || undefined, decaimiento: l.decay, angulo: l.angle, penumbra: l.penumbra, sombra: l.castShadow && l.shadowMap ? { mapa: l.shadowMap[0], sesgo: l.shadowBias?.[0] || undefined, sesgoNormal: l.shadowBias?.[1] || undefined, radio: l.shadowBias?.[2] !== 1 ? l.shadowBias?.[2] : undefined, caja: l.shadowCam?.length === 6 ? (l.shadowCam as [number, number, number, number, number, number]) : undefined } : undefined })),
    },
    materiales: ((invFinal?.materials ?? []) as unknown as Record<string, unknown>[]).slice(0, 16).map((m) => ({
      id: String(m.name ?? m.id),
      modelo: MODELO(String(m.type)),
      color: m.color as string | undefined,
      rugosidad: m.roughness as number | undefined,
      metalico: m.metalness as number | undefined,
      emisivo: m.emissive as string | undefined,
      intensidadEmisiva: m.emissiveIntensity as number | undefined,
      transmision: m.transmission as number | undefined,
      grosor: m.thickness as number | undefined,
      ior: m.ior as number | undefined,
      dispersion: m.dispersion as number | undefined,
      barniz: m.clearcoat as number | undefined,
      brillo: m.sheen as number | undefined,
      iridiscencia: m.iridescence as number | undefined,
      opacidad: m.opacity as number | undefined,
      intensidadEntorno: m.envMapIntensity as number | undefined,
      transicion: transiciones.get(String(m.name)),
    })),
    atmosfera: {
      niebla: inv?.fog ? (inv.fog.type === "exp2" ? { tipo: "exp2", color: inv.fog.color, densidad: inv.fog.density } : { tipo: "lineal", color: inv.fog.color, near: inv.fog.near, far: inv.fog.far }) : undefined,
      fondo: bg?.kind === "color" ? bg.value : undefined,
      efectos: volumetrico(inv, first.passes),
    },
    post: pases,
    escena: [],
    presupuesto: { drawCalls: median(calls), triangulos: median(tris), texturas: r?.textures ?? undefined, pasadasPorFotograma: first.passes.length, dprMax: r?.pixelRatio },
    origen: { render: "medido", camara: "medido", luz: "medido", materiales: "medido", atmosfera: "medido", post: "medido", presupuesto: "medido" },
  };
  return {
    ficha,
    medidas: {
      revision: first.revision,
      renderer: r,
      centroEscena: c0,
      caja: inv?.bounds ?? null,
      objetos: inv?.counts ?? {},
      tramos: tr,
      paseSinIdentificar: sinIdentificar,
      pasesAuxiliares: auxiliares,
      entornoGenerado,
      firmasShaders: firmas(shaders),
      // las etiquetas que la página pone a sus shaders (WebGPU: createShaderModule({ label })): a menudo dicen la técnica
      etiquetasShaders: [...new Set(shaders.map((s) => s.label).filter((x): x is string => !!x).map((x) => x.replace(/^(vertex|fragment|compute)_/, "")))].slice(0, 60),
      sinEscena: !ms.some((m) => m.renderer),
      firmasCodigo: firmasJs(js),
      relojScroll: scroll ? (windowScrolls ? "ventana" : "rueda") : null,
      animaciones: animaciones(ms, reloj),
      flotacion: flotaciones(ms),
      suavizado,
      // el reloj de la ficha en cada muestra (con saturación y amortiguado ya aplicados): lo usa cine:compare
      reloj: ms.map((m) => +reloj(m).toFixed(5)),
      pasadasEscena: first.passes.filter((p) => p.kind === "scene").map((p) => ({ escala: p.scale ?? null, size: p.size })),
      paramsPost: inv?.post ?? [],
      fovRango: [Math.min(...ms.map((m) => m.camera?.fov ?? Infinity)), Math.max(...ms.map((m) => m.camera?.fov ?? -Infinity))],
      focalMM: first.camera?.focalMM ?? null,
    },
  };
}

/** volumétrico: un material de volumen (VolumeNodeMaterial) o una pasada de escena a menos resolución que el lienzo */
function volumetrico(inv: Inv | null, passes: Pasada[]): NonNullable<Ficha["atmosfera"]["efectos"]> | undefined {
  const mats = ((inv?.materials ?? []) as unknown as Record<string, unknown>[]).filter((m) => /volume/i.test(String(m.type)));
  if (!mats.length) return undefined;
  const aspect = passes.find((p) => p.kind === "scene" && p.scale === 1)?.size;
  const mismaProporcion = (p: Pasada) => !aspect || !p.size || Math.abs(p.size[0] / p.size[1] - aspect[0] / aspect[1]) < 0.05;
  // la pasada a menos resolución con la proporción del lienzo (las cuadradas suelen ser mapas de sombras)
  const reducida = passes.find((p) => p.kind === "scene" && p.scale && p.scale < 0.9 && mismaProporcion(p));
  const pasos = mats.map((m) => m.steps).find((x) => typeof x === "number");
  return [{ tipo: "volumetrico", nota: `${mats[0].type}${pasos ? `, ${pasos} pasos de raymarching` : ""}${reducida ? `, pintado a ${reducida.scale} de resolución` : ""}` }];
}

/**
 * Amortiguado del scroll: tras el último golpe de rueda la cámara sigue y frena de forma exponencial (v[k+1] ≈ r·v[k]).
 * La mediana de esos cocientes, mientras la velocidad es clara (> 2 % de la máxima), es r por fotograma. Sin cola de
 * frenada clara (la cámara se para en seco), null.
 */
export function amortiguado(ms: Muestra[]): number | null {
  if (!ms.some((m) => m.input.wheel)) return null;
  const sp = ms.map((m, k) => (k && m.camera && ms[k - 1].camera ? len(sub(m.camera.pos, ms[k - 1].camera!.pos)) : 0));
  const vmax = Math.max(...sp);
  if (vmax <= 0) return null;
  // la frenada empieza tras la última subida de velocidad (el último golpe que surtió efecto, sea de ventana o de rueda)
  let last = -1;
  for (let k = 1; k < sp.length; k++) if (sp[k] > sp[k - 1] * 1.02 && sp[k] > vmax * 0.02) last = k;
  if (last < 0) return null;
  const ratios: number[] = [];
  for (let k = last + 1; k < ms.length - 1; k++) if (sp[k] > vmax * 0.02 && sp[k + 1] > 0) ratios.push(sp[k + 1] / sp[k]);
  if (ratios.length < 5) return null;
  const r = median(ratios);
  return r > 0.3 && r < 0.995 ? Math.round(r * 1000) / 1000 : null;
}

/**
 * Animaciones de la escena (clips de un GLB): para cada una, si su tiempo sigue al reloj de la ficha (segundos o scroll)
 * y con qué rango. Una recta t = a·reloj + b ajustada a sus muestras; r² > 0,98 = la mueve el reloj. Con scroll, el
 * tiempo del clip en el progreso 0 y en el 1 es lo que necesita el banco (`animacionReloj`).
 */
export function animaciones(ms: Muestra[], reloj: (m: Muestra) => number) {
  const clips = new Map<string, { x: number; y: number }[]>();
  for (const m of ms)
    for (const a of m.acciones ?? []) {
      if (!a.clip || a.peso <= 0) continue;
      if (!clips.has(a.clip)) clips.set(a.clip, []);
      clips.get(a.clip)!.push({ x: reloj(m), y: a.t });
    }
  return [...clips].map(([clip, pts]) => {
    const n = pts.length;
    const mx = avg(pts.map((p) => p.x)), my = avg(pts.map((p) => p.y));
    const sxx = pts.reduce((s, p) => s + (p.x - mx) ** 2, 0), sxy = pts.reduce((s, p) => s + (p.x - mx) * (p.y - my), 0), syy = pts.reduce((s, p) => s + (p.y - my) ** 2, 0);
    const a = sxx > 1e-12 ? sxy / sxx : 0;
    const b = my - a * mx;
    const r2 = sxx > 1e-12 && syy > 1e-12 ? (sxy * sxy) / (sxx * syy) : 0;
    const rango = Math.max(...pts.map((p) => p.y)) - Math.min(...pts.map((p) => p.y));
    const mueve = rango < 1e-3 ? "quieta" : r2 > 0.98 ? "reloj" : "otra";
    return { clip, muestras: n, mueve, r2: +r2.toFixed(4), desde: +(b).toFixed(4), hasta: +(a + b).toFixed(4), rango: +rango.toFixed(4) };
  });
}

/**
 * Saturación de la rueda: la rueda acumulada hasta el último golpe que todavía acelera algo (la cámara o una animación).
 * Después de ese golpe la página ya no responde: su recorrido de scroll ha terminado. 0 si no se puede saber.
 */
export function saturacionRueda(ms: Muestra[]): number {
  const act = ms.map((m, k) => {
    if (!k) return 0;
    const p = ms[k - 1];
    const cam = m.camera && p.camera ? len(sub(m.camera.pos, p.camera.pos)) + Math.acos(Math.max(-1, Math.min(1, dot(m.camera.dir, p.camera.dir)))) : 0;
    const clip = (m.acciones ?? []).reduce((s, a, j) => s + Math.abs(a.t - (p.acciones?.[j]?.t ?? a.t)), 0);
    return cam + clip;
  });
  const max = Math.max(...act) || 1;
  const golpes = ms.map((m, k) => (m.input.wheel ? k : -1)).filter((k) => k >= 0);
  /*
   * Mientras la página responde, la actividad media tras cada golpe se mantiene (o sube) respecto a la de antes; saturada,
   * solo frena (con amortiguado 0,95 y 6 fotogramas entre golpes, el cociente cae a ≈ 0,74). La saturación es el último
   * golpe activo antes de tres inactivos seguidos.
   */
  const ventana = (a: number, b: number) => avg(act.slice(Math.max(0, a), Math.max(a + 1, b)));
  const acum: number[] = [];
  const activo: boolean[] = [];
  let acc = 0;
  golpes.forEach((k, g) => {
    acc += ms[k].input.wheel ?? 0;
    acum.push(acc);
    const paso = (g + 1 < golpes.length ? golpes[g + 1] : k + 6) - k;
    const antes = ventana(k - paso, k);
    const despues = ventana(k + 1, k + 1 + paso);
    activo.push(despues > max * 0.02 && despues >= antes * 0.9);
  });
  for (let g = 0; g < golpes.length; g++) {
    if (!activo[g]) continue;
    if (activo.slice(g + 1, g + 4).length === 3 && activo.slice(g + 1, g + 4).every((x) => !x)) return acum[g];
  }
  return 0;
}

/** ajuste c + a·sen(ωt) + b·cos(ωt) por mínimos cuadrados; devuelve amplitud, fase y r² */
function senoide(ts: number[], ys: number[], w: number) {
  // ecuaciones normales 3×3 (resueltas con Cramer: es pequeño)
  let n = 0, s = 0, c = 0, ss = 0, cc = 0, sc = 0, y = 0, ys_ = 0, yc = 0;
  ts.forEach((t, i) => {
    const si = Math.sin(w * t), ci = Math.cos(w * t), yi = ys[i];
    n++; s += si; c += ci; ss += si * si; cc += ci * ci; sc += si * ci; y += yi; ys_ += yi * si; yc += yi * ci;
  });
  const M = [[n, s, c], [s, ss, sc], [c, sc, cc]];
  const v = [y, ys_, yc];
  const det = (m: number[][]) => m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
  const D = det(M);
  if (Math.abs(D) < 1e-12) return { c0: avg(ys), amp: 0, fase: 0, r2: 0 };
  const col = (k: number) => M.map((row, i) => row.map((x, j) => (j === k ? v[i] : x)));
  const [c0, a, b] = [0, 1, 2].map((k) => det(col(k)) / D);
  const mean = avg(ys);
  const sst = ys.reduce((acc, yi) => acc + (yi - mean) ** 2, 0);
  const sse = ts.reduce((acc, t, i) => acc + (ys[i] - (c0 + a * Math.sin(w * t) + b * Math.cos(w * t))) ** 2, 0);
  // a·sen + b·cos = amp·sen(ωt + fase)
  return { c0, amp: Math.hypot(a, b), fase: Math.atan2(b, a), r2: sst > 1e-12 ? 1 - sse / sst : 0 };
}

/**
 * Flotación de las piezas (docs/26 §4): la pose de cada malla con nombre, por fotograma, se ajusta a una senoide con un
 * periodo común (de 1 s a 1,5 veces lo capturado; gana el que mejor explica la altura de todas las piezas). Una pieza flota si su
 * altura oscila con r² > 0,9 y amplitud clara. El pivote es la posición media de la pieza (el origen de la malla). El giro
 * sale del cuaternión del mundo como vector de ángulo pequeño (2·q.xyz). Con piezas que también mueve una animación, el
 * ajuste lo pierde: entonces no se declara flotación.
 */
export function flotaciones(ms: Muestra[]): Flotacion[] {
  const series = new Map<string, { t: number[]; p: Vec3[]; r: number[][] }>();
  for (const m of ms)
    for (const pz of m.piezas ?? []) {
      if (!series.has(pz.n)) series.set(pz.n, { t: [], p: [], r: [] });
      const s = series.get(pz.n)!;
      const sg = pz.q[3] < 0 ? -1 : 1;
      s.t.push(m.t);
      s.p.push(pz.p);
      s.r.push([2 * sg * pz.q[0], 2 * sg * pz.q[1], 2 * sg * pz.q[2]]);
    }
  const piezas = [...series].filter(([, s]) => s.t.length > 60);
  if (!piezas.length) return [];
  const dur = ms[ms.length - 1].t - ms[0].t;
  // periodo común: el que mejor explica la altura de todas (suma de r²), sin pasar de 1,5 veces lo capturado (con menos de
  // dos tercios de ciclo, un periodo larguísimo encaja cualquier trozo de curva)
  let mejor = { periodo: 0, score: -Infinity };
  for (let periodo = 1; periodo <= Math.min(40, dur * 1.5); periodo += 0.05) {
    const w = (2 * Math.PI) / periodo;
    let score = 0;
    for (const [, s] of piezas) {
      const ys = s.p.map((p) => p[1]);
      const f = senoide(s.t, ys, w);
      score += f.r2;
    }
    if (score > mejor.score) mejor = { periodo, score };
  }
  const w = (2 * Math.PI) / mejor.periodo;
  const out: Flotacion[] = [];
  for (const [n, s] of piezas) {
    const fy = senoide(s.t, s.p.map((p) => p[1]), w);
    if (fy.r2 < 0.9 || fy.amp < 1e-3) continue;
    const giro = [0, 1, 2].map((k) => {
      const f = senoide(s.t, s.r.map((r) => r[k]), w);
      return { amp: +f.amp.toFixed(5), fase: +f.fase.toFixed(4) };
    }) as [Oscilacion, Oscilacion, Oscilacion];
    const pm = [0, 1, 2].map((k) => avg(s.p.map((p) => p[k])));
    out.push({ pieza: n, pivote: [+pm[0].toFixed(4), +fy.c0.toFixed(4), +pm[2].toFixed(4)], periodo: +mejor.periodo.toFixed(2), y: { amp: +fy.amp.toFixed(5), fase: +fy.fase.toFixed(4) }, giro });
  }
  return out;
}

/** hex sRGB → lineal (como trabaja three los colores) */
const lineal = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c > 0.04045 ? ((c + 0.055) / 1.055) ** 2.4 : c / 12.92));

/**
 * Transiciones de color de los materiales: el que empieza con un color y acaba con otro. El amortiguado sale como el del
 * scroll: la mediana de d[k+1]/d[k], con d la distancia (en lineal) al color final, mientras la distancia es clara.
 */
export function transicionesMateriales(ms: Muestra[]): Map<string, { desde: string; suavizado: number }> {
  const series = new Map<string, string[]>();
  for (const m of ms) for (const x of m.mats ?? []) if (x.c) (series.get(x.n) ?? series.set(x.n, []).get(x.n)!).push(x.c);
  const out = new Map<string, { desde: string; suavizado: number }>();
  for (const [n, cs] of series) {
    if (cs.length < 10 || cs[0] === cs[cs.length - 1]) continue;
    const fin = lineal(cs[cs.length - 1]);
    const d = cs.map((c) => len(sub(lineal(c), fin)));
    const d0 = d[0] || 1;
    const ratios: number[] = [];
    for (let k = 0; k < d.length - 1; k++) if (d[k] > d0 * 0.02 && d[k + 1] > 0) ratios.push(d[k + 1] / d[k]);
    const r = ratios.length >= 3 ? median(ratios) : 0;
    out.set(n, { desde: cs[0], suavizado: Math.round(Math.min(0.999, Math.max(0, r)) * 1000) / 1000 });
  }
  return out;
}

/** cámara de autor: un clip anima un nodo de la cadena de padres de la cámara (la cámara de un GLB de Blender) */
export function camaraDeModelo(inv: Inv | null): { nodo: string; clip: string } | undefined {
  const cadena = (inv?.camaraCadena ?? []).filter(Boolean);
  for (const c of inv?.clips ?? []) {
    const nodo = c.nodos.find((n) => cadena.includes(n));
    if (nodo) return { nodo, clip: c.clip };
  }
  return undefined;
}
