import { vcls, type Variant } from "./variants";

export type ScrollAreaProps = {
  /** un párrafo por línea */
  content?: string;
  height?: number;
  variant?: Variant;
  className?: string;
};

const DEFAULT_CONTENT =
  "Registro de cambios\n" +
  "v1.4.0 — Panel de tokens con selector de tipografía y fuentes de Google autoalojadas.\n" +
  "v1.3.0 — Categoría «Secciones»: hero, contacto, precios, FAQ y más, listos para pegar.\n" +
  "v1.2.0 — Entrada, salida y hover por composición (Presence y HoverFX) para todo el catálogo.\n" +
  "v1.1.0 — Comparador de los 7 estilos y vista «en caso real» por categoría.\n" +
  "v1.0.0 — Primera versión del catálogo: tokens, sistema de estilos y 20 componentes.";

/**
 * Caja de contenido largo (registro de cambios, comentarios, salida de terminal…) con su propia
 * barra de desplazamiento — ver la sección "Scrollbars personalizadas" en `components/ui/styles/ui-kit.css`: la
 * barra la hereda automáticamente cualquier superficie `ui-s--<variante>`, este componente es solo
 * el envoltorio con una altura fija para demostrarla y para usarla directamente en un proyecto.
 */
export default function ScrollArea({ content = DEFAULT_CONTENT, height = 220, variant = "glass", className = "" }: ScrollAreaProps) {
  const lines = content.split("\n").filter((l) => l.trim());
  return (
    <div className={`ui-scroll ui-surface ${vcls(variant)} ${className}`} style={{ height }}>
      {lines.map((l, i) => (
        <p key={i} className={i === 0 ? "ui-scroll__head" : undefined}>
          {l}
        </p>
      ))}
    </div>
  );
}
