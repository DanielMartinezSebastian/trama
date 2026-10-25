"use client";

import EngravedMapContent, { type EngravedMapContentProps } from "@/lib/gravure/content";
import { Grabado as Composicion } from "@/lib/gravure/scene";
import type { OpcionesGrabado } from "@/lib/gravure/post";

/**
 * El paisaje grabado del kit (`lib/gravure`) dentro del banco: el mismo motor que `EngravedMap` (escena con el material
 * de lápiz y su composición en papel), así la calibración contra Chartogne-Taillet (docs/32) prueba el código que se
 * publica. Lleva su propia cámara (ficha con `camara.dePieza`) y su propia composición (la ficha no pone posprocesado).
 */
export default function Grabado({ grabado = {}, entrada = 3, ...props }: EngravedMapContentProps & { grabado?: OpcionesGrabado }) {
  return (
    <>
      <EngravedMapContent entrada={entrada} objetivo={null} {...props} />
      <Composicion grabado={grabado} entrada={entrada} />
    </>
  );
}
