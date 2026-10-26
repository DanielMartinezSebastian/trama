import type { Metadata } from "next";
import FlameHorizon from "@/components/ui/FlameHorizon";
import ThornEmblem from "@/components/ui/ThornEmblem";

/* Prueba de las piezas de B1 (docs/36): FlameHorizon en cuatro momentos de su coreografía y ThornEmblem de frente y de canto */

export const metadata: Metadata = { title: "Prueba de llamas · Trama", robots: { index: false, follow: false } };

export default function Page() {
  return (
    <main style={{ background: "#000", ["--bg" as string]: "#000", ["--acc" as string]: "#b0001a", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
      {[0.12, 0.25, 0.75, 0.95].map((p) => (
        <FlameHorizon key={p} progress={p} height={300} className={`p-${Math.round(p * 100)}`} />
      ))}
      <ThornEmblem height={300} shape="wings" lighting="red" />
      <ThornEmblem height={300} progress={1} />
    </main>
  );
}
