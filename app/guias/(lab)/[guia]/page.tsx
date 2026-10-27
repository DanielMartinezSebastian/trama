import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GuideSheet from "@/components/site/guias/GuideSheet";
import { datosDeGuia } from "@/components/site/guias/fuentes";
import { STYLE_GUIDES } from "@/lib/ui/guides";

/* La hoja de estilo de una guía (docs/54): todo lo que el repo sabe de ella. */

type Props = { params: Promise<{ guia: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return STYLE_GUIDES.map((g) => ({ guia: g.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { guia } = await params;
  const g = STYLE_GUIDES.find((x) => x.id === guia);
  return g ? { title: `${g.label} · Guías de estilo · Trama`, description: g.note, alternates: { canonical: `/guias/${g.id}` } } : {};
}

export default async function GuiaPage({ params }: Props) {
  const d = datosDeGuia((await params).guia);
  if (!d) notFound();
  return (
    <div className="tr-page">
      <GuideSheet d={d} />
    </div>
  );
}
