import { useSyncExternalStore } from "react";

export type CocheMaqueta = { numero: string; tono: string; plazas: number; color: string };
export type Elegida = { coche: number; n: number } | null;

export const COCHES_MAQUETA: CocheMaqueta[] = [
  { numero: "1", tono: "#252525", plazas: 12, color: "sandybrown" },
  { numero: "2", tono: "#454545", plazas: 7, color: "lightskyblue" },
  { numero: "3", tono: "#252525", plazas: 3, color: "#f4a6b8" },
  { numero: "4", tono: "#454545", plazas: 0, color: "gray" },
  { numero: "5", tono: "#252525", plazas: 0, color: "gray" },
];
const ASIENTOS = 64;
/* 17 es primo con 64: reparte las plazas libres por el coche sin repetir y siempre igual. */
export const libres = (plazas: number) => Array.from({ length: plazas }, (_, i) => (i * 17 + 5) % ASIENTOS);
/* Avance del scroll con cada coche centrado; al final queda el andén vacío. */
export const paradaCoche = (i: number) => (6 + 26 * i) / 160;
export const AVANCE_ANDEN = .92;
export const capituloDe = (t: number) => (t < .02 ? -1 : t > .84 ? 5 : Math.max(0, Math.min(4, Math.round((t * 160 - 6) / 26))));

/*
 * La plaza vive fuera de React a propósito: si un cambio de estado vuelve a renderizar <Canvas>, ScrollControls pierde
 * su escucha de scroll y el tren deja de moverse. Así la escena y el panel la comparten sin tocar el lienzo.
 */
let plaza: Elegida = null;
const oyentes = new Set<() => void>();
export const fijarPlaza = (p: Elegida) => { plaza = p; oyentes.forEach((f) => f()); };
const suscribir = (f: () => void) => { oyentes.add(f); return () => { oyentes.delete(f); }; };
export const usePlaza = () => useSyncExternalStore(suscribir, () => plaza, () => null);
