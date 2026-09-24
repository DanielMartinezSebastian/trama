"use client";

import { useEffect, useMemo, useState } from "react";
import { vcls, type Variant } from "./variants";

export type TerminalTyperProps = {
  /** una línea por renglón; las que empiezan por el prompt se pintan con `--acc2` */
  lines: string;
  /** caracteres por segundo */
  charsPerSecond?: number;
  /** @deprecated usa `charsPerSecond` */
  speed?: number;
  variant?: Variant;
  /** barra superior con botones y título */
  chrome?: boolean;
  title?: string;
  cursor?: "block" | "bar" | "underscore";
  prompt?: string;
  loop?: boolean;
  playKey?: number;
  className?: string;
};

/** Terminal que escribe sola, carácter a carácter. Con movimiento reducido muestra todo de golpe. */
export default function TerminalTyper({
  lines,
  charsPerSecond, speed: legacySpeed,
  variant = "terminal",
  chrome = true,
  title = "zsh — proyecto",
  cursor = "block",
  prompt = "$",
  loop = true,
  playKey = 0,
  className = "",
}: TerminalTyperProps) {
  const speed = charsPerSecond ?? legacySpeed ?? 32;
  const rows = useMemo(() => lines.split("\n"), [lines]);
  const total = useMemo(() => rows.reduce((n, r) => n + r.length + 6, 0), [rows]);
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTyped(total);
      return;
    }
    setTyped(0);
    let raf = 0;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      const n = ((now - start) / 1000) * speed;
      if (n >= total + speed * 1.2) {
        if (loop) start = now;
        else {
          setTyped(total);
          return;
        }
      }
      setTyped(Math.min(total, Math.floor(n)));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [total, speed, loop, playKey]);

  let left = typed;
  return (
    <div className={`ui-term ui-surface ${vcls(variant)} ${className}`}>
      {chrome && (
        <div className="ui-term__bar" aria-hidden>
          <i style={{ background: "#ff5f57" }} />
          <i style={{ background: "#febc2e" }} />
          <i style={{ background: "#28c840" }} />
          <span style={{ marginLeft: 8 }}>{title}</span>
        </div>
      )}
      <pre className="ui-term__body" aria-label={lines}>
        {rows.map((row, i) => {
          const n = Math.max(0, Math.min(row.length, left));
          left -= row.length + 6;
          const active = n > 0 && n < row.length;
          const cls = row.startsWith(prompt) ? "ui-term__cmd" : row.startsWith("[ok]") ? "ui-term__ok" : "";
          return (
            <span key={i} className={`ui-term__line ${cls}`}>
              {row.slice(0, n)}
              {active && <b className={`ui-term__cursor ui-term__cursor--${cursor}`} />}
              {"\n"}
            </span>
          );
        })}
      </pre>
    </div>
  );
}
