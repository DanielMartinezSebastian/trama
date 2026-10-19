"use client";

import { useCallback, useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { lockScroll } from "@/lib/motion/lenis";
import { themeSnapshot } from "@/lib/ui/themeSnapshot";

export type FullscreenMenuLink = { label: string; href: string; /** texto pequeño a un lado (p. ej. «12 proyectos») */ meta?: string };

export type FullscreenMenuProps = {
  links: FullscreenMenuLink[];
  /** nombre de la marca, solo para el texto accesible del menú (y para la fila superior propia si no hay cabecera) */
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

/** Marca como `inert` todo lo que rodea a `keep` (hermanos de él y de sus ancestros), salvo el portal. Devuelve cómo deshacerlo. */
function inertAround(keep: Element, portal: Element | null) {
  const changed: Array<[Element, boolean]> = [];
  for (let node: Element | null = keep; node && node !== document.body; node = node.parentElement) {
    for (const sib of Array.from(node.parentElement?.children ?? [])) {
      if (sib === node || sib === portal || sib.contains(portal) || sib.tagName === "SCRIPT" || sib.tagName === "STYLE") continue;
      changed.push([sib, (sib as HTMLElement).inert]);
      (sib as HTMLElement).inert = true;
    }
  }
  return () => changed.forEach(([el, was]) => ((el as HTMLElement).inert = was));
}

/**
 * Botón `[menu]` que abre un menú a pantalla completa: la cortina baja y los enlaces suben uno a uno.
 *
 * **La cabecera no se mueve.** Si el botón está dentro de un `<header>` (o `role="banner"`), el menú se abre *debajo* de él:
 * la marca, la hora y el propio botón —que pasa de `[menu]` a `[close]` en el mismo sitio— siguen exactamente donde
 * estaban, y siguen siendo clicables. Así el usuario no ve saltar los elementos que ya conocía. Sin cabecera, el menú
 * cubre la ventana y trae su propia fila superior con la marca y `[close]`.
 *
 * Cierra con `Esc` y al elegir un enlace, pausa el scroll (sin que salte la página: ver `lockScroll`) y deja inerte el
 * resto de la página para que el teclado no llegue a lo que queda tapado. Se pinta en un portal con los tokens de tu tema.
 */
export default function FullscreenMenu({ links, brand = "", openLabel = "menu", closeLabel = "close", footer = [], note = "", open: controlled, onOpenChange, className = "" }: FullscreenMenuProps) {
  const uid = useId();
  const [inner, setInner] = useState(false);
  const open = controlled ?? inner;
  const [mounted, setMounted] = useState(false);
  // el portal sale de la web: lleva sus tokens y su tipografía; y, si hay cabecera, empieza justo debajo de ella
  const [theme, setTheme] = useState<CSSProperties>();
  const [top, setTop] = useState<number | null>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const set = useCallback((v: boolean) => { setInner(v); onOpenChange?.(v); }, [onOpenChange]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const trigger = btn.current;
    const p = panel.current;
    if (trigger) setTheme(themeSnapshot(trigger));
    const host = trigger?.closest<HTMLElement>('header, [role="banner"]') ?? null;
    setTop(host ? Math.round(host.getBoundingClientRect().bottom) : null);
    const unlock = lockScroll();

    // con cabecera: sube por encima del menú (que queda debajo) y deja inerte lo demás; sin ella, atrapa el foco en el menú
    const prevZ = host?.style.zIndex ?? "";
    let restoreInert: (() => void) | undefined;
    if (host) {
      host.style.zIndex = "9001";
      restoreInert = inertAround(host, p ?? null);
    }
    const t = host ? 0 : window.setTimeout(() => p?.querySelector<HTMLElement>(".ui-fsm__close")?.focus(), 50);

    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") return set(false);
      if (host || e.key !== "Tab" || !p) return;
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
      restoreInert?.();
      if (host) host.style.zIndex = prevZ;
      unlock();
      trigger?.focus({ preventScroll: true });
    };
  }, [open, set]);

  const hosted = top !== null;
  const overlay = (
    <div
      ref={panel}
      id={`${uid}-menu`}
      className={`ui-fsm ${className}`.trim()}
      data-open={open ? "" : undefined}
      data-host={hosted ? "" : undefined}
      role="dialog"
      aria-modal={hosted ? undefined : true}
      aria-label={brand ? `Menú de ${brand}` : "Menú"}
      aria-hidden={!open}
      inert={!open}
      style={{ ...theme, ...(hosted ? { "--fsm-top": `${top}px` } : null) } as CSSProperties}
    >
      {!hosted && (
        <div className="ui-fsm__top">
          <span>{brand}</span>
          <button type="button" className="ui-fsm__btn ui-fsm__close" onClick={() => set(false)}>[{closeLabel}]</button>
        </div>
      )}
      <nav className="ui-fsm__nav" aria-label="Principal">
        {links.map((l, i) => (
          <div key={l.href + i} className="ui-fsm__item">
            <a className="ui-fsm__link" href={l.href} style={{ "--i": i } as CSSProperties} onClick={() => set(false)}>
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
      <button ref={btn} type="button" className="ui-fsm__btn" aria-expanded={open} aria-controls={`${uid}-menu`} aria-haspopup="dialog" onClick={() => { if (!open) { const h = btn.current?.closest<HTMLElement>('header, [role="banner"]'); setTop(h ? Math.round(h.getBoundingClientRect().bottom) : null); } set(!open); }}>
        {/* el botón es el mismo abierto y cerrado y no cambia de tamaño: los dos textos ocupan la misma celda y solo se ve uno */}
        <span className="ui-fsm__lbl">
          <span style={{ visibility: open ? "hidden" : "visible" }} aria-hidden={open || undefined}>[{openLabel}]</span>
          <span style={{ visibility: open ? "visible" : "hidden" }} aria-hidden={!open || undefined}>[{closeLabel}]</span>
        </span>
      </button>
      {mounted ? createPortal(overlay, document.body) : null}
    </>
  );
}
