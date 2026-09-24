"use client";

import { useEffect, useState } from "react";
import { vcls, type Variant } from "./variants";

export type ToggleProps = {
  label?: string;
  defaultChecked?: boolean;
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  /** textos de los estilos retro y terminal, que no dibujan la pista */
  onText?: string;
  offText?: string;
  className?: string;
};

/** Interruptor accesible (`role="switch"`). Retro y terminal lo muestran como texto `[ON ]`/`[OFF]`. */
export default function Toggle({ label = "Notificaciones", defaultChecked = true, variant = "glass", size = "md", onText = "ON ", offText = "OFF", className = "" }: ToggleProps) {
  const [on, setOn] = useState(defaultChecked);
  useEffect(() => setOn(defaultChecked), [defaultChecked]);
  return (
    <button type="button" role="switch" aria-checked={on} onClick={() => setOn((v) => !v)} className={`ui-toggle ui-toggle--${size} ${on ? "is-on" : ""} ${vcls(variant)} ${className}`}>
      <span className="ui-toggle__track" aria-hidden>
        <span className="ui-toggle__thumb" />
      </span>
      <span className="ui-toggle__text" aria-hidden>
        [{on ? onText : offText}]
      </span>
      {label && <span>{label}</span>}
    </button>
  );
}
