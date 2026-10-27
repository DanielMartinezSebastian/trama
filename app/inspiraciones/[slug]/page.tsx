import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Cargador from "@/components/inspiraciones/Cargador";
import { REPLICAS, replica } from "@/components/inspiraciones/registro";

/*
 * Una inspiración (docs/55): una web premiada estudiada en el laboratorio y rehecha con piezas de Trama, con marca, textos e
 * imágenes propios. Se ve a pantalla completa, como las landings; su guía de estilo está en /guias/<guía>.
 */

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return REPLICAS.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const r = replica(slug);
  if (!r) return {};
  return {
    title: `${r.nombre} · Inspiración de Trama`,
    description: `${r.nombre}, demo de Trama inspirada en ${r.ref}: ${r.firma}.`,
    alternates: { canonical: `/inspiraciones/${r.slug}` },
  };
}

export default async function InspiracionPage({ params }: Props) {
  const { slug } = await params;
  if (!replica(slug)) notFound();
  return <Cargador slug={slug} />;
}
