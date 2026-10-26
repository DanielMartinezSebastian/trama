/*
 * Física de cuerpos rígidos sin WebAssembly (la CSP de producción no deja compilarlo, docs/README «Modelos»): cada cuerpo
 * es un grupo de esferas fijas a él (una caja, una letra o un ladrillo se aproximan con varias), contra el suelo (un plano
 * o una función de altura) y entre sí. Impulsos secuenciales con rozamiento de Coulomb, rebote y corrección de
 * penetración; los cuerpos quietos se duermen. Es lo que pide una portada con objetos que se empujan, vuelcan y ruedan
 * (docs/29), no un motor general: sin uniones ni mallas de colisión.
 */

export type V3 = [number, number, number];
/** cuaternión [x, y, z, w] */
export type Q = [number, number, number, number];

export type Esfera = { o: V3; r: number };

export type Cuerpo = {
  id: number;
  pos: V3;
  rot: Q;
  vel: V3;
  ang: V3;
  /** masa inversa (0 = fijo) e inercia inversa en ejes locales (diagonal) */
  invMasa: number;
  invInercia: V3;
  esferas: Esfera[];
  /** radio que envuelve todas las esferas, para la fase amplia */
  radio: number;
  rozamiento: number;
  rebote: number;
  /** fotogramas seguidos casi quieto: a partir de un umbral, duerme */
  quieto: number;
  dormido: boolean;
  /** datos libres del que lo usa (la malla, una etiqueta) */
  dato?: unknown;
};

export type Suelo = (x: number, z: number) => { y: number; n: V3 };

export const plano = (altura = 0): Suelo => () => ({ y: altura, n: [0, 1, 0] });

// ---------------------------------------------------------------- álgebra mínima
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a: V3, s: number): V3 => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const len = (a: V3) => Math.hypot(a[0], a[1], a[2]);
export const vec = { add, sub, mul, dot, cross, len };

/** gira v por el cuaternión q */
export function rotar(q: Q, v: V3): V3 {
  const [x, y, z, w] = q;
  const ix = w * v[0] + y * v[2] - z * v[1];
  const iy = w * v[1] + z * v[0] - x * v[2];
  const iz = w * v[2] + x * v[1] - y * v[0];
  const iw = -x * v[0] - y * v[1] - z * v[2];
  return [ix * w + iw * -x + iy * -z - iz * -y, iy * w + iw * -y + iz * -x - ix * -z, iz * w + iw * -z + ix * -y - iy * -x];
}
const conj = (q: Q): Q => [-q[0], -q[1], -q[2], q[3]];

/** inercia inversa en el mundo aplicada a un vector: R · I⁻¹ · Rᵀ · v */
function invI(c: Cuerpo, v: V3): V3 {
  const l = rotar(conj(c.rot), v);
  return rotar(c.rot, [l[0] * c.invInercia[0], l[1] * c.invInercia[1], l[2] * c.invInercia[2]]);
}

/** velocidad del punto del cuerpo que está en r (relativo al centro) */
const velEn = (c: Cuerpo, r: V3): V3 => add(c.vel, cross(c.ang, r));

export function aplicarImpulso(c: Cuerpo, j: V3, r: V3) {
  if (!c.invMasa) return;
  c.vel = add(c.vel, mul(j, c.invMasa));
  c.ang = add(c.ang, invI(c, cross(r, j)));
}

/** fuerza aplicada en un punto del mundo durante dt (para muelles y motores) */
export function aplicarFuerza(c: Cuerpo, f: V3, punto: V3, dt: number) {
  despertar(c);
  aplicarImpulso(c, mul(f, dt), sub(punto, c.pos));
}

export function despertar(c: Cuerpo) {
  c.dormido = false;
  c.quieto = 0;
}

// ---------------------------------------------------------------- creación

let siguienteId = 1;

/**
 * Un cuerpo con sus esferas en coordenadas locales (alrededor de su centro de masas). La inercia se aproxima con la de
 * la caja que envuelve las esferas, que es lo que importa para cómo vuelca.
 */
export function cuerpo(esferas: Esfera[], masa: number, op: Partial<Pick<Cuerpo, "pos" | "rot" | "rozamiento" | "rebote" | "dato">> = {}): Cuerpo {
  const min: V3 = [Infinity, Infinity, Infinity];
  const max: V3 = [-Infinity, -Infinity, -Infinity];
  let radio = 0;
  for (const e of esferas) {
    for (let k = 0; k < 3; k++) {
      min[k] = Math.min(min[k], e.o[k] - e.r);
      max[k] = Math.max(max[k], e.o[k] + e.r);
    }
    radio = Math.max(radio, len(e.o) + e.r);
  }
  const [w, h, d] = [max[0] - min[0], max[1] - min[1], max[2] - min[2]];
  const ix = (masa / 12) * (h * h + d * d), iy = (masa / 12) * (w * w + d * d), iz = (masa / 12) * (w * w + h * h);
  return {
    id: siguienteId++,
    pos: op.pos ?? [0, 0, 0],
    rot: op.rot ?? [0, 0, 0, 1],
    vel: [0, 0, 0],
    ang: [0, 0, 0],
    invMasa: masa > 0 ? 1 / masa : 0,
    invInercia: masa > 0 ? [1 / ix, 1 / iy, 1 / iz] : [0, 0, 0],
    esferas,
    radio,
    rozamiento: op.rozamiento ?? 0.6,
    rebote: op.rebote ?? 0.1,
    quieto: 0,
    dormido: false,
    dato: op.dato,
  };
}

/**
 * caja de lados (w, h, d) rellena de esferas de radio un cuarto del lado menor, repartidas hasta las esquinas con un paso
 * de 1,2 radios como mucho: cada cara apoya en varias esferas a la misma altura y la caja se queda plana (con una sola
 * esfera grande sería una bola y rodaría)
 */
export function esferasCaja(w: number, h: number, d: number): Esfera[] {
  const r = Math.min(w, h, d) / 4;
  const n = (l: number) => Math.max(2, Math.ceil((l - 2 * r) / (1.2 * r)) + 1);
  const [nx, ny, nz] = [n(w), n(h), n(d)];
  const t = (q: number, m: number, l: number) => -l / 2 + r + (q / (m - 1)) * (l - 2 * r);
  const out: Esfera[] = [];
  for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) for (let k = 0; k < nz; k++) out.push({ o: [t(i, nx, w), t(j, ny, h), t(k, nz, d)], r });
  return out;
}

// ---------------------------------------------------------------- mundo

type Contacto = { a: Cuerpo; b: Cuerpo | null; n: V3; p: V3; prof: number; ra: V3; rb: V3; masaN: number; jn: number; jt: number; jb: number; t1: V3; t2: V3; rozamiento: number; vObjetivo: number };

export class Mundo {
  cuerpos: Cuerpo[] = [];
  gravedad: V3 = [0, -9.81, 0];
  suelo: Suelo = plano(0);
  iteraciones = 10;
  /** pasos fijos por segundo: la física no depende de la frecuencia de pantalla */
  hz = 120;
  private resto = 0;
  /** antes de cada paso fijo (vehículos, agarres): reciben dt */
  antes: ((dt: number) => void)[] = [];

  añadir(c: Cuerpo) {
    this.cuerpos.push(c);
    return c;
  }

  quitar(c: Cuerpo) {
    this.cuerpos = this.cuerpos.filter((x) => x !== c);
  }

  /** avanza el tiempo real dt en pasos fijos (como mucho 8 por llamada, para no espiralar) */
  avanzar(dt: number) {
    this.resto += Math.min(dt, 0.1);
    const h = 1 / this.hz;
    let n = 0;
    while (this.resto >= h && n < 8) {
      this.paso(h);
      this.resto -= h;
      n++;
    }
  }

  paso(dt: number) {
    for (const f of this.antes) f(dt);
    const vivos = this.cuerpos.filter((c) => c.invMasa && !c.dormido);
    for (const c of vivos) {
      c.vel = add(c.vel, mul(this.gravedad, dt));
      // amortiguación pequeña (aire, rodadura): evita que nada gire sin fin
      c.vel = mul(c.vel, 1 - 0.02 * dt);
      c.ang = mul(c.ang, 1 - 0.6 * dt);
    }
    const contactos = this.contactos();
    // impulsos secuenciales
    for (const k of contactos) this.prepara(k, dt);
    for (let it = 0; it < this.iteraciones; it++) for (const k of contactos) this.resuelve(k);
    for (const c of vivos) {
      c.pos = add(c.pos, mul(c.vel, dt));
      // integración de la rotación: q += ½·(ω,0)·q·dt
      const [x, y, z, w] = c.rot;
      const [ax, ay, az] = c.ang;
      const q: Q = [x + 0.5 * dt * (ax * w + ay * z - az * y), y + 0.5 * dt * (ay * w + az * x - ax * z), z + 0.5 * dt * (az * w + ax * y - ay * x), w + 0.5 * dt * (-ax * x - ay * y - az * z)];
      const l = Math.hypot(...q);
      c.rot = [q[0] / l, q[1] / l, q[2] / l, q[3] / l];
      // dormir: medio segundo casi quieto
      if (len(c.vel) < 0.05 && len(c.ang) < 0.08) {
        if (++c.quieto > this.hz * 0.5) {
          c.dormido = true;
          c.vel = [0, 0, 0];
          c.ang = [0, 0, 0];
        }
      } else c.quieto = 0;
    }
  }

  private contactos(): Contacto[] {
    const out: Contacto[] = [];
    const activos = this.cuerpos.filter((c) => c.invMasa);
    // contra el suelo
    for (const c of activos) {
      if (c.dormido) continue;
      for (const e of c.esferas) {
        const p = add(c.pos, rotar(c.rot, e.o));
        const s = this.suelo(p[0], p[2]);
        const prof = s.y + e.r - p[1];
        if (prof > -0.01) out.push(this.nuevo(c, null, s.n, sub(p, mul(s.n, e.r)), prof));
      }
    }
    // entre cuerpos (fase amplia por radio envolvente); un cuerpo dormido despierta si lo tocan uno despierto
    for (let i = 0; i < activos.length; i++)
      for (let j = i + 1; j < activos.length; j++) {
        const a = activos[i], b = activos[j];
        if (a.dormido && b.dormido) continue;
        if (len(sub(a.pos, b.pos)) > a.radio + b.radio) continue;
        for (const ea of a.esferas) {
          const pa = add(a.pos, rotar(a.rot, ea.o));
          for (const eb of b.esferas) {
            const pb = add(b.pos, rotar(b.rot, eb.o));
            const d = sub(pa, pb);
            const dist = len(d);
            const prof = ea.r + eb.r - dist;
            if (prof <= -0.005 || dist < 1e-6) continue;
            const n = mul(d, 1 / dist);
            if (a.dormido) despertar(a);
            if (b.dormido) despertar(b);
            out.push(this.nuevo(a, b, n, add(pb, mul(n, eb.r - prof / 2)), prof));
          }
        }
      }
    // los fijos (invMasa 0) también chocan: se tratan como b sin masa
    const fijos = this.cuerpos.filter((c) => !c.invMasa);
    for (const a of activos) {
      if (a.dormido) continue;
      for (const b of fijos) {
        if (len(sub(a.pos, b.pos)) > a.radio + b.radio) continue;
        for (const ea of a.esferas) {
          const pa = add(a.pos, rotar(a.rot, ea.o));
          for (const eb of b.esferas) {
            const pb = add(b.pos, rotar(b.rot, eb.o));
            const d = sub(pa, pb);
            const dist = len(d);
            const prof = ea.r + eb.r - dist;
            if (prof <= -0.005 || dist < 1e-6) continue;
            const n = mul(d, 1 / dist);
            out.push(this.nuevo(a, b, n, add(pb, mul(n, eb.r - prof / 2)), prof));
          }
        }
      }
    }
    return out;
  }

  private nuevo(a: Cuerpo, b: Cuerpo | null, n: V3, p: V3, prof: number): Contacto {
    const t1 = Math.abs(n[0]) > 0.7 ? cross(n, [0, 1, 0]) : cross(n, [1, 0, 0]);
    const l1 = len(t1);
    const tt1 = mul(t1, 1 / l1);
    return { a, b, n, p, prof, ra: sub(p, a.pos), rb: b ? sub(p, b.pos) : [0, 0, 0], masaN: 0, jn: 0, jt: 0, jb: 0, t1: tt1, t2: cross(n, tt1), rozamiento: Math.sqrt(a.rozamiento * (b?.rozamiento ?? 0.8)), vObjetivo: 0 };
  }

  private masaEfectiva(k: Contacto, d: V3) {
    const { a, b, ra, rb } = k;
    let m = a.invMasa + dot(cross(invI(a, cross(ra, d)), ra), d);
    if (b && b.invMasa) m += b.invMasa + dot(cross(invI(b, cross(rb, d)), rb), d);
    return m > 0 ? 1 / m : 0;
  }

  private relativa(k: Contacto): V3 {
    const va = velEn(k.a, k.ra);
    const vb = k.b ? velEn(k.b, k.rb) : [0, 0, 0];
    return sub(va, vb as V3);
  }

  private prepara(k: Contacto, dt: number) {
    k.masaN = this.masaEfectiva(k, k.n);
    const vn = dot(this.relativa(k), k.n);
    const rebote = Math.max(k.a.rebote, k.b?.rebote ?? 0);
    // rebote solo en choques de verdad; la penetración se corrige con una velocidad de empuje (Baumgarte)
    k.vObjetivo = Math.max(vn < -1 ? -rebote * vn : 0, (0.2 / dt) * Math.max(0, k.prof - 0.005));
  }

  private resuelve(k: Contacto) {
    const v = this.relativa(k);
    const vn = dot(v, k.n);
    let j = k.masaN * (k.vObjetivo - vn);
    const viejo = k.jn;
    k.jn = Math.max(0, viejo + j);
    j = k.jn - viejo;
    const imp = mul(k.n, j);
    aplicarImpulso(k.a, imp, k.ra);
    if (k.b) aplicarImpulso(k.b, mul(imp, -1), k.rb);
    // rozamiento en las dos tangentes, acotado por μ·jn
    for (const [t, campo] of [
      [k.t1, "jt"],
      [k.t2, "jb"],
    ] as const) {
      const vt = dot(this.relativa(k), t);
      const m = this.masaEfectiva(k, t);
      let jt = -vt * m;
      const max = k.rozamiento * k.jn;
      const ant = k[campo];
      k[campo] = Math.max(-max, Math.min(max, ant + jt));
      jt = k[campo] - ant;
      const it = mul(t, jt);
      aplicarImpulso(k.a, it, k.ra);
      if (k.b) aplicarImpulso(k.b, mul(it, -1), k.rb);
    }
  }
}
