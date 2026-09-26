import type { Metadata } from "next";
import DemosIndex from "@/components/site/DemosIndex";
import { demoGroups } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Demos · Trama",
  description: "Landings y webs de referencia, fondos generativos, efectos de texto y páginas con scroll hechas con Trama.",
  alternates: { canonical: "/demos" },
};

export default function DemosPage() {
  return <DemosIndex groups={demoGroups()} />;
}
