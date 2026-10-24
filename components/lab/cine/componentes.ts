import type { ComponentType } from "react";
import CampoTipografico from "./piezas/CampoTipografico";

/**
 * Piezas de escena que no se pueden describir como datos (un shader propio, una simulación): la ficha las nombra con
 * `{ tipo: "componente", id }` y el banco las busca aquí. Cada estudio registra las suyas.
 */
// cada pieza tiene sus props: las pasa la ficha tal cual
export const COMPONENTES: Record<string, ComponentType<any>> = { "campo-tipografico": CampoTipografico };
