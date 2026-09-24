import type { CSSProperties } from "react";

export type CrtOverlayProps = {
  scanlines?: number;
  vignette?: number;
  flicker?: number;
  /** barra de barrido que recorre la pantalla */
  sweep?: boolean;
  className?: string;
};

/** Capa de efectos de monitor CRT (líneas de barrido, viñeta, parpadeo). Se superpone al contenedor y no bloquea el puntero. */
export default function CrtOverlay({ scanlines = 0.3, vignette = 0.6, flicker = 0.4, sweep = true, className = "" }: CrtOverlayProps) {
  return (
    <div className={`ui-crt ${className}`} style={{ "--scan": scanlines, "--vig": vignette, "--flk": flicker } as CSSProperties} aria-hidden>
      <div className="ui-crt__scan" />
      {flicker > 0 && <div className="ui-crt__flick" />}
      {sweep && <div className="ui-crt__bar" />}
      <div className="ui-crt__vig" />
    </div>
  );
}
