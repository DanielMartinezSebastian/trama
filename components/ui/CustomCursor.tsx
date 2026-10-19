"use client";

import { useEffect, useRef } from "react";

export type CustomCursorProps = {
  /** diámetro del punto en reposo (px) */
  cursorSize?: number;
  /** suavizado del seguimiento: 1 = pegado al puntero · 0,1 = muy flotante */
  follow?: number;
  /** `difference` invierte los colores de lo que hay debajo (sobre fondos mixtos) */
  blend?: "none" | "difference";
  /** oculta el cursor del sistema en toda la página (menos en campos de texto) */
  hideNative?: boolean;
  /** texto de `data-cursor` que se trata como etiqueta; el resto de valores son modos (`link`, `hide`, `text`) */
  className?: string;
};

const LINKS = 'a[href], button, [role="button"], summary, label[for]';

/**
 * Cursor propio para toda la página. Reacciona a lo que hay debajo sin que los elementos importen el componente:
 * - `data-cursor="Ver"` en cualquier elemento: el punto crece y muestra esa etiqueta («Ver», «Arrastra»…);
 * - `data-cursor="hide"`: se oculta (útil sobre vídeos o mapas);
 * - enlaces y botones: el punto crece; campos de texto: se convierte en una barra fina.
 * No existe en táctil ni con `prefers-reduced-motion`, y no sustituye al cursor del sistema salvo con `hideNative`.
 * Solo se monta si el equipo tiene puntero fino y hover.
 */
export default function CustomCursor({ cursorSize = 14, follow = 0.18, blend = "difference", hideNative = false, className = "" }: CustomCursorProps) {
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
    const setMode = (target: EventTarget | null) => {
      const t = target instanceof Element ? target : null;
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
