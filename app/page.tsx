import type { Metadata } from "next";
import HomePage from "@/components/site/HomePage";
import PageTransition from "@/components/ui/PageTransition";
import SiteChrome from "@/components/site/SiteChrome";
import { JsonLd, homeJsonLd } from "@/lib/seo";
import { homeData } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Trama · Componentes, guías y recetas para React y Next.js",
  description:
    "Componentes, guías visuales y recetas para webs con carácter: tokens, composición y movimiento en React y Next.js. Recorrido experimental para agentes.",
  alternates: { canonical: "/" },
};

export default function Home() {
  const data = homeData();
  return (
    <SiteChrome>
      <JsonLd data={homeJsonLd(data.counts.components)} />
      <PageTransition kind="wipe" pace="fast">
        <HomePage data={data} />
      </PageTransition>
    </SiteChrome>
  );
}
