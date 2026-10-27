"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import Desplazable from "@/components/lab/cine/Desplazable";

/** Cada réplica se carga por separado: abrir una no descarga las otras quince. */
const PAGINAS: Record<string, ComponentType> = {
  matiz: dynamic(() => import("./matiz/Matiz")),
  nura: dynamic(() => import("./nura/Nura")),
  cita: dynamic(() => import("./cita/Cita")),
  melena: dynamic(() => import("./melena/Melena")),
  raiz: dynamic(() => import("./raiz/Raiz")),
  patron: dynamic(() => import("./patron/Patron")),
  nucleo: dynamic(() => import("./nucleo/Nucleo")),
  impulso: dynamic(() => import("./impulso/Impulso")),
  vive: dynamic(() => import("./vive/Vive")),
  talla: dynamic(() => import("./talla/Talla")),
  lobo: dynamic(() => import("./lobo/Lobo")),
  remada: dynamic(() => import("./remada/Remada")),
  ahora: dynamic(() => import("./ahora/Ahora")),
  oficio: dynamic(() => import("./oficio/Oficio")),
  "abuela-rosa": dynamic(() => import("./abuela-rosa/AbuelaRosa")),
  q47: dynamic(() => import("./q47/Q47")),
};

export const replicaLista = (slug: string) => slug in PAGINAS;

export default function Cargador({ slug }: { slug: string }) {
  const Pagina = PAGINAS[slug];
  return (
    <>
      <Desplazable />
      {Pagina ? <Pagina /> : null}
    </>
  );
}
