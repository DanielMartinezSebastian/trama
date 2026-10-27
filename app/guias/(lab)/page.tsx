import type { Metadata } from "next";
import GuideIndex from "@/components/site/guias/GuideIndex";
import GuideLab from "@/components/site/guias/GuideLab";
import PageTransition from "@/components/ui/PageTransition";
import { STYLE_GUIDES } from "@/lib/ui/guides";

export const metadata: Metadata = {
  title: "Guías de estilo · Trama",
  description: "Guías de estilo construidas con todo lo medido en el repo: webs premiadas, estudios por sector con sus réplicas y las propias webs y demos de Trama. Cada guía tiene su hoja de estilo con color, letra, escala, espacio, movimiento, componentes, receta y código.",
  alternates: { canonical: "/guias" },
};

export default function GuiasPage() {
  return (
    <PageTransition kind="wipe" pace="fast">
      <div className="tr-page">
        <header className="tr-page__head">
          <p className="tr-label">Guías de estilo · {STYLE_GUIDES.length}</p>
          <h1 className="tr-statement">Guías de estilo hechas con lo que hemos medido</h1>
          <p className="tr-sec__lead">
            Cada guía fija colores, letras, tamaños, espacios, superficies y movimiento con valores medidos en el navegador: en
            webs premiadas, en webs reales de cada sector replicadas y comparadas con su original, y en las propias webs y demos
            de Trama. Abre una para ver su hoja de estilo completa, o pruébalas abajo con la misma historia (docs/16, docs/54).
          </p>
        </header>
        <GuideIndex />
        <header className="tr-page__head">
          <p className="tr-label">Laboratorio</p>
          <h2 className="tr-statement" style={{ fontSize: "clamp(32px, 4.4vw, 64px)" }}>La misma historia, contada con cada guía</h2>
          <p className="tr-sec__lead">
            Elige una guía, cambia la composición de la portada y la estructura del relato, y compáralas. El contenido es siempre el
            mismo (Albor, una marca ficticia): lo único que cambia es cómo se cuenta.
          </p>
        </header>
        <GuideLab />
      </div>
    </PageTransition>
  );
}
