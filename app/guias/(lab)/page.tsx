import type { Metadata } from "next";
import GuideLab from "@/components/site/guias/GuideLab";
import PageTransition from "@/components/ui/PageTransition";

export const metadata: Metadata = {
  title: "Guías de estilo · Trama",
  description: "Ocho guías de estilo sacadas de las webs premiadas en Awwwards: la misma historia contada con cada guía, ocho composiciones de portada y diez estructuras de relato, con el código para copiar.",
  alternates: { canonical: "/guias" },
};

export default function GuiasPage() {
  return (
    <PageTransition kind="wipe" pace="fast">
      <div className="tr-page">
        <header className="tr-page__head">
          <p className="tr-label">Guías de estilo · 8</p>
          <h1 className="tr-statement">La misma historia, contada como las webs que ganan</h1>
          <p className="tr-sec__lead">
            Cada guía fija colores, fuentes, tamaños, espacios y movimiento con los valores medidos en las webs premiadas
            (docs/16). Elige una, cambia la composición de la portada y la estructura del relato, y compáralas. El contenido es
            siempre el mismo (Albor, una marca ficticia): lo único que cambia es cómo se cuenta.
          </p>
        </header>
        <GuideLab />
      </div>
    </PageTransition>
  );
}
