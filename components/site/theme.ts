import pkg from "@/package.json";
import { tokensToStyle } from "@/lib/ui/tokens";

/**
 * Tema de la web de Trama: el negro, blanco y gris de SILO con el rojo de alerta de SIGNAL como único acento. Los mismos
 * tokens que cualquier proyecto con el kit: los componentes que se ven en la web se pintan con ellos.
 */
export const SITE_TOKENS = {
  bg: "#000000",
  fg: "#ededed",
  mut: "#8a8a8a",
  acc: "#ff3b3b",
  acc2: "#8a8a8a",
  card: "rgba(255,255,255,0.035)",
  ln: "rgba(255,255,255,0.14)",
  r: 0,
  font: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
  display: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
};

export const SITE_STYLE = tokensToStyle(SITE_TOKENS);

export const GITHUB = "https://github.com/DanielMartinezSebastian/trama";
export const VERSION = pkg.version;

/** Secciones principales de la web (cabecera y pie). */
export const NAV = [
  { href: "/docs", label: "Docs" },
  { href: "/componentes", label: "Componentes" },
  { href: "/demos", label: "Demos" },
] as const;
