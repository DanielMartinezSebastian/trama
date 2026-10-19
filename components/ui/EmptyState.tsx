import type { ReactNode } from "react";
import { vcls, type Variant } from "./variants";

export type EmptyStateProps = {
  title: string;
  text?: string;
  /** glifo o emoji decorativo sobre el título */
  glyph?: string;
  /** nivel del encabezado: 2 (por defecto), 3 o 4, según dónde esté en la página */
  level?: 2 | 3 | 4;
  /** botón o enlace de la acción principal */
  children?: ReactNode;
  variant?: Variant;
  className?: string;
};

/** Estado vacío (sin datos, sin resultados, error): qué pasa y qué puedes hacer. Una sola acción principal. */
export default function EmptyState({ title, text = "", glyph = "∅", level = 2, children, variant = "editorial", className = "" }: EmptyStateProps) {
  return (
    <div className={`ui-empty ui-surface ${vcls(variant)} ${className}`.trim()}>
      <span className="ui-empty__g" aria-hidden>{glyph}</span>
      {(() => { const H = `h${level}` as "h2" | "h3" | "h4"; return <H className="ui-empty__t">{title}</H>; })()}
      {text && <p className="ui-empty__p">{text}</p>}
      {children && <div className="ui-empty__a">{children}</div>}
    </div>
  );
}
