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
