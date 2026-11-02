import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Horario from "@/components/lucero/Horario";
import Maqueta from "@/components/lucero/Maqueta";
import Vagon from "@/components/lucero/Vagon";
import Ventanilla from "@/components/lucero/Ventanilla";

const versions = {
  horario: { title: "Lucero — horario", description: "El tren nocturno Bilbao–Cádiz como tabla horaria: eliges tramo en la propia tabla y el precio se calcula en línea.", Page: Horario },
  vagon: { title: "Lucero — vagón", description: "El tren nocturno Bilbao–Cádiz en corte lateral: se recorre de lado y se elige la plaza sobre el dibujo.", Page: Vagon },
  ventanilla: { title: "Lucero — ventanilla", description: "El tren nocturno Bilbao–Cádiz visto desde la ventanilla: el scroll hace pasar las once horas de viaje.", Page: Ventanilla },
  maqueta: { title: "Lucero — maqueta", description: "El tren nocturno Bilbao–Cádiz como maqueta 3D: pasa bajo la cámara y las plazas libres se eligen en la escena.", Page: Maqueta },
};
type Version = keyof typeof versions;
const isVersion = (v: string): v is Version => v in versions;

export const dynamicParams = false;
export function generateStaticParams() { return Object.keys(versions).map((version) => ({ version })); }
export async function generateMetadata({ params }: { params: Promise<{ version: string }> }): Promise<Metadata> {
  const { version } = await params;
  if (!isVersion(version)) return { title: "Lucero" };
  return { title: versions[version].title, description: versions[version].description };
}
export default async function LuceroPage({ params }: { params: Promise<{ version: string }> }) {
  const { version } = await params;
  if (!isVersion(version)) notFound();
  const { Page } = versions[version];
  return <Page />;
}
