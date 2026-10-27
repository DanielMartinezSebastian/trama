import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageTransition from "@/components/ui/PageTransition";
import { InspiracionPagina } from "@/components/inspiraciones/Cargador";
import { REPLICAS, paginaDe, replica, rutasDe } from "@/components/inspiraciones/registro";

/*
 * Una página de una inspiración (docs/55, docs/56): una web premiada estudiada en el laboratorio y rehecha con piezas de
 * Trama, con marca, textos e imágenes propios. Se ve a pantalla completa, como las landings; su guía de estilo está en
 * /guias/<guía>. La transición entre páginas la elige el registro.
 */

type Props = { params: Promise<{ slug: string; ruta?: string[] }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return REPLICAS.flatMap((r) => rutasDe(r).map((p) => ({ slug: r.slug, ruta: p.path ? p.path.split("/") : [] })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, ruta = [] } = await params;
  const r = replica(slug);
  const p = r && paginaDe(r, ruta);
  if (!r || !p) return {};
  const camino = `/inspiraciones/${r.slug}${p.path ? `/${p.path}` : ""}`;
  return {
    title: `${p.path ? `${p.titulo} · ${r.nombre}` : r.nombre} · Inspiración de Trama`,
    description: `${r.nombre}, demo de Trama inspirada en ${r.ref}: ${r.firma}.`,
    alternates: { canonical: camino },
  };
}

export default async function InspiracionPage({ params }: Props) {
  const { slug, ruta = [] } = await params;
  const r = replica(slug);
  if (!r || !paginaDe(r, ruta)) notFound();
  return (
    <PageTransition kind={r.transicion ?? "fade"} pace="fast">
      <InspiracionPagina slug={slug} ruta={ruta} />
    </PageTransition>
  );
}
