"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

const subscribe = (cb: () => void) => {
  const mq = matchMedia(QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/**
 * `true` si el sistema pide reducir el movimiento (WCAG 2.3.3). Se actualiza si la preferencia cambia con la página abierta.
 * En el servidor devuelve `false`: los componentes deben arrancar igual y frenar al hidratar.
 */
export function useReducedMotion() {
  return useSyncExternalStore(subscribe, () => matchMedia(QUERY).matches, () => false);
}
