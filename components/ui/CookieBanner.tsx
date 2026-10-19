"use client";

import { useEffect, useState, type ReactNode } from "react";

export type CookieChoice = { necessary: true; analytics: boolean; marketing: boolean };

export type CookieBannerProps = {
  title?: ReactNode;
  text?: ReactNode;
  /** enlace a la política de cookies */
  policyHref?: string;
  /** se llama con la elección (aceptar todo, rechazar o personalizada) */
  onChoice?: (c: CookieChoice) => void;
  /** clave de `localStorage` donde se recuerda la elección */
  storageKey?: string;
  /** esquina o franja */
  position?: "bottom-left" | "bottom-right" | "bottom";
  className?: string;
};

const stored = (key: string) => {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as CookieChoice) : null;
  } catch {
    return null;
  }
};

/**
 * Aviso de cookies con la estética de la web (Neutomni). **«Rechazar» pesa igual que «Aceptar»** (mismo tamaño, mismo
 * énfasis): es lo que exige la normativa europea y se comprueba a ojo. Hay vista «Personalizar» con categorías (las necesarias
 * van fijas). No es modal: no bloquea la página. Recuerda la elección en `localStorage`. En una demo no activa ninguna cookie
 * real; quien lo integre debe enlazar `onChoice` con su gestor de consentimiento.
 */
export default function CookieBanner({
  title = "¿Qué te parecen las cookies?",
  text = "Usamos las imprescindibles para que la web funcione. Las de medición y marketing solo si tú quieres.",
  policyHref,
  onChoice,
  storageKey = "ui-cookies",
  position = "bottom-left",
  className = "",
}: CookieBannerProps) {
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState(false);
  const [an, setAn] = useState(false);
  const [mk, setMk] = useState(false);

  useEffect(() => {
    const s = stored(storageKey);
    if (s) onChoice?.(s);
    else setOpen(true);
    // solo al montar
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = (c: CookieChoice) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(c));
    } catch {
      /* ignorar */
    }
    onChoice?.(c);
    setOpen(false);
  };

  if (!open) return null;
  return (
    <section className={`ui-cook ui-cook--${position} ${className}`.trim()} role="region" aria-label="Preferencias de cookies">
      <h2 className="ui-cook__t">{title}</h2>
      <p className="ui-cook__p">
        {text} {policyHref && <a href={policyHref}>Política de cookies</a>}
      </p>
      {custom && (
        <ul className="ui-cook__cats">
          <li><label><input type="checkbox" checked disabled /> Necesarias <small>siempre activas</small></label></li>
          <li><label><input type="checkbox" checked={an} onChange={(e) => setAn(e.target.checked)} /> Medición <small>cómo se usa la web</small></label></li>
          <li><label><input type="checkbox" checked={mk} onChange={(e) => setMk(e.target.checked)} /> Marketing <small>anuncios a tu medida</small></label></li>
        </ul>
      )}
      <div className="ui-cook__acts">
        <button type="button" className="ui-cook__b" onClick={() => save({ necessary: true, analytics: true, marketing: true })}>Aceptar</button>
        <button type="button" className="ui-cook__b" onClick={() => save({ necessary: true, analytics: false, marketing: false })}>Rechazar</button>
        {custom ? (
          <button type="button" className="ui-cook__b" onClick={() => save({ necessary: true, analytics: an, marketing: mk })}>Guardar</button>
        ) : (
          <button type="button" className="ui-cook__b" onClick={() => setCustom(true)}>Personalizar</button>
        )}
      </div>
    </section>
  );
}
