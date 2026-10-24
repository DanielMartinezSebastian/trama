"use client";

import PortholeContent, { type PortholeContentProps } from "@/lib/porthole/content";

/**
 * La ventanilla del kit (`lib/porthole`) dentro del banco: el mismo motor que `Porthole`, así la calibración contra
 * Hublot (docs/28) prueba el código que se publica. Lleva su propia cámara (ficha con `camara.dePieza`).
 */
export default function Ventanilla(props: PortholeContentProps) {
  return <PortholeContent {...props} />;
}
