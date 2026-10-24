import { createContext, useContext, type RefObject } from "react";

/**
 * El reloj de la ficha para las piezas propias de un estudio (`componentes.ts`): segundos (reloj de tiempo) o progreso
 * de 0 a 1 (reloj de scroll, ya con el amortiguado de la ficha). Lo da el banco; una pieza lo lee en su useFrame.
 */
export const RelojContext = createContext<RefObject<number> | null>(null);

export function useRelojFicha(): RefObject<number> {
  const r = useContext(RelojContext);
  if (!r) throw new Error("[cine] useRelojFicha fuera del banco");
  return r;
}
