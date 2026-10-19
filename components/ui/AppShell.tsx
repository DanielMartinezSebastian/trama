"use client";

import { useEffect, useState, type ReactNode } from "react";
import { vcls, type Variant } from "./variants";

export type AppNavItem = {
  label: string;
  href: string;
  /** icono o glifo corto delante de la etiqueta (decorativo) */
  icon?: ReactNode;
  /** contador o etiqueta a la derecha */
  badge?: string;
  /** página actual (`aria-current="page"`) */
  active?: boolean;
};

export type AppNavGroup = { label?: string; items: AppNavItem[] };

export type AppShellProps = {
  brand?: ReactNode;
  groups: AppNavGroup[];
  /** título de la página, en la barra superior */
  title?: string;
  /** a la derecha de la barra superior: buscador, avatar, acciones */
  actions?: ReactNode;
  /** pie de la barra lateral (usuario, ayuda) */
  footer?: ReactNode;
  /** permite plegar la barra lateral a solo iconos en escritorio */
  collapsible?: boolean;
  /** alto del marco: `100svh` (página entera) o un valor fijo cuando va dentro de otra cosa */
  height?: string;
  variant?: Variant;
  children: ReactNode;
  className?: string;
};

/**
 * Marco de aplicación: barra lateral con grupos de navegación, barra superior y zona de contenido con su propio scroll.
 * En pantallas estrechas la barra lateral pasa a ser un panel que se abre con un botón (cierra con Esc, al elegir un enlace
 * o al pulsar fuera). Los enlaces son `<a href>` reales (con `aria-current`); en una SPA intercepta los clics en tu marco.
 */
export default function AppShell({ brand = "App", groups, title = "", actions, footer, collapsible = true, height = "100svh", variant = "editorial", children, className = "" }: AppShellProps) {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [open]);

  return (
    <div className={`ui-app ${vcls(variant)} ${className}`.trim()} style={{ height }} data-open={open ? "" : undefined} data-collapsed={collapsed ? "" : undefined}>
      <aside className="ui-app__side" aria-label="Barra lateral">
        <div className="ui-app__brand">{brand}</div>
        <nav className="ui-app__nav" aria-label="Principal">
          {groups.map((g, gi) => (
            <div key={gi} className="ui-app__group">
              {g.label && <p className="ui-app__glabel">{g.label}</p>}
              <ul>
                {g.items.map((it) => (
                  <li key={it.href + it.label}>
                    <a href={it.href} className="ui-app__link" aria-current={it.active ? "page" : undefined} title={collapsed ? it.label : undefined} onClick={() => setOpen(false)}>
                      {it.icon && <span className="ui-app__icon" aria-hidden>{it.icon}</span>}
                      <span className="ui-app__txt">{it.label}</span>
                      {it.badge && <span className="ui-app__badge">{it.badge}</span>}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className="ui-app__foot">
          {footer}
          {collapsible && (
            <button type="button" className="ui-app__fold" aria-pressed={collapsed} onClick={() => setCollapsed((c) => !c)}>
              <span aria-hidden>{collapsed ? "»" : "«"}</span>
              <span className="ui-app__txt">{collapsed ? "Expandir" : "Plegar"}</span>
              <span className="ui-sr">{collapsed ? "Expandir barra lateral" : "Plegar barra lateral"}</span>
            </button>
          )}
        </div>
      </aside>
      <div className="ui-app__scrim" onClick={() => setOpen(false)} aria-hidden />
      <div className="ui-app__main">
        <header className="ui-app__top">
          <button type="button" className="ui-app__menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            <span aria-hidden>☰</span>
            <span className="ui-sr">Menú</span>
          </button>
          {title && <h1 className="ui-app__title">{title}</h1>}
          <div className="ui-app__actions">{actions}</div>
        </header>
        <main className="ui-app__content" id="contenido-app">
          {children}
        </main>
      </div>
    </div>
  );
}
