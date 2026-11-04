import type { Metadata } from "next";
import DemosIndex from "@/components/site/DemosIndex";
import PageTransition from "@/components/ui/PageTransition";
import { demoGroups } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Demos · Trama",
  description: "Webs y landings hechas con Trama por sector (peluquería, gimnasio, restaurante, tienda, academia…) y demos técnicas: fondos generativos, efectos de texto y scroll.",
  alternates: { canonical: "/demos" },
};

export default function DemosPage() {
  return (
    <PageTransition kind="wipe" pace="fast">
      <DemosIndex groups={demoGroups()} />
    </PageTransition>
  );
}
