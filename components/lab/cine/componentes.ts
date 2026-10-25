import type { ComponentType } from "react";
import CampoTipografico from "./piezas/CampoTipografico";
import Ventanilla from "./piezas/Ventanilla";
import Cochecito from "./piezas/Cochecito";
import Racimo from "./piezas/Racimo";
import Grabado from "./piezas/Grabado";

/**
 * Piezas de escena que no se pueden describir como datos (un shader propio, una simulación): la ficha las nombra con
 * `{ tipo: "componente", id }` y el banco las busca aquí. Cada estudio registra las suyas.
 */
// cada pieza tiene sus props: las pasa la ficha tal cual
export const COMPONENTES: Record<string, ComponentType<any>> = { "campo-tipografico": CampoTipografico, ventanilla: Ventanilla, cochecito: Cochecito, racimo: Racimo, grabado: Grabado };
