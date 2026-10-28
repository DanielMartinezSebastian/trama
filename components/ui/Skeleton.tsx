import { cloneElement, Fragment, isValidElement, type CSSProperties, type HTMLAttributes, type ReactElement, type ReactNode } from "react";
import { tcls, type Tone } from "./variants";

export type SkeletonProps = {
  /** Sin children: formas de tamaño explícito o plantillas aproximadas de texto, tarjeta y tabla. */
  kind?: "text" | "block" | "card" | "avatar" | "table";
  lines?: number;
  tone?: Tone;
  /** false muestra los hijos originales; sin hijos, no muestra nada. */
  loading?: boolean;
  /** Texto o un elemento real cuya geometría se conserva durante la carga. */
  children?: ReactNode;
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  borderRadius?: CSSProperties["borderRadius"];
  animation?: "shimmer" | "pulse" | "none";
  className?: string;
  style?: CSSProperties;
};

/**
 * Sustituye cada pieza del contenido conservando su geometría, sin efectos ni mediciones de JavaScript.
 * Con un elemento hijo, reutiliza su nodo y mantiene clases, estilos, tipografía y dimensiones.
 * Los controles quedan fuera del foco y del árbol accesible mientras cargan. Los componentes propios
 * usados como hijos deben propagar className, style, aria-hidden, inert y tabIndex a su raíz HTML.
 * Sin children ofrece las plantillas anteriores; no deducen la estructura del contenido futuro.
 */
export default function Skeleton({ kind = "text", lines = 3, tone = "mut", loading = true, children, width, height, borderRadius, animation = "shimmer", className = "", style }: SkeletonProps) {
  if (!loading) return children ?? null;
  const dimensions: CSSProperties = { ...style, ...(width !== undefined ? { width } : {}), ...(height !== undefined ? { height } : {}), ...(borderRadius !== undefined ? { borderRadius } : {}) };
  const cls = `ui-skel ui-skel--${animation} ${tcls(tone)}`;
  const count = Number.isFinite(lines) ? Math.max(1, Math.floor(lines)) : 3;

  if (children !== undefined && children !== null && typeof children !== "boolean") {
    const attributes: HTMLAttributes<HTMLElement> = { className: `${cls} ui-skel--content ${className}`, style: dimensions, "aria-hidden": true, inert: true, tabIndex: -1 };
    if (isValidElement(children) && children.type !== Fragment) {
      const child = children as ReactElement<HTMLAttributes<HTMLElement>>;
      return cloneElement(child, { ...attributes, className: `${child.props.className ?? ""} ${attributes.className}`, style: { ...child.props.style, ...dimensions } });
    }
    return <span {...attributes}>{children}</span>;
  }

  if (kind === "avatar") {
    return <div className={`${cls} ui-skel--avatar ${className}`} style={dimensions} aria-hidden />;
  }
  if (kind === "block") {
    return <div className={`${cls} ui-skel--block ui-skel--standalone ${className}`} style={dimensions} aria-hidden />;
  }
  if (kind === "card") {
    return (
      <div className={`ui-skel-card ${className}`} style={dimensions} aria-hidden>
        <div className={`${cls} ui-skel--block`} />
        <div className={`${cls} ui-skel--line`} style={{ width: "70%" }} />
        <div className={`${cls} ui-skel--line`} style={{ width: "45%" }} />
      </div>
    );
  }
  if (kind === "table") {
    return (
      <div className={`ui-skel-table ${className}`} style={dimensions} aria-hidden>
        {Array.from({ length: Math.max(2, count) }, (_, i) => (
          <div key={i} className={`${cls} ui-skel--row`} />
        ))}
      </div>
    );
  }
  return (
    <span className={`ui-skel-lines ${className}`} style={dimensions} aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className={`${cls} ui-skel--line`} style={{ width: i === count - 1 ? "60%" : "100%" }} />
      ))}
    </span>
  );
}
