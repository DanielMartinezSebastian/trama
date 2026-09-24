/**
 * Catálogo tipográfico del kit.
 *
 * Fuentes de Google cargadas con `next/font/google`: se descargan en build y se
 * autoalojan en este dominio (sin `<link>` a fonts.googleapis.com, sin petición
 * de red en runtime, sin CLS gracias a `display: "swap"` + métricas de fallback
 * automáticas). Cada una expone una variable CSS (`--font-*`) que `FONT_PRESETS`
 * (`lib/ui/tokens.ts`) y los temas de landing (`lib/themes/themes.ts`) referencian
 * con un *stack* de sistema como último fallback, así nunca se depende 100% de
 * que la variable exista.
 *
 * Para añadir una fuente propia (de marca, con licencia local, no en Google
 * Fonts): usa `next/font/local` en este mismo archivo, exporta su variable igual
 * que las de abajo y regístrala en `FONT_PRESETS`. Ver guía §11.
 */
import { Fraunces, Inter, Instrument_Serif, JetBrains_Mono, Manrope, Space_Grotesk, Space_Mono, Syne } from "next/font/google";

export const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
export const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
export const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", display: "swap" });
export const syne = Syne({ subsets: ["latin"], variable: "--font-syne", display: "swap" });
export const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });
export const instrumentSerif = Instrument_Serif({ subsets: ["latin"], weight: ["400"], variable: "--font-instrument-serif", display: "swap" });
export const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono", display: "swap" });
export const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-space-mono", display: "swap" });

/**
 * Fuentes "Pixel" — las 46 familias que Google Fonts agrupa bajo Appearance › Theme › Pixel
 * (fonts.google.com/?categoryFilters=Appearance:%2FTheme%2FPixel), todas registradas también
 * en `FONT_PRESETS` bajo la etiqueta "Pixel — …". `preload: false` a propósito: son 46 fuentes
 * decorativas para elegir una a una desde el selector de `/componentes`, no texto de cada
 * página — con precarga activa (el valor por defecto) cada carga de CUALQUIER página del sitio
 * encadenaría 46 `<link rel="preload">` aunque esa página no use ninguna. Sin precarga, el
 * `@font-face` sigue disponible para aplicarla al instante en cuanto se elige.
 */
import {
  Bitcount, Bitcount_Grid_Double, Bitcount_Grid_Double_Ink, Bitcount_Grid_Single, Bitcount_Grid_Single_Ink, Bitcount_Ink,
  Bitcount_Prop_Double, Bitcount_Prop_Double_Ink, Bitcount_Prop_Single, Bitcount_Prop_Single_Ink, Bitcount_Single, Bitcount_Single_Ink,
  Bytesized, Coral_Pixels, DotGothic16, Doto, Geist_Pixel, Handjet,
  Jacquard_12, Jacquard_12_Charted, Jacquard_24, Jacquard_24_Charted, Jacquarda_Bastarda_9, Jacquarda_Bastarda_9_Charted,
  Jersey_10, Jersey_10_Charted, Jersey_15, Jersey_15_Charted, Jersey_20, Jersey_20_Charted,
  Jersey_25, Jersey_25_Charted, Micro_5, Micro_5_Charted, Mozilla_Headline, Pixelify_Sans,
  Press_Start_2P, Rubik_Broken_Fax, Rubik_Iso, Rubik_Pixels, Silkscreen, Sixtyfour,
  Sixtyfour_Convergence, Tiny5, VT323, Workbench,
} from "next/font/google";

export const pressStart2P = Press_Start_2P({ weight: "400", subsets: ["latin"], variable: "--font-press-start-2p", display: "swap", preload: false });
export const vt323 = VT323({ weight: "400", subsets: ["latin"], variable: "--font-vt323", display: "swap", preload: false });
export const geistPixel = Geist_Pixel({ subsets: ["latin"], variable: "--font-geist-pixel", display: "swap", preload: false });
export const jersey25 = Jersey_25({ weight: "400", subsets: ["latin"], variable: "--font-jersey-25", display: "swap", preload: false });
export const pixelifySans = Pixelify_Sans({ subsets: ["latin"], variable: "--font-pixelify-sans", display: "swap", preload: false });
export const dotGothic16 = DotGothic16({ weight: "400", subsets: ["latin"], variable: "--font-dotgothic16", display: "swap", preload: false });
export const silkscreen = Silkscreen({ weight: "400", subsets: ["latin"], variable: "--font-silkscreen", display: "swap", preload: false });
export const bitcountSingle = Bitcount_Single({ subsets: ["latin"], variable: "--font-bitcount-single", display: "swap", preload: false });
export const jersey10 = Jersey_10({ weight: "400", subsets: ["latin"], variable: "--font-jersey-10", display: "swap", preload: false });
export const doto = Doto({ subsets: ["latin"], variable: "--font-doto", display: "swap", preload: false });
export const tiny5 = Tiny5({ weight: "400", subsets: ["latin"], variable: "--font-tiny5", display: "swap", preload: false });
export const bitcountPropSingle = Bitcount_Prop_Single({ subsets: ["latin"], variable: "--font-bitcount-prop-single", display: "swap", preload: false });
export const handjet = Handjet({ subsets: ["latin"], variable: "--font-handjet", display: "swap", preload: false });
export const bitcountGridDouble = Bitcount_Grid_Double({ subsets: ["latin"], variable: "--font-bitcount-grid-double", display: "swap", preload: false });
export const jacquard12 = Jacquard_12({ weight: "400", subsets: ["latin"], variable: "--font-jacquard-12", display: "swap", preload: false });
export const jersey20 = Jersey_20({ weight: "400", subsets: ["latin"], variable: "--font-jersey-20", display: "swap", preload: false });
export const jersey15 = Jersey_15({ weight: "400", subsets: ["latin"], variable: "--font-jersey-15", display: "swap", preload: false });
export const jacquardaBastarda9 = Jacquarda_Bastarda_9({ weight: "400", subsets: ["latin"], variable: "--font-jacquarda-bastarda-9", display: "swap", preload: false });
export const micro5 = Micro_5({ weight: "400", subsets: ["latin"], variable: "--font-micro-5", display: "swap", preload: false });
export const bitcountInk = Bitcount_Ink({ subsets: ["latin"], variable: "--font-bitcount-ink", display: "swap", preload: false });
export const bitcountPropSingleInk = Bitcount_Prop_Single_Ink({ subsets: ["latin"], variable: "--font-bitcount-prop-single-ink", display: "swap", preload: false });
export const bitcountGridDoubleInk = Bitcount_Grid_Double_Ink({ subsets: ["latin"], variable: "--font-bitcount-grid-double-ink", display: "swap", preload: false });
export const bitcountPropDoubleInk = Bitcount_Prop_Double_Ink({ subsets: ["latin"], variable: "--font-bitcount-prop-double-ink", display: "swap", preload: false });
export const bitcountGridSingleInk = Bitcount_Grid_Single_Ink({ subsets: ["latin"], variable: "--font-bitcount-grid-single-ink", display: "swap", preload: false });
export const bitcountSingleInk = Bitcount_Single_Ink({ subsets: ["latin"], variable: "--font-bitcount-single-ink", display: "swap", preload: false });
export const jacquard24 = Jacquard_24({ weight: "400", subsets: ["latin"], variable: "--font-jacquard-24", display: "swap", preload: false });
export const bitcountGridSingle = Bitcount_Grid_Single({ subsets: ["latin"], variable: "--font-bitcount-grid-single", display: "swap", preload: false });
export const coralPixels = Coral_Pixels({ weight: "400", subsets: ["latin"], variable: "--font-coral-pixels", display: "swap", preload: false });
export const bytesized = Bytesized({ weight: "400", subsets: ["latin"], variable: "--font-bytesized", display: "swap", preload: false });
export const bitcount = Bitcount({ subsets: ["latin"], variable: "--font-bitcount", display: "swap", preload: false });
export const jacquard12Charted = Jacquard_12_Charted({ weight: "400", subsets: ["latin"], variable: "--font-jacquard-12-charted", display: "swap", preload: false });
export const bitcountPropDouble = Bitcount_Prop_Double({ subsets: ["latin"], variable: "--font-bitcount-prop-double", display: "swap", preload: false });
export const jacquard24Charted = Jacquard_24_Charted({ weight: "400", subsets: ["latin"], variable: "--font-jacquard-24-charted", display: "swap", preload: false });
export const jersey15Charted = Jersey_15_Charted({ weight: "400", subsets: ["latin"], variable: "--font-jersey-15-charted", display: "swap", preload: false });
export const micro5Charted = Micro_5_Charted({ weight: "400", subsets: ["latin"], variable: "--font-micro-5-charted", display: "swap", preload: false });
export const jersey10Charted = Jersey_10_Charted({ weight: "400", subsets: ["latin"], variable: "--font-jersey-10-charted", display: "swap", preload: false });
export const jersey25Charted = Jersey_25_Charted({ weight: "400", subsets: ["latin"], variable: "--font-jersey-25-charted", display: "swap", preload: false });
export const jacquardaBastarda9Charted = Jacquarda_Bastarda_9_Charted({ weight: "400", subsets: ["latin"], variable: "--font-jacquarda-bastarda-9-charted", display: "swap", preload: false });
export const jersey20Charted = Jersey_20_Charted({ weight: "400", subsets: ["latin"], variable: "--font-jersey-20-charted", display: "swap", preload: false });
export const sixtyfour = Sixtyfour({ subsets: ["latin"], variable: "--font-sixtyfour", display: "swap", preload: false });
export const sixtyfourConvergence = Sixtyfour_Convergence({ subsets: ["latin"], variable: "--font-sixtyfour-convergence", display: "swap", preload: false });
export const workbench = Workbench({ subsets: ["latin"], variable: "--font-workbench", display: "swap", preload: false });
export const rubikPixels = Rubik_Pixels({ weight: "400", subsets: ["latin"], variable: "--font-rubik-pixels", display: "swap", preload: false });
export const rubikIso = Rubik_Iso({ weight: "400", subsets: ["latin"], variable: "--font-rubik-iso", display: "swap", preload: false });
export const mozillaHeadline = Mozilla_Headline({ subsets: ["latin"], variable: "--font-mozilla-headline", display: "swap", preload: false });
export const rubikBrokenFax = Rubik_Broken_Fax({ weight: "400", subsets: ["latin"], variable: "--font-rubik-broken-fax", display: "swap", preload: false });

/** Todas las variables juntas, para aplicar una sola vez en `<html>` (ver `app/layout.tsx`). */
export const fontVariables = [
  inter, manrope, spaceGrotesk, syne, fraunces, instrumentSerif, jetbrainsMono, spaceMono,
  pressStart2P, vt323, geistPixel, jersey25, pixelifySans, dotGothic16,
  silkscreen, bitcountSingle, jersey10, doto, tiny5, bitcountPropSingle,
  handjet, bitcountGridDouble, jacquard12, jersey20, jersey15, jacquardaBastarda9,
  micro5, bitcountInk, bitcountPropSingleInk, bitcountGridDoubleInk, bitcountPropDoubleInk, bitcountGridSingleInk,
  bitcountSingleInk, jacquard24, bitcountGridSingle, coralPixels, bytesized, bitcount,
  jacquard12Charted, bitcountPropDouble, jacquard24Charted, jersey15Charted, micro5Charted, jersey10Charted,
  jersey25Charted, jacquardaBastarda9Charted, jersey20Charted, sixtyfour, sixtyfourConvergence, workbench,
  rubikPixels, rubikIso, mozillaHeadline, rubikBrokenFax,
]
  .map((f) => f.variable)
  .join(" ");
