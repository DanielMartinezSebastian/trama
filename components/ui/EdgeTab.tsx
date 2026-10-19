import type { CSSProperties, MouseEventHandler } from "react";

export type EdgeTabProps = {
  label: string;
  /** con `href` es un enlace; sin él, un botón */
  href?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  side?: "left" | "right";
  /** posición vertical (CSS), por defecto el centro */
  top?: string;
  /** glifo o pieza corta sobre el texto vertical («W.», «★») */
  mark?: string;
  className?: string;
};

/**
 * Pestaña fija pegada al borde de la ventana con el texto en vertical («Reservar», «Site of the Day»): una llamada a la acción
 * siempre a mano que no ocupa la cabecera. Es un enlace o botón real con foco visible. El texto vertical se lee de abajo arriba.
 */
export default function EdgeTab({ label, href, onClick, side = "right", top = "50%", mark = "", className = "" }: EdgeTabProps) {
  const inner = (
    <>
      {mark && <span className="ui-edge__mark" aria-hidden>{mark}</span>}
      <span className="ui-edge__txt">{label}</span>
    </>
  );
  // la pestaña va dentro de un <nav> con nombre: así no queda contenido «suelto» fuera de un landmark (axe: region)
  return (
    <nav className={`ui-edge ui-edge--${side} ${className}`.trim()} style={{ top } as CSSProperties} aria-label={`Acceso rápido: ${label}`}>
      {href ? (
        <a className="ui-edge__a" href={href} onClick={onClick}>{inner}</a>
      ) : (
        <button type="button" className="ui-edge__a" onClick={onClick}>{inner}</button>
      )}
    </nav>
  );
}
