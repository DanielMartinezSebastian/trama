"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { vcls, type Variant } from "./variants";

export type OtpInputProps = {
  length?: number;
  size?: "sm" | "md" | "lg";
  variant?: Variant;
  className?: string;
};

/** Casillas de código de verificación: el foco avanza solo al escribir y retrocede con Retroceso. */
export default function OtpInput({ length = 6, size = "md", variant = "glass", className = "" }: OtpInputProps) {
  const n = Math.max(2, Math.min(8, length));
  const [values, setValues] = useState<string[]>(() => Array(n).fill(""));
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const setAt = (i: number, raw: string) => {
    const c = raw.slice(-1).replace(/[^a-zA-Z0-9]/g, "");
    setValues((prev) => {
      const next = [...prev];
      next[i] = c;
      return next;
    });
    if (c && i < n - 1) refs.current[i + 1]?.focus();
  };
  const onKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !values[i] && i > 0) refs.current[i - 1]?.focus();
  };

  return (
    <div className={`ui-otp ui-otp--${size} ${className}`}>
      {Array.from({ length: n }, (_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className={`ui-otp__box ui-surface ${vcls(variant)}`}
          inputMode="text"
          maxLength={1}
          value={values[i]}
          onChange={(e) => setAt(i, e.target.value)}
          onKeyDown={(e) => onKeyDown(i, e)}
          aria-label={`Dígito ${i + 1} de ${n}`}
        />
      ))}
    </div>
  );
}
