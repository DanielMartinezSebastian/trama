"use client";

import { useId, useMemo, useState } from "react";
import { splitEscaped } from "@/lib/ui/list";
import { resolveImage } from "@/lib/ui/placeholder";
import { vcls, type Variant } from "./variants";

export type FeatureExplorerProps = {
  /** una ventaja por línea: «Título|Texto|imagen|texto alternativo» (imagen: URL, ruta o `gen:N`) */
  items?: string;
  defaultIndex?: number;
  /** lado de la imagen en escritorio */
  mediaSide?: "right" | "left";
  /** proporción de la imagen (CSS `aspect-ratio`) */
  ratio?: string;
  variant?: Variant;
  className?: string;
};

/**
 * Explorador de ventajas (Apple, páginas de producto): una lista de píldoras con «+»; la elegida se abre en una tarjeta con su
 * texto y cambia la imagen de al lado con un fundido. Una abierta cada vez. Cada píldora es un `<button>` con `aria-expanded`
 * que controla su texto; la imagen es la de la ventaja abierta, con su `alt`. En móvil, la imagen va encima de la lista.
 * Todas las imágenes están en el HTML (apiladas), así el cambio no espera a la red.
 */
export default function FeatureExplorer({
  items = "Tabla blanda|Espuma de 8 pies para las primeras olas: flota de sobra y no hace daño si te cae encima.|gen:1|Tabla de espuma sobre la arena\nNeopreno a medida|Tallas de la XS a la XXL, de 4/3 mm en invierno y 3/2 en verano.|gen:2|Neoprenos colgados en la escuela\nMonitores titulados|Un monitor por cada seis alumnos, siempre en el agua contigo.|gen:3|Monitor explicando en la orilla",
  defaultIndex = 0,
  mediaSide = "right",
  ratio = "4 / 3",
  variant = "glass",
  className = "",
}: FeatureExplorerProps) {
  const rows = useMemo(() => items.split("\n").map((l) => splitEscaped(l, "|")).filter((p) => p[0]?.trim()), [items]);
  const [on, setOn] = useState(Math.min(defaultIndex, Math.max(0, rows.length - 1)));
  const id = useId();
  return (
    <div className={`ui-fexp ui-fexp--${mediaSide} ${vcls(variant)} ${className}`.trim()}>
      <ul className="ui-fexp__list">
        {rows.map(([title, text], i) => (
          <li key={title + i} className="ui-fexp__item" data-on={i === on ? "" : undefined}>
            <button type="button" className="ui-fexp__pill" aria-expanded={i === on} aria-controls={`${id}-t${i}`} onClick={() => setOn(i)}>
              <span className="ui-fexp__plus" aria-hidden />
              <span>{title}</span>
            </button>
            {/* abierto con grid-template-rows (sin medir alturas); cerrado, visibility: hidden lo saca también del lector */}
            <div className="ui-fexp__body" id={`${id}-t${i}`}>
              <div>
                <p>{text}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="ui-fexp__media" style={{ aspectRatio: ratio }}>
        {rows.map(([title, , img, alt], i) =>
          img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={title + i} src={resolveImage(img)} alt={i === on ? (alt ?? "") : ""} aria-hidden={i !== on} data-on={i === on ? "" : undefined} loading={i === on ? "eager" : "lazy"} />
          ) : null,
        )}
      </div>
    </div>
  );
}
