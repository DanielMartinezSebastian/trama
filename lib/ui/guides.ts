import type { CSSProperties } from "react";
import { forestTokens, nightTokens, poolTokens, tokensToStyle, voltTokens, type TokenSet } from "./tokens";

/**
 * Guías de estilo: sistemas completos sacados de lo que comparten las webs premiadas (docs/16-guias-de-estilo-plan.md).
 *
 * Un tema (`TokenSet`) solo fija colores y fuentes. Una guía fija además la **escala tipográfica** (dos escalones de titular:
 * marca 12–18 vw y titular 3–8 vw), el **espacio** (margen lateral, columnas, separación, aire entre secciones), las
 * **superficies** (radio, línea, sombra) y el **movimiento** (duraciones, curvas, stagger), con los valores medidos en las
 * premiadas. `guideToStyle()` lo publica como variables CSS `--g-*` en un contenedor y las clases `ui-g-*`
 * (`components/ui/styles/ui-guides.css`) las aplican; `GuideFrame` hace las dos cosas.
 *
 * Fuentes: todas libres. Switzer y General Sans (Fontshare, licencia ITF: uso comercial y web, pero sin redistribuir los
 * archivos) se nombran por familia con una de Google detrás: si la web carga la hoja de Fontshare, se usan; si no, cae a la
 * alternativa (`GUIDE_FONTSHARE_CSS`).
 */

export type GuideHero = "split-video" | "framed-object" | "marquee-window" | "asym-editorial" | "product-center" | "collage-manifesto" | "dark-data" | "wordmark";
export type GuideStory = "chapters" | "object" | "product" | "manifesto" | "index" | "world" | "timeline" | "before-after" | "webfilm" | "service";

export type StyleGuide = {
  id: string;
  label: string;
  /** para qué sirve, en una frase */
  note: string;
  /** sectores donde encaja */
  sectors: string;
  /** webs premiadas medidas de las que sale (docs/16 §5.1) */
  refs: string[];
  /** variante de estilo sugerida para los componentes del kit (`variant`) */
  variant: "editorial" | "minimal" | "outline" | "retro" | "glass";
  tokens: TokenSet;
  fonts: { display: string; body: string; accent: string; mono: string };
  type: {
    /** marca o portada, con clamp() */
    brand: string;
    /** titular de sección */
    h1: string;
    h2: string;
    body: string;
    label: string;
    weight: number;
    lineHeight: number;
    /** tracking del titular, en em */
    tracking: number;
    upper: boolean;
    /** mayúsculas y tracking de las etiquetas (o mono a 0) */
    labelUpper: boolean;
    labelTracking: number;
    bodyLineHeight: number;
  };
  space: { margin: string; gutter: string; cols: number; section: string; header: string; measure: string };
  surface: { radius: number; pill: boolean; shadow: boolean };
  motion: { fast: number; reveal: number; page: number; stagger: number; ease: string; easeReveal: string };
  /** composiciones del primer pantallazo que mejor le van (docs/16 §3) */
  heroes: GuideHero[];
  /** estructuras de relato que mejor le van (docs/16 §4) */
  stories: GuideStory[];
};

const SANS = "ui-sans-serif, system-ui, sans-serif";
const SERIF = "Georgia, serif";
const MONO = "ui-monospace, Consolas, monospace";
const f = {
  inter: `var(--font-inter), ${SANS}`,
  interTight: `var(--font-inter-tight), var(--font-inter), ${SANS}`,
  instrumentSans: `var(--font-instrument-sans), ${SANS}`,
  cormorant: `var(--font-cormorant-garamond), ${SERIF}`,
  instrumentSerif: `var(--font-instrument-serif), ${SERIF}`,
  gloock: `var(--font-gloock), ${SERIF}`,
  newsreader: `var(--font-newsreader), ${SERIF}`,
  anton: `var(--font-anton), Impact, "Arial Narrow", sans-serif`,
  mona: `var(--font-mona-sans), ${SANS}`,
  onest: `var(--font-onest), ${SANS}`,
  archivo: `var(--font-archivo), ${SANS}`,
  bricolage: `var(--font-bricolage-grotesque), ${SANS}`,
  switzer: `"Switzer", var(--font-inter), ${SANS}`,
  generalSans: `"General Sans", var(--font-onest), ${SANS}`,
  geistMono: `var(--font-geist-mono), ${MONO}`,
  martian: `var(--font-martian-mono), var(--font-geist-mono), ${MONO}`,
  silkscreen: `var(--font-silkscreen), ${MONO}`,
};

/** Curvas medidas (docs/16 §2): `expo.out` en CSS, la estándar de Material y la `easeOutQuart` de muchas premiadas. */
export const GUIDE_EASES = { expoOut: "cubic-bezier(0.19, 1, 0.22, 1)", expoInOut: "cubic-bezier(0.87, 0, 0.13, 1)", standard: "cubic-bezier(0.4, 0, 0.2, 1)", quartOut: "cubic-bezier(0.165, 0.84, 0.44, 1)", power2InOut: "cubic-bezier(0.45, 0, 0.55, 1)" };
const E = GUIDE_EASES;

/** Hoja oficial de Fontshare con Switzer y General Sans (se sirve desde sus servidores; ver la nota de licencia arriba). */
export const GUIDE_FONTSHARE_CSS = "https://api.fontshare.com/v2/css?f[]=switzer@300,400,500,600&f[]=general-sans@400,500,600&display=swap";

export const STYLE_GUIDES: StyleGuide[] = [
  {
    id: "lujo",
    label: "Lujo tranquilo",
    note: "Hueso cálido, una tinta oliva, serifa fina en mayúsculas y vídeo a sangre. Calma, tiempo y oficio.",
    sectors: "Hotel, clínica estética, inmobiliaria de lujo, bodega, joyería",
    refs: ["Tengile Malamala", "Odyssée", "Son Daven", "White Desert"],
    variant: "editorial",
    tokens: { bg: "#f5eee9", fg: "#373f1d", mut: "#5f5d4b", acc: "#5c6e21", acc2: "#373f1d", card: "#ece3dc", ln: "rgba(55,63,29,0.2)", r: 2, font: f.inter, display: f.cormorant, accentFont: f.cormorant },
    fonts: { display: f.cormorant, body: f.inter, accent: f.cormorant, mono: f.geistMono },
    type: { brand: "clamp(3.5rem, 12vw, 13rem)", h1: "clamp(2.75rem, 8.3vw, 9.5rem)", h2: "clamp(2rem, 4.4vw, 4rem)", body: "clamp(1rem, 0.95rem + 0.25vw, 1.125rem)", label: "0.8125rem", weight: 300, lineHeight: 0.9, tracking: -0.02, upper: true, labelUpper: true, labelTracking: 0.03, bodyLineHeight: 1.4 },
    space: { margin: "16px", gutter: "16px", cols: 12, section: "clamp(96px, 12vw, 200px)", header: "40px", measure: "24em" },
    surface: { radius: 2, pill: false, shadow: false },
    motion: { fast: 0.3, reveal: 1.2, page: 1, stagger: 0.08, ease: E.standard, easeReveal: E.expoOut },
    heroes: ["split-video", "asym-editorial"],
    stories: ["timeline", "service", "chapters"],
  },
  {
    id: "monocromo",
    label: "Monocromo de agencia",
    note: "Blanco y negro, una grotesca gigante en peso normal con tracking muy negativo, rejilla fina. El trabajo pone el color.",
    sectors: "Estudios, agencias, portfolios, productoras",
    refs: ["twks", "bleibtgleich", "Huy Phan", "Obys", "Signal-A"],
    variant: "minimal",
    tokens: { bg: "#ffffff", fg: "#0e0e0e", mut: "#5c5c5c", acc: "#0e0e0e", acc2: "#0e0e0e", card: "#f2f2f2", ln: "rgba(14,14,14,0.14)", r: 0, font: f.interTight, display: f.interTight, accentFont: f.instrumentSerif },
    fonts: { display: f.interTight, body: f.interTight, accent: f.instrumentSerif, mono: f.geistMono },
    type: { brand: "clamp(4rem, 15vw, 17rem)", h1: "clamp(2.5rem, 6.4vw, 7rem)", h2: "clamp(2rem, 3.7vw, 3.5rem)", body: "1rem", label: "0.75rem", weight: 500, lineHeight: 0.88, tracking: -0.045, upper: false, labelUpper: false, labelTracking: 0, bodyLineHeight: 1.3 },
    space: { margin: "12px", gutter: "10px", cols: 12, section: "clamp(80px, 10vw, 160px)", header: "40px", measure: "28em" },
    surface: { radius: 0, pill: true, shadow: false },
    motion: { fast: 0.4, reveal: 0.9, page: 0.8, stagger: 0.04, ease: E.standard, easeReveal: E.expoOut },
    heroes: ["wordmark", "collage-manifesto"],
    stories: ["manifesto", "index"],
  },
  {
    id: "tecnico",
    label: "Técnico de producto",
    note: "Gris frío y pizarra, grotesca suiza fina con mono, el visual dentro de un marco, datos y reloj en la cabecera.",
    sectors: "Hardware, IA, ingeniería, industria, B2B técnico",
    refs: ["Lidar Drone Scanning", "Heron AI", "CoMinVi", "Terminal Industries"],
    variant: "outline",
    tokens: { bg: "#ffffff", fg: "#24363f", mut: "#5b6b73", acc: "#c2410c", acc2: "#24363f", card: "#eef1f3", ln: "rgba(36,54,63,0.16)", r: 4, font: f.switzer, display: f.switzer, accentFont: f.martian },
    fonts: { display: f.switzer, body: f.switzer, accent: f.martian, mono: f.martian },
    type: { brand: "clamp(4rem, 16.7vw, 15rem)", h1: "clamp(2.25rem, 4.4vw, 4.5rem)", h2: "clamp(2rem, 2.2vw, 2.25rem)", body: "0.9375rem", label: "0.75rem", weight: 300, lineHeight: 1, tracking: -0.04, upper: false, labelUpper: true, labelTracking: 0, bodyLineHeight: 1.5 },
    space: { margin: "24px", gutter: "16px", cols: 12, section: "clamp(96px, 10vw, 160px)", header: "64px", measure: "30em" },
    surface: { radius: 4, pill: false, shadow: false },
    motion: { fast: 0.3, reveal: 0.8, page: 0.6, stagger: 0.05, ease: E.standard, easeReveal: E.quartOut },
    heroes: ["framed-object", "dark-data"],
    stories: ["object", "product", "before-after"],
  },
  {
    id: "nocturno",
    label: "Producto nocturno",
    note: "Negro azulado, grises de la misma tinta, Inter a 510 de peso y la interfaz real como imagen.",
    sectors: "SaaS, herramientas para desarrolladores, IA",
    refs: ["Linear", "Raycast"],
    variant: "editorial",
    tokens: { ...nightTokens, font: f.inter, display: f.inter },
    fonts: { display: f.inter, body: f.inter, accent: f.newsreader, mono: f.geistMono },
    type: { brand: "clamp(3rem, 8vw, 7rem)", h1: "clamp(2.25rem, 5vw, 4.5rem)", h2: "clamp(2rem, 3.3vw, 3rem)", body: "0.9375rem", label: "0.8125rem", weight: 510, lineHeight: 1, tracking: -0.022, upper: false, labelUpper: false, labelTracking: 0, bodyLineHeight: 1.6 },
    space: { margin: "max(24px, calc((100vw - 1200px) / 2))", gutter: "24px", cols: 12, section: "128px", header: "72px", measure: "32em" },
    surface: { radius: 8, pill: true, shadow: false },
    motion: { fast: 0.16, reveal: 0.7, page: 0.5, stagger: 0.05, ease: E.standard, easeReveal: E.quartOut },
    heroes: ["product-center"],
    stories: ["product", "service"],
  },
  {
    id: "electrico",
    label: "Acento eléctrico",
    note: "Casi negro y un acento ácido, condensada gruesa en mayúsculas y grotesca variable para leer. Velocidad.",
    sectors: "Deporte, motor, música, eventos, marcas personales",
    refs: ["Lando Norris", "Nick Ho", "Neutomni"],
    variant: "editorial",
    tokens: { ...voltTokens, font: f.mona, display: f.anton, accentFont: f.instrumentSerif },
    fonts: { display: f.anton, body: f.mona, accent: f.instrumentSerif, mono: f.geistMono },
    type: { brand: "clamp(4.5rem, 16vw, 16rem)", h1: "clamp(3rem, 7.6vw, 8rem)", h2: "clamp(2rem, 4.4vw, 4rem)", body: "1rem", label: "0.75rem", weight: 400, lineHeight: 0.85, tracking: -0.01, upper: true, labelUpper: true, labelTracking: 0.04, bodyLineHeight: 1.3 },
    space: { margin: "16px", gutter: "16px", cols: 12, section: "clamp(96px, 12vw, 180px)", header: "56px", measure: "26em" },
    surface: { radius: 10, pill: true, shadow: false },
    motion: { fast: 0.25, reveal: 0.5, page: 0.7, stagger: 0.04, ease: E.standard, easeReveal: E.expoOut },
    heroes: ["dark-data", "wordmark"],
    stories: ["object", "chapters"],
  },
  {
    id: "rotulo",
    label: "Rótulo cinético",
    note: "Blanco y un azul marino, una frase gigante que se mueve y una foto que hace de ventana; chips en letra extendida.",
    sectors: "Inmobiliaria, inversión, turismo, agencias de servicios",
    refs: ["Realevate", "Pensatori Irrazionali"],
    variant: "minimal",
    tokens: { bg: "#ffffff", fg: "#1f2b5e", mut: "#4f5880", acc: "#1f2b5e", acc2: "#1f2b5e", card: "#f1f2f7", ln: "rgba(31,43,94,0.2)", r: 0, font: f.onest, display: f.onest, accentFont: f.archivo },
    fonts: { display: f.onest, body: f.onest, accent: f.archivo, mono: f.archivo },
    type: { brand: "clamp(5rem, 15.2vw, 15rem)", h1: "clamp(2.5rem, 5.2vw, 5.5rem)", h2: "clamp(2rem, 3vw, 3rem)", body: "1rem", label: "0.75rem", weight: 500, lineHeight: 1, tracking: -0.02, upper: false, labelUpper: true, labelTracking: 0.12, bodyLineHeight: 1.4 },
    space: { margin: "clamp(16px, 4.2vw, 60px)", gutter: "20px", cols: 12, section: "clamp(96px, 10vw, 160px)", header: "72px", measure: "30em" },
    surface: { radius: 0, pill: false, shadow: false },
    motion: { fast: 0.3, reveal: 0.8, page: 0.75, stagger: 0.06, ease: E.quartOut, easeReveal: E.expoOut },
    heroes: ["marquee-window", "collage-manifesto"],
    stories: ["index", "service"],
  },
  {
    id: "calido",
    label: "Editorial cálido",
    note: "Crema, tinta verde y una serifa de contraste enorme; telón de color entre páginas. Arquitectura y cultura.",
    sectors: "Arquitectura, cultura, editoriales, gastronomía de autor",
    refs: ["Belgrade Arbor", "Akaru", "David Whyte", "Iventions"],
    variant: "editorial",
    tokens: { ...forestTokens, bg: "#fdfbef", fg: "#2e3a26", mut: "#5b6150", acc: "#8a5a1f", acc2: "#2e3a26", card: "#f3efdc", ln: "rgba(46,58,38,0.18)", r: 20, font: f.instrumentSans, display: f.gloock, accentFont: f.gloock },
    fonts: { display: f.gloock, body: f.instrumentSans, accent: f.gloock, mono: f.geistMono },
    type: { brand: "clamp(4rem, 16.7vw, 15rem)", h1: "clamp(2.5rem, 6vw, 6.5rem)", h2: "clamp(2rem, 3.9vw, 3.5rem)", body: "clamp(1rem, 0.9rem + 0.35vw, 1.25rem)", label: "0.8125rem", weight: 400, lineHeight: 0.95, tracking: -0.02, upper: false, labelUpper: true, labelTracking: 0.06, bodyLineHeight: 1.5 },
    space: { margin: "clamp(20px, 4.4vw, 64px)", gutter: "24px", cols: 12, section: "clamp(112px, 12vw, 200px)", header: "72px", measure: "33em" },
    surface: { radius: 20, pill: true, shadow: false },
    motion: { fast: 0.5, reveal: 1.1, page: 0.9, stagger: 0.07, ease: E.standard, easeReveal: E.expoOut },
    heroes: ["wordmark", "split-video"],
    stories: ["timeline", "chapters", "manifesto"],
  },
  {
    id: "ludico",
    label: "Lúdico",
    note: "Pareja de colores vivos, una grotesca redonda y gruesa, pixel en las etiquetas. Para jugar y explorar.",
    sectors: "Cultura joven, juegos, música, comunidades, marcas con humor",
    refs: ["Ponpon Mania", "Bruno Simon", "Lacoste Polo Factory", "Poolsuite"],
    variant: "retro",
    tokens: { ...poolTokens, font: f.instrumentSans, display: f.bricolage },
    fonts: { display: f.bricolage, body: f.instrumentSans, accent: f.silkscreen, mono: f.silkscreen },
    type: { brand: "clamp(4rem, 13vw, 12rem)", h1: "clamp(2.5rem, 7vw, 7rem)", h2: "clamp(2rem, 3.6vw, 3.25rem)", body: "1.0625rem", label: "0.75rem", weight: 800, lineHeight: 0.92, tracking: -0.03, upper: false, labelUpper: true, labelTracking: 0, bodyLineHeight: 1.45 },
    space: { margin: "20px", gutter: "16px", cols: 12, section: "clamp(80px, 10vw, 140px)", header: "64px", measure: "28em" },
    surface: { radius: 16, pill: true, shadow: true },
    motion: { fast: 0.25, reveal: 0.7, page: 0.6, stagger: 0.05, ease: E.quartOut, easeReveal: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
    heroes: ["collage-manifesto", "product-center"],
    stories: ["world", "webfilm"],
  },
];

export type StyleGuideId = (typeof STYLE_GUIDES)[number]["id"];

/** Guía por id (o la primera). */
export const guide = (id: string): StyleGuide => STYLE_GUIDES.find((g) => g.id === id) ?? STYLE_GUIDES[0];

/**
 * Variables CSS de una guía para un contenedor: los tokens del tema (`tokensToStyle`) más `--g-*` (tipografía, espacio,
 * superficies y movimiento). Las clases `ui-g-*` de `ui-guides.css` las leen.
 */
export function guideToStyle(g: StyleGuide): CSSProperties {
  const t = g.type;
  return {
    ...tokensToStyle({ ...g.tokens, font: g.fonts.body, display: g.fonts.display, accentFont: g.fonts.accent }),
    "--g-font-display": g.fonts.display,
    "--g-font-body": g.fonts.body,
    "--g-font-mono": g.fonts.mono,
    "--g-fs-brand": t.brand,
    "--g-fs-h1": t.h1,
    "--g-fs-h2": t.h2,
    "--g-fs-body": t.body,
    "--g-fs-label": t.label,
    "--g-fw-display": t.weight,
    "--g-lh-display": t.lineHeight,
    "--g-ls-display": `${t.tracking}em`,
    "--g-tt-display": t.upper ? "uppercase" : "none",
    "--g-tt-label": t.labelUpper ? "uppercase" : "none",
    "--g-ls-label": `${t.labelTracking}em`,
    "--g-lh-body": t.bodyLineHeight,
    "--g-margin": g.space.margin,
    "--g-gutter": g.space.gutter,
    "--g-cols": g.space.cols,
    "--g-section": g.space.section,
    "--g-header": g.space.header,
    "--g-measure": g.space.measure,
    "--g-radius": `${g.surface.radius}px`,
    "--g-radius-btn": g.surface.pill ? "999px" : `${g.surface.radius}px`,
    "--g-shadow": g.surface.shadow ? "4px 4px 0 var(--fg)" : "none",
    "--g-dur-fast": `${g.motion.fast}s`,
    "--g-dur-reveal": `${g.motion.reveal}s`,
    "--g-dur-page": `${g.motion.page}s`,
    "--g-stagger": `${g.motion.stagger}s`,
    "--g-ease": g.motion.ease,
    "--g-ease-reveal": g.motion.easeReveal,
  } as CSSProperties;
}
