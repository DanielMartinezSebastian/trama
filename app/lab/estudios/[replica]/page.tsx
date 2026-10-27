import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Cargador from "@/components/inspiraciones/Cargador";
import { REPLICAS, replica } from "@/components/inspiraciones/registro";

/* Réplica de una web estudiada (docs/50 §2 E13): marca inventada, estética y estructura de la referencia, piezas del kit. */

export function generateStaticParams() {
  return REPLICAS.map((r) => ({ replica: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ replica: string }> }): Promise<Metadata> {
  const r = replica((await params).replica);
  return { title: r ? `${r.nombre} (réplica de ${r.ref}) · Trama` : "Réplica · Trama", robots: { index: false, follow: false } };
}

export default async function Page({ params }: { params: Promise<{ replica: string }> }) {
  const { replica: slug } = await params;
  if (!replica(slug)) notFound();
  return <Cargador slug={slug} />;
}
