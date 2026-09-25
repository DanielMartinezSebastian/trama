import catalogJson from "@/docs/catalog.json";
import { demos, type DemoMeta } from "@/lib/demos";
import { sites } from "@/lib/sites";
import type { DemoGroup } from "@/components/site/DemosIndex";
import type { HomeData } from "@/components/site/HomePage";

/**
 * Datos de la web de Trama (portada y /demos), en el servidor: salen de `docs/catalog.json` (generado desde lib/catalog/),
 * del registro de demos y del de webs completas. Así la portada no arrastra el catálogo con todos sus componentes.
 */

type CatalogJson = {
  styles: string[];
  categories: { id: string; label: string; blurb: string; components: string[] }[];
  components: { id: string; name: string; component: string }[];
};
const catalog = catalogJson as unknown as CatalogJson;

const isKit = (d: DemoMeta) => d.family === "landing" && d.render === "kit";
const libOf = (d: DemoMeta) => [d.lib, d.reactive ? "reactivo" : "ambiente"].filter(Boolean).join(" · ");
const splitTitle = (t: string) => {
  const [name, ...rest] = t.split(" · ");
  return { name, kind: rest.join(" · ") };
};

export function homeData(): HomeData {
  return {
    counts: { components: catalog.components.length, categories: catalog.categories.length, styles: catalog.styles.length, demos: demos.length, sites: sites.length },
    categories: catalog.categories.map((c) => ({ id: c.id, label: c.label, blurb: c.blurb, count: c.components.length, first: c.components[0] })),
    landings: demos.filter(isKit).map((d) => ({ slug: d.slug, ...splitTitle(d.title), lib: d.lib ?? "", accent: d.accent })),
    sites: sites.map((s) => ({ slug: s.slug, name: s.name, tag: s.tag, pages: s.routes.length, accent: s.accent })),
    componentNames: [...new Set(catalog.components.map((c) => c.component))],
  };
}

export function demoGroups(): DemoGroup[] {
  const item = (d: DemoMeta) => ({ href: `/demo/${d.slug}`, title: d.title, blurb: d.blurb, meta: libOf(d), accent: d.accent });
  const of = (f: DemoMeta["family"]) => demos.filter((d) => d.family === f);
  return [
    { id: "landings", label: "Landings del kit", blurb: "Páginas completas construidas solo con components/ui/: la mejor referencia para montar una landing.", items: demos.filter(isKit).map(item) },
    {
      id: "webs",
      label: "Webs completas",
      blurb: "Sitios de varias páginas con navegación, estado compartido (carrito, suscripción, chat) y contenido propio.",
      items: sites.map((s) => ({ href: `/sitios/${s.slug}`, title: s.title, blurb: s.blurb, meta: `${s.tag} · ${s.routes.length} páginas`, accent: s.accent })),
    },
    { id: "tematicas", label: "Landings temáticas", blurb: "Landings de 300vh con cards de efectos ASCII y fondos que cambian de escena, anteriores al kit.", items: of("landing").filter((d) => !isKit(d)).map(item) },
    { id: "scroll", label: "Scroll", blurb: "Páginas de 300vh donde el scroll (GSAP ScrollTrigger) mueve el fondo: base para héroes y secciones.", items: of("scroll").map(item) },
    { id: "texto", label: "Texto", blurb: "Escribe tu texto y míralo cambiar en tiempo real con textmode.js, asciify-engine o las dos.", items: of("text").map(item) },
    { id: "textmode", label: "textmode.js", blurb: "Sketches generativos que dibujan directamente sobre la rejilla de caracteres.", items: of("textmode").map(item) },
    { id: "asciify", label: "asciify-engine", blurb: "Imágenes procedurales convertidas a caracteres, con estilos Studio y efectos de hover.", items: of("asciify").map(item) },
  ].filter((g) => g.items.length);
}
