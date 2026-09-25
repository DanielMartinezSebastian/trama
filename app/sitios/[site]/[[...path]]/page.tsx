import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SitePage } from "@/components/sites/SiteRouter";
import { getRoute, getSite, sites } from "@/lib/sites";

type Props = { params: Promise<{ site: string; path?: string[] }> };

export const dynamicParams = false;

/** Todas las páginas de todas las webs, prerenderizadas. */
export function generateStaticParams() {
  return sites.flatMap((s) => s.routes.map((r) => ({ site: s.slug, path: r.path ? r.path.split("/") : [] })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { site, path = [] } = await params;
  const s = getSite(site);
  const r = getRoute(site, path);
  return { title: s && r ? (r.path ? `${r.title} · ${s.name}` : s.title) : "Trama", description: s?.blurb };
}

export default async function Page({ params }: Props) {
  const { site, path = [] } = await params;
  if (!getRoute(site, path)) notFound();
  return <SitePage site={site} path={path} />;
}
