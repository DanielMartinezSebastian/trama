import type { MetadataRoute } from "next";
import { DOC_PAGES, docHref } from "@/lib/docs";
import { demos } from "@/lib/demos";
import { sites } from "@/lib/sites";
import { SITE_URL } from "@/lib/site-url";

/** Todas las páginas públicas: la web de la librería, la documentación, las demos y las webs completas. */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({ url: `${SITE_URL}${path}`, priority });
  return [
    url("/", 1),
    url("/componentes", 0.9),
    url("/demos", 0.8),
    ...DOC_PAGES.map((p) => url(docHref(p.slug), p.slug === "empezar" ? 0.9 : 0.7)),
    ...demos.map((d) => url(`/demo/${d.slug}`, d.family === "landing" ? 0.6 : 0.4)),
    ...sites.flatMap((s) => s.routes.map((r) => url(`/sitios/${s.slug}${r.path ? `/${r.path}` : ""}`, r.path ? 0.4 : 0.6))),
  ];
}
