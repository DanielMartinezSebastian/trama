/**
 * Registro de las webs completas (`/sitios/<slug>/…`): metadatos y páginas de cada una. Datos puros: lo leen las rutas
 * (generateStaticParams, títulos), la galería y el catálogo (`npm run catalog`).
 */
import * as kernel from "@/components/sites/kernel-log/data";
import * as pixelforge from "@/components/sites/pixelforge/data";
import * as vigia from "@/components/sites/vigia/data";
import * as onda from "@/components/sites/onda/data";
import * as clara from "@/components/sites/clara-vidal/data";
import * as estudio from "@/components/sites/estudio/data";
import * as pulso from "@/components/sites/pulso/data";
import * as barro from "@/components/sites/barro/data";
import * as plano from "@/components/sites/plano/data";
import * as foro from "@/components/sites/foro/data";
import * as arbor from "@/components/sites/arbor/data";
import * as sonar from "@/components/sites/sonar/data";

export type SiteRoute = { path: string; title: string };
export type SiteMeta = { slug: string; name: string; title: string; blurb: string; accent: string; tag: string; routes: SiteRoute[]; dir: string };

export const sites: SiteMeta[] = [
  { ...kernel.meta, routes: kernel.ROUTES, dir: "components/sites/kernel-log" },
  { ...pixelforge.meta, routes: pixelforge.ROUTES, dir: "components/sites/pixelforge" },
  { ...vigia.meta, routes: vigia.ROUTES, dir: "components/sites/vigia" },
  { ...onda.meta, routes: onda.ROUTES, dir: "components/sites/onda" },
  { ...clara.meta, routes: clara.ROUTES, dir: "components/sites/clara-vidal" },
  { ...estudio.meta, routes: estudio.ROUTES, dir: "components/sites/estudio" },
  { ...pulso.meta, routes: pulso.ROUTES, dir: "components/sites/pulso" },
  { ...barro.meta, routes: barro.ROUTES, dir: "components/sites/barro" },
  { ...plano.meta, routes: plano.ROUTES, dir: "components/sites/plano" },
  { ...foro.meta, routes: foro.ROUTES, dir: "components/sites/foro" },
  { ...arbor.meta, routes: arbor.ROUTES, dir: "components/sites/arbor" },
  { ...sonar.meta, routes: sonar.ROUTES, dir: "components/sites/sonar" },
];

export const getSite = (slug: string) => sites.find((s) => s.slug === slug);
export const getRoute = (slug: string, path: string[] = []) => getSite(slug)?.routes.find((r) => r.path === path.join("/"));
