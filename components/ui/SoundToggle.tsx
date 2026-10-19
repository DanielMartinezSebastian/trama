"use client";

import { useEffect, useRef, useState } from "react";

export type SoundToggleProps = {
  /** audio opcional (URL); si no hay, el componente solo informa con `onChange` */
  src?: string;
  /** se llama al cambiar */
  onChange?: (on: boolean) => void;
  /** estado inicial: apagado salvo que quien llama lo cambie por una elección previa */
  defaultOn?: boolean;
  labelOn?: string;
  labelOff?: string;
  /** barras del ecualizador */
  bars?: number;
  className?: string;
};

/**
 * Interruptor de sonido con ecualizador animado (Overworld Audio). **Arranca apagado** y nunca reproduce nada sin que la persona
 * lo pida (el navegador tampoco lo permitiría). Con `src` maneja un `<audio>` en bucle; con `prefers-reduced-motion` las barras
 * se quedan quietas. Es un botón real con `aria-pressed`.
 */
export default function SoundToggle({ src, onChange, defaultOn = false, labelOn = "Sonido: sí", labelOff = "Sonido: no", bars = 4, className = "" }: SoundToggleProps) {
  const [on, setOn] = useState(defaultOn);
  const audio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!src) return;
    if (!audio.current) {
      audio.current = new Audio(src);
      audio.current.loop = true;
    }
    if (on) audio.current.play().catch(() => setOn(false));
    else audio.current.pause();
    return () => audio.current?.pause();
  }, [on, src]);

  const toggle = () => {
    setOn(!on);
    onChange?.(!on);
  };
  return (
    <button type="button" className={`ui-snd ${className}`.trim()} aria-pressed={on} onClick={toggle}>
      <span className="ui-snd__eq" aria-hidden>
        {Array.from({ length: bars }, (_, i) => <i key={i} style={{ animationDelay: `${i * -0.23}s` }} />)}
      </span>
      <span className="ui-snd__t">{on ? labelOn : labelOff}</span>
    </button>
  );
}
