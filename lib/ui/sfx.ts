"use client";

import { useSyncExternalStore } from "react";
import { audioContext } from "./audio";

/**
 * Efectos de sonido de **8 bits** sintetizados en el navegador con Web Audio: sin archivos, sin peso y sin licencias.
 * Cada efecto es una lista de notas (onda cuadrada, triangular, de sierra o ruido) con su envolvente y, si acaso, un
 * deslizamiento de tono: la moneda, el golpe, el cofre, la victoria… Para interfaces con juego, promociones o webs de
 * videojuegos.
 *
 * El silencio es global y se recuerda (`localStorage`): `useSfx()` lo lee y `SoundToggle` lo cambia. El `AudioContext` se
 * crea con el primer sonido, que siempre llega tras un gesto (los navegadores no dejan sonar antes).
 */

export const SFX_PRESETS = ["blip", "select", "confirm", "coin", "hit", "hurt", "open", "powerup", "win", "lose", "start"] as const;
export type SfxName = (typeof SFX_PRESETS)[number];

type Note = { wave: OscillatorType | "noise"; f0: number; f1?: number; at?: number; dur: number; vol?: number };

const seq = (wave: OscillatorType, freqs: number[], step: number, dur = step, vol = 1): Note[] => freqs.map((f, i) => ({ wave, f0: f, at: i * step, dur, vol }));

const PRESETS: Record<SfxName, Note[]> = {
  blip: [{ wave: "square", f0: 880, dur: 0.05, vol: 0.6 }],
  select: seq("square", [660, 990], 0.05, 0.06, 0.6),
  confirm: seq("square", [523, 659, 784], 0.06, 0.08),
  coin: [{ wave: "square", f0: 988, dur: 0.07 }, { wave: "square", f0: 1319, at: 0.07, dur: 0.22 }],
  hit: [{ wave: "noise", f0: 1, dur: 0.12, vol: 0.9 }, { wave: "square", f0: 220, f1: 70, dur: 0.14 }],
  hurt: [{ wave: "sawtooth", f0: 320, f1: 80, dur: 0.3, vol: 0.8 }, { wave: "noise", f0: 1, dur: 0.22, vol: 0.6 }],
  open: [{ wave: "triangle", f0: 196, f1: 392, dur: 0.22 }, ...seq("square", [523, 659, 784, 1047], 0.07, 0.1, 0.7).map((n) => ({ ...n, at: (n.at ?? 0) + 0.2 }))],
  powerup: [{ wave: "square", f0: 330, f1: 990, dur: 0.38, vol: 0.7 }, { wave: "triangle", f0: 165, f1: 495, dur: 0.38 }],
  win: [...seq("square", [523, 659, 784, 1047], 0.11, 0.12), { wave: "square", f0: 1047, at: 0.44, dur: 0.5 }, { wave: "triangle", f0: 523, at: 0.44, dur: 0.5 }],
  lose: [...seq("square", [392, 330, 262], 0.16, 0.16, 0.8), { wave: "square", f0: 196, f1: 98, at: 0.48, dur: 0.6, vol: 0.8 }],
  start: [{ wave: "square", f0: 784, dur: 0.08 }, { wave: "square", f0: 1047, at: 0.09, dur: 0.24 }],
};

/* ---------- silencio global, recordado ---------- */
const KEY = "trama-sfx-silencio";
const listeners = new Set<() => void>();
let muted: boolean | null = null;
const readMuted = () => {
  if (muted === null) {
    try {
      muted = localStorage.getItem(KEY) === "1";
    } catch {
      muted = false;
    }
  }
  return muted;
};
export function isSfxMuted() {
  return typeof window === "undefined" ? true : readMuted();
}
export function setSfxMuted(v: boolean) {
  muted = v;
  try {
    localStorage.setItem(KEY, v ? "1" : "0");
  } catch {
    /* sin almacenamiento */
  }
  listeners.forEach((l) => l());
}

let noise: AudioBuffer | null = null;
function noiseBuffer(ctx: AudioContext) {
  if (noise) return noise;
  noise = ctx.createBuffer(1, Math.round(ctx.sampleRate * 0.5), ctx.sampleRate);
  const d = noise.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return noise;
}

/** Suena un efecto (si no hay silencio). `pitch` multiplica el tono (variedad: 0,9–1,1); `volume` de 0 a 1. */
export function playSfx(name: SfxName, { volume = 0.22, pitch = 1 }: { volume?: number; pitch?: number } = {}) {
  if (typeof window === "undefined" || readMuted()) return;
  let ctx: AudioContext;
  try {
    ctx = audioContext();
  } catch {
    return;
  }
  if (ctx.state === "suspended") void ctx.resume().catch(() => {});
  const t0 = ctx.currentTime + 0.005;
  const out = ctx.createGain();
  out.gain.value = volume;
  out.connect(ctx.destination);
  let end = 0;
  for (const n of PRESETS[name]) {
    const at = t0 + (n.at ?? 0), stop = at + n.dur;
    end = Math.max(end, stop);
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, at);
    env.gain.exponentialRampToValueAtTime(n.vol ?? 1, at + 0.005);
    env.gain.exponentialRampToValueAtTime(0.0001, stop);
    env.connect(out);
    if (n.wave === "noise") {
      const src = ctx.createBufferSource();
      src.buffer = noiseBuffer(ctx);
      src.connect(env);
      src.start(at);
      src.stop(stop);
    } else {
      const osc = ctx.createOscillator();
      osc.type = n.wave;
      osc.frequency.setValueAtTime(n.f0 * pitch, at);
      if (n.f1) osc.frequency.exponentialRampToValueAtTime(n.f1 * pitch, stop);
      osc.connect(env);
      osc.start(at);
      osc.stop(stop);
    }
  }
  setTimeout(() => out.disconnect(), (end - ctx.currentTime + 0.2) * 1000);
}

/** El silencio global y una función para sonar: `const { play, muted, setMuted } = useSfx()`. */
export function useSfx() {
  const m = useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    readMuted,
    () => true,
  );
  return { play: playSfx, muted: m, setMuted: setSfxMuted };
}
