import type { CSSProperties } from "react";
import { vcls, type Variant } from "./variants";

export type BentoCell = {
  title: string;
  text?: string;
  /** cifra o dato grande de la celda */
  stat?: string;
  /** imagen de fondo (URL o data URI) */
  image?: string;
  /** tamaño en la rejilla: columnas × filas */
  span?: "1x1" | "2x1" | "1x2" | "2x2";
  href?: string;
};

export type BentoGridProps = {
  cells: BentoCell[];
  /** columnas en pantallas anchas (en móvil siempre 1–2) */
  columns?: 2 | 3 | 4;
  variant?: Variant;
  className?: string;
};

/**
 * Rejilla «bento»: celdas de distinto tamaño (1×1, 2×1, 1×2, 2×2) que encajan sin huecos (`grid-auto-flow: dense`).
 * CSS puro, sin JS. Cada celda admite título, texto, una cifra grande o una imagen de fondo; con `href` es un enlace.
 * En móvil colapsa a una o dos columnas conservando el orden.
 */
export default function BentoGrid({ cells, columns = 4, variant = "editorial", className = "" }: BentoGridProps) {
  return (
    <div className={`ui-bento ${className}`.trim()} style={{ "--bento-cols": columns } as CSSProperties}>
      {cells.map((c, i) => {
        const span = c.span ?? "1x1";
        const body = (
          <>
            {c.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="ui-bento__img" src={c.image} alt="" loading="lazy" />
            )}
            <div className="ui-bento__body">
              {c.stat && <b className="ui-bento__stat">{c.stat}</b>}
              <h3 className="ui-bento__t">{c.title}</h3>
              {c.text && <p className="ui-bento__p">{c.text}</p>}
            </div>
          </>
        );
        const cls = `ui-bento__cell ui-surface ${vcls(variant)} ui-bento__cell--${span} ${c.image ? "ui-bento__cell--img" : ""}`;
        return c.href ? (
          <a key={i} className={cls} href={c.href}>{body}</a>
        ) : (
          <div key={i} className={cls}>{body}</div>
        );
      })}
    </div>
  );
}
