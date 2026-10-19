"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { lockScroll } from "@/lib/motion/lenis";
import { themeSnapshot } from "@/lib/ui/themeSnapshot";
import Kbd from "./Kbd";

export type CommandItem = {
  id: string;
  label: string;
  /** texto pequeño a la derecha o bajo la etiqueta */
  hint?: string;
  /** encabezado del grupo en el que aparece */
  group?: string;
  /** palabras extra por las que se encuentra */
  keywords?: string;
  href?: string;
};

export type CommandPaletteProps = {
  items: CommandItem[];
  /** se llama al elegir un elemento. Sin ella (y con `href`), se navega al enlace */
  onSelect?: (item: CommandItem) => void;
  /** abre con Ctrl/⌘ + K (y cierra con Esc) */
  hotkey?: boolean;
  /** pinta el botón «Buscar  ⌘K» que la abre; si lo pones a false, ábrela con `open` o con el atajo */
  trigger?: boolean;
  triggerLabel?: string;
  placeholder?: string;
  emptyText?: string;
  /** controlado desde fuera (opcional) */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
};

const norm = (s: string) => s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

/** Todos los términos deben aparecer; puntúa más lo que empieza por el término y lo que está en la etiqueta. */
function score(item: CommandItem, terms: string[]) {
  const label = norm(item.label);
  const rest = norm(`${item.hint ?? ""} ${item.keywords ?? ""} ${item.group ?? ""}`);
  let s = 0;
  for (const t of terms) {
    const i = label.indexOf(t);
    if (i >= 0) s += i === 0 ? 3 : label.split(/\s+/).some((w) => w.startsWith(t)) ? 2 : 1;
    else if (rest.includes(t)) s += 0.5;
    else return -1;
  }
  return s;
}

const FOCUSABLE = 'input, button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';
const isMac = () => typeof navigator !== "undefined" && /mac|iphone|ipad/i.test(navigator.platform || navigator.userAgent);

/**
 * Paleta de comandos (⌘K / Ctrl+K): una caja de búsqueda sobre la página con una lista filtrada por varias palabras (sin
 * acentos ni mayúsculas), agrupada y navegable con flechas, Intro y Esc. Patrón ARIA «combobox + listbox»: el foco se queda
 * en el campo y `aria-activedescendant` indica la opción activa. Atrapa el foco, pausa el scroll y lo devuelve al cerrar.
 * Se pinta en un portal con los tokens de tu tema.
 */
export default function CommandPalette({ items, onSelect, hotkey = true, trigger = true, triggerLabel = "Buscar", placeholder = "Escribe un comando o busca…", emptyText = "Sin resultados", open: controlled, onOpenChange, className = "" }: CommandPaletteProps) {
  const uid = useId();
  const [inner, setInner] = useState(false);
  const open = controlled ?? inner;
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<CSSProperties>();
  const [mac, setMac] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const set = useCallback((v: boolean) => { setInner(v); onOpenChange?.(v); }, [onOpenChange]);

  useEffect(() => { setMounted(true); setMac(isMac()); }, []);

  useEffect(() => {
    if (!hotkey) return;
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        set(!open);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [hotkey, open, set]);

  const results = useMemo(() => {
    const terms = norm(q).split(/\s+/).filter(Boolean);
    if (terms.length === 0) return items.slice(0, 50);
    return items
      .map((it) => ({ it, s: score(it, terms) }))
      .filter((x) => x.s >= 0)
      .sort((a, b) => b.s - a.s)
      .map((x) => x.it)
      .slice(0, 50);
  }, [items, q]);

  useEffect(() => setActive(0), [q, open]);

  useEffect(() => {
    if (!open) return;
    setQ("");
    if (btn.current) setTheme(themeSnapshot(btn.current));
    const unlock = lockScroll();
    const opener = btn.current ?? (document.activeElement as HTMLElement | null);
    const t = window.setTimeout(() => panel.current?.querySelector<HTMLElement>("input")?.focus(), 30);
    return () => {
      clearTimeout(t);
      unlock();
      opener?.focus?.({ preventScroll: true });
    };
  }, [open]);

  useEffect(() => {
    list.current?.querySelector<HTMLElement>(`[data-i="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const choose = (it: CommandItem) => {
    set(false);
    if (onSelect) onSelect(it);
    else if (it.href) window.location.assign(it.href);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { e.preventDefault(); set(false); }
    else if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(results.length - 1, a + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
    else if (e.key === "Home") { e.preventDefault(); setActive(0); }
    else if (e.key === "End") { e.preventDefault(); setActive(results.length - 1); }
    else if (e.key === "Enter") { const it = results[active]; if (it) { e.preventDefault(); choose(it); } }
    else if (e.key === "Tab") {
      const f = Array.from(panel.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
      if (f.length) { e.preventDefault(); f[0].focus(); }
    }
  };

  let lastGroup: string | undefined;
  const overlay = (
    <div className={`ui-cmdk ${className}`.trim()} data-open={open ? "" : undefined} style={theme} aria-hidden={!open} inert={!open}>
      <div className="ui-cmdk__scrim" onClick={() => set(false)} />
      <div ref={panel} className="ui-cmdk__panel" role="dialog" aria-modal="true" aria-label="Paleta de comandos" onKeyDown={onKey}>
        <input
          className="ui-cmdk__input"
          role="combobox"
          aria-expanded="true"
          aria-controls={`${uid}-list`}
          aria-activedescendant={results[active] ? `${uid}-o${active}` : undefined}
          aria-autocomplete="list"
          autoComplete="off"
          spellCheck={false}
          placeholder={placeholder}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <ul ref={list} id={`${uid}-list`} className="ui-cmdk__list" role="listbox" aria-label="Resultados">
          {results.length === 0 && <li className="ui-cmdk__empty" role="presentation">{emptyText}</li>}
          {results.map((it, i) => {
            const head = it.group && it.group !== lastGroup ? it.group : null;
            lastGroup = it.group;
            return (
              <li key={it.id} role="presentation">
                {head && <div className="ui-cmdk__group" role="presentation">{head}</div>}
                <div id={`${uid}-o${i}`} data-i={i} role="option" aria-selected={i === active} className="ui-cmdk__opt" onPointerMove={() => setActive(i)} onClick={() => choose(it)}>
                  <span>{it.label}</span>
                  {it.hint && <span className="ui-cmdk__hint">{it.hint}</span>}
                </div>
              </li>
            );
          })}
        </ul>
        <div className="ui-cmdk__foot" aria-hidden>
          <span><Kbd>↑</Kbd> <Kbd>↓</Kbd> navegar</span>
          <span><Kbd>↵</Kbd> elegir</span>
          <span><Kbd>Esc</Kbd> cerrar</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {trigger && (
        <button ref={btn} type="button" className="ui-cmdk__btn" aria-haspopup="dialog" aria-expanded={open} onClick={() => set(true)}>
          <span>{triggerLabel}</span>
          {hotkey && <Kbd>{mac ? "⌘K" : "Ctrl K"}</Kbd>}
        </button>
      )}
      {mounted ? createPortal(overlay, document.body) : null}
    </>
  );
}
