import { Mundo, cuerpo, aplicarFuerza, plano, vec, type Cuerpo, type Esfera, type V3 } from "../physics/world";

/*
 * La física de `CrossCluster` (docs/31 §3) con `lib/physics`: cruces sin gravedad que tiran hacia un punto y se empujan.
 * Medido en lusion.co con cine:conjunto: el centro del racimo sigue al puntero un 35 % de lo que se mueve, con unos
 * 0,4 s de retraso, y vuelve al centro en ~2 s cuando el puntero se va; en reposo, ~0,2 m/s y ~0,4 rad/s de media
 * mientras se asienta; con el puntero barriendo, ~1 m/s. El puntero es además una bola que aparta las cruces.
 */

/** una cruz: el centro y las seis puntas (tres cilindros de radio 1/3 y media longitud 1) */
export function esferasCruz(radio = 1): Esfera[] {
  const r = radio / 3;
  const out: Esfera[] = [{ o: [0, 0, 0], r: r * 1.15 }];
  for (const k of [0, 1, 2])
    for (const s of [-1, 1]) {
      const o: V3 = [0, 0, 0];
      o[k] = s * (radio - r);
      out.push({ o, r });
      const m: V3 = [0, 0, 0];
      m[k] = s * (radio - r) * 0.5;
      out.push({ o: m, r });
    }
  return out;
}

export type OpcionesRacimo = {
  /** cuántas cruces */
  n: number;
  /** semilla de las posiciones de salida */
  semilla?: number;
  /** rigidez del muelle hacia el punto de atracción (1/s²: aceleración por metro de distancia) */
  tiron?: number;
  /** amortiguación lineal y angular (1/s) */
  freno?: number;
  frenoGiro?: number;
  /** rozamiento entre cruces (hace que giren al rozarse) */
  rozamiento?: number;
  /**
   * agitación: fuerza (m/s²) y par (rad/s²) que cambian despacio, distintos en cada cruz; el racimo de la referencia
   * nunca se para del todo (en reposo, ~0,15 radios/s y ~0,18 rad/s)
   */
  vida?: number;
  vidaGiro?: number;
  /** fracción del puntero que sigue el punto de atracción y cuánto tarda (s) */
  seguir?: number;
  retraso?: number;
  /** cuánto tarda en volver al centro cuando el puntero se va (s) */
  vuelta?: number;
  /** radio de la bola del puntero (0 = no aparta) */
  bola?: number;
  /**
   * choque como una sola esfera de este radio (0 = la forma de la cruz con 13 esferas): la referencia choca como bolas
   * (las cruces no se encajan y el racimo queda suelto, con huecos: dispersión de 2,4 radios)
   */
  esfera?: number;
};

export const RACIMO_LUSION = { tiron: 20, freno: 4, frenoGiro: 0.2, rozamiento: 0.2, seguir: 0.38, retraso: 0.05, vuelta: 0.05, bola: 0.5, esfera: 1.05, vida: 4, vidaGiro: 6 };

export function crearRacimo(op: OpcionesRacimo) {
  const o = { ...RACIMO_LUSION, ...op };
  // mulberry32: un generador lineal congruencial reparte mal y agrupa los colores (que van alternos)
  let s = (o.semilla ?? 7) >>> 0;
  const azar = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const mundo = new Mundo();
  mundo.gravedad = [0, 0, 0];
  mundo.suelo = plano(-1e6);
  mundo.hz = 60;
  mundo.iteraciones = 10;
  const cruces: Cuerpo[] = [];
  for (let i = 0; i < o.n; i++) {
    // salen de una esfera amplia y se juntan: la entrada de la portada
    const d = 3 + azar() * 5;
    const th = azar() * Math.PI * 2, ph = Math.acos(azar() * 2 - 1);
    const pos: V3 = [d * Math.sin(ph) * Math.cos(th), d * Math.sin(ph) * Math.sin(th), d * Math.cos(ph) * 0.6];
    const q = [azar() - 0.5, azar() - 0.5, azar() - 0.5, azar() - 0.5];
    const l = Math.hypot(...q) || 1;
    cruces.push(mundo.añadir(cuerpo(o.esfera ? [{ o: [0, 0, 0], r: o.esfera }] : esferasCruz(1), 1, { pos, rot: [q[0] / l, q[1] / l, q[2] / l, q[3] / l], rozamiento: o.rozamiento, rebote: 0 })));
  }
  const bola = cuerpo([{ o: [0, 0, 0], r: o.bola || 0.001 }], 0, { pos: [0, 0, 100] });
  if (o.bola) mundo.añadir(bola);

  const atrae: V3 = [0, 0, 0];
  let puntero: V3 | null = null;
  // fases de la agitación de cada cruz (tres senos por eje, de periodos de 3 a 9 s)
  const fases = cruces.map(() => Array.from({ length: 12 }, () => azar() * Math.PI * 2));
  let t = 0;
  mundo.antes.push((dt) => {
    t += dt;
    // el punto de atracción va hacia una fracción del puntero (o al centro) con un retraso de primer orden
    const meta: V3 = puntero ? [puntero[0] * o.seguir, puntero[1] * o.seguir, 0] : [0, 0, 0];
    const k = 1 - Math.exp(-dt / (puntero ? o.retraso : o.vuelta));
    for (let j = 0; j < 3; j++) atrae[j] += (meta[j] - atrae[j]) * k;
    const fl = 1 / (1 + o.freno * dt), fa = 1 / (1 + o.frenoGiro * dt);
    cruces.forEach((c, i) => {
      const d = vec.sub(atrae, c.pos);
      const l = vec.len(d);
      // muelle hacia el punto de atracción: lejos tira fuerte (el racimo sigue al puntero casi sin retraso), cerca apenas
      if (l > 1e-4) aplicarFuerza(c, vec.mul(d, o.tiron), c.pos, dt);
      const f = fases[i];
      const onda = (k: number, w: number) => Math.sin(t * w + f[k]);
      if (o.vida) c.vel = vec.add(c.vel, vec.mul([onda(0, 0.9), onda(1, 1.3), onda(2, 0.7) * 0.5], o.vida * dt));
      if (o.vidaGiro) c.ang = vec.add(c.ang, vec.mul([onda(3, 1.1), onda(4, 0.8), onda(5, 1.7)], o.vidaGiro * dt));
      c.vel = vec.mul(c.vel, fl);
      c.ang = vec.mul(c.ang, fa);
    });
  });

  return {
    mundo,
    cruces,
    /** el puntero en el plano z = 0 (null = fuera); su velocidad la toma la bola para empujar */
    puntero(p: V3 | null, dt: number) {
      if (p && puntero && dt > 0) bola.vel = vec.mul(vec.sub(p, bola.pos), 1 / dt);
      else bola.vel = [0, 0, 0];
      puntero = p;
      bola.pos = p ?? [0, 0, 100];
    },
    avanzar(dt: number) {
      mundo.avanzar(dt);
    },
  };
}

export type Racimo = ReturnType<typeof crearRacimo>;
