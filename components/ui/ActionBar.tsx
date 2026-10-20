"use client";

import type { MouseEvent } from "react";
import { splitList } from "@/lib/ui/list";
import type { IconName } from "@/lib/ui/icons";
import Icon from "./Icon";
import { vcls, type Variant } from "./variants";

export type ActionItem = {
  label: string;
  /** `tel:+34…`, `https://wa.me/34…`, una ruta o un ancla */
  href?: string;
  onClick?: (e: MouseEvent) => void;
  icon?: IconName;
  /** la acción principal (una sola): ocupa más y lleva el color de acento */
  primary?: boolean;
  /** contador sobre el icono (artículos en la bolsa) */
  badge?: number;
};

export type ActionBarProps = {
  /** una acción por línea o separadas por `;`: `Etiqueta|enlace|icono|primary` (p. ej. `Llamar|tel:+34976000000|phone`) */
  actions?: string | ActionItem[];
  /** mobile = solo en ventanas de hasta 760 px (en la zona del pulgar) · always = también en escritorio */
  show?: "mobile" | "always";
  /** fixed = pegada abajo con su hueco en la página · static = en el flujo (vista previa, maquetas) */
  position?: "fixed" | "static";
  /** nombre accesible de la barra */
  label?: string;
  /** al pulsar un enlace interno (empieza por `/`): navegación sin recarga del framework */
  onNavigate?: (href: string) => void;
  variant?: Variant;
  className?: string;
};

function parse(actions: string): ActionItem[] {
  return splitList(actions.replace(/;/g, "\n"), "\n").map((l) => {
    const [label, href = "", icon = "", flag = ""] = l.split("|").map((x) => x.trim());
    return { label, href: href || undefined, icon: (icon || undefined) as IconName | undefined, primary: flag === "primary" };
  });
}

/**
 * Barra de acciones fija abajo en móvil: llamar, WhatsApp, cómo llegar y la acción principal del negocio (reservar,
 * pedir, pedir cita). Responde a B1 y B2 de docs/11: la acción no obliga a abrir el menú y queda en la zona del pulgar
 * (objetivos de 56 px, `safe-area-inset-bottom`). Deja un hueco de su altura al final de la página para no tapar el pie.
 */
export default function ActionBar({
  actions = "Llamar|tel:+34976000000|phone\nWhatsApp|https://wa.me/34600000000|message\nCómo llegar|https://maps.google.com/?q=Zaragoza|map-pin\nReservar|#reservar|calendar|primary",
  show = "mobile",
  position = "fixed",
  label = "Acciones rápidas",
  onNavigate,
  variant = "solid",
  className = "",
}: ActionBarProps) {
  const items = typeof actions === "string" ? parse(actions) : actions;
  const cls = `ui-actionbar ui-actionbar--${position} ui-actionbar--${show} ${vcls(variant)} ${className}`.trim();
  return (
    <>
      {position === "fixed" && <div className={`ui-actionbar-spacer ui-actionbar-spacer--${show}`} aria-hidden />}
      <nav className={cls} aria-label={label}>
        {items.map((a, i) => {
          const body = (
            <>
              {a.icon && (
                <span className="ui-actionbar__ic">
                  <Icon name={a.icon} iconSize={22} />
                  {!!a.badge && <b className="ui-actionbar__badge" aria-hidden>{a.badge}</b>}
                </span>
              )}
              <span className="ui-actionbar__l">{a.label}</span>
              {!!a.badge && !a.label.includes(String(a.badge)) && <span className="ui-sr"> ({a.badge})</span>}
            </>
          );
          const cn = `ui-actionbar__a ${a.primary ? "ui-actionbar__a--primary" : ""}`.trim();
          return a.href ? (
            <a
              key={i}
              className={cn}
              href={a.href}
              {...(/^https?:/.test(a.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              onClick={(e) => {
                a.onClick?.(e);
                if (!e.defaultPrevented && onNavigate && a.href!.startsWith("/")) {
                  e.preventDefault();
                  onNavigate(a.href!);
                }
              }}
            >
              {body}
            </a>
          ) : (
            <button key={i} type="button" className={cn} onClick={a.onClick}>
              {body}
            </button>
          );
        })}
      </nav>
    </>
  );
}
