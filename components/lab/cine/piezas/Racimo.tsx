"use client";

import CrossClusterContent, { type CrossClusterContentProps } from "@/lib/crosscluster/content";

/**
 * El racimo de cruces del kit (`lib/crosscluster`) dentro del banco: el mismo motor que `CrossCluster`, así la
 * calibración contra la portada de Lusion (docs/31) prueba el código que se publica. Lleva su propia cámara (ficha con
 * `camara.dePieza`) y el puntero llega por el lienzo, como en la captura.
 */
export default function Racimo(props: CrossClusterContentProps) {
  return <CrossClusterContent {...props} />;
}
