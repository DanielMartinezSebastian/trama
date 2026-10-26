import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter_Tight } from "next/font/google";
import Desplazable from "@/components/lab/cine/Desplazable";
import LusionWeb from "@/components/lab/cine/piezas/LusionWeb";

/*
 * Réplica de la portada de lusion.co (docs/43): la web entera con piezas del kit, no solo el racimo de cruces del banco
 * (/lab/cine/lusion, que sigue midiendo el racimo con cine:vuelta). Aeonik es de pago: Inter Tight en su lugar; la
 * monoespaciada es la de la referencia (IBM Plex Mono).
 */
const sans = Inter_Tight({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-lw" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400"], variable: "--font-lw-mono" });

export const metadata: Metadata = { title: "Lusion (réplica) · Trama", robots: { index: false, follow: false } };

export default function Page() {
  return (
    <main className={`${sans.variable} ${mono.variable}`}>
      <Desplazable />
      <LusionWeb />
    </main>
  );
}
