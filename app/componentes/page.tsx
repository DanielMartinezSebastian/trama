import type { Metadata } from "next";
import Playground from "@/components/playground/Playground";
import SiteChrome from "@/components/site/SiteChrome";

export const metadata: Metadata = {
  title: "Componentes · Trama",
  description: "Catálogo de componentes reutilizables con vista previa en tiempo real y props editables.",
};

export default function ComponentesPage() {
  return (
    <SiteChrome app>
      <Playground />
    </SiteChrome>
  );
}
