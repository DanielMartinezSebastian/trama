import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BenchLoader from "@/components/lab/cine/BenchLoader";
import { ESTUDIOS } from "@/components/lab/cine/estudios";

/*
 * Banco de pruebas de cine (docs/26): monta la ficha de un estudio a pantalla completa, sin interfaz, para capturarlo con
 * `npm run cine:capture -- http://localhost:3000/lab/cine/<estudio>` y compararlo con su referencia (`cine:compare`).
 */

export const metadata: Metadata = { title: "Banco de cine · Trama", robots: { index: false, follow: false } };

export function generateStaticParams() {
  return Object.keys(ESTUDIOS).map((estudio) => ({ estudio }));
}

export default async function Page({ params }: { params: Promise<{ estudio: string }> }) {
  const { estudio } = await params;
  if (!ESTUDIOS[estudio]) notFound();
  return <BenchLoader id={estudio} />;
}
