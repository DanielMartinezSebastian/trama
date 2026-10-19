"use client";

import { useEffect, useState } from "react";

export type LocalTimeProps = {
  /** zona IANA, p. ej. `Europe/Madrid` */
  timeZone?: string;
  /** texto antes de la hora (ciudad) */
  city?: string;
  /** idioma del formato */
  locale?: string;
  /** muestra los segundos */
  seconds?: boolean;
  className?: string;
};

/** Hora local de una ciudad («Madrid 14:32»), detalle típico de estudios. Se pinta al montar (sin desajuste de hidratación). */
export default function LocalTime({ timeZone = "Europe/Madrid", city = "Madrid", locale = "es-ES", seconds = false, className = "" }: LocalTimeProps) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), seconds ? 1000 : 15000);
    return () => clearInterval(id);
  }, [seconds]);
  let text = seconds ? "--:--:--" : "--:--";
  if (now) {
    try {
      text = new Intl.DateTimeFormat(locale, { timeZone, hour: "2-digit", minute: "2-digit", second: seconds ? "2-digit" : undefined, hour12: false }).format(now);
    } catch {
      /* zona no válida: se deja el marcador */
    }
  }
  return (
    <span className={`ui-ltime ${className}`.trim()}>
      {city ? `${city} ` : ""}
      <time dateTime={now?.toISOString()} suppressHydrationWarning>{text}</time>
    </span>
  );
}
