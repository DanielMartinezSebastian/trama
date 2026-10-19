"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { lockScroll } from "@/lib/motion/lenis";

export type EntryGateAction = {
  label: string;
  /** valor que recibe `onChoose` */
  value: string;
  /** si lleva `href` es un enlace (p. ej. «No» → otra web) y no cierra la pantalla */
  href?: string;
  /** botón principal (recibe el foco al abrir) */
  primary?: boolean;
};

export type EntryGateProps = {
  /** titular (display) */
  title: ReactNode;
  /** línea pequeña bajo el titular */
  text?: string;
  /** marca o símbolo sobre el titular */
  mark?: ReactNode;
  actions: EntryGateAction[];
  /** se llama al elegir (antes de cerrar) */
  onChoose?: (value: string) => void;
  /** guarda la elección en `sessionStorage` con esta clave y no vuelve a mostrarse en la sesión */
  storageKey?: string;
  /** tono: «sound» (entrar con o sin sonido) · «age» (mayoría de edad) · «plain» */
  variant?: "sound" | "age" | "plain";
  className?: string;
};

/**
 * Pantalla de entrada a pantalla completa: «Entrar con sonido / sin sonido» (Overworld Audio) o «¿Eres mayor de edad?»
 * (Santioni Spirits). Es un diálogo modal: bloquea el scroll, atrapa el foco y no se puede saltar con Escape (hay que elegir).
 * Es una elección declarada por la persona, no una verificación de edad: no sustituye a un control legal. Si hay `storageKey`
 * recuerda la respuesta durante la sesión.
 */
export default function EntryGate({ title, text, mark, actions, onChoose, storageKey, variant = "plain", className = "" }: EntryGateProps) {
  const [open, setOpen] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (storageKey && sessionStorage.getItem(storageKey)) setOpen(false);
    } catch {
      /* sin almacenamiento: se muestra siempre */
    }
  }, [storageKey]);

  useEffect(() => {
    if (!open) return;
    const unlock = lockScroll();
    box.current?.querySelector<HTMLElement>("[data-primary], button, a")?.focus();
    return unlock;
  }, [open]);

  const choose = (a: EntryGateAction) => {
    onChoose?.(a.value);
    try {
      if (storageKey) sessionStorage.setItem(storageKey, a.value);
    } catch {
      /* ignorar */
    }
    setLeaving(true);
    window.setTimeout(() => setOpen(false), matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 520);
  };

  // atrapa el foco dentro del diálogo
  const onKey = (e: KeyboardEvent) => {
    if (e.key !== "Tab") return;
    const els = [...(box.current?.querySelectorAll<HTMLElement>("button, a[href]") ?? [])];
    if (!els.length) return;
    const first = els[0];
    const last = els[els.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  if (!open) return null;
  return (
    <div ref={box} className={`ui-gate ui-gate--${variant} ${leaving ? "ui-gate--out" : ""} ${className}`.trim()} role="dialog" aria-modal="true" aria-labelledby="ui-gate-t" onKeyDown={onKey}>
      <div className="ui-gate__in">
        {mark && <div className="ui-gate__mark" aria-hidden>{mark}</div>}
        <h2 id="ui-gate-t" className="ui-gate__t">{title}</h2>
        {text && <p className="ui-gate__p">{text}</p>}
        <div className="ui-gate__acts">
          {actions.map((a) =>
            a.href ? (
              <a key={a.value} className="ui-gate__btn" href={a.href}>{a.label}</a>
            ) : (
              <button key={a.value} type="button" className="ui-gate__btn" data-primary={a.primary ? "" : undefined} onClick={() => choose(a)}>{a.label}</button>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
