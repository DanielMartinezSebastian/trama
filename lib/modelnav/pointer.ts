import { createContext, useContext, type MutableRefObject } from "react";

/**
 * Dónde está el puntero respecto al medallón de `ModelNav`: `x` e `y` de −1 a 1 (relativos a la ventana, y hacia arriba) y
 * `near` de 0 a 1 (1 = encima del medallón, 0 = a más de ~180 px). Lo lee el modelo para reaccionar a su manera (abrir la boca,
 * mirar, brillar…); la inclinación hacia el puntero ya la pone el medallón.
 */
export type ModelNavPointer = { x: number; y: number; near: number };

export const ModelNavPointerContext = createContext<MutableRefObject<ModelNavPointer> | null>(null);

const NONE = { current: { x: 0, y: 0, near: 0 } } as MutableRefObject<ModelNavPointer>;
/** Dentro del modelo de un `ModelNav`: el puntero (una ref que se actualiza sin re-renderizar). */
export const useModelNavPointer = () => useContext(ModelNavPointerContext) ?? NONE;
