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
 * Las siete últimas (salón, barbería, club, boutique, academia de autor, escuela amarilla, producto de marca) son las
 * familias de los estudios por sector: salen del cuaderno del laboratorio (docs/cuaderno, docs/53) y sus valores, de los
 * pares medidos con `refs:probe --par` contra las webs de referencia (docs/50 E10).
 *
 * Las cuatro del final (terminal, pixel, puntos, papel) son la estética propia del repo: las páginas de Trama que
 * `refs:probe --repo` no podía asignar a ninguna de las anteriores, con sus valores medidos en ellas (docs/54).
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
  /** de dónde sale: premiadas = webs de Awwwards medidas (docs/16) · sectores = estudios por sector y sus réplicas medidas
   * (docs/50) · repo = la estética propia de las demos y webs de Trama (docs/54) */
  source?: "premiadas" | "sectores" | "repo";
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
  antonio: `var(--font-antonio), var(--font-anton), "Arial Narrow", sans-serif`,
  manrope: `var(--font-manrope), ${SANS}`,
  spaceGrotesk: `var(--font-space-grotesk), ${SANS}`,
  playfair: `var(--font-playfair-display), ${SERIF}`,
  mona: `var(--font-mona-sans), ${SANS}`,
  onest: `var(--font-onest), ${SANS}`,
  archivo: `var(--font-archivo), ${SANS}`,
  bricolage: `var(--font-bricolage-grotesque), ${SANS}`,
  switzer: `"Switzer", var(--font-inter), ${SANS}`,
  generalSans: `"General Sans", var(--font-onest), ${SANS}`,
  geistMono: `var(--font-geist-mono), ${MONO}`,
  martian: `var(--font-martian-mono), var(--font-geist-mono), ${MONO}`,
  silkscreen: `var(--font-silkscreen), ${MONO}`,
  jetbrains: `var(--font-jetbrains-mono), ${MONO}`,
  spaceMono: `var(--font-space-mono), ${MONO}`,
  plexMono: `var(--font-ibm-plex-mono), ${MONO}`,
  doto: `var(--font-doto), var(--font-ibm-plex-mono), ${MONO}`,
};

/** Curvas medidas (docs/16 §2): `expo.out` en CSS, la estándar de Material y la `easeOutQuart` de muchas premiadas. */
export const GUIDE_EASES = { expoOut: "cubic-bezier(0.19, 1, 0.22, 1)", expoInOut: "cubic-bezier(0.87, 0, 0.13, 1)", standard: "cubic-bezier(0.4, 0, 0.2, 1)", quartOut: "cubic-bezier(0.165, 0.84, 0.44, 1)", power2InOut: "cubic-bezier(0.45, 0, 0.55, 1)", quintOut: "cubic-bezier(0.22, 1, 0.36, 1)" };
const E = GUIDE_EASES;

/** Hoja oficial de Fontshare con Switzer y General Sans (se sirve desde sus servidores; ver la nota de licencia arriba). */
export const GUIDE_FONTSHARE_CSS = "https://api.fontshare.com/v2/css?f[]=switzer@300,400,500,600&f[]=general-sans@400,500,600&display=swap";

export const STYLE_GUIDES: StyleGuide[] = [
  {
    id: "lujo",
    source: "premiadas",
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
    source: "premiadas",
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
    source: "premiadas",
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
    source: "premiadas",
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
    source: "premiadas",
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
    source: "premiadas",
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
    source: "premiadas",
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
    source: "premiadas",
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
  // --- familias de los estudios por sector (docs/50 E10, docs/cuaderno: valores de los pares medidos) ---
  {
    id: "salon",
    source: "sectores",
    label: "Salón editorial claro",
    note: "Blanco y gris claro con un pastel cálido, serifa muy fina y texto grande y ligero; formas o fotos de trabajos como único adorno.",
    sectors: "Peluquería y color, estética, estudio de belleza, floristería",
    refs: ["Il Colorista", "ALICE Hair & Art", "Hair Me Up"],
    variant: "editorial",
    tokens: { bg: "#ffffff", fg: "#1f1f1f", mut: "#868686", acc: "#f5a490", acc2: "#963e13", card: "#f4f4f4", ln: "rgba(31,31,31,0.14)", r: 0, font: f.manrope, display: f.cormorant, accentFont: f.cormorant },
    fonts: { display: f.cormorant, body: f.manrope, accent: f.cormorant, mono: f.geistMono },
    type: { brand: "clamp(3.5rem, 8.7vw, 8rem)", h1: "clamp(2.5rem, 5vw, 4.5rem)", h2: "clamp(2.25rem, 7.6vw, 6.875rem)", body: "clamp(1rem, 0.8rem + 0.7vw, 1.5rem)", label: "0.8125rem", weight: 300, lineHeight: 1.1, tracking: 0, upper: false, labelUpper: false, labelTracking: 0, bodyLineHeight: 1.58 },
    space: { margin: "24px", gutter: "16px", cols: 12, section: "clamp(96px, 10vw, 160px)", header: "138px", measure: "28em" },
    surface: { radius: 0, pill: false, shadow: false },
    motion: { fast: 0.3, reveal: 1, page: 0.9, stagger: 0.08, ease: E.standard, easeReveal: E.expoOut },
    heroes: ["asym-editorial", "collage-manifesto"],
    stories: ["service", "manifesto"],
  },
  {
    id: "barberia",
    source: "sectores",
    label: "Barbería de carácter",
    note: "Hueso y negro con un acento saturado, condensada o serifa enorme con la cursiva para el énfasis, datos en mayúsculas y botones en óvalo.",
    sectors: "Barbería, sastrería, tatuaje, coctelería, tienda de oficio",
    refs: ["Rendezvous", "Don Barber & Groom", "Marco Ambrosi"],
    variant: "outline",
    tokens: { bg: "#eceae0", fg: "#111111", mut: "#5c5c5c", acc: "#ff622b", acc2: "#7e929c", card: "#f6f4ee", ln: "rgba(17,17,17,0.18)", r: 0, font: f.archivo, display: f.antonio, accentFont: f.playfair },
    fonts: { display: f.antonio, body: f.archivo, accent: f.playfair, mono: f.geistMono },
    type: { brand: "clamp(4.5rem, 23.6vw, 21rem)", h1: "clamp(3rem, 8.6vw, 8rem)", h2: "clamp(2.25rem, 6.6vw, 6rem)", body: "1rem", label: "0.75rem", weight: 400, lineHeight: 0.9, tracking: -0.01, upper: true, labelUpper: true, labelTracking: 0.02, bodyLineHeight: 1.4 },
    space: { margin: "clamp(16px, 3vw, 44px)", gutter: "16px", cols: 12, section: "clamp(80px, 9vw, 140px)", header: "64px", measure: "26em" },
    surface: { radius: 0, pill: true, shadow: false },
    motion: { fast: 0.25, reveal: 0.9, page: 0.8, stagger: 0.06, ease: E.quartOut, easeReveal: E.expoOut },
    heroes: ["split-video", "wordmark"],
    stories: ["service", "before-after"],
  },
  {
    id: "club",
    source: "sectores",
    label: "Club de alto contraste",
    note: "Negro absoluto y blanco con un acento saturado, condensada en mayúsculas gigante y muy apretada, píldoras de contorno y texto que rueda.",
    sectors: "Gimnasio, artes marciales, entrenador personal, agencia creativa",
    refs: ["FIT AND YOU", "Essor Fitness", "Skulpt", "Fenriz Gym", "K72"],
    variant: "outline",
    tokens: { bg: "#000000", fg: "#ffffff", mut: "#999999", acc: "#cef952", acc2: "#ffffff", card: "#141414", ln: "rgba(255,255,255,0.22)", r: 0, font: f.inter, display: f.antonio, accentFont: f.antonio },
    fonts: { display: f.antonio, body: f.inter, accent: f.antonio, mono: f.geistMono },
    type: { brand: "clamp(4.5rem, 14.4vw, 13rem)", h1: "clamp(3rem, 11vw, 10rem)", h2: "clamp(2.5rem, 6.8vw, 6rem)", body: "clamp(1rem, 0.9rem + 0.3vw, 1.1875rem)", label: "0.8125rem", weight: 700, lineHeight: 0.94, tracking: -0.06, upper: true, labelUpper: true, labelTracking: 0.05, bodyLineHeight: 1.4 },
    space: { margin: "clamp(16px, 1.7vw, 24px)", gutter: "16px", cols: 12, section: "clamp(80px, 10vw, 160px)", header: "64px", measure: "27em" },
    surface: { radius: 0, pill: true, shadow: false },
    motion: { fast: 0.15, reveal: 0.9, page: 0.6, stagger: 0.07, ease: "cubic-bezier(0.215, 0.61, 0.355, 1)", easeReveal: E.expoOut },
    heroes: ["wordmark", "split-video"],
    stories: ["chapters", "index"],
  },
  {
    id: "boutique",
    source: "sectores",
    label: "Estudio boutique",
    note: "Rosa empolvado y marrón tierra, serifa con media frase en cursiva, sans limpia con aire y reserva siempre a mano.",
    sectors: "Pilates, yoga, estudio privado, fisioterapia, spa urbano",
    refs: ["Core Atelier Pilates"],
    variant: "editorial",
    tokens: { bg: "#f7e7de", fg: "#25140c", mut: "#7c5a48", acc: "#744c32", acc2: "#25140c", card: "#fbf1ec", ln: "rgba(37,20,12,0.22)", r: 0, font: f.inter, display: f.cormorant, accentFont: f.cormorant },
    fonts: { display: f.cormorant, body: f.inter, accent: f.cormorant, mono: f.geistMono },
    type: { brand: "clamp(3.5rem, 12vw, 11rem)", h1: "clamp(2.75rem, 5.6vw, 5rem)", h2: "clamp(2.5rem, 4.9vw, 4.375rem)", body: "1.125rem", label: "0.8125rem", weight: 400, lineHeight: 0.86, tracking: -0.01, upper: false, labelUpper: true, labelTracking: 0.08, bodyLineHeight: 1.39 },
    space: { margin: "clamp(20px, 2.2vw, 32px)", gutter: "20px", cols: 12, section: "clamp(96px, 10vw, 160px)", header: "65px", measure: "25em" },
    surface: { radius: 0, pill: true, shadow: false },
    motion: { fast: 0.3, reveal: 1.1, page: 0.9, stagger: 0.08, ease: E.standard, easeReveal: E.expoOut },
    heroes: ["asym-editorial", "split-video"],
    stories: ["service", "chapters"],
  },
  {
    id: "autor",
    source: "sectores",
    label: "Academia de autor",
    note: "Gris claro con dos acentos, todo en minúsculas, títulos entre paréntesis, garabatos a mano y botones con sombra dura: la marca es la persona.",
    sectors: "Formación de una persona, coaching, viajes guiados, creadores con comunidad",
    refs: ["Surfing Academy"],
    variant: "retro",
    tokens: { bg: "#ededed", fg: "#17191a", mut: "#555555", acc: "#ff4f28", acc2: "#39be91", card: "#ffffff", ln: "rgba(23,25,26,0.6)", r: 0, font: f.onest, display: f.onest, accentFont: f.onest },
    fonts: { display: f.onest, body: f.onest, accent: f.onest, mono: f.geistMono },
    type: { brand: "clamp(4rem, 20vw, 18rem)", h1: "clamp(2.5rem, 6.9vw, 6.25rem)", h2: "clamp(2rem, 3.1vw, 2.8125rem)", body: "1rem", label: "0.75rem", weight: 400, lineHeight: 1, tracking: 0, upper: false, labelUpper: false, labelTracking: 0, bodyLineHeight: 1.3 },
    space: { margin: "clamp(20px, 8vw - 10px, 120px)", gutter: "16px", cols: 12, section: "clamp(80px, 9vw, 120px)", header: "24px", measure: "30em" },
    surface: { radius: 0, pill: false, shadow: true },
    motion: { fast: 0.2, reveal: 1, page: 0.8, stagger: 0.06, ease: E.quartOut, easeReveal: E.expoOut },
    heroes: ["collage-manifesto", "asym-editorial"],
    stories: ["timeline", "service"],
  },
  {
    id: "escuela",
    source: "sectores",
    label: "Escuela amarilla",
    note: "Amarillo saturado y negro, una grotesca en mayúsculas siempre apretada, recuadros con borde y sombra dura; fotos documentales de las clases.",
    sectors: "Academia, escuela de diseño o negocio, formación profesional, bootcamp",
    refs: ["Future London Academy", "Honhar"],
    variant: "retro",
    tokens: { bg: "#ffffff", fg: "#1a1a1a", mut: "#6f6f6f", acc: "#ffe32b", acc2: "#1a1a1a", card: "#ffe32b", ln: "#1a1a1a", r: 8, font: f.spaceGrotesk, display: f.spaceGrotesk, accentFont: f.spaceGrotesk },
    fonts: { display: f.spaceGrotesk, body: f.spaceGrotesk, accent: f.spaceGrotesk, mono: f.geistMono },
    type: { brand: "clamp(4rem, 15vw, 14rem)", h1: "clamp(2.5rem, 6.7vw, 6rem)", h2: "clamp(2rem, 4.6vw, 4.125rem)", body: "1.125rem", label: "0.75rem", weight: 500, lineHeight: 0.97, tracking: -0.05, upper: true, labelUpper: true, labelTracking: 0.02, bodyLineHeight: 1.34 },
    space: { margin: "clamp(16px, 2.5vw, 36px)", gutter: "16px", cols: 12, section: "clamp(96px, 10vw, 140px)", header: "96px", measure: "28em" },
    surface: { radius: 8, pill: false, shadow: true },
    motion: { fast: 0.15, reveal: 0.8, page: 0.7, stagger: 0.05, ease: E.quartOut, easeReveal: E.expoOut },
    heroes: ["wordmark", "collage-manifesto"],
    stories: ["index", "service"],
  },
  {
    id: "marca",
    source: "sectores",
    label: "Producto de marca",
    note: "Dos tintas como una serigrafía, grotesca estrecha y gruesa a tamaño de cartel, texto grande en mayúsculas y el producto fijo mientras pasa la página.",
    sectors: "Salsas, conservas, bebidas, cosmética de marca, producto de autor",
    refs: ["Peppa Sauce"],
    variant: "outline",
    tokens: { bg: "#141329", fg: "#feeee2", mut: "#8f93b8", acc: "#feeee2", acc2: "#e8612c", card: "#141329", ln: "rgba(254,238,226,0.9)", r: 28, font: f.spaceGrotesk, display: f.archivo, accentFont: f.archivo },
    fonts: { display: f.archivo, body: f.spaceGrotesk, accent: f.archivo, mono: f.geistMono },
    type: { brand: "clamp(5rem, 17vw, 16rem)", h1: "clamp(3rem, 13vw, 12rem)", h2: "clamp(1.75rem, 3.5vw, 3.125rem)", body: "clamp(1rem, 0.6rem + 1.4vw, 1.5rem)", label: "0.875rem", weight: 800, lineHeight: 0.85, tracking: -0.03, upper: true, labelUpper: true, labelTracking: 0.04, bodyLineHeight: 1.2 },
    space: { margin: "clamp(16px, 2.5vw, 36px)", gutter: "16px", cols: 12, section: "clamp(80px, 9vw, 140px)", header: "56px", measure: "24em" },
    surface: { radius: 28, pill: true, shadow: false },
    motion: { fast: 0.25, reveal: 0.9, page: 0.8, stagger: 0.06, ease: E.quartOut, easeReveal: E.expoOut },
    heroes: ["product-center", "wordmark"],
    stories: ["product", "object"],
  },
  // ── las del repo (docs/54): la estética propia de Trama, medida en sus webs y landings con `refs:probe --repo` ──
  {
    id: "terminal",
    source: "repo",
    label: "Terminal de neón",
    note: "Negro tintado del color del acento, todo en monoespaciada, titulares gruesos en mayúsculas y un solo neón para lo que se puede tocar.",
    sectors: "Herramientas para desarrolladores, ciberseguridad, infraestructura, datos, lanzamientos técnicos",
    refs: ["CIPHERGRID (/demo/th-ciphergrid)", "MYCEL (/demo/th-mycel)", "Kernel Log (/sitios/kernel-log)"],
    variant: "outline",
    tokens: { bg: "#08020f", fg: "#f4ecff", mut: "#a78bc7", acc: "#ff2fd0", acc2: "#67e38a", card: "#120a1c", ln: "rgba(244,236,255,0.14)", r: 4, font: f.jetbrains, display: f.jetbrains, accentFont: f.jetbrains },
    fonts: { display: f.jetbrains, body: f.jetbrains, accent: f.jetbrains, mono: f.jetbrains },
    type: { brand: "clamp(3rem, 13vw, 12rem)", h1: "clamp(2.25rem, 4.4vw, 4.25rem)", h2: "clamp(1.5rem, 2.4vw, 2.25rem)", body: "0.875rem", label: "0.75rem", weight: 800, lineHeight: 1, tracking: -0.02, upper: true, labelUpper: true, labelTracking: 0.08, bodyLineHeight: 1.6 },
    space: { margin: "max(24px, calc((100vw - 1100px) / 2))", gutter: "16px", cols: 12, section: "clamp(80px, 9vw, 128px)", header: "56px", measure: "34em" },
    surface: { radius: 4, pill: false, shadow: false },
    motion: { fast: 0.15, reveal: 0.6, page: 0.4, stagger: 0.03, ease: "steps(4, end)", easeReveal: E.standard },
    heroes: ["dark-data", "product-center"],
    stories: ["product", "timeline"],
  },
  {
    id: "pixel",
    source: "repo",
    label: "Arcade pixel",
    note: "Ciruela de noche, letra de píxel solo en los titulares, monoespaciada para leer, un amarillo de moneda y esquinas que no se redondean.",
    sectors: "Videojuegos indie, estudios creativos, eventos, merchandising, comunidades",
    refs: ["Pixelforge (/sitios/pixelforge)", "Hamaca (/sitios/hamaca)", "MINIMAL (/demo/th-minimal)"],
    variant: "retro",
    tokens: { bg: "#140b26", fg: "#f4efff", mut: "#a99cc9", acc: "#ffcc4d", acc2: "#ff6b8b", card: "#2b1e2a", ln: "rgba(244,239,255,0.18)", r: 0, font: f.spaceMono, display: f.silkscreen, accentFont: f.silkscreen },
    fonts: { display: f.silkscreen, body: f.spaceMono, accent: f.silkscreen, mono: f.spaceMono },
    type: { brand: "clamp(3rem, 12vw, 11rem)", h1: "clamp(2rem, 4.4vw, 4rem)", h2: "clamp(1.5rem, 2.4vw, 2.25rem)", body: "1.0625rem", label: "0.75rem", weight: 400, lineHeight: 1, tracking: -0.02, upper: false, labelUpper: true, labelTracking: 0.06, bodyLineHeight: 1.6 },
    space: { margin: "max(24px, calc((100vw - 1160px) / 2))", gutter: "16px", cols: 12, section: "clamp(80px, 9vw, 128px)", header: "64px", measure: "33em" },
    surface: { radius: 0, pill: false, shadow: false },
    motion: { fast: 0.12, reveal: 0.5, page: 0.4, stagger: 0.04, ease: "steps(3, end)", easeReveal: "steps(6, end)" },
    heroes: ["wordmark", "framed-object"],
    stories: ["product", "world", "chapters"],
  },
  {
    id: "puntos",
    source: "repo",
    label: "Matriz de puntos",
    note: "Negro puro, titulares de puntos como un panel de leds, texto en mono gris y un rojo de piloto encendido como único color.",
    sectors: "Hardware, audio, gadgets, relojes, transporte, señalética",
    refs: ["DOTMATRIX (/demo/th-dotmatrix)", "Almíbar Barrio (/sitios/almibar-barrio)"],
    variant: "minimal",
    tokens: { bg: "#000000", fg: "#e6e6e6", mut: "#8c8c8c", acc: "#ff3b3b", acc2: "#e6e6e6", card: "#0d0d0d", ln: "rgba(230,230,230,0.14)", r: 6, font: f.plexMono, display: f.doto, accentFont: f.doto },
    fonts: { display: f.doto, body: f.plexMono, accent: f.doto, mono: f.plexMono },
    type: { brand: "clamp(3.5rem, 14vw, 13rem)", h1: "clamp(2.25rem, 5vw, 4.5rem)", h2: "clamp(1.5rem, 2.6vw, 2.5rem)", body: "0.875rem", label: "0.75rem", weight: 800, lineHeight: 1, tracking: -0.02, upper: false, labelUpper: true, labelTracking: 0.1, bodyLineHeight: 1.6 },
    space: { margin: "max(24px, calc((100vw - 1100px) / 2))", gutter: "16px", cols: 12, section: "clamp(80px, 9vw, 140px)", header: "56px", measure: "34em" },
    surface: { radius: 6, pill: true, shadow: false },
    motion: { fast: 0.2, reveal: 0.8, page: 0.5, stagger: 0.04, ease: E.standard, easeReveal: E.quartOut },
    heroes: ["product-center", "dark-data"],
    stories: ["object", "product"],
  },
  {
    id: "papel",
    source: "repo",
    label: "Estudio en papel",
    note: "Papel crudo y tinta casi negra, grotesca ajustada a medio peso, filetes finos en vez de cajas y un solo color de óxido para lo importante.",
    sectors: "Estudios de arquitectura y diseño, consultoras, cerámica, oficios, portfolios",
    refs: ["Alzado (/sitios/alzado)", "Estudio (/sitios/estudio)", "Barro (/sitios/barro)", "Plano (/sitios/plano)"],
    variant: "minimal",
    tokens: { bg: "#f2efe9", fg: "#121110", mut: "#625d54", acc: "#b9501d", acc2: "#121110", card: "#e8e4dc", ln: "rgba(18,17,16,0.14)", r: 6, font: f.inter, display: f.interTight, accentFont: f.geistMono },
    fonts: { display: f.interTight, body: f.inter, accent: f.geistMono, mono: f.geistMono },
    type: { brand: "clamp(4rem, 15vw, 14rem)", h1: "clamp(2.25rem, 5vw, 4.75rem)", h2: "clamp(2rem, 3.2vw, 3rem)", body: "1rem", label: "0.75rem", weight: 500, lineHeight: 1.02, tracking: -0.035, upper: false, labelUpper: true, labelTracking: 0.06, bodyLineHeight: 1.55 },
    space: { margin: "clamp(20px, 2.8vw, 40px)", gutter: "20px", cols: 12, section: "clamp(96px, 11vw, 168px)", header: "64px", measure: "30em" },
    surface: { radius: 6, pill: true, shadow: false },
    motion: { fast: 0.3, reveal: 1, page: 0.7, stagger: 0.06, ease: E.quintOut, easeReveal: E.quintOut },
    heroes: ["asym-editorial", "framed-object"],
    stories: ["chapters", "index"],
  },
];

/**
 * Las once reglas con las que `refs:probe --guides` mide cada guía (docs/16 §2): los rangos de las webs premiadas. La
 * lógica está en `scripts/probe-refs.mts`; aquí, el nombre de cada regla (el mismo texto en los dos sitios).
 */
export const GUIDE_RULES = [
  "familias ≤ 3",
  "titular 3–8 vw, marca 12–18 vw o de borde a borde ≤ 50 vw",
  "interlineado del titular 0,8–1",
  "peso del titular 300–500 (o condensada/lúdica)",
  "tracking del titular 0 a −5 %",
  "texto 14–20 px",
  "interlineado del texto 1,3–1,6",
  "margen lateral 10–80 px o contenido centrado (escritorio)",
  "margen lateral 8–29 px (móvil)",
  "titular móvil 8–16 vw (marca hasta 50)",
  "sombras ≤ 2 (salvo lúdico o sombra dura)",
] as const;

/**
 * Excepciones medidas: rasgos de una familia que salen de los rangos de las premiadas generalistas y son justo lo que la
 * hace reconocible. Cada una lleva su medida y la web donde se midió (docs/16 §5.1b); sin eso sería un fallo.
 */
export const GUIDE_EXCEPTIONS: Record<string, { rule: (typeof GUIDE_RULES)[number]; why: string }[]> = {
  salon: [
    { rule: "interlineado del titular 0,8–1", why: "Il Colorista: Cormorant 200 a 1,11" },
    { rule: "texto 14–20 px", why: "Il Colorista: Karla 200 a 24 px" },
  ],
  autor: [{ rule: "margen lateral 10–80 px o contenido centrado (escritorio)", why: "Surfing Academy: 120 px" }],
  marca: [{ rule: "interlineado del texto 1,3–1,6", why: "Peppa Sauce: texto de cartel a 1,2 (36 px)" }],
  terminal: [{ rule: "peso del titular 300–500 (o condensada/lúdica)", why: "CIPHERGRID y MYCEL: JetBrains Mono a 800; la mono fina no se lee como titular" }],
  puntos: [{ rule: "peso del titular 300–500 (o condensada/lúdica)", why: "DOTMATRIX y Almíbar Barrio: Doto a 800; con menos peso los puntos no se juntan en letras" }],
};

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
