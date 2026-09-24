import type { Metadata } from "next";
import Playground from "@/components/playground/Playground";

export const metadata: Metadata = {
  title: "Componentes · Trama",
  description: "Catálogo de componentes reutilizables con vista previa en tiempo real y props editables.",
};

export default function ComponentesPage() {
  return <Playground />;
}
