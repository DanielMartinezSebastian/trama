/**
 * Motores de audio de `AudioPlayer`, con la misma interfaz:
 *
 * - `FileEngine`: un archivo real (`src` = URL de mp3, ogg, wav…) en un `<audio>`, enrutado por un `AnalyserNode` para el
 *   visualizador. Para archivos de otro dominio hace falta CORS (se pide con `crossOrigin="anonymous"`).
 * - `SynthEngine`: música generada en el navegador con Web Audio, para demos sin archivos (`src` = `synth:<estilo>:<bpm>:<semilla>`,
 *   p. ej. `synth:hardtechno:156:4`). Estilos: `hardtechno` (bombo distorsionado, rumble, acid, acordes, hats y palmas), `techno` (más
 *   limpio, con swing) y `ambient` (pads y arpegio con eco). La semilla fija tonalidad, patrones, timbres y arreglo, y `semilla % 4`
 *   la entrada (0 bombo y rumble, 1 acid sola, 2 acordes con eco, 3 percusión). Determinista y con búsqueda (seek).
 */

export interface AudioEngine {
  play(): Promise<void>;
  pause(): void;
  seek(t: number): void;
  setVolume(v: number): void;
  readonly currentTime: number;
  readonly duration: number;
  readonly playing: boolean;
  readonly analyser: AnalyserNode | null;
  onEnded: () => void;
  destroy(): void;
}

let shared: AudioContext | null = null;
/** Un solo AudioContext por página (los navegadores limitan cuántos se pueden abrir). */
export function audioContext() {
  shared ??= new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  return shared;
}

export class FileEngine implements AudioEngine {
  private el: HTMLAudioElement;
  private gain: GainNode | null = null;
  analyser: AnalyserNode | null = null;
  onEnded = () => {};
  constructor(src: string, private fallbackDuration = 0) {
    this.el = new Audio();
    this.el.crossOrigin = "anonymous";
    this.el.preload = "metadata";
    this.el.src = src;
    this.el.addEventListener("ended", () => this.onEnded());
  }
  private wire() {
    if (this.analyser) return;
    try {
      const ctx = audioContext();
      const node = ctx.createMediaElementSource(this.el);
      this.gain = ctx.createGain();
      this.analyser = ctx.createAnalyser();
      this.analyser.fftSize = 256;
      node.connect(this.gain).connect(this.analyser).connect(ctx.destination);
    } catch {
      /* sin Web Audio (o ya enrutado): se reproduce igual, sin visualizador */
    }
  }
  async play() {
    this.wire();
    await audioContext().resume().catch(() => {});
    await this.el.play();
  }
  pause() {
    this.el.pause();
  }
  seek(t: number) {
    this.el.currentTime = Math.max(0, Math.min(t, this.duration || t));
  }
  setVolume(v: number) {
    if (this.gain) this.gain.gain.value = v;
    else this.el.volume = v;
  }
  get currentTime() {
    return this.el.currentTime;
  }
  get duration() {
    return Number.isFinite(this.el.duration) && this.el.duration > 0 ? this.el.duration : this.fallbackDuration;
  }
  get playing() {
    return !this.el.paused;
  }
  destroy() {
    this.el.pause();
    this.el.removeAttribute("src");
    this.el.load();
    this.analyser?.disconnect();
    this.gain?.disconnect();
  }
}

/* ---------- sintetizador ---------- */

type Style = "hardtechno" | "techno" | "ambient";
type Layer = "kick" | "bass" | "hat" | "ohat" | "clap" | "perc" | "acid" | "stab" | "pad" | "arp";

const rnd = (seed: number, i: number) => {
  const x = Math.sin((seed + 1) * 127.1 + i * 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const semi = (n: number) => Math.pow(2, n / 12);
const SCALE = [0, 1, 3, 5, 7, 8, 10]; // frigio: el color oscuro del techno
const ROOTS = [41.2, 43.65, 46.25, 49, 51.91, 55, 58.27]; // mi … la# graves

/**
 * Entrada de cada pista (semilla % 4): así dos pistas del mismo estilo se distinguen desde el primer segundo.
 * 0 = bombo y rumble directos · 1 = línea acid sola · 2 = acordes con eco · 3 = percusión y hats
 */
const INTROS: Record<Exclude<Style, "ambient">, Layer[][]> = {
  hardtechno: [["kick", "bass"], ["acid"], ["stab"], ["perc", "hat"]],
  techno: [["kick", "hat"], ["acid"], ["stab", "pad"], ["perc", "ohat"]],
};
const REST: Layer[] = ["kick", "bass", "hat", "clap", "ohat", "perc", "acid", "stab"];

export class SynthEngine implements AudioEngine {
  private ctx = audioContext();
  private out: GainNode;
  private bus: GainNode;
  private send: GainNode; // eco (corchea con puntillo)
  analyser: AnalyserNode;
  onEnded = () => {};
  private startAt = 0; // ctx.currentTime en el que la posición 0 empezaría
  private pos = 0; // posición guardada en pausa
  private isPlaying = false;
  private timer = 0;
  private nextStep = 0; // siguiente semicorchea por programar
  private noise: AudioBuffer;
  private shaper: WaveShaperNode;
  private readonly step: number;
  private readonly root: number;
  private readonly swing: number;
  // carácter de la pista, todo derivado de la semilla
  private readonly kickFrom: number;
  private readonly kickDecay: number;
  private readonly kickFill: boolean;
  private readonly bassCut: number;
  private readonly hatMask: number[];
  private readonly bassMask: number[];
  private readonly percMask: number[];
  private readonly percPitch: number;
  private readonly acid: Array<{ n: number; acc: boolean } | null>;
  private readonly stabSteps: Set<number>;
  private readonly prog: number[]; // transposición de los acordes cada 4 compases
  private readonly arp: number[];
  private readonly plan: Set<Layer>[]; // capas por bloque de 8 compases (0–3 = entrada que crece)
  private readonly melodic: Set<Layer>; // lo que queda en el respiro

  constructor(
    private style: Style,
    bpm: number,
    private seed: number,
    readonly duration: number,
  ) {
    const r = (i: number) => rnd(seed, i);
    this.step = 60 / bpm / 4;
    this.root = ROOTS[Math.floor(r(2) * ROOTS.length)];
    this.swing = style === "techno" ? r(3) * 0.14 : 0;
    this.kickFrom = (style === "hardtechno" ? 160 : 125) + r(4) * 60;
    this.kickDecay = (style === "hardtechno" ? 0.32 : 0.24) + r(5) * 0.22;
    this.kickFill = r(6) > 0.5;
    this.bassCut = (style === "hardtechno" ? 170 : 120) + r(7) * 220;
    const hatDensity = 0.35 + r(8) * 0.5;
    this.hatMask = Array.from({ length: 16 }, (_, i) => (i % 4 === 2 ? 1 : r(10 + i) < hatDensity ? 0.45 + r(30 + i) * 0.4 : 0));
    const offbeat = r(9) > 0.5; // rumble en cada semicorchea libre o solo a contratiempo
    this.bassMask = Array.from({ length: 16 }, (_, i) => (i % 4 === 0 ? 0 : offbeat ? (i % 4 === 2 ? 1 : 0) : r(50 + i) > 0.3 ? 1 : 0));
    this.percMask = Array.from({ length: 16 }, (_, i) => (r(70 + i) > 0.72 && i % 4 !== 0 ? 1 : 0));
    this.percPitch = 150 + r(11) * 180;
    this.acid = Array.from({ length: 16 }, (_, i) =>
      r(90 + i) < 0.28 ? null : { n: SCALE[Math.floor(r(110 + i) * 5)] + (r(130 + i) > 0.82 ? 12 : 0), acc: r(150 + i) > 0.68 },
    );
    const stabPool = [0, 3, 6, 8, 10, 11, 14];
    this.stabSteps = new Set(stabPool.filter((_, i) => r(170 + i) > 0.55).concat(stabPool[Math.floor(r(12) * stabPool.length)]));
    const progs = [[0, 0, -2, 3], [0, 1, 0, -2], [0, 3, 5, 3], [0, -4, -2, 0]];
    this.prog = progs[Math.floor(r(13) * progs.length)];
    this.arp = Array.from({ length: 8 }, (_, i) => SCALE[Math.floor(r(190 + i) * SCALE.length)] + (i % 3 === 2 ? 12 : 0));

    // arreglo: la entrada según la semilla y el resto de capas en un orden barajado con ella
    if (style === "ambient") {
      const padFirst = seed % 2 === 0;
      this.plan = [new Set<Layer>([padFirst ? "pad" : "arp"]), new Set<Layer>(["pad", "arp"]), new Set<Layer>(["pad", "arp", "ohat"]), new Set<Layer>(["pad", "arp", "ohat", "bass"])];
      this.melodic = new Set<Layer>(["pad"]);
    } else {
      const intro = INTROS[style][seed % 4];
      const rest = REST.filter((l) => !intro.includes(l)).sort((a, b) => r(210 + REST.indexOf(a)) - r(210 + REST.indexOf(b)));
      const steps = [intro, [...intro, ...rest.slice(0, 2)], [...intro, ...rest.slice(0, 4)], [...intro, ...rest.slice(0, 6)]];
      this.plan = steps.map((ls) => new Set<Layer>(ls));
      const mel = intro.filter((l) => l === "acid" || l === "stab");
      this.melodic = new Set<Layer>([...(mel.length ? mel : ["stab" as Layer]), "pad", "hat"]);
    }

    this.out = this.ctx.createGain();
    this.out.gain.value = 0.8;
    this.bus = this.ctx.createGain();
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.smoothingTimeConstant = 0.6;
    const comp = this.ctx.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.ratio.value = 6;
    this.bus.connect(comp).connect(this.out).connect(this.analyser).connect(this.ctx.destination);
    // eco con realimentación filtrada
    this.send = this.ctx.createGain();
    const delay = this.ctx.createDelay(2);
    delay.delayTime.value = this.step * 3;
    const fb = this.ctx.createGain();
    fb.gain.value = 0.38;
    const damp = this.ctx.createBiquadFilter();
    damp.type = "lowpass";
    damp.frequency.value = 2600;
    this.send.connect(delay).connect(damp).connect(fb).connect(delay);
    damp.connect(this.bus);
    this.shaper = this.ctx.createWaveShaper();
    const k = style === "hardtechno" ? 40 + r(14) * 60 : 8 + r(14) * 10;
    this.shaper.curve = new Float32Array(Array.from({ length: 1024 }, (_, i) => {
      const x = (i / 1023) * 2 - 1;
      return ((1 + k) * x) / (1 + k * Math.abs(x));
    }));
    this.shaper.connect(this.bus);
    this.noise = this.ctx.createBuffer(1, this.ctx.sampleRate, this.ctx.sampleRate);
    const d = this.noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }

  get currentTime() {
    return this.isPlaying ? Math.min(this.duration, this.ctx.currentTime - this.startAt) : this.pos;
  }
  get playing() {
    return this.isPlaying;
  }

  async play() {
    await this.ctx.resume();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.startAt = this.ctx.currentTime - this.pos + 0.05;
    this.nextStep = Math.ceil(this.pos / this.step);
    this.out.gain.cancelScheduledValues(this.ctx.currentTime);
    this.out.gain.setValueAtTime(this.out.gain.value, this.ctx.currentTime);
    this.bus.gain.cancelScheduledValues(this.ctx.currentTime);
    this.bus.gain.setValueAtTime(1, this.ctx.currentTime);
    this.timer = window.setInterval(() => this.schedule(), 25);
    this.schedule();
  }
  pause() {
    if (!this.isPlaying) return;
    this.pos = this.currentTime;
    this.isPlaying = false;
    window.clearInterval(this.timer);
    // silencia lo ya programado (y la cola del eco)
    const g = this.bus.gain;
    g.cancelScheduledValues(this.ctx.currentTime);
    g.setValueAtTime(0, this.ctx.currentTime);
  }
  seek(t: number) {
    const was = this.isPlaying;
    if (was) this.pause();
    this.pos = Math.max(0, Math.min(this.duration, t));
    if (was) void this.play();
  }
  setVolume(v: number) {
    this.out.gain.setTargetAtTime(v * 0.8, this.ctx.currentTime, 0.02);
  }
  destroy() {
    this.pause();
    this.bus.disconnect();
    this.send.disconnect();
    this.out.disconnect();
    this.analyser.disconnect();
  }

  /** Programa las semicorcheas que caen en los próximos 120 ms. */
  private schedule() {
    const ahead = this.ctx.currentTime + 0.12;
    while (this.isPlaying) {
      const t = this.startAt + this.nextStep * this.step;
      if (t > ahead) break;
      if (this.nextStep * this.step >= this.duration) {
        this.pos = this.duration;
        this.isPlaying = false;
        window.clearInterval(this.timer);
        window.setTimeout(() => this.onEnded(), Math.max(0, (t - this.ctx.currentTime) * 1000));
        break;
      }
      if (t >= this.ctx.currentTime - 0.01) this.voices(this.nextStep, t + (this.nextStep % 2 ? this.swing * this.step : 0));
      this.nextStep++;
    }
  }

  /** Capas activas en un compás: entrada que crece en bloques de 8, respiro de 8 cada 48 y final que se vacía. */
  private layers(bar: number): { on: Set<Layer>; breakdown: boolean; riser: boolean } {
    const block = Math.floor(bar / 8);
    const total = Math.floor(this.duration / (this.step * 16));
    const full = this.plan[this.plan.length - 1];
    if (bar >= total - 8) return { on: this.plan[1], breakdown: false, riser: false };
    if (block >= 4 && block % 6 === 4) return { on: this.melodic, breakdown: true, riser: bar % 8 >= 4 };
    return { on: block < this.plan.length ? this.plan[block] : full, breakdown: false, riser: false };
  }

  private voices(n: number, t: number) {
    const s = n % 16;
    const bar = Math.floor(n / 16);
    const { on, breakdown, riser } = this.layers(bar);
    const shift = this.prog[Math.floor(bar / 4) % 4];
    if (this.style === "ambient") {
      if (s === 0 && bar % 2 === 0 && on.has("pad")) this.pad(t, this.step * 32, shift);
      if (s % 2 === 0 && on.has("arp")) this.pluck(t, this.root * 8 * semi(this.arp[(n / 2) % 8] + shift), 0.06);
      if (s % 4 === 2 && on.has("ohat")) this.hat(t, 0.05, 0.12);
      if (s === 0 && on.has("bass")) this.sub(t, this.root * 2 * semi(shift), this.step * 12);
      return;
    }
    if (on.has("kick") && (s % 4 === 0 || (this.kickFill && bar % 4 === 3 && s === 15))) this.kick(t);
    if (on.has("bass") && this.bassMask[s]) this.rumble(t, shift);
    if (on.has("hat") && this.hatMask[s]) this.hat(t, this.hatMask[s] * (this.style === "hardtechno" ? 0.2 : 0.15), 0.05);
    if (on.has("ohat") && s % 4 === 2) this.hat(t, 0.12, 0.2);
    if (on.has("clap") && (s === 4 || s === 12)) this.clap(t);
    if (on.has("perc") && this.percMask[s]) this.perc(t);
    if (on.has("acid")) {
      const a = this.acid[s];
      if (a) this.acidNote(t, this.root * 4 * semi(a.n + shift), a.acc, bar);
    }
    if (on.has("stab") && this.stabSteps.has(s)) this.stab(t, shift);
    if (on.has("pad") && s === 0 && bar % 4 === 0) this.pad(t, this.step * 64, shift);
    if (breakdown && riser && s === 0 && bar % 8 === 4) this.riser(t, this.step * 64);
  }

  private env(g: GainNode, t: number, peak: number, dur: number) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + 0.003);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  }
  private kick(t: number) {
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.frequency.setValueAtTime(this.kickFrom, t);
    o.frequency.exponentialRampToValueAtTime(this.root, t + 0.08);
    this.env(g, t, 1, this.kickDecay);
    o.connect(g).connect(this.shaper);
    o.start(t);
    o.stop(t + this.kickDecay + 0.05);
  }
  private rumble(t: number, shift: number) {
    const o = this.ctx.createOscillator();
    const f = this.ctx.createBiquadFilter();
    const g = this.ctx.createGain();
    o.type = "sawtooth";
    o.frequency.value = this.root * semi(shift);
    f.type = "lowpass";
    f.frequency.value = this.bassCut;
    this.env(g, t, 0.42, this.step * 0.9);
    o.connect(f).connect(g).connect(this.shaper);
    o.start(t);
    o.stop(t + this.step);
  }
  private hat(t: number, level: number, dur: number) {
    const src = this.ctx.createBufferSource();
    const f = this.ctx.createBiquadFilter();
    const g = this.ctx.createGain();
    src.buffer = this.noise;
    f.type = "highpass";
    f.frequency.value = dur > 0.1 ? 6000 : 7500;
    this.env(g, t, level, dur);
    src.connect(f).connect(g).connect(this.bus);
    src.start(t, rnd(this.seed, t) * 0.5, dur + 0.05);
  }
  private clap(t: number) {
    const src = this.ctx.createBufferSource();
    const f = this.ctx.createBiquadFilter();
    const g = this.ctx.createGain();
    src.buffer = this.noise;
    f.type = "bandpass";
    f.frequency.value = 1400 + rnd(this.seed, 15) * 600;
    f.Q.value = 0.9;
    this.env(g, t, 0.32, 0.18);
    src.connect(f).connect(g).connect(this.bus);
    g.connect(this.send);
    src.start(t, 0.2, 0.25);
  }
  private perc(t: number) {
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.frequency.setValueAtTime(this.percPitch * 1.6, t);
    o.frequency.exponentialRampToValueAtTime(this.percPitch, t + 0.05);
    this.env(g, t, 0.28, 0.16);
    o.connect(g).connect(this.bus);
    g.connect(this.send);
    o.start(t);
    o.stop(t + 0.2);
  }
  private acidNote(t: number, freq: number, accent: boolean, bar: number) {
    const o = this.ctx.createOscillator();
    const f = this.ctx.createBiquadFilter();
    const g = this.ctx.createGain();
    o.type = "sawtooth";
    o.frequency.value = freq;
    f.type = "lowpass";
    f.Q.value = accent ? 16 : 10;
    // el filtro respira en ciclos de 16 compases
    const sweep = 0.5 + 0.5 * Math.sin((bar / 16) * Math.PI * 2 + this.seed);
    const top = 500 + sweep * 2400 + (accent ? 900 : 0);
    f.frequency.setValueAtTime(top, t);
    f.frequency.exponentialRampToValueAtTime(180, t + this.step * 0.9);
    this.env(g, t, accent ? 0.2 : 0.13, this.step * 0.95);
    o.connect(f).connect(g).connect(this.bus);
    if (accent) g.connect(this.send);
    o.start(t);
    o.stop(t + this.step);
  }
  private stab(t: number, shift: number) {
    const f = this.ctx.createBiquadFilter();
    const g = this.ctx.createGain();
    f.type = "bandpass";
    f.frequency.value = 900 + rnd(this.seed, 16) * 900;
    f.Q.value = 1.4;
    this.env(g, t, 0.16, this.step * 1.6);
    f.connect(g).connect(this.bus);
    g.connect(this.send);
    for (const iv of [0, 3, 7]) {
      const o = this.ctx.createOscillator();
      o.type = "square";
      o.frequency.value = this.root * 4 * semi(iv + shift);
      o.connect(f);
      o.start(t);
      o.stop(t + this.step * 1.7);
    }
  }
  private pluck(t: number, freq: number, level: number) {
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = "sine";
    o.frequency.value = freq;
    this.env(g, t, level, this.step * 3);
    o.connect(g).connect(this.bus);
    g.connect(this.send);
    o.start(t);
    o.stop(t + this.step * 3.2);
  }
  private sub(t: number, freq: number, dur: number) {
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.12, t + dur * 0.2);
    g.gain.linearRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(this.bus);
    o.start(t);
    o.stop(t + dur);
  }
  private riser(t: number, dur: number) {
    const src = this.ctx.createBufferSource();
    const f = this.ctx.createBiquadFilter();
    const g = this.ctx.createGain();
    src.buffer = this.noise;
    src.loop = true;
    f.type = "bandpass";
    f.Q.value = 3;
    f.frequency.setValueAtTime(300, t);
    f.frequency.exponentialRampToValueAtTime(9000, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.18, t + dur);
    g.gain.setValueAtTime(0.0001, t + dur);
    src.connect(f).connect(g).connect(this.bus);
    src.start(t);
    src.stop(t + dur);
  }
  private pad(t: number, dur: number, shift: number) {
    for (const iv of [0, 3, 7, 12]) {
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = "triangle";
      o.frequency.value = this.root * 4 * semi(iv + shift) * (1 + (rnd(this.seed, iv) - 0.5) * 0.006);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.04, t + dur * 0.3);
      g.gain.linearRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(this.bus);
      o.start(t);
      o.stop(t + dur);
    }
  }
}

/** Crea el motor para un `src`: `synth:estilo:bpm:semilla` o una URL de archivo. */
export function createEngine(src: string, duration: number): AudioEngine {
  if (src.startsWith("synth:")) {
    const [, style = "techno", bpm = "132", seed = "1"] = src.split(":");
    const st: Style = style === "hardtechno" || style === "ambient" ? style : "techno";
    return new SynthEngine(st, Math.max(60, Math.min(200, Number(bpm) || 132)), Number(seed) || 1, duration || 180);
  }
  return new FileEngine(src, duration);
}

/** «3:12» → 192 · «192» → 192 */
export const parseTime = (s = "") => {
  const p = s.trim().split(":").map(Number);
  if (p.some((x) => Number.isNaN(x))) return 0;
  return p.reduce((acc, x) => acc * 60 + x, 0);
};
/** 192 → «3:12» */
export const formatTime = (t: number) => {
  if (!Number.isFinite(t) || t < 0) t = 0;
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
};
