import type { Metadata } from "next";
import Desplazable from "@/components/lab/cine/Desplazable";
import Cenit from "@/components/inspiraciones/cenit/Cenit";

/*
 * Banco de la réplica de lusion.co (docs/43): la inspiración Cénit (/inspiraciones/cenit) a pantalla completa, para
 * compararla con la original con cine:capture y refs:probe. El racimo de cruces solo sigue en /lab/cine/lusion.
 */

export const metadata: Metadata = { title: "Lusion (réplica) · Trama", robots: { index: false, follow: false } };

export default function Page() {
  return (
    <main>
      <Desplazable />
      <Cenit />
    </main>
  );
}
