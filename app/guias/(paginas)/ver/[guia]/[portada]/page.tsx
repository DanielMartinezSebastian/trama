import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GuideFrame from "@/components/ui/GuideFrame";
import { HEROES } from "@/components/site/guias/content";
import { GuideHeroView } from "@/components/site/guias/heroes";
import { STYLE_GUIDES } from "@/lib/ui/guides";

type Props = { params: Promise<{ guia: string; portada: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return STYLE_GUIDES.flatMap((g) => HEROES.map((h) => ({ guia: g.id, portada: h.id })));
}

const find = (guia: string, portada: string) => ({ g: STYLE_GUIDES.find((x) => x.id === guia), h: HEROES.find((x) => x.id === portada) });

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { guia, portada } = await params;
  const { g, h } = find(guia, portada);
  if (!g || !h) return { title: "Trama" };
  return { title: `${h.code} ${h.label} · ${g.label} · Guías de Trama`, description: h.note, alternates: { canonical: `/guias/ver/${guia}/${portada}` } };
}

export default async function GuideHeroPage({ params }: Props) {
  const { guia, portada } = await params;
  const { g, h } = find(guia, portada);
  if (!g || !h) notFound();
  return (
    <GuideFrame guide={g} as="main" className="gx-page">
      <GuideHeroView id={h.id} />
    </GuideFrame>
  );
}
