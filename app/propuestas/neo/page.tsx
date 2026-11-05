import type { Metadata } from "next";
import SiteChrome from "@/components/site/SiteChrome";
import Neo from "@/components/propuestas/neo/Neo";
import { demoGroups, homeData } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Neo · propuesta de web para Trama",
  description: "Propuesta neofuturista de la portada de Trama: la misma estructura de la web actual con escenas 3D del kit (ObjectStage, CrossCluster, DeviceMockup3D y TypeField).",
};

export default function NeoPage() {
  const data = homeData();
  const sectores = demoGroups()
    .filter((g) => g.kind === "sector")
    .map((g) => ({ id: g.id, label: g.label, blurb: g.blurb, items: g.items }));
  return (
    <SiteChrome>
      <Neo data={data} sectores={sectores} />
    </SiteChrome>
  );
}
