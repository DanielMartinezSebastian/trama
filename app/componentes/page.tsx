import type { Metadata } from "next";
import Playground from "@/components/playground/Playground";
import SiteChrome from "@/components/site/SiteChrome";

export const metadata: Metadata = {
  title: "Componentes · Trama",
  description: "Catálogo interactivo de los componentes de Trama: vista previa en tiempo real, props editables, ocho estilos, tokens de tema y código de uso listo para copiar.",
  alternates: { canonical: "/componentes" },
};

export default function ComponentesPage() {
  return (
    <SiteChrome app>
      <Playground />
    </SiteChrome>
  );
}
