import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GuideFrame from "@/components/ui/GuideFrame";
import { STORIES } from "@/components/site/guias/content";
import { GuideHeroView } from "@/components/site/guias/heroes";
import { GuideStoryView } from "@/components/site/guias/stories";
import { STYLE_GUIDES } from "@/lib/ui/guides";

type Props = { params: Promise<{ guia: string; relato: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return STYLE_GUIDES.flatMap((g) => STORIES.map((s) => ({ guia: g.id, relato: s.id })));
}

const find = (guia: string, relato: string) => ({ g: STYLE_GUIDES.find((x) => x.id === guia), s: STORIES.find((x) => x.id === relato) });

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { guia, relato } = await params;
  const { g, s } = find(guia, relato);
  if (!g || !s) return { title: "Trama" };
  return { title: `${s.code} ${s.label} · ${g.label} · Guías de Trama`, description: s.note, alternates: { canonical: `/guias/relato/${guia}/${relato}` } };
}

/** Página completa: la portada recomendada de la guía y el relato elegido. */
export default async function GuideStoryPage({ params }: Props) {
  const { guia, relato } = await params;
  const { g, s } = find(guia, relato);
  if (!g || !s) notFound();
  return (
    <GuideFrame guide={g} as="main" className="gx-page">
      <GuideHeroView id={g.heroes[0]} />
      <GuideStoryView id={s.id} />
    </GuideFrame>
  );
}
