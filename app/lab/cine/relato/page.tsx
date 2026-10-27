import type { Metadata } from "next";
import Desplazable from "@/components/lab/cine/Desplazable";
import Brasa from "@/components/inspiraciones/brasa/Brasa";

/*
 * Banco del relato con scroll (docs/30, docs/36 B1): la inspiración Brasa (/inspiraciones/brasa), basada en
 * meermohsin.me, con el mismo guion de rueda que la referencia; se compara con `cine:compare` (receta `relato`).
 */

export const metadata: Metadata = { title: "Banco de relato · Trama", robots: { index: false, follow: false } };

export default function Page() {
  return (
    <>
      <Desplazable />
      <Brasa />
    </>
  );
}
