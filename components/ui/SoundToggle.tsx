"use client";

import { playSfx, useSfx } from "@/lib/ui/sfx";

export type SoundToggleProps = {
  /** texto con sonido (vacío = solo el icono) */
  onLabel?: string;
  /** texto en silencio */
  offLabel?: string;
  /** nombre accesible (también sin texto) */
  label?: string;
  className?: string;
};

/**
 * Interruptor del **sonido** de la página: silencia o activa los efectos de `lib/ui/sfx` (`playSfx`, `useSfx`) en toda la
 * web y lo recuerda entre visitas. Es un botón con `aria-pressed` (pulsado = con sonido). Al activarlo suena un «blip»: así
 * se oye el volumen y el navegador desbloquea el audio con ese gesto. Colores de los tokens.
 */
export default function SoundToggle({ onLabel = "Sonido", offLabel = "Silencio", label = "Sonido", className = "" }: SoundToggleProps) {
  const { muted, setMuted } = useSfx();
  const on = !muted;
  return (
    <button
      type="button"
      className={`ui-sound ${on ? "is-on" : ""} ${className}`.trim()}
      aria-pressed={on}
      aria-label={label}
      onClick={() => {
        setMuted(on);
        if (!on) playSfx("blip");
      }}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" stroke="none" />
        {on ? <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" /> : <path d="M16 9.5l5 5M21 9.5l-5 5" />}
      </svg>
      {(on ? onLabel : offLabel) && <span>{on ? onLabel : offLabel}</span>}
    </button>
  );
}
