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
import * as mota from "@/components/sites/mota/data";
import * as alzado from "@/components/sites/alzado/data";
import * as vertice from "@/components/sites/vertice/data";
import * as volt from "@/components/sites/volt/data";
import * as faro from "@/components/sites/faro/data";
import * as hamaca from "@/components/sites/hamaca/data";
import * as travesia from "@/components/sites/travesia/data";
import * as almibar from "@/components/sites/almibar/data";
import * as almibarTaller from "@/components/sites/almibar-taller/data";
import * as almibarBarrio from "@/components/sites/almibar-barrio/data";
import * as quilate from "@/components/sites/quilate/data";
import * as anima from "@/components/sites/anima/data";
import * as cota from "@/components/sites/cota/data";
import * as maravillas from "@/components/sites/maravillas/data";
import * as runa from "@/components/sites/runa/data";
import * as vozDeLaTierra from "@/components/sites/voz-de-la-tierra/data";
import * as nadir from "@/components/sites/nadir/data";
import * as hebra from "@/components/sites/hebra/data";
import * as cadencia from "@/components/sites/cadencia/data";
import * as laTramoya from "@/components/sites/la-tramoya/data";
import * as esparta from "@/components/sites/esparta/data";
import * as forja from "@/components/sites/forja/data";

export type SiteRoute = { path: string; title: string };
export type SiteMeta = { slug: string; name: string; title: string; blurb: string; accent: string; tag: string; routes: SiteRoute[]; dir: string };

export const sites: SiteMeta[] = [
  { ...esparta.meta, routes: esparta.ROUTES, dir: "components/sites/esparta" },
  { ...forja.meta, routes: forja.ROUTES, dir: "components/sites/forja" },
  { ...hebra.meta, routes: hebra.ROUTES, dir: "components/sites/hebra" },
  { ...cadencia.meta, routes: cadencia.ROUTES, dir: "components/sites/cadencia" },
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
  { ...mota.meta, routes: mota.ROUTES, dir: "components/sites/mota" },
  { ...alzado.meta, routes: alzado.ROUTES, dir: "components/sites/alzado" },
  { ...vertice.meta, routes: vertice.ROUTES, dir: "components/sites/vertice" },
  { ...volt.meta, routes: volt.ROUTES, dir: "components/sites/volt" },
  { ...faro.meta, routes: faro.ROUTES, dir: "components/sites/faro" },
  { ...hamaca.meta, routes: hamaca.ROUTES, dir: "components/sites/hamaca" },
  { ...travesia.meta, routes: travesia.ROUTES, dir: "components/sites/travesia" },
  { ...almibar.meta, routes: almibar.ROUTES, dir: "components/sites/almibar" },
  { ...almibarTaller.meta, routes: almibarTaller.ROUTES, dir: "components/sites/almibar-taller" },
  { ...almibarBarrio.meta, routes: almibarBarrio.ROUTES, dir: "components/sites/almibar-barrio" },
  { ...quilate.meta, routes: quilate.ROUTES, dir: "components/sites/quilate" },
  { ...anima.meta, routes: anima.ROUTES, dir: "components/sites/anima" },
  { ...cota.meta, routes: cota.ROUTES, dir: "components/sites/cota" },
  { ...maravillas.meta, routes: maravillas.ROUTES, dir: "components/sites/maravillas" },
  { ...runa.meta, routes: runa.ROUTES, dir: "components/sites/runa" },
  { ...vozDeLaTierra.meta, routes: vozDeLaTierra.ROUTES, dir: "components/sites/voz-de-la-tierra" },
  { ...nadir.meta, routes: nadir.ROUTES, dir: "components/sites/nadir" },
  { ...laTramoya.meta, routes: laTramoya.ROUTES, dir: "components/sites/la-tramoya" },
];

export const getSite = (slug: string) => sites.find((s) => s.slug === slug);
export const getRoute = (slug: string, path: string[] = []) => getSite(slug)?.routes.find((r) => r.path === path.join("/"));
