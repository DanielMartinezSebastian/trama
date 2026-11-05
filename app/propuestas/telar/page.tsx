import type { Metadata } from "next";
import Telar from "@/components/propuestas/telar/Telar";
import { demoGroups, homeData } from "@/lib/site-data";
import { STYLE_GUIDES } from "@/lib/ui/guides";

export const metadata: Metadata = {
  title: "Telar · propuesta de web para Trama",
  description: "Propuesta de portada para Trama: el nombre hecho materia. Los tokens son la urdimbre, los componentes la trama, y la página se teje al bajar.",
};

export default function TelarPage() {
  const { counts } = homeData();
  const sectores = demoGroups()
    .filter((g) => g.kind === "sector")
    .map((g) => ({ id: g.id, label: g.label, n: g.items.length }));
  const guias = STYLE_GUIDES.map((g) => ({ id: g.id, label: g.label, bg: g.tokens.bg, fg: g.tokens.fg, acc: g.tokens.acc }));
  return <Telar counts={counts} sectores={sectores} guias={guias} />;
}
