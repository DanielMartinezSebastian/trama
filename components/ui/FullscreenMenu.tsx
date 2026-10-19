"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { lockScroll } from "@/lib/motion/lenis";
import { themeSnapshot } from "@/lib/ui/themeSnapshot";

export type FullscreenMenuLink = { label: string; href: string; /** texto pequeño a un lado (p. ej. «12 proyectos») */ meta?: string };

export type FullscreenMenuProps = {
  links: FullscreenMenuLink[];
  /** marca que se repite arriba del menú abierto */
  brand?: string;
  /** texto del botón cerrado / abierto; los corchetes son parte del estilo editorial */
  openLabel?: string;
  closeLabel?: string;
  /** enlaces secundarios del pie del menú (redes, correo) */
  footer?: { label: string; href: string }[];
  /** texto libre a la izquierda del pie (ciudad, hora…) */
  note?: string;
  /** controlado desde fuera (opcional) */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
};

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Botón `[menu]` que abre un menú a pantalla completa: la cortina baja, los enlaces suben uno a uno. Atrapa el foco,
 * cierra con `Esc` y al elegir un enlace, pausa el scroll de la página (también el de Lenis) y devuelve el foco al botón.
 * El menú se pinta en un portal para que ningún ancestro con `transform` lo recorte.
 */
export default function FullscreenMenu({ links, brand = "", openLabel = "menu", closeLabel = "close", footer = [], note = "", open: controlled, onOpenChange, className = "" }: FullscreenMenuProps) {
  const [inner, setInner] = useState(false);
  const open = controlled ?? inner;
  const [mounted, setMounted] = useState(false);
  // el portal sale de la web: lleva sus tokens y su tipografía
  const [theme, setTheme] = useState<React.CSSProperties>();
  const btn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const set = useCallback((v: boolean) => { setInner(v); onOpenChange?.(v); }, [onOpenChange]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    if (btn.current) setTheme(themeSnapshot(btn.current));
    const unlock = lockScroll();
    const p = panel.current;
    const opener = btn.current;
    const t = window.setTimeout(() => p?.querySelector<HTMLElement>(".ui-fsm__close")?.focus(), 50);
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") return set(false);
      if (e.key !== "Tab" || !p) return;
      const f = Array.from(p.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("keydown", key);
      clearTimeout(t);
      unlock();
      opener?.focus({ preventScroll: true });
    };
  }, [open, set]);

  const overlay = (
    <div ref={panel} className={`ui-fsm ${className}`.trim()} data-open={open ? "" : undefined} role="dialog" aria-modal="true" aria-label={brand ? `Menú de ${brand}` : "Menú"} aria-hidden={!open} inert={!open} style={theme}>
      <div className="ui-fsm__top">
        <span>{brand}</span>
        <button type="button" className="ui-fsm__btn ui-fsm__close" onClick={() => set(false)}>[{closeLabel}]</button>
      </div>
      <nav className="ui-fsm__nav" aria-label="Principal">
        {links.map((l, i) => (
          <div key={l.href + i} className="ui-fsm__item">
            <a className="ui-fsm__link" href={l.href} style={{ "--i": i } as React.CSSProperties} onClick={() => set(false)}>
              <span>{l.label}</span>
              {l.meta && <small>{l.meta}</small>}
            </a>
          </div>
        ))}
      </nav>
      <div className="ui-fsm__foot">
        <span>{note}</span>
        <span style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {footer.map((f, i) => (
            <a key={`${f.href}-${i}`} href={f.href}>{f.label}</a>
          ))}
        </span>
      </div>
    </div>
  );

  return (
    <>
      <button ref={btn} type="button" className="ui-fsm__btn" aria-expanded={open} aria-haspopup="dialog" onClick={() => set(true)}>
        [{openLabel}]
      </button>
      {mounted ? createPortal(overlay, document.body) : null}
    </>
  );
}
