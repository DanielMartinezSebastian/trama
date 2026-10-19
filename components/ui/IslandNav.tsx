"use client";

import type { ReactNode } from "react";
import HideOnScroll from "./HideOnScroll";

export type IslandNavProps = {
  /** a la izquierda de la píldora: normalmente un `FullscreenMenu` o un botón «Menú» */
  leading?: ReactNode;
  /** el centro: logotipo o marca */
  brand: ReactNode;
  /** a la derecha: acción principal («Consultar →») */
  trailing?: ReactNode;
  /** se esconde al bajar y reaparece al subir */
  hideOnScroll?: boolean;
  /** distancia al borde superior (px) */
  offset?: number;
  className?: string;
};

/**
 * Navegación «isla»: una píldora flotante, centrada arriba, con vidrio esmerilado, que agrupa menú, marca y acción en una sola
 * forma compacta (en lugar de una barra a todo el ancho). Deja pasar los clics fuera de la píldora. Con `leading` = `FullscreenMenu`,
 * el menú se abre debajo de la isla. La píldora es una `<header>`, así que cuenta como la cabecera de la página.
 */
export default function IslandNav({ leading, brand, trailing, hideOnScroll = true, offset = 14, className = "" }: IslandNavProps) {
  const pill = (
    <div className="ui-island__pill">
      <div className="ui-island__l">{leading}</div>
      <div className="ui-island__c">{brand}</div>
      <div className="ui-island__r">{trailing}</div>
    </div>
  );
  return hideOnScroll ? (
    <HideOnScroll className={`ui-island ${className}`.trim()}>
      <span style={{ display: "contents", ["--island-top" as string]: `${offset}px` }}>{pill}</span>
    </HideOnScroll>
  ) : (
    <header className={`ui-island ${className}`.trim()} style={{ ["--island-top" as string]: `${offset}px` }}>
      {pill}
    </header>
  );
}
