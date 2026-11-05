import type { Metadata } from "next";
import Escaparate from "@/components/propuestas/escaparate/Escaparate";
import { demoGroups, homeData } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Escaparate · propuesta de web para Trama",
  description: "Propuesta de portada para Trama: eliges tu negocio y un estilo, y ves tu web montada con piezas reales de la librería.",
};

export default function EscaparatePage() {
  const { counts } = homeData();
  const sectores = demoGroups()
    .filter((g) => g.kind === "sector")
    .map((g) => ({ id: g.id, label: g.label, items: g.items }));
  return <Escaparate sectores={sectores} counts={counts} />;
}
