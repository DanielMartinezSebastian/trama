"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { pinProgress, trackScroll } from "@/lib/motion/progress";
import { resolveFeel, seguidorRaf, tramo, type ScrollFeelName } from "@/lib/motion/scroll-feel";

export type ScrollExpandProps = {
  /** el medio que crece: vídeo, imagen, un lienzo 3D… (llena la tarjeta con `object-fit: cover`) */
  children: ReactNode;
  /** contenido encima del medio (un titular, «PLAY REEL»); crece con la tarjeta */
  overlay?: ReactNode;
  /** pantallas de scroll que dura la sección fijada */
  length?: number;
  /** tamaño inicial de la tarjeta: ancho y alto en cualquier unidad CSS */
  from?: { width: string; height: string };
  /** desplazamiento inicial del centro de la tarjeta respecto al centro de la pantalla */
  offset?: { x: string; y: string };
  /** margen alrededor de la tarjeta al final (px); 0 = a sangre */
  inset?: number;
  /** radio de las esquinas al principio y al final (px) */
  radius?: [number, number];
  /** inclinación inicial en grados (la tarjeta llega de lado, como un plano en 3D, y se endereza al crecer) */
  tilt?: number;
  /** sensación (meseta, curva y amortiguado, docs/42); por defecto, la de la página */
  feel?: ScrollFeelName;
  className?: string;
};

/**
 * Una tarjeta de medios que crece con el scroll, de pequeña a pantalla completa, mientras la sección se queda fija: el
 * reel de lusion.co, que sale de una tarjeta del texto y acaba a sangre, o la tableta que se convierte en la escena.
 * Llega inclinada como un plano en 3D y se endereza al crecer. Todo se interpola en CSS a partir de un solo avance
 * (`--se-t`), con la tubería de scroll del kit: meseta, curva y seguimiento amortiguado (docs/42). Sin WebGL. Con
 * movimiento reducido, la tarjeta ya está crecida.
 */
export default function ScrollExpand({ children, overlay, length = 2, from = { width: "34vw", height: "21vw" }, offset = { x: "0px", y: "0px" }, inset = 24, radius = [18, 18], tilt = 14, feel, className = "" }: ScrollExpandProps) {
  const outer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = outer.current;
    if (!el) return;
    const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (quieto) {
      el.style.setProperty("--se-t", "1");
      return;
    }
    const f = resolveFeel(feel);
    const t = seguidorRaf(f.damp.pose, (v) => el.style.setProperty("--se-t", v.toFixed(4)));
    // la tarjeta crece en el primer 80 % del recorrido y se queda a sangre el resto
    const stop = trackScroll(el, (r, vh) => t.set(tramo(Math.min(1, pinProgress(r, vh) / 0.8), f.plateau * 0.5, f.curve)));
    return () => {
      stop();
      t.stop();
    };
  }, [feel]);
  return (
    <div
      ref={outer}
      className={`ui-pin ui-sxp ${className}`.trim()}
      style={{ "--pin-len": length, "--se-t": 0, "--se-w0": from.width, "--se-h0": from.height, "--se-x0": offset.x, "--se-y0": offset.y, "--se-in": `${inset}px`, "--se-r0": `${radius[0]}px`, "--se-r1": `${radius[1]}px`, "--se-tilt": `${tilt}deg` } as CSSProperties}
    >
      <div className="ui-pin__in ui-sxp__stage">
        <div className="ui-sxp__card">
          <div className="ui-sxp__media">{children}</div>
          {overlay && <div className="ui-sxp__overlay">{overlay}</div>}
        </div>
      </div>
    </div>
  );
}
