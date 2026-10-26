"use client";

import ToyDriveContent, { type ToyDriveContentProps } from "@/lib/toydrive/content";

/**
 * El coche de juguete del kit (`lib/toydrive` sobre `lib/physics`) dentro del banco: el mismo motor que `ToyDrive`, así
 * la calibración contra el portfolio de Bruno Simon (docs/29) prueba el código que se publica. Lleva su propia cámara
 * (ficha con `camara.dePieza`); el teclado llega por la ventana, como en la captura.
 */
export default function Cochecito(props: Omit<ToyDriveContentProps, "fuente"> & { fuente?: string }) {
  return <ToyDriveContent fuente="/fonts/anton/anton.typeface.json" {...props} />;
}
