import { createElement, type CSSProperties, type ReactNode } from "react";
import { guide, guideToStyle, type StyleGuide } from "@/lib/ui/guides";
import { textContrastStyle } from "@/lib/ui/text-contrast";

export type GuideFrameProps = {
  /** id de una guía de `STYLE_GUIDES` (`lujo`, `monocromo`, `tecnico`, `nocturno`, `electrico`, `rotulo`, `calido`, `ludico`, `salon`, `barberia`, `club`, `boutique`, `autor`, `escuela`, `marca`, `terminal`, `pixel`, `puntos`, `papel`; hoja de cada una en /guias/<id>) o una guía propia */
  guide?: string | StyleGuide;
  /** Ajusta --mut-text/--acc-text a 4,5:1 sobre --bg (sRGB opaco); conserva --mut/--acc decorativos. Por defecto false. */
  textContrast?: boolean;
  as?: "div" | "main" | "section" | "article";
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

/**
 * Aplica una guía de estilo (docs/16) a un contenedor: tema, par tipográfico, escala, espacio, superficies y movimiento como
 * variables CSS, con el fondo y el color de la guía. Dentro, las clases `ui-g-*` (titulares `ui-g-brand`/`ui-g-h1`/`ui-g-h2`,
 * `ui-g-body`, `ui-g-label`, `ui-g-btn`, `ui-g-grid`, `ui-g-wrap`, `ui-g-section`, `ui-g-rise`…) y cualquier componente del kit
 * (lee los mismos tokens) siguen la guía. Componente de servidor: no tiene estado ni efectos.
 */
export default function GuideFrame({ guide: g = "lujo", textContrast = false, as = "div", className = "", style, children }: GuideFrameProps) {
  const def = typeof g === "string" ? guide(g) : g;
  const base = { ...guideToStyle(def), ...style };
  return createElement(as, { className: `ui-guide ${className}`.trim(), "data-guide": def.id, style: { ...base, ...(textContrast ? textContrastStyle(base) : {}), ...style } }, children);
}
