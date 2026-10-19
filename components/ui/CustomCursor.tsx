"use client";

import { useEffect, useRef } from "react";

export type CustomCursorProps = {
  /** diámetro del punto en reposo (px) */
  cursorSize?: number;
  /** suavizado del seguimiento: 1 = pegado al puntero · 0,1 = muy flotante */
  follow?: number;
  /** `none` (por defecto): el cursor cambia de color según el fondo que tiene debajo. `difference`: invierte lo que hay debajo (falla sobre tonos medios y sobre negro) */
  blend?: "none" | "difference";
  /** oculta el cursor del sistema en toda la página (menos en campos de texto) */
  hideNative?: boolean;
  /** texto de `data-cursor` que se trata como etiqueta; el resto de valores son modos (`link`, `hide`, `text`) */
  className?: string;
};

/** Canales 0–1 de un color computado (`rgb()`, `rgba()` o `color(srgb …)`, que es lo que devuelve `color-mix`). */
function channels(css: string): [number, number, number, number] | null {
  const rgb = css.match(/^rgba?\(([^)]+)\)/);
  if (rgb) {
    const p = rgb[1].split(/[\s,/]+/).filter(Boolean).map(Number);
    return [p[0] / 255, p[1] / 255, p[2] / 255, p[3] ?? 1];
  }
  const c = css.match(/^color\(srgb\s+([-\d.e]+)\s+([-\d.e]+)\s+([-\d.e]+)(?:\s*\/\s*([-\d.e%]+))?\)/);
  if (c) return [Number(c[1]), Number(c[2]), Number(c[3]), c[4] ? (c[4].endsWith("%") ? parseFloat(c[4]) / 100 : Number(c[4])) : 1];
  return null;
}

const lin = (v: number) => (v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));

/**
 * ¿Qué hay debajo del puntero? `light` / `dark` según el primer ancestro con fondo (casi) opaco, o `mixed` si antes aparece una
 * imagen, un degradado o un vídeo (no se puede saber, así que el cursor lleva siempre un contorno que se ve sobre cualquier cosa).
 */
function backdropTone(start: Element | null): "light" | "dark" | "mixed" {
  let el: Element | null = start;
  for (let i = 0; el && i < 24; i++, el = el.parentElement) {
    if (/^(IMG|VIDEO|CANVAS|PICTURE)$/.test(el.tagName)) return "mixed";
    const cs = getComputedStyle(el);
    if (cs.backgroundImage !== "none") return "mixed";
    const c = channels(cs.backgroundColor);
    if (c && c[3] >= 0.6) return 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]) > 0.18 ? "light" : "dark";
  }
  return "dark";
}

const LINKS = 'a[href], button, [role="button"], summary, label[for]';

/**
 * Cursor propio para toda la página. Reacciona a lo que hay debajo sin que los elementos importen el componente:
 * - `data-cursor="Ver"` en cualquier elemento: el punto crece y muestra esa etiqueta («Ver», «Arrastra»…);
 * - `data-cursor="hide"`: se oculta (útil sobre vídeos o mapas);
 * - enlaces y botones: el punto se convierte en un aro que deja ver el texto; campos de texto: una barra fina.
 * - **se ve sobre cualquier fondo**: lee el fondo que hay debajo (claro, oscuro o imagen) y cambia de color; además lleva siempre un contorno de contraste.
 * No existe en táctil ni con `prefers-reduced-motion`, y no sustituye al cursor del sistema salvo con `hideNative`.
 * Solo se monta si el equipo tiene puntero fino y hover.
 */
export default function CustomCursor({ cursorSize = 14, follow = 0.18, blend = "none", hideNative = false, className = "" }: CustomCursorProps) {
  const root = useRef<HTMLDivElement>(null);
  const txt = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const html = document.documentElement;
    if (hideNative) html.classList.add("ui-ccur-native");
    let x = -100, y = -100, tx = -100, ty = -100, raf = 0, seen = false;
    const loop = () => {
      x += (tx - x) * follow;
      y += (ty - y) * follow;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    let lastEl: Element | null = null;
    const setMode = (target: EventTarget | null) => {
      const t = target instanceof Element ? target : null;
      // el color de fondo solo se vuelve a leer cuando el puntero cambia de elemento
      if (t !== lastEl) {
        lastEl = t;
        el.dataset.bg = backdropTone(t);
      }
      const tagged = t?.closest<HTMLElement>("[data-cursor]");
      const data = tagged?.dataset.cursor;
      let mode = "idle";
      let label = "";
      if (data === "hide") mode = "hide";
      else if (data && data !== "link") { mode = "label"; label = data; }
      else if (data === "link" || t?.closest(LINKS)) mode = "link";
      else if (t?.closest('input:not([type="checkbox"]):not([type="radio"]):not([type="range"]), textarea, [contenteditable="true"]')) mode = "text";
      el.dataset.mode = mode;
      if (txt.current && txt.current.textContent !== label) txt.current.textContent = label;
    };
    const move = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!seen) {
        seen = true;
        x = tx;
        y = ty;
        el.setAttribute("data-on", "");
        raf = requestAnimationFrame(loop);
      }
      setMode(e.target);
    };
    const leave = () => { el.removeAttribute("data-on"); seen = false; cancelAnimationFrame(raf); };
    const down = () => el.setAttribute("data-down", "");
    const up = () => el.removeAttribute("data-down");
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(raf);
      html.classList.remove("ui-ccur-native");
    };
  }, [follow, hideNative]);

  return (
    <div ref={root} className={`ui-ccur ${blend === "difference" ? "ui-ccur--diff" : ""} ${className}`.trim()} data-mode="idle" aria-hidden style={{ "--cc-size": `${cursorSize}px` } as React.CSSProperties}>
      <span className="ui-ccur__dot">
        <span ref={txt} className="ui-ccur__txt" />
      </span>
    </div>
  );
}
