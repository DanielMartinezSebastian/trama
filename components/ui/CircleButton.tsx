import type { MouseEventHandler, ReactNode } from "react";

export type CircleButtonProps = {
  /** nombre accesible (obligatorio: el botón solo lleva un icono) */
  label: string;
  /** el icono o glifo: «→», «↓», un SVG */
  children?: ReactNode;
  href?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  /** tamaño fijo */
  size?: "sm" | "md" | "lg";
  /** se ajusta al texto que lo rodea (0,62 em) para ir *dentro* de un titular; ignora `size` */
  inline?: boolean;
  /** outline = aro · solid = relleno */
  look?: "outline" | "solid";
  className?: string;
};

/**
 * Botón circular de icono. Con `inline` mide lo mismo que la letra y se coloca dentro de un titular («…interior design
 * studio ⊙»), un recurso habitual de las webs de estudio. Enlace o botón real, con foco visible y nombre accesible.
 */
export default function CircleButton({ label, children = "→", href, onClick, size = "md", inline = false, look = "outline", className = "" }: CircleButtonProps) {
  const cls = `ui-circ ui-circ--${inline ? "inline" : size} ui-circ--${look} ${className}`.trim();
  const inner = <span aria-hidden>{children}</span>;
  return href ? (
    <a className={cls} href={href} onClick={onClick} aria-label={label}>{inner}</a>
  ) : (
    <button type="button" className={cls} onClick={onClick} aria-label={label}>{inner}</button>
  );
}
