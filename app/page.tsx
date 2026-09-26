import type { Metadata } from "next";
import HomePage from "@/components/site/HomePage";
import SiteChrome from "@/components/site/SiteChrome";
import { JsonLd, homeJsonLd } from "@/lib/seo";
import { homeData } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Trama · Librería de componentes ASCII, textmode y pixel art para Next.js",
  description:
    "Componentes React para Next.js con fondos ASCII y textmode, efectos de texto, pixel art y secciones de landing listas para pegar. Ocho estilos, un juego de tokens CSS, catálogo interactivo y documentación.",
  alternates: { canonical: "/" },
};

export default function Home() {
  const data = homeData();
  return (
    <SiteChrome>
      <JsonLd data={homeJsonLd(data.counts.components)} />
      <HomePage data={data} />
    </SiteChrome>
  );
}
