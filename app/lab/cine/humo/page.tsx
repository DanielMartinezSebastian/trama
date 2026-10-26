import type { Metadata } from "next";
import FluidCursor from "@/components/ui/FluidCursor";

/* Prueba de FluidCursor (docs/41 P5) sobre el degradado de la portada de Meer Mohsin */

export const metadata: Metadata = { title: "Prueba de humo · Trama", robots: { index: false, follow: false } };

export default function Page() {
  return (
    <main style={{ height: "100vh", backgroundColor: "#000", backgroundImage: "linear-gradient(223.86deg, rgba(192,4,6,.894) 0%, rgba(0,0,0,.894) 89.5%)", ["--acc" as string]: "#e00000" }}>
      <FluidCursor />
    </main>
  );
}
