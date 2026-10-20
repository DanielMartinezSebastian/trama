"use client";

import { useEffect, useState, type ReactNode } from "react";
import Button from "./Button";
import Toggle from "./Toggle";
import { type Variant } from "./variants";

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
  /** esquina o franja (por defecto, abajo a la derecha) */
  position?: "bottom-left" | "bottom-right" | "bottom";
  /** estilo de los botones e interruptores */
  variant?: Variant;
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
 *
 * Es una composición de átomos (`Button`, `Toggle`) con los tokens del tema: para cambiarle el color, redefine `--bg`, `--fg`
 * y `--acc` sobre `.ui-cook` y todo lo de dentro se adapta.
 */
export default function CookieBanner({
  title = "¿Qué te parecen las cookies?",
  text = "Usamos las imprescindibles para que la web funcione. Las de medición y marketing solo si tú quieres.",
  policyHref,
  onChoice,
  storageKey = "ui-cookies",
  position = "bottom-right",
  variant = "minimal",
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
        <div className="ui-cook__cats" role="group" aria-label="Categorías">
          <Toggle label="Necesarias (siempre activas)" checked disabled size="sm" variant={variant} />
          <Toggle label="Medición: cómo se usa la web" checked={an} onChange={setAn} size="sm" variant={variant} />
          <Toggle label="Marketing: anuncios a tu medida" checked={mk} onChange={setMk} size="sm" variant={variant} />
        </div>
      )}
      {/* mismo énfasis y tamaño para todos: rechazar cuesta lo mismo que aceptar */}
      <div className="ui-cook__acts">
        <Button label="Aceptar" emphasis="outline" size="sm" variant={variant} onClick={() => save({ necessary: true, analytics: true, marketing: true })} />
        <Button label="Rechazar" emphasis="outline" size="sm" variant={variant} onClick={() => save({ necessary: true, analytics: false, marketing: false })} />
        {custom ? (
          <Button label="Guardar" emphasis="outline" size="sm" variant={variant} onClick={() => save({ necessary: true, analytics: an, marketing: mk })} />
        ) : (
          <Button label="Personalizar" emphasis="outline" size="sm" variant={variant} onClick={() => setCustom(true)} />
        )}
      </div>
    </section>
  );
}
