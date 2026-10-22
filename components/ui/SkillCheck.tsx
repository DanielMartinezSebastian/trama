"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "@/lib/ui/useReducedMotion";

export const SKILLCHECK_SHAPES = ["bar", "ring"] as const;
export type SkillCheckShape = (typeof SKILLCHECK_SHAPES)[number];

export type SkillCheckProps = {
  /** aciertos seguidos que hacen falta para completarlo */
  rounds?: number;
  /** vueltas (anillo) o pasadas (barra) por segundo de la aguja; sube un 15 % con cada acierto */
  speed?: number;
  /** tamaño de la zona buena, en fracción del recorrido (0–1) */
  zone?: number;
  /** bar = la aguja va y vuelve por una barra · ring = da vueltas a un anillo (como forzar una cerradura) */
  shape?: SkillCheckShape;
  /** un fallo devuelve el progreso a cero */
  resetOnMiss?: boolean;
  /** texto del botón (también se dispara con Espacio o Enter con el foco dentro) */
  actionLabel?: string;
  /** con `true` también escucha Espacio en toda la página (para un juego a pantalla completa) */
  globalKey?: boolean;
  /** parado: la aguja no se mueve y no se puede pulsar */
  disabled?: boolean;
  /** cambia la clave para empezar de nuevo */
  resetKey?: string | number;
  onHit?: (round: number) => void;
  onMiss?: () => void;
  onComplete?: () => void;
  /** nombre accesible del minijuego */
  label?: string;
  className?: string;
  style?: CSSProperties;
};

/**
 * Un minijuego de **precisión** («skill check»): una aguja recorre una barra o un anillo y hay que pulsar cuando pasa por
 * la zona buena. Tras cada acierto la zona cambia de sitio y la aguja acelera; con `rounds` aciertos, `onComplete`. Sirve
 * para forzar una cerradura, cargar un golpe, un «rasca y gana» con habilidad o una promoción con juego.
 *
 * Se juega con clic o toque en el botón, o con Espacio o Enter con el foco dentro (`globalKey` para toda la página). La
 * aguja se mueve escribiendo en el DOM (sin re-renderizar). Con movimiento reducido va a la mitad de velocidad. Colores de
 * los tokens (`--acc` la zona y los aciertos, `--fg` la aguja).
 */
export default function SkillCheck({
  rounds = 3,
  speed = 0.8,
  zone = 0.16,
  shape = "ring",
  resetOnMiss = false,
  actionLabel = "¡Ahora!",
  globalKey = false,
  disabled = false,
  resetKey,
  onHit,
  onMiss,
  onComplete,
  label = "Minijuego de precisión",
  className = "",
  style,
}: SkillCheckProps) {
  const reduced = useReducedMotion();
  const [round, setRound] = useState(0);
  const [flash, setFlash] = useState<"" | "hit" | "miss">("");
  const [zoneAt, setZoneAt] = useState(0.55);
  const pos = useRef(0);
  const dir = useRef(1);
  const needle = useRef<HTMLSpanElement>(null);
  const done = round >= rounds;
  const cb = useRef({ onHit, onMiss, onComplete });
  cb.current = { onHit, onMiss, onComplete };

  useEffect(() => {
    setRound(0);
    setFlash("");
    setZoneAt(0.55);
    pos.current = 0;
  }, [resetKey]);

  // la aguja: barra = va y vuelve (0→1→0), anillo = da vueltas (0→1 y otra vez)
  useEffect(() => {
    if (disabled || done) return;
    let raf = 0;
    let last = performance.now();
    const v = speed * Math.pow(1.15, round) * (reduced ? 0.5 : 1);
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (shape === "ring") pos.current = (pos.current + dt * v) % 1;
      else {
        pos.current += dt * v * 2 * dir.current;
        if (pos.current > 1) {
          pos.current = 2 - pos.current;
          dir.current = -1;
        } else if (pos.current < 0) {
          pos.current = -pos.current;
          dir.current = 1;
        }
      }
      const el = needle.current;
      if (el) el.style.setProperty("--p", pos.current.toFixed(4));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [disabled, done, speed, round, shape, reduced]);

  const press = useCallback(() => {
    if (disabled || done) return;
    const p = pos.current, a = zoneAt - zone / 2, b = zoneAt + zone / 2;
    // en el anillo la zona puede cruzar el cero
    const inside = shape === "ring" ? [p, p + 1, p - 1].some((x) => x >= a && x <= b) : p >= a && p <= b;
    if (inside) {
      const next = round + 1;
      setRound(next);
      setFlash("hit");
      cb.current.onHit?.(next);
      if (next >= rounds) cb.current.onComplete?.();
      // la zona salta lejos de la aguja
      setZoneAt(((p + 0.35 + Math.random() * 0.3) % 1) * (1 - zone) + zone / 2);
    } else {
      setFlash("miss");
      cb.current.onMiss?.();
      if (resetOnMiss) setRound(0);
    }
  }, [disabled, done, zoneAt, zone, shape, round, rounds, resetOnMiss]);

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(""), 380);
    return () => clearTimeout(t);
  }, [flash, round]);

  useEffect(() => {
    if (!globalKey) return;
    const key = (e: KeyboardEvent) => {
      if (e.code !== "Space" || e.repeat) return;
      const t = e.target as HTMLElement | null;
      if (t && /^(INPUT|TEXTAREA|SELECT|BUTTON|A)$/.test(t.tagName)) return;
      e.preventDefault();
      press();
    };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, [globalKey, press]);

  const status = done ? "Completado" : flash === "hit" ? `Acierto ${round} de ${rounds}` : flash === "miss" ? "Fallo" : `${round} de ${rounds}`;
  return (
    <div
      className={`ui-skill ui-skill--${shape} ${flash ? `is-${flash}` : ""} ${done ? "is-done" : ""} ${className}`.trim()}
      style={{ ...style, "--z": zone, "--za": zoneAt } as CSSProperties}
      role="group"
      aria-label={label}
    >
      <div className="ui-skill__track" aria-hidden onPointerDown={(e) => {
          e.preventDefault();
          press();
        }}>
        {shape === "ring" ? (
          <svg viewBox="0 0 100 100" className="ui-skill__ring">
            <circle cx="50" cy="50" r="42" className="ui-skill__base" pathLength={1} />
            <circle cx="50" cy="50" r="42" className="ui-skill__zone" pathLength={1} style={{ strokeDasharray: `${zone} ${1 - zone}`, strokeDashoffset: -(zoneAt - zone / 2) }} />
          </svg>
        ) : (
          <span className="ui-skill__zonebar" />
        )}
        <span className="ui-skill__needle" ref={needle} />
      </div>
      <div className="ui-skill__foot">
        <span className="ui-skill__pips" aria-hidden>
          {Array.from({ length: rounds }, (_, i) => (
            <i key={i} className={i < round ? "is-on" : ""} />
          ))}
        </span>
        <button type="button" className="ui-skill__btn" onClick={press} disabled={disabled || done}>
          {actionLabel}
        </button>
      </div>
      <span className="ui-sr" aria-live="polite">{status}</span>
    </div>
  );
}
