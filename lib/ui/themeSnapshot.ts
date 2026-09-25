import type { CSSProperties } from "react";

const NAMES = ["--bg", "--fg", "--mut", "--acc", "--acc2", "--card", "--ln", "--r", "--display", "--ok", "--info", "--warn", "--bad"];

/**
 * Tokens del tema vigentes en `el`, como estilo en línea. Sirve a los overlays que tienen que salir a `document.body` con un
 * portal (porque algún ancestro con `backdrop-filter`, `transform` o `filter` atraparía su `position: fixed`) sin perder el
 * tema: el nodo del portal lleva los mismos tokens y la misma tipografía base que el sitio donde vive el componente.
 */
export function themeSnapshot(el: Element): CSSProperties {
  const cs = getComputedStyle(el);
  const out: Record<string, string> = {};
  for (const n of NAMES) {
    const v = cs.getPropertyValue(n).trim();
    if (v) out[n] = v;
  }
  // la tipografía base es la del contenedor (el propio elemento puede llevar la de su variante)
  out.fontFamily = getComputedStyle(el.parentElement ?? el).fontFamily;
  if (out["--fg"]) out.color = out["--fg"];
  return out as CSSProperties;
}
