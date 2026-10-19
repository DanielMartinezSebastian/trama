import type { ReactNode } from "react";
import { vcls, type Variant } from "./variants";

export type EmptyStateProps = {
  title: string;
  text?: string;
  /** glifo o emoji decorativo sobre el título */
  glyph?: string;
  /** botón o enlace de la acción principal */
  children?: ReactNode;
  variant?: Variant;
  className?: string;
};

/** Estado vacío (sin datos, sin resultados, error): qué pasa y qué puedes hacer. Una sola acción principal. */
export default function EmptyState({ title, text = "", glyph = "∅", children, variant = "editorial", className = "" }: EmptyStateProps) {
  return (
    <div className={`ui-empty ui-surface ${vcls(variant)} ${className}`.trim()}>
      <span className="ui-empty__g" aria-hidden>{glyph}</span>
      <h3 className="ui-empty__t">{title}</h3>
      {text && <p className="ui-empty__p">{text}</p>}
      {children && <div className="ui-empty__a">{children}</div>}
    </div>
  );
}
