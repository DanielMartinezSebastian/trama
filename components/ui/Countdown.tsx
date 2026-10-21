"use client";

import { useEffect, useState } from "react";
import { vcls, type Variant } from "./variants";

export type CountdownProps = {
  /** fecha y hora de destino, ISO con zona horaria (p. ej. `2026-10-31T21:00:00+01:00`) */
  to: string;
  /** unidades que se ven: días, horas, minutos y segundos (dhms) o sin segundos (dhm) */
  units?: "dhms" | "dhm";
  /** texto encima de las cifras («Faltan») */
  label?: string;
  /** texto al llegar a cero («Ya ha empezado») */
  done?: string;
  size?: "sm" | "md" | "lg";
  variant?: Variant;
  className?: string;
};

const NAMES = { d: ["día", "días"], h: ["hora", "horas"], m: ["minuto", "minutos"], s: ["segundo", "segundos"] } as const;

function parts(ms: number) {
  const t = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(t / 86400), h: Math.floor((t % 86400) / 3600), m: Math.floor((t % 3600) / 60), s: t % 60 };
}

/**
 * Cuenta atrás hasta una fecha (lanzamientos, eventos, rebajas). Las cifras cambian con un pequeño desplazamiento vertical;
 * se calcula en el navegador (en el servidor y antes de hidratar salen guiones, sin desajustes) y se apaga al llegar a cero,
 * donde enseña `done`. Accesible: `role="timer"` con la fecha en un `<time>`; el texto para lectores de pantalla se
 * actualiza cada minuto, no cada segundo, para no saturarlos. Con movimiento reducido, sin animación.
 */
export default function Countdown({ to, units = "dhms", label = "Faltan", done = "Ya ha empezado", size = "md", variant = "minimal", className = "" }: CountdownProps) {
  const target = new Date(to).getTime();
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    // se alinea con el cambio de segundo para que todas las cifras salten a la vez
    let id = 0;
    const t = window.setTimeout(() => {
      setNow(Date.now());
      id = window.setInterval(() => setNow(Date.now()), 1000);
    }, 1000 - (Date.now() % 1000));
    return () => {
      clearTimeout(t);
      clearInterval(id);
    };
  }, []);
  const left = now === null ? null : target - now;
  const p = left === null ? null : parts(left);
  const keys = (units === "dhm" ? ["d", "h", "m"] : ["d", "h", "m", "s"]) as (keyof typeof NAMES)[];
  const finished = left !== null && left <= 0;
  // para lectores de pantalla: al minuto
  const spoken = p ? keys.filter((k) => k !== "s").map((k) => `${p[k]} ${NAMES[k][p[k] === 1 ? 0 : 1]}`).join(", ") : "";

  return (
    <div className={`ui-count ui-count--${size} ${vcls(variant)} ${className}`.trim()} role="timer" data-done={finished ? "" : undefined}>
      {label && !finished && <p className="ui-count__label">{label}</p>}
      {finished ? (
        <p className="ui-count__done">{done}</p>
      ) : (
        <>
          <span className="ui-count__row" aria-hidden>
            {keys.map((k) => {
              const v = p ? String(p[k]).padStart(2, "0") : "--";
              return (
                <span key={k} className="ui-count__cell">
                  <span className="ui-count__num">
                    {/* la clave cambia con el valor: cada cifra nueva entra con su animación */}
                    <span key={v} className="ui-count__v">{v}</span>
                  </span>
                  <span className="ui-count__u">{NAMES[k][1]}</span>
                </span>
              );
            })}
          </span>
          {/* la fecha legible depende de la zona horaria del navegador: solo en el cliente (sin desajustes al hidratar) */}
          {now !== null && (
            <span className="ui-sr">
              {label} {spoken} para el <time dateTime={to}>{new Date(to).toLocaleString("es-ES", { dateStyle: "long", timeStyle: "short" })}</time>
            </span>
          )}
        </>
      )}
    </div>
  );
}
