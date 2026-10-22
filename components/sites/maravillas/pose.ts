import type { RoomSlug } from "./data";

/** La pose de una pieza: la escribe la página (el juego) y la lee su escena en cada fotograma. Sin three: se importa en todas partes. */
export type PiecePose = {
  /** giro (radianes) alrededor del eje vertical y del horizontal, y en el plano de la pantalla */
  yaw: number;
  pitch: number;
  roll: number;
  /** minutos en la esfera del reloj (720 = una vuelta de la horaria) */
  minute: number;
  /** ángulo de la alidada del astrolabio (radianes, 0 = derecha, π/2 = arriba) */
  alidade: number;
  /** el reloj anda solo (tras ganar) */
  ticking: boolean;
};

export const POSE_START: Record<RoomSlug, PiecePose> = {
  mar: { yaw: 1.15, pitch: -0.75, roll: 0, minute: 0, alidade: 0, ticking: false },
  tierra: { yaw: 0.25, pitch: -0.2, roll: 0, minute: 0, alidade: 0, ticking: false },
  cielo: { yaw: 0, pitch: 0, roll: 0, minute: 0, alidade: 0.35, ticking: false },
  // las 10:08, la hora de los escaparates de relojería
  tiempo: { yaw: 0, pitch: 0, roll: 0, minute: 10 * 60 + 8, alidade: 0, ticking: false },
};

/** Dónde está la pieza: en su sala se juega; en el índice, el estante y la vitrina se exhibe (gira despacio). */
export type PieceMode = "game" | "display" | "shelf";
