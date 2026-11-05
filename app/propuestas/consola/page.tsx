import type { Metadata } from "next";
import Consola from "@/components/propuestas/consola/Consola";
import { demoGroups, homeData } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Consola · propuesta de web para Trama",
  description: "Propuesta de portada para Trama: un escritorio de texto con órdenes, ventanas y agentes, en la estética ASCII de la librería.",
};

export default function ConsolaPage() {
  const { counts, categories } = homeData();
  const grupos = demoGroups().map((g) => ({ id: g.id, kind: g.kind, label: g.label, items: g.items.map((i) => ({ href: i.href, title: i.title })) }));
  return <Consola counts={counts} categories={categories.map((c) => ({ id: c.id, label: c.label, count: c.count, first: c.first }))} grupos={grupos} />;
}
