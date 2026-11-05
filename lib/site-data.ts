import catalogJson from "@/docs/catalog.json";
import { demos, type DemoMeta } from "@/lib/demos";
import { sites } from "@/lib/sites";
import { REPLICAS } from "@/components/inspiraciones/registro";
import { STYLE_GUIDES } from "@/lib/ui/guides";
import type { DemoGroup, DemoItem } from "@/components/site/DemosIndex";
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

/**
 * Sectores comerciales de /demos: quien busca «cómo quedaría mi negocio» encuentra juntas las webs completas, las
 * inspiraciones y las landings de su sector. Cada demo con negocio detrás va a uno solo; el resto queda en «Técnicas».
 */
const SECTORS: { id: string; label: string; blurb: string }[] = [
  { id: "belleza", label: "Peluquería, barbería y estética", blurb: "Salones, barberías, estilismo y clínicas: reserva de cita, equipo, servicios con precio y trabajos." },
  { id: "deporte", label: "Gimnasio y deporte", blurb: "Gimnasios, estudios boutique y deportistas: horarios de clases, tarifas, entrenadores y prueba gratis." },
  { id: "comida", label: "Restaurante, café y alimentación", blurb: "Restaurantes, cafeterías, obradores y marcas de comida: carta, reservas, encargos y tienda." },
  { id: "tienda", label: "Tienda y producto", blurb: "Comercio y marcas de producto: catálogo, ficha, carrito, configurador y producto en 3D." },
  { id: "formacion", label: "Academia y formación", blurb: "Escuelas, academias y cursos: programas, convocatorias, profesores e inscripción." },
  { id: "creativo", label: "Agencia, estudio y portfolio", blurb: "Agencias, estudios creativos, interiorismo y portfolios de autor: proyectos, servicios y contacto." },
  { id: "arquitectura", label: "Arquitectura e inmobiliaria", blurb: "Estudios de arquitectura, promociones y viviendas: proyectos, maquetas, planos y selector de viviendas." },
  { id: "tecnologia", label: "Software y tecnología", blurb: "SaaS, paneles, fintech, robótica y blogs técnicos: producto, precios, documentación y demo." },
  { id: "empresa", label: "Empresa, industria y servicios", blurb: "Grupos industriales, logística, seguridad y selección de personal: servicios, cifras y presupuesto." },
  { id: "cultura", label: "Eventos, cultura y ocio", blurb: "Festivales, conferencias, música, cine, videojuegos y clubes: programa, entradas y suscripción." },
  { id: "viajes", label: "Turismo y viajes", blurb: "Alojamientos, safaris y trenes: destinos, itinerarios y reserva." },
];

/** Sector de cada web completa (`lib/sites`); las que no aparecen son técnicas (relatos 3D, demos de motor). */
const SITE_SECTOR: Record<string, string> = {
  hebra: "belleza", esparta: "belleza", "clara-vidal": "belleza",
  forja: "deporte", cadencia: "deporte", volt: "deporte",
  almibar: "comida", "almibar-taller": "comida", "almibar-barrio": "comida", "la-tramoya": "comida",
  barro: "tienda", pixelforge: "tienda", onda: "tienda", quilate: "tienda",
  estudio: "creativo", mota: "creativo", sonar: "creativo",
  alzado: "arquitectura", arbor: "arquitectura", plano: "arquitectura",
  faro: "tecnologia", pulso: "tecnologia", "kernel-log": "tecnologia",
  vertice: "empresa", vigia: "empresa", cota: "empresa",
  foro: "cultura", anima: "cultura", hamaca: "cultura", travesia: "cultura", runa: "cultura",
};

/** Sector de cada inspiración según `r.sector` del registro (con alguna excepción por slug). */
const REPLICA_SECTOR: Record<string, string> = {
  peluquería: "belleza", clínica: "belleza", gimnasio: "deporte", restaurante: "comida", producto: "tienda", mueble: "tienda",
  automoción: "tienda", academia: "formacion", agencia: "creativo", "estudio creativo": "creativo", interiorismo: "creativo",
  arquitectura: "arquitectura", inmobiliaria: "arquitectura", residencia: "arquitectura", tipografía: "creativo", software: "tecnologia", finanzas: "tecnologia", robótica: "tecnologia",
  logística: "empresa", maquinaria: "empresa", "selección de personal": "empresa", conferencia: "cultura", música: "cultura", cine: "cultura",
  videojuego: "cultura", "club de suscripción": "cultura", safari: "viajes",
};
const REPLICA_SLUG_SECTOR: Record<string, string> = { "abuela-rosa": "comida" };

/** Demos de `/demo/<slug>` con un negocio detrás. */
const DEMO_SECTOR: Record<string, string> = { "th-parla": "formacion", "ines-bruma": "creativo" };

/** Relatos 3D y demos de motor entre las webs completas: van a «Técnicas». */
const TECH_SITES = ["nadir", "voz-de-la-tierra", "maravillas"];

export function demoGroups(): DemoGroup[] {
  const item = (d: DemoMeta) => ({ href: `/demo/${d.slug}`, title: d.title, blurb: d.blurb, meta: libOf(d), accent: d.accent });
  const of = (f: DemoMeta["family"]) => demos.filter((d) => d.family === f);
  const guideOf = (id: string) => STYLE_GUIDES.find((g) => g.id === id)?.label.toLowerCase() ?? id;
  const siteItem = (s: (typeof sites)[number]) => ({ href: `/sitios/${s.slug}`, title: s.title, blurb: s.blurb, meta: `Web completa · ${s.routes.length} páginas`, accent: s.accent });

  // Lo que no tiene sector (web o inspiración nueva sin clasificar) cae en «Otras» para que no desaparezca del índice
  const bySector = new Map<string, DemoItem[]>([...SECTORS.map((s) => [s.id, []] as [string, DemoItem[]]), ["otras", []]]);
  const put = (sector: string | undefined, it: DemoItem) => bySector.get(sector ?? "otras")?.push(it);
  for (const s of sites) if (!TECH_SITES.includes(s.slug)) put(SITE_SECTOR[s.slug], siteItem(s));
  for (const r of REPLICAS)
    put(REPLICA_SLUG_SECTOR[r.slug] ?? REPLICA_SECTOR[r.sector], {
      href: `/inspiraciones/${r.slug}`,
      title: r.nombre,
      blurb: `Basada en ${r.ref}: ${r.firma}.`,
      meta: `Inspiración · ${r.sector} · guía ${guideOf(r.guia)}`,
      accent: r.acento,
    });
  for (const d of demos) if (DEMO_SECTOR[d.slug]) put(DEMO_SECTOR[d.slug], { ...item(d), meta: `Landing · ${libOf(d)}` });
  put("tienda", { href: "/producto/materia", title: "SONDA · Materia", blurb: "Materiales, ensamblaje y producto explorable en WebGL. Inspiración: Floema.", meta: "Landing · WebGL · comercio narrativo", accent: "#b9d3a0" });
  put("tienda", { href: "/producto/ritual", title: "SONDA · Ritual", blurb: "Una escena sensorial de interacción por gestos. Inspiración: The Magic Bottle.", meta: "Landing · WebGL · experiencia de objeto", accent: "#e7a36e" });
  put("tienda", { href: "/producto/esencial", title: "SONDA · Esencial", blurb: "Fotografía original, ficha clara y compra directa, sin WebGL. Inspiración: Longbow.", meta: "Landing · sin WebGL · comercio editorial", accent: "#bbc18c" });
  put("viajes", { href: "/lucero/horario", title: "Lucero · Horario", blurb: "Tren nocturno: la página es la tabla y se elige tramo y plaza sobre el propio horario.", meta: "Landing · sin imágenes · datos", accent: "#ffd60a" });
  put("viajes", { href: "/lucero/vagon", title: "Lucero · Vagón", blurb: "Tren nocturno en corte lateral: se recorre de lado y se toca el asiento.", meta: "Landing · dibujo CSS · scroll lateral", accent: "#d9482b" });
  put("viajes", { href: "/lucero/ventanilla", title: "Lucero · Ventanilla", blurb: "Tren nocturno en una sola toma: el scroll hace pasar las once horas de viaje.", meta: "Landing · WebGL · tiempo", accent: "#ffc58f" });
  put("viajes", { href: "/lucero/maqueta", title: "Lucero · Maqueta", blurb: "Tren nocturno que reinterpreta Night Train de pmndrs: las plazas libres se eligen en 3D.", meta: "Landing · R3F · Merged y ScrollControls", accent: "#f4b483" });

  const sectorGroups: DemoGroup[] = SECTORS.map((s) => ({ ...s, kind: "sector" as const, items: bySector.get(s.id) ?? [] }));
  const techGroups: DemoGroup[] = [
    { id: "landings", label: "Landings del kit", blurb: "Páginas completas construidas solo con components/ui/: cada una exhibe una variante y un fondo del kit.", items: demos.filter((d) => isKit(d) && !DEMO_SECTOR[d.slug]).map(item) },
    { id: "propuestas", label: "Propuestas para la web de Trama", blurb: "Cuatro portadas distintas para la propia librería: la web actual en clave neofuturista con escenas 3D, y la misma información contada como tela que se teje, como escaparate por negocio y como consola de órdenes.", items: [
      { href: "/propuestas/neo", title: "Neo", blurb: "La estructura de la web actual con piel neofuturista: nudo cromado, cruces de cristal, la web de cada sector viva en un portátil 3D y un campo de letras.", meta: "3D · ObjectStage, CrossCluster, DeviceMockup3D, TypeField", accent: "#c8ff2e" },
      { href: "/propuestas/telar", title: "Telar", blurb: "Los tokens son la urdimbre y los componentes la trama: un lienzo teje la tela con el scroll y las guías son un muestrario.", meta: "Canvas 2D · scroll y puntero", accent: "#d2391b" },
      { href: "/propuestas/escaparate", title: "Escaparate", blurb: "Eliges negocio y acabado y la web se monta en vivo con piezas reales del kit; debajo, el código exacto.", meta: "Configurador · fotos por sector", accent: "#1d6647" },
      { href: "/propuestas/consola", title: "Consola", blurb: "Escritorio de texto con órdenes que responden con el catálogo y las demos, agentes trabajando y monitor ASCII.", meta: "Teclado · ASCII", accent: "#c5f06a" },
    ] },
    { id: "relatos", label: "Relatos 3D y WebGL", blurb: "Historias interactivas con escenas generativas, shaders, piezas 3D que viajan entre rutas y movimiento enlazado al recorrido.", items: [
      ...demos.filter((d) => d.slug === "polaris-archivo").map(item),
      ...sites.filter((s) => TECH_SITES.includes(s.slug)).map((s) => ({ ...siteItem(s), meta: `${s.tag} · ${s.routes.length} páginas` })),
    ] },
    { id: "tematicas", label: "Landings temáticas", blurb: "Landings de 300vh con cards de efectos ASCII y fondos que cambian de escena, anteriores al kit.", items: of("landing").filter((d) => !isKit(d) && d.render !== "portfolio").map(item) },
    { id: "scroll", label: "Scroll", blurb: "Páginas de 300vh donde el scroll (GSAP ScrollTrigger) mueve el fondo: base para héroes y secciones.", items: of("scroll").map(item) },
    { id: "texto", label: "Texto", blurb: "Escribe tu texto y míralo cambiar en tiempo real con textmode.js, asciify-engine o las dos.", items: of("text").map(item) },
    { id: "textmode", label: "textmode.js", blurb: "Sketches generativos que dibujan directamente sobre la rejilla de caracteres.", items: of("textmode").map(item) },
    { id: "asciify", label: "asciify-engine", blurb: "Imágenes procedurales convertidas a caracteres, con estilos Studio y efectos de hover.", items: of("asciify").map(item) },
    { id: "otras", label: "Otras", blurb: "Webs e inspiraciones aún sin sector asignado en lib/site-data.ts.", items: bySector.get("otras") ?? [] },
  ].map((g) => ({ ...g, kind: "tecnica" as const }));

  return [...sectorGroups, ...techGroups].filter((g) => g.items.length);
}
