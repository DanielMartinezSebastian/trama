"use client";

import { useEffect, useState, type ReactNode } from "react";
import { vcls, type Variant } from "./variants";

export type ToggleProps = {
  label?: string;
  defaultChecked?: boolean;
  /** modo controlado: si se pasa, manda sobre el estado interno (avisa con `onChange`) */
  checked?: boolean;
  onChange?: (on: boolean) => void;
  disabled?: boolean;
  /** sustituye la pista por otro dibujo (barras de ecualizador, un icono…); el estado va en `aria-checked`/`.is-on`, que el CSS
   * del indicador puede leer */
  indicator?: ReactNode;
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  /** textos de los estilos retro y terminal, que no dibujan la pista */
  onText?: string;
  offText?: string;
  className?: string;
};

/**
 * Interruptor accesible (`role="switch"`). Retro, terminal y dotmatrix lo muestran como texto `[ON ]`/`[OFF]`. Con
 * `indicator` sirve de interruptor de sonido, de modo oscuro, etc. sin crear otro componente.
 */
export default function Toggle({ label = "Notificaciones", defaultChecked = true, checked, onChange, disabled = false, indicator, variant = "glass", size = "md", onText = "ON ", offText = "OFF", className = "" }: ToggleProps) {
  const [own, setOwn] = useState(defaultChecked);
  useEffect(() => setOwn(defaultChecked), [defaultChecked]);
  const on = checked ?? own;
  const flip = () => {
    if (checked === undefined) setOwn(!on);
    onChange?.(!on);
  };
  return (
    <button type="button" role="switch" aria-checked={on} disabled={disabled} onClick={flip} className={`ui-toggle ui-toggle--${size} ${on ? "is-on" : ""} ${indicator ? "ui-toggle--ind" : ""} ${vcls(variant)} ${className}`}>
      {indicator ? (
        <span className="ui-toggle__ind" aria-hidden>{indicator}</span>
      ) : (
        <span className="ui-toggle__track" aria-hidden>
          <span className="ui-toggle__thumb" />
        </span>
      )}
      <span className="ui-toggle__text" aria-hidden>
        [{on ? onText : offText}]
      </span>
      {label && <span>{label}</span>}
    </button>
  );
}
