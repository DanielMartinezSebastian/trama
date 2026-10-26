import { aplicarFuerza, despertar, rotar, vec, type Cuerpo, type Mundo, type V3 } from "./world";

/*
 * Vehículo por rayos sobre `Mundo` (docs/29): el chasis es un cuerpo rígido normal (choca y empuja con sus esferas) y
 * cada rueda es un rayo hacia abajo desde su anclaje con un muelle y un amortiguador. En el contacto, el neumático
 * empuja hacia delante (motor), frena y agarra de lado (fuerza contra la velocidad lateral, acotada por μ·carga). Los
 * números por defecto se calibran contra la captura de la referencia (aceleración, velocidad punta, frenada, giro).
 */

export type ParamsVehiculo = {
  /** anclajes de las ruedas en el chasis (locales; x adelante, y arriba, z a la derecha) y radio de rueda */
  ruedas: V3[];
  radioRueda: number;
  /** muelle: longitud en reposo, rigidez y amortiguación (por unidad de masa del chasis) */
  suspension: { reposo: number; rigidez: number; amortiguacion: number };
  /** aceleración del motor (m/s²), velocidad punta (m/s) y fracción de ella desde la que el empuje se suaviza */
  motor: number;
  velocidadPunta: number;
  suavizaDesde: number;
  /** freno con el mando de freno y frenada sola al soltar (m/s²; la referencia frena sola, arcade) */
  freno: number;
  frenadaSola: number;
  /**
   * dirección arcade: el ángulo de las ruedas se elige para girar a `velocidadAngular` (rad/s) sea cual sea la velocidad
   * (la referencia gira a ~120°/s de 5 a 13 m/s), sin pasar de `maximo` (rad); `rapidez` es lo que tarda el volante
   */
  giro: { maximo: number; rapidez: number; velocidadAngular: number };
  /** batalla (distancia entre ejes, m), para el ángulo de la dirección */
  batalla: number;
  /** se da la vuelta solo si queda volcado y quieto (segundos que espera) */
  enderezar: number;
  /** agarre lateral (1/s) y su tope como coeficiente de rozamiento */
  agarre: number;
  mu: number;
  /** a qué altura entre el suelo (0) y el centro de masas (1) empujan los neumáticos: cuanto más alto, menos cabecea y vuelca */
  alturaFuerzas: number;
  /** lo mismo para el agarre lateral: casi en el centro de masas el coche no vuelca al girar (arcade) */
  alturaLateral: number;
};

export const VEHICULO_POR_DEFECTO: ParamsVehiculo = {
  // batalla 1,8 m y vía 1,5 m, las de la referencia
  ruedas: [
    [0.9, -0.2, -0.75],
    [0.9, -0.2, 0.75],
    [-0.9, -0.2, -0.75],
    [-0.9, -0.2, 0.75],
  ],
  radioRueda: 0.32,
  suspension: { reposo: 0.35, rigidez: 25, amortiguacion: 5 },
  // calibrado con Bruno Simon (docs/29 §2): 32 m/s² hasta ~80 % de la punta, punta 13,8 m/s, frena sola a 20 m/s²,
  // gira a ~2,1 rad/s (el objetivo es 2,4: el modelo subvira un 15 %)
  motor: 32,
  velocidadPunta: 13.8,
  suavizaDesde: 0.8,
  freno: 25,
  frenadaSola: 20,
  giro: { maximo: 0.6, rapidez: 6, velocidadAngular: 2.4 },
  batalla: 1.8,
  enderezar: 0.4,
  agarre: 20,
  // 3,2 g de arranque y 2,8 g de giro medidos: mucho más de lo que da un neumático de verdad (arcade)
  mu: 6,
  alturaFuerzas: 0.7,
  alturaLateral: 0.95,
};

export type Mandos = { adelante: number; atras: number; izquierda: number; derecha: number; freno?: number };

export type EstadoRueda = { compresion: number; enSuelo: boolean; giro: number; vueltas: number; punto: V3 };

export class Vehiculo {
  mandos: Mandos = { adelante: 0, atras: 0, izquierda: 0, derecha: 0 };
  ruedas: EstadoRueda[];
  private direccion = 0;
  private volcado = 0;
  constructor(
    readonly mundo: Mundo,
    readonly chasis: Cuerpo,
    readonly p: ParamsVehiculo = VEHICULO_POR_DEFECTO,
  ) {
    this.ruedas = p.ruedas.map(() => ({ compresion: 0, enSuelo: false, giro: 0, vueltas: 0, punto: [0, 0, 0] }));
    mundo.antes.push((dt) => this.paso(dt));
  }

  /** velocidad hacia delante (m/s, con signo) */
  get velocidad() {
    return vec.dot(this.chasis.vel, rotar(this.chasis.rot, [1, 0, 0]));
  }

  private paso(dt: number) {
    const c = this.chasis;
    const { p, mandos } = this;
    const masa = c.invMasa ? 1 / c.invMasa : 1;
    const delante = rotar(c.rot, [1, 0, 0]);
    const arriba = rotar(c.rot, [0, 1, 0]);
    const v = this.velocidad;
    if (mandos.adelante || mandos.atras || mandos.izquierda || mandos.derecha) despertar(c);
    // dirección arcade: el ángulo que da la velocidad angular pedida (modelo de bicicleta: ω = v·tan δ / batalla)
    const angulo = Math.min(p.giro.maximo, Math.atan((p.giro.velocidadAngular * p.batalla) / Math.max(0.5, Math.abs(v))));
    const objetivo = (mandos.izquierda - mandos.derecha) * angulo * Math.sign(v || 1);
    this.direccion += Math.max(-p.giro.rapidez * dt, Math.min(p.giro.rapidez * dt, objetivo - this.direccion));
    const motriz = mandos.adelante - mandos.atras;
    let enSuelo = 0;
    // las cuatro fuerzas se calculan con el mismo estado y se aplican al final (aplicarlas una a una tuerce el coche)
    const fuerzas: { f: [number, number, number]; en: [number, number, number] }[] = [];
    p.ruedas.forEach((anclaje, i) => {
      const r = this.ruedas[i];
      const a = vec.add(c.pos, rotar(c.rot, anclaje));
      const s = this.mundo.suelo(a[0], a[2]);
      // el rayo baja por el eje del chasis; distancia al suelo medida a lo largo de él
      const caida = (a[1] - s.y) / Math.max(0.2, arriba[1]);
      const largo = caida - p.radioRueda;
      const delantera = anclaje[0] > 0;
      r.giro = delantera ? this.direccion : 0;
      if (largo > p.suspension.reposo) {
        r.enSuelo = false;
        r.compresion = 0;
        r.punto = vec.sub(a, vec.mul(arriba, p.suspension.reposo + p.radioRueda));
        return;
      }
      enSuelo++;
      r.enSuelo = true;
      const compresionAntes = r.compresion;
      r.compresion = p.suspension.reposo - largo;
      const velComp = (r.compresion - compresionAntes) / dt;
      const carga = Math.max(0, (p.suspension.rigidez * r.compresion + p.suspension.amortiguacion * velComp) * masa);
      const punto: V3 = [a[0], s.y, a[2]];
      r.punto = punto;
      fuerzas.push({ f: vec.mul(s.n, carga), en: a });
      // ejes de la rueda: hacia delante girado por la dirección, y el lateral
      const cos = Math.cos(r.giro), sin = Math.sin(r.giro);
      const lateralCh = rotar(c.rot, [0, 0, 1]);
      const fw = vec.add(vec.mul(delante, cos), vec.mul(lateralCh, -sin));
      const lado = vec.cross(fw, s.n);
      const vp = vec.add(c.vel, vec.cross(c.ang, vec.sub(punto, c.pos)));
      const vLat = vec.dot(vp, lado);
      const vLong = vec.dot(vp, fw);
      // con un suelo: al arrancar el morro sube y descarga las delanteras, pero en un arcade siguen tirando
      const tope = p.mu * Math.max(carga, (masa * 9.81) / 8);
      // agarre lateral: anula la velocidad de lado, hasta lo que da el rozamiento (derrapa por encima)
      const fLat = Math.max(-tope, Math.min(tope, -vLat * p.agarre * masa * 0.25));
      // motor (a las cuatro) hasta la velocidad punta, freno contra el sentido de la marcha y rodadura
      let fLong = 0;
      // empuje constante y, desde `suavizaDesde` de la punta, a cero en la punta (la curva medida)
      const hacia = Math.sign(motriz) * vLong;
      const resta = 1 - Math.max(0, (hacia / p.velocidadPunta - p.suavizaDesde) / (1 - p.suavizaDesde));
      if (motriz) fLong += (motriz * p.motor * Math.max(0, Math.min(1, resta)) * masa) / 4;
      // contra la marcha: el freno, o la frenada sola al soltar (sin pasarse de parar en este paso)
      const deceleracion = mandos.freno ? p.freno * mandos.freno : !motriz ? p.frenadaSola : 0;
      if (deceleracion) fLong -= Math.sign(vLong) * Math.min(Math.abs(vLong) / dt / 4, deceleracion / 4) * masa;
      fLong = Math.max(-tope, Math.min(tope, fLong));
      // el punto de empuje sube por la normal hacia la altura del centro de masas
      const subida = Math.max(0, vec.dot(vec.sub(c.pos, punto), s.n));
      const a1 = vec.add(punto, vec.mul(s.n, subida * p.alturaFuerzas));
      const a2 = vec.add(punto, vec.mul(s.n, subida * p.alturaLateral));
      fuerzas.push({ f: vec.mul(fw, fLong), en: a1 }, { f: vec.mul(lado, fLat), en: a2 });
      r.vueltas += (vLong * dt) / p.radioRueda;
    });
    for (const { f, en } of fuerzas) aplicarFuerza(c, f, en, dt);
    // volcado y casi quieto: un par que lo devuelve a su posición (la referencia se endereza en menos de un segundo)
    if (arriba[1] < 0.3 && vec.len(c.vel) < 3) {
      this.volcado += dt;
      if (this.volcado > p.enderezar) {
        const eje = vec.cross(arriba, [0, 1, 0]);
        const l = vec.len(eje) || 1;
        c.ang = vec.add(vec.mul(c.ang, 0.9), vec.mul(eje, (6 * dt * 60 * 0.1) / l));
        if (arriba[1] < -0.5) c.vel = vec.add(c.vel, [0, 9.81 * 1.6 * dt, 0]);
      }
    } else this.volcado = 0;
    // sin ruedas en el suelo las vueltas siguen por inercia
    if (!enSuelo) for (const r of this.ruedas) r.vueltas += (v * dt) / p.radioRueda;
  }
}
