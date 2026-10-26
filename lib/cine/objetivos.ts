/**
 * Objetivo y veredicto de cada eje (docs/36 A1). Un eje cumple cuando su alejamiento queda por debajo de su objetivo:
 *   objetivo = máx(ruido · 1,1 + 0,02, umbral)
 * El umbral es 15 % por defecto (10 % el presupuesto) y la receta puede cambiarlo por eje con `objetivos`, o marcar un
 * eje como "no aplica" cuando no mide nada en esa web (las piezas de Bruno, sucesos del mundo vivo; la coreografía de
 * Chartogne, los pájaros). Lo que está por debajo del ruido de la propia referencia ya no se puede mejorar de forma
 * medible, así que el ruido sube el objetivo y nunca lo baja.
 */
export type Objetivos = Record<string, number | "no aplica">;

export const UMBRAL: Record<string, number> = { presupuesto: 0.1 };
export const UMBRAL_DEFECTO = 0.15;

export type Veredicto = { eje: string; valor: number; objetivo: number | null; ruido?: number; cumple: boolean | null; falta: number };

export function veredictos(alejamiento: Record<string, number>, ruido: Record<string, number> | null, objetivos: Objetivos = {}) {
  const ejes: Veredicto[] = Object.entries(alejamiento)
    .sort((a, b) => b[1] - a[1])
    .map(([eje, valor]) => {
      const o = objetivos[eje];
      const r = ruido?.[eje];
      if (o === "no aplica") return { eje, valor, objetivo: null, ruido: r, cumple: null, falta: 0 };
      const umbral = typeof o === "number" ? o : (UMBRAL[eje] ?? UMBRAL_DEFECTO);
      const objetivo = Math.max(r !== undefined ? r * 1.1 + 0.02 : 0, umbral);
      return { eje, valor, objetivo, ruido: r, cumple: valor <= objetivo, falta: Math.max(0, valor - objetivo) };
    });
  const cuentan = ejes.filter((e) => e.cumple !== null);
  return { ejes, cumple: cuentan.filter((e) => e.cumple).length, total: cuentan.length };
}

export const textoVeredicto = (v: Veredicto) =>
  v.cumple === null ? "no aplica" : v.cumple ? "cumple" : `falta ${Math.round(v.falta * 100)} pt`;
