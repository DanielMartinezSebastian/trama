"use client";

import TypeFieldMesh, { type CampoTipograficoProps } from "@/lib/typefield/field";
import { useRelojFicha } from "../reloj";

/**
 * El campo tipográfico del kit (`lib/typefield`) dentro del banco: el progreso es el reloj de la ficha y los colores
 * vienen en lineal, como los mide cine:capture. Así la calibración contra Plain Sight (docs/27) prueba el mismo código
 * que usa `TypeField`.
 */
export default function CampoTipografico(props: Omit<CampoTipograficoProps, "progreso">) {
  const reloj = useRelojFicha();
  return <TypeFieldMesh coloresLineales {...props} progreso={reloj} />;
}
