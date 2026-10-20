import type { CSSProperties } from "react";

/**
 * Tokens de diseño que consumen todos los componentes de `components/ui/`.
 * Un tema es solo un objeto de tokens: cambiarlo no toca ningún componente.
 */
export type TokenSet = {
  bg: string;
  fg: string;
  mut: string;
  acc: string;
  acc2: string;
  card: string;
  ln: string;
  /** radio en px */
  r: number;
  font: string;
  /** fuente de los titulares (h1–h3); sin ella heredan `font` */
  display?: string;
  /** fuente de acento (cursiva dentro de un titular, `<em>`); se publica como `--font-accent` */
  accentFont?: string;
  /** fuerza los brillos de texto (neón, dot matrix…) a true/false; por defecto, solo con texto claro */
  glow?: boolean;
};

/** Tema por defecto del kit: el mismo que fija `:root` en `components/ui/styles/kit.css`. */
export const neutralTokens: TokenSet = {
  bg: "#07080f",
  fg: "#e8ecf4",
  mut: "#9aa3b5",
  acc: "#7cc4ff",
  acc2: "#c084fc",
  card: "rgba(255,255,255,0.06)",
  ln: "rgba(255,255,255,0.16)",
  r: 14,
  font: 'var(--font-inter), ui-sans-serif, system-ui, "Segoe UI", sans-serif',
};

/**
 * Tema monocromo de matriz de puntos: negro puro, texto gris claro, acento blanco. Pensado para la variante `dotmatrix` y para
 * `RetroCanvas` (ASCII de puntos + scanlines), pero es un tema más: vale con cualquier variante.
 */
export const dotmatrixTokens: TokenSet = {
  bg: "#000000",
  fg: "#e6e6e6",
  mut: "#8c8c8c",
  acc: "#ffffff",
  acc2: "#a3a3a3",
  card: "rgba(255,255,255,0.035)",
  ln: "rgba(255,255,255,0.22)",
  r: 0,
  font: 'var(--font-ibm-plex-mono), var(--font-jetbrains-mono), ui-monospace, Consolas, monospace',
  display: 'var(--font-doto), var(--font-major-mono-display), ui-monospace, monospace',
};

/**
 * Tema editorial claro («papel»): fondo hueso, tinta casi negra y un acento naranja. Pensado para la variante `editorial`
 * (estudios, portfolios, marcas con fotografía) y para tipografía grande; vale con cualquier variante. Titulares en Inter Tight,
 * texto en Inter y cursiva de acento en Instrument Serif (`FONT_PAIRINGS`, par «estudio»).
 */
export const editorialTokens: TokenSet = {
  bg: "#f2efe9",
  fg: "#121110",
  mut: "#6c675e",
  acc: "#c93208",
  acc2: "#121110",
  card: "#e8e4dc",
  ln: "rgba(18,17,16,0.16)",
  r: 16,
  font: 'var(--font-inter), ui-sans-serif, system-ui, "Helvetica Neue", Arial, sans-serif',
  display: 'var(--font-inter-tight), var(--font-inter), ui-sans-serif, system-ui, sans-serif',
  accentFont: 'var(--font-instrument-serif), Georgia, serif',
};

/** Tema editorial oscuro («tinta»): el mismo carácter sobre negro cálido. */
export const editorialDarkTokens: TokenSet = {
  bg: "#0e0e0d",
  fg: "#ece9e2",
  mut: "#8f8a80",
  acc: "#ff5a2c",
  acc2: "#ece9e2",
  card: "rgba(236,233,226,0.06)",
  ln: "rgba(236,233,226,0.18)",
  r: 16,
  font: 'var(--font-inter), ui-sans-serif, system-ui, "Helvetica Neue", Arial, sans-serif',
  display: 'var(--font-inter-tight), var(--font-inter), ui-sans-serif, system-ui, sans-serif',
  accentFont: 'var(--font-instrument-serif), Georgia, serif',
};

/**
 * Tema «plano técnico» (fórmula de Heron AI): papel hueso con grano, tinta casi negra y un único acento naranja. Pensado para webs
 * de producto técnico: marcos de línea fina, etiquetas mono en mayúsculas y titulares gruesos y apretados.
 */
export const blueprintTokens: TokenSet = {
  bg: "#f4f2ec",
  fg: "#232220",
  mut: "#5f5b53",
  acc: "#c43500",
  acc2: "#232220",
  card: "#ebe8df",
  ln: "rgba(35,34,32,0.22)",
  r: 2,
  font: 'var(--font-inter), ui-sans-serif, system-ui, "Helvetica Neue", Arial, sans-serif',
  display: 'var(--font-inter-tight), var(--font-inter), ui-sans-serif, system-ui, sans-serif',
  accentFont: 'var(--font-geist-mono), ui-monospace, Consolas, monospace',
};

/**
 * Tema «bosque» (fórmula de Belgrade Arbor): verde profundo, crema y oro, con serif elegante en los titulares. Pensado para
 * arquitectura, inmobiliario, hostelería y marcas de lujo tranquilo.
 */
export const forestTokens: TokenSet = {
  bg: "#25331f",
  fg: "#efe8d6",
  mut: "#b9b49c",
  acc: "#d9b45a",
  acc2: "#efe8d6",
  card: "rgba(239,232,214,0.06)",
  ln: "rgba(239,232,214,0.2)",
  r: 14,
  font: 'var(--font-instrument-sans), ui-sans-serif, system-ui, sans-serif',
  display: 'var(--font-cormorant-garamond), var(--font-playfair-display), Georgia, serif',
  accentFont: 'var(--font-cormorant-garamond), Georgia, serif',
};

/**
 * Tema «voltaje» (fórmula de Lando Norris, sitio del año 2025): verde oliva casi negro, texto hueso y un único amarillo ácido.
 * Titulares en palo seco grueso y mayúsculas con palabras sueltas en serifa de alto contraste (`SplitText emphasis`). Deporte,
 * atletas, motor, marcas personales con mucha fotografía.
 */
export const voltTokens: TokenSet = {
  bg: "#282c20",
  fg: "#e8eadf",
  mut: "#a3a893",
  acc: "#d2ff00",
  acc2: "#b3c43c",
  card: "rgba(232,234,223,0.06)",
  ln: "rgba(232,234,223,0.16)",
  r: 6,
  font: 'var(--font-schibsted-grotesk), ui-sans-serif, system-ui, sans-serif',
  display: 'var(--font-schibsted-grotesk), ui-sans-serif, system-ui, sans-serif',
  accentFont: 'var(--font-bodoni-moda), "Didot", Georgia, serif',
};

/**
 * Tema «producto nocturno» (Linear, Raycast): negro casi puro, texto blanco roto, grises fríos y un violeta de acento que se usa
 * poco. Titulares en Inter de peso medio y tracking negativo; etiquetas en mono. SaaS, herramientas para desarrolladores.
 */
export const nightTokens: TokenSet = {
  bg: "#08090a",
  fg: "#f7f8f8",
  mut: "#8a8f98",
  acc: "#7170ff",
  acc2: "#e2e4e7",
  card: "rgba(255,255,255,0.035)",
  ln: "rgba(255,255,255,0.09)",
  r: 10,
  font: 'var(--font-inter), ui-sans-serif, system-ui, -apple-system, sans-serif',
  display: 'var(--font-inter), ui-sans-serif, system-ui, -apple-system, sans-serif',
  accentFont: 'var(--font-geist-mono), ui-monospace, Consolas, monospace',
};

/**
 * Tema «escritorio Y2K» (Poolsuite): rosa de piscina, ventanas de sistema operativo antiguo con borde de tinta y un azul de
 * botón. Cuerpo en mono, titulares en pixel. Radios, música, comunidades y marcas con humor; con la variante `retro`.
 */
export const poolTokens: TokenSet = {
  bg: "#f4d4d4",
  fg: "#2b1d1d",
  mut: "#6b4a4a",
  acc: "#2f5be0",
  acc2: "#ffcf4a",
  card: "#fff7f0",
  ln: "rgba(43,29,29,0.55)",
  r: 3,
  font: 'var(--font-ibm-plex-mono), ui-monospace, Consolas, monospace',
  display: 'var(--font-silkscreen), var(--font-ibm-plex-mono), monospace',
  accentFont: 'var(--font-vt323), ui-monospace, monospace',
};

/**
 * Registro de temas del kit. **Añadir un tema = añadir una entrada aquí**: el selector de `/componentes`, el paquete
 * (`trama-ui/tokens`) y la tabla de `docs/README.md` lo recogen solos (la última, con `npm run catalog`). No hay límite:
 * un tema es solo un objeto de tokens (ver «Temas del kit» en la guía, §2.5).
 * `variant` es la variante de estilo que mejor le sienta (una sugerencia: cualquier tema vale con cualquier variante).
 */
export type KitTheme = { id: string; label: string; note: string; variant: string; tokens: TokenSet };

export const TOKEN_THEMES: KitTheme[] = [
  { id: "neutro", label: "Neutro oscuro", note: "El tema por defecto del kit: azul noche con acento celeste.", variant: "glass", tokens: neutralTokens },
  { id: "dotmatrix", label: "Dot matrix (mono)", note: "Negro puro monocromo para la estética de matriz de puntos.", variant: "dotmatrix", tokens: dotmatrixTokens },
  { id: "editorial", label: "Editorial · papel", note: "Hueso y tinta con acento naranja. Estudios, portfolios, marcas con fotografía.", variant: "editorial", tokens: editorialTokens },
  { id: "blueprint", label: "Plano técnico", note: "Papel hueso y un acento naranja, mono en etiquetas. Producto técnico, ingeniería, herramientas.", variant: "outline", tokens: blueprintTokens },
  { id: "bosque", label: "Bosque", note: "Verde profundo, crema y oro con serif elegante. Arquitectura, inmobiliario, hostelería.", variant: "editorial", tokens: forestTokens },
  { id: "voltaje", label: "Voltaje", note: "Oliva casi negro y amarillo ácido, palo seco con serifa de acento. Deporte, atletas, motor.", variant: "editorial", tokens: voltTokens },
  { id: "nocturno", label: "Producto nocturno", note: "Negro, grises fríos y un violeta que casi no se usa. SaaS y herramientas (Linear, Raycast).", variant: "editorial", tokens: nightTokens },
  { id: "piscina", label: "Escritorio Y2K", note: "Rosa de piscina y ventanas de sistema antiguo, mono y pixel. Radios, música, comunidades.", variant: "retro", tokens: poolTokens },
  { id: "editorial-oscuro", label: "Editorial · tinta", note: "Negro cálido con el mismo carácter editorial.", variant: "editorial", tokens: editorialDarkTokens },
];

/** Luminancia relativa (0–1) de un color CSS en `#rgb`, `#rrggbb`, `rgb()` o `rgba()`; `null` si no se sabe leer. */
function luminance(css: string): number | null {
  const c = css.trim().toLowerCase();
  let r: number, g: number, b: number;
  const hex = c.match(/^#([0-9a-f]{3,8})$/);
  const fn = c.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/);
  if (hex) {
    const h = hex[1].length <= 4 ? [...hex[1]].map((x) => x + x).join("") : hex[1];
    if (h.length < 6) return null;
    r = parseInt(h.slice(0, 2), 16);
    g = parseInt(h.slice(2, 4), 16);
    b = parseInt(h.slice(4, 6), 16);
  } else if (fn) {
    [r, g, b] = [Number(fn[1]), Number(fn[2]), Number(fn[3])];
  } else return null;
  const lin = (v: number) => ((v /= 255) <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/**
 * ¿Es oscuro el texto de este tema? Con texto oscuro sobre fondo claro **no debe haber brillos ni sombras de texto**: un
 * brillo oscuro alrededor de letras oscuras las empasta y estorba la lectura. El kit lo resuelve con la variable `--glow`
 * (0 = sin brillos, 1 = con ellos) que escala todos los `text-shadow` de color. Se decide por la luminancia del texto (o,
 * si no se puede leer, por la del fondo); sin datos, se asume tema oscuro (el de por defecto del kit).
 */
export function hasDarkText(t: Pick<TokenSet, "fg" | "bg">): boolean {
  const f = luminance(t.fg);
  if (f !== null) return f < 0.4;
  const b = luminance(t.bg);
  return b !== null ? b > 0.4 : false;
}

/** Convierte tokens en variables CSS para el contenedor (`style={tokensToStyle(...)}`). */
export function tokensToStyle(t: TokenSet): CSSProperties {
  return {
    "--bg": t.bg,
    "--fg": t.fg,
    "--mut": t.mut,
    "--acc": t.acc,
    "--acc2": t.acc2,
    "--card": t.card,
    "--ln": t.ln,
    "--r": `${t.r}px`,
    ...(t.display ? { "--display": t.display } : {}),
    ...(t.accentFont ? { "--font-accent": t.accentFont } : {}),
    "--glow": (t.glow ?? !hasDarkText(t)) ? 1 : 0,
    // El halo de legibilidad se fija aquí, con el fondo de ESTE tema: una variable definida en `:root` con `var(--bg, …)` se resuelve
    // en `:root`, donde el tema aún no existe, y caería al negro de reserva (sombra negra sobre texto oscuro en temas claros).
    "--legibility-ts": `0 1px 1px color-mix(in srgb, ${t.bg} 85%, transparent), 0 0 3px color-mix(in srgb, ${t.bg} 65%, transparent)`,
    fontFamily: t.font,
    color: t.fg,
  } as CSSProperties;
}

/** Lee un token desde el DOM (para canvas): `token(el, "--acc")`. */
export function token(el: Element, name: string, fallback = "#ffffff") {
  return getComputedStyle(el).getPropertyValue(name).trim() || fallback;
}

/**
 * Tipografías que ofrece el selector de tokens del catálogo (`/componentes`).
 * Las que llevan `var(--font-*)` vienen de Google, autoalojadas por `next/font`
 * en `lib/ui/fonts.ts` (sin petición externa en runtime); las "del sistema" son
 * el *fallback* sin fuente web, para cuando no hace falta descargar nada. Una
 * fuente local propia (de marca) se añade igual: `next/font/local` en
 * `lib/ui/fonts.ts` + una entrada aquí con su `var(--font-...)`.
 */
export const FONT_PRESETS: { id: string; label: string; stack: string }[] = [
  { id: "sistema", label: "Sans del sistema", stack: 'ui-sans-serif, system-ui, "Segoe UI", sans-serif' },
  { id: "inter", label: "Sans — Inter", stack: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif' },
  { id: "manrope", label: "Sans — Manrope", stack: 'var(--font-manrope), ui-sans-serif, system-ui, sans-serif' },
  { id: "space-grotesk", label: "Display — Space Grotesk", stack: 'var(--font-space-grotesk), ui-sans-serif, system-ui, sans-serif' },
  { id: "syne", label: "Display — Syne", stack: 'var(--font-syne), ui-sans-serif, system-ui, sans-serif' },
  { id: "fraunces", label: "Serif — Fraunces", stack: 'var(--font-fraunces), Georgia, serif' },
  { id: "instrument-serif", label: "Serif — Instrument Serif", stack: 'var(--font-instrument-serif), Georgia, serif' },
  { id: "jetbrains-mono", label: "Mono — JetBrains Mono", stack: 'var(--font-jetbrains-mono), ui-monospace, Consolas, monospace' },
  { id: "space-mono", label: "Mono — Space Mono", stack: 'var(--font-space-mono), ui-monospace, Consolas, monospace' },
  { id: "ibm-plex-mono", label: "Mono — IBM Plex Mono", stack: 'var(--font-ibm-plex-mono), ui-monospace, Consolas, monospace' },
  { id: "share-tech-mono", label: "Mono — Share Tech Mono", stack: 'var(--font-share-tech-mono), ui-monospace, Consolas, monospace' },
  { id: "major-mono-display", label: "Display — Major Mono Display", stack: 'var(--font-major-mono-display), ui-monospace, monospace' },
  { id: "mono-sistema", label: "Monoespaciada del sistema", stack: 'ui-monospace, "Cascadia Code", Consolas, monospace' },
  // Editorial — grotescas de titular apretado, serifs de acento y mono (lib/ui/fonts.ts).
  { id: "inter-tight", label: "Editorial — Inter Tight", stack: 'var(--font-inter-tight), var(--font-inter), ui-sans-serif, system-ui, sans-serif' },
  { id: "instrument-sans", label: "Editorial — Instrument Sans", stack: 'var(--font-instrument-sans), ui-sans-serif, system-ui, sans-serif' },
  { id: "geist", label: "Editorial — Geist", stack: 'var(--font-geist), ui-sans-serif, system-ui, sans-serif' },
  { id: "schibsted-grotesk", label: "Editorial — Schibsted Grotesk", stack: 'var(--font-schibsted-grotesk), ui-sans-serif, system-ui, sans-serif' },
  { id: "bricolage-grotesque", label: "Editorial — Bricolage Grotesque", stack: 'var(--font-bricolage-grotesque), ui-sans-serif, system-ui, sans-serif' },
  { id: "newsreader", label: "Editorial serif — Newsreader", stack: 'var(--font-newsreader), Georgia, serif' },
  { id: "bodoni-moda", label: "Editorial serif — Bodoni Moda", stack: 'var(--font-bodoni-moda), "Didot", Georgia, serif' },
  { id: "cormorant-garamond", label: "Editorial serif — Cormorant Garamond", stack: 'var(--font-cormorant-garamond), Georgia, serif' },
  { id: "playfair-display", label: "Editorial serif — Playfair Display", stack: 'var(--font-playfair-display), Georgia, serif' },
  { id: "geist-mono", label: "Editorial mono — Geist Mono", stack: 'var(--font-geist-mono), ui-monospace, Consolas, monospace' },
  // Pixel — las 46 familias de fonts.google.com/?categoryFilters=Appearance:/Theme/Pixel (lib/ui/fonts.ts).
  { id: "press-start-2p", label: "Pixel — Press Start 2P", stack: 'var(--font-press-start-2p), monospace' },
  { id: "vt323", label: "Pixel — VT323", stack: 'var(--font-vt323), monospace' },
  { id: "geist-pixel", label: "Pixel — Geist Pixel", stack: 'var(--font-geist-pixel), monospace' },
  { id: "jersey-25", label: "Pixel — Jersey 25", stack: 'var(--font-jersey-25), monospace' },
  { id: "pixelify-sans", label: "Pixel — Pixelify Sans", stack: 'var(--font-pixelify-sans), monospace' },
  { id: "dotgothic16", label: "Pixel — DotGothic16", stack: 'var(--font-dotgothic16), monospace' },
  { id: "silkscreen", label: "Pixel — Silkscreen", stack: 'var(--font-silkscreen), monospace' },
  { id: "bitcount-single", label: "Pixel — Bitcount Single", stack: 'var(--font-bitcount-single), monospace' },
  { id: "jersey-10", label: "Pixel — Jersey 10", stack: 'var(--font-jersey-10), monospace' },
  { id: "doto", label: "Pixel — Doto", stack: 'var(--font-doto), monospace' },
  { id: "tiny5", label: "Pixel — Tiny5", stack: 'var(--font-tiny5), monospace' },
  { id: "bitcount-prop-single", label: "Pixel — Bitcount Prop Single", stack: 'var(--font-bitcount-prop-single), monospace' },
  { id: "handjet", label: "Pixel — Handjet", stack: 'var(--font-handjet), monospace' },
  { id: "bitcount-grid-double", label: "Pixel — Bitcount Grid Double", stack: 'var(--font-bitcount-grid-double), monospace' },
  { id: "jacquard-12", label: "Pixel — Jacquard 12", stack: 'var(--font-jacquard-12), monospace' },
  { id: "jersey-20", label: "Pixel — Jersey 20", stack: 'var(--font-jersey-20), monospace' },
  { id: "jersey-15", label: "Pixel — Jersey 15", stack: 'var(--font-jersey-15), monospace' },
  { id: "jacquarda-bastarda-9", label: "Pixel — Jacquarda Bastarda 9", stack: 'var(--font-jacquarda-bastarda-9), monospace' },
  { id: "micro-5", label: "Pixel — Micro 5", stack: 'var(--font-micro-5), monospace' },
  { id: "bitcount-ink", label: "Pixel — Bitcount Ink", stack: 'var(--font-bitcount-ink), monospace' },
  { id: "bitcount-prop-single-ink", label: "Pixel — Bitcount Prop Single Ink", stack: 'var(--font-bitcount-prop-single-ink), monospace' },
  { id: "bitcount-grid-double-ink", label: "Pixel — Bitcount Grid Double Ink", stack: 'var(--font-bitcount-grid-double-ink), monospace' },
  { id: "bitcount-prop-double-ink", label: "Pixel — Bitcount Prop Double Ink", stack: 'var(--font-bitcount-prop-double-ink), monospace' },
  { id: "bitcount-grid-single-ink", label: "Pixel — Bitcount Grid Single Ink", stack: 'var(--font-bitcount-grid-single-ink), monospace' },
  { id: "bitcount-single-ink", label: "Pixel — Bitcount Single Ink", stack: 'var(--font-bitcount-single-ink), monospace' },
  { id: "jacquard-24", label: "Pixel — Jacquard 24", stack: 'var(--font-jacquard-24), monospace' },
  { id: "bitcount-grid-single", label: "Pixel — Bitcount Grid Single", stack: 'var(--font-bitcount-grid-single), monospace' },
  { id: "coral-pixels", label: "Pixel — Coral Pixels", stack: 'var(--font-coral-pixels), monospace' },
  { id: "bytesized", label: "Pixel — Bytesized", stack: 'var(--font-bytesized), monospace' },
  { id: "bitcount", label: "Pixel — Bitcount", stack: 'var(--font-bitcount), monospace' },
  { id: "jacquard-12-charted", label: "Pixel — Jacquard 12 Charted", stack: 'var(--font-jacquard-12-charted), monospace' },
  { id: "bitcount-prop-double", label: "Pixel — Bitcount Prop Double", stack: 'var(--font-bitcount-prop-double), monospace' },
  { id: "jacquard-24-charted", label: "Pixel — Jacquard 24 Charted", stack: 'var(--font-jacquard-24-charted), monospace' },
  { id: "jersey-15-charted", label: "Pixel — Jersey 15 Charted", stack: 'var(--font-jersey-15-charted), monospace' },
  { id: "micro-5-charted", label: "Pixel — Micro 5 Charted", stack: 'var(--font-micro-5-charted), monospace' },
  { id: "jersey-10-charted", label: "Pixel — Jersey 10 Charted", stack: 'var(--font-jersey-10-charted), monospace' },
  { id: "jersey-25-charted", label: "Pixel — Jersey 25 Charted", stack: 'var(--font-jersey-25-charted), monospace' },
  { id: "jacquarda-bastarda-9-charted", label: "Pixel — Jacquarda Bastarda 9 Charted", stack: 'var(--font-jacquarda-bastarda-9-charted), monospace' },
  { id: "jersey-20-charted", label: "Pixel — Jersey 20 Charted", stack: 'var(--font-jersey-20-charted), monospace' },
  { id: "sixtyfour", label: "Pixel — Sixtyfour", stack: 'var(--font-sixtyfour), monospace' },
  { id: "sixtyfour-convergence", label: "Pixel — Sixtyfour Convergence", stack: 'var(--font-sixtyfour-convergence), monospace' },
  { id: "workbench", label: "Pixel — Workbench", stack: 'var(--font-workbench), monospace' },
  { id: "rubik-pixels", label: "Pixel — Rubik Pixels", stack: 'var(--font-rubik-pixels), monospace' },
  { id: "rubik-iso", label: "Pixel — Rubik Iso", stack: 'var(--font-rubik-iso), monospace' },
  { id: "mozilla-headline", label: "Pixel — Mozilla Headline", stack: 'var(--font-mozilla-headline), monospace' },
  { id: "rubik-broken-fax", label: "Pixel — Rubik Broken Fax", stack: 'var(--font-rubik-broken-fax), monospace' },
];

export type TokenOverrides = Partial<{ bg: string; fg: string; mut: string; acc: string; acc2: string; r: number; font: string }>;

const isHex = (c: string) => /^#[0-9a-f]{6}$/i.test(c);
const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

/** Aplica cambios manuales sobre un tema; card y ln se derivan de fg si este se modifica. */
export function applyOverrides(base: TokenSet, o: TokenOverrides): TokenSet {
  const t: TokenSet = { ...base };
  if (o.bg) t.bg = o.bg;
  if (o.fg) {
    t.fg = o.fg;
    if (isHex(o.fg)) {
      t.card = rgba(o.fg, 0.07);
      t.ln = rgba(o.fg, 0.18);
    }
  }
  if (o.mut) t.mut = o.mut;
  if (o.acc) t.acc = o.acc;
  if (o.acc2) t.acc2 = o.acc2;
  if (o.r !== undefined) t.r = o.r;
  if (o.font) t.font = o.font;
  return t;
}

/** Valor válido para `<input type="color">` (solo acepta #rrggbb). */
export const toHex = (c: string, fallback = "#888888") => (isHex(c) ? c : fallback);

/**
 * Pares tipográficos para la variante `editorial`: `display` para titulares (con tracking negativo), `body` para texto,
 * `accent` para palabras en cursiva dentro de un titular (`<em>`) y `mono` para etiquetas. Los stacks son los de `FONT_PRESETS`.
 * Uso: `tokensToStyle({ ..., font: pair.body, display: pair.display })` y `--font-accent: pair.accent` en el contenedor.
 */
export const FONT_PAIRINGS: { id: string; label: string; note: string; display: string; body: string; accent: string; mono: string }[] = [
  {
    id: "estudio",
    label: "Estudio sobrio",
    note: "Inter Tight en titulares, Inter en texto, Instrument Serif en cursiva. La de Marea Studio.",
    display: 'var(--font-inter-tight), var(--font-inter), ui-sans-serif, sans-serif',
    body: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
    accent: 'var(--font-instrument-serif), Georgia, serif',
    mono: 'var(--font-geist-mono), ui-monospace, Consolas, monospace',
  },
  {
    id: "contemporaneo",
    label: "Contemporáneo",
    note: "Geist en todo, con Newsreader para las cursivas. Tecnología y producto.",
    display: 'var(--font-geist), ui-sans-serif, system-ui, sans-serif',
    body: 'var(--font-geist), ui-sans-serif, system-ui, sans-serif',
    accent: 'var(--font-newsreader), Georgia, serif',
    mono: 'var(--font-geist-mono), ui-monospace, Consolas, monospace',
  },
  {
    id: "revista",
    label: "Revista",
    note: "Schibsted Grotesk para titulares, Newsreader para leer. Medios, blogs y contenido largo.",
    display: 'var(--font-schibsted-grotesk), ui-sans-serif, system-ui, sans-serif',
    body: 'var(--font-newsreader), Georgia, serif',
    accent: 'var(--font-newsreader), Georgia, serif',
    mono: 'var(--font-geist-mono), ui-monospace, Consolas, monospace',
  },
  {
    id: "moda",
    label: "Moda y lujo",
    note: "Instrument Sans discreta con Bodoni Moda de alto contraste en titulares. Marcas, joyería, estilismo.",
    display: 'var(--font-bodoni-moda), "Didot", Georgia, serif',
    body: 'var(--font-instrument-sans), ui-sans-serif, system-ui, sans-serif',
    accent: 'var(--font-bodoni-moda), "Didot", Georgia, serif',
    mono: 'var(--font-geist-mono), ui-monospace, Consolas, monospace',
  },
  {
    id: "arquitectura",
    label: "Arquitectura",
    note: "Cormorant Garamond para titulares y Instrument Sans para leer. Estudios de arquitectura, inmobiliario, hostelería.",
    display: 'var(--font-cormorant-garamond), var(--font-playfair-display), Georgia, serif',
    body: 'var(--font-instrument-sans), ui-sans-serif, system-ui, sans-serif',
    accent: 'var(--font-cormorant-garamond), Georgia, serif',
    mono: 'var(--font-geist-mono), ui-monospace, Consolas, monospace',
  },
  {
    id: "tecnico",
    label: "Técnico",
    note: "Inter Tight en mayúsculas gruesas y Geist Mono en etiquetas. Producto técnico y planos.",
    display: 'var(--font-inter-tight), var(--font-inter), ui-sans-serif, sans-serif',
    body: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
    accent: 'var(--font-geist-mono), ui-monospace, Consolas, monospace',
    mono: 'var(--font-geist-mono), ui-monospace, Consolas, monospace',
  },
  {
    id: "expresivo",
    label: "Expresivo",
    note: "Bricolage Grotesque con carácter, e Instrument Sans para leer. Estudios creativos, eventos y cultura.",
    display: 'var(--font-bricolage-grotesque), ui-sans-serif, system-ui, sans-serif',
    body: 'var(--font-instrument-sans), ui-sans-serif, system-ui, sans-serif',
    accent: 'var(--font-instrument-serif), Georgia, serif',
    mono: 'var(--font-geist-mono), ui-monospace, Consolas, monospace',
  },
];
