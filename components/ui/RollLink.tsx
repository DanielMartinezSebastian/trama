"use client";

import type { MouseEventHandler } from "react";

export type RollLinkProps = {
  label: string;
  /** con `href` se pinta como enlace; sin él, como botón */
  href?: string;
  /** hacia dónde sale el texto al pasar el puntero */
  direction?: "up" | "down";
  external?: boolean;
  onClick?: MouseEventHandler<HTMLElement>;
  className?: string;
};

/**
 * Enlace o botón cuyo texto «rueda»: al pasar el puntero (o enfocar) sube la palabra y entra una copia igual por debajo.
 * Solo CSS. El lector de pantalla lee el texto una vez (la copia visual va `aria-hidden`).
 */
export default function RollLink({ label, href, direction = "up", external = false, onClick, className = "" }: RollLinkProps) {
  const inner = (
    <>
      <span className="ui-roll__t" aria-hidden>
        <span className="ui-roll__in">
          <span>{label}</span>
          <span>{label}</span>
        </span>
      </span>
      <span className="ui-sr">{label}</span>
    </>
  );
  const cls = `ui-roll ui-roll--${direction} ${className}`.trim();
  return href ? (
    <a className={cls} href={href} onClick={onClick} {...(external ? { target: "_blank", rel: "noreferrer noopener" } : null)}>
      {inner}
    </a>
  ) : (
    <button type="button" className={cls} onClick={onClick}>
      {inner}
    </button>
  );
}
