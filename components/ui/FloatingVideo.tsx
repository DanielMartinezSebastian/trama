"use client";

import { createPortal } from "react-dom";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { seguidorRaf } from "@/lib/motion/scroll-feel";
import { useReducedMotion } from "@/lib/ui/useReducedMotion";

export type FloatingVideoProps = {
  /** vídeo en bucle, mudo, de la miniatura (y el que se abre si no hay `fullSrc`) */
  src: string;
  /** vídeo que se abre al pulsar (con sonido y controles); por defecto, `src` */
  fullSrc?: string;
  poster?: string;
  /** etiqueta en mono sobre la miniatura («BEHIND THE SCENES») */
  label?: string;
  /** texto pequeño a la derecha de la etiqueta (una duración, «0:42») */
  caption?: string;
  /** nombre accesible del botón y del diálogo */
  title?: string;
  /** ancho de la miniatura en cualquier unidad CSS (el alto sale de `ratio`) */
  width?: string;
  ratio?: "16/9" | "4/3" | "1/1" | "9/16";
  /** inclinación de reposo en grados: la miniatura flota ladeada y se endereza al pasar el ratón */
  tilt?: number;
  /** px que la miniatura persigue al cursor (0 = quieta) */
  follow?: number;
  className?: string;
  style?: CSSProperties;
};

/** «16/9» → 1,78 (el CSS no puede dividir la proporción para acotar el alto de la capa abierta) */
const proporcion = (r: string) => {
  const [a, b] = r.split("/").map(Number);
  return a / b;
};

type Caja = { x: number; y: number; w: number; h: number };

/**
 * Un vídeo flotante: una miniatura ladeada que se mece sola y persigue un poco al cursor, como un objeto suelto sobre la
 * página, y que solo crece si se pulsa. Al pulsarla viaja desde su sitio al centro (FLIP: la capa abierta sale de la caja
 * de la miniatura) y se oye; Escape, el botón o pulsar fuera la devuelven a su sitio. El clip abierto sigue donde iba la
 * miniatura. Sin dependencias; con movimiento reducido no se mece ni viaja.
 */
export default function FloatingVideo({ src, fullSrc, poster, label = "Behind the scenes", caption = "", title = "Ver el vídeo", width = "min(320px, 60vw)", ratio = "16/9", tilt = -6, follow = 18, className = "", style }: FloatingVideoProps) {
  const reduced = useReducedMotion();
  const raiz = useRef<HTMLDivElement>(null);
  const mini = useRef<HTMLVideoElement>(null);
  const grande = useRef<HTMLVideoElement>(null);
  const cerrar = useRef<HTMLButtonElement>(null);
  const boton = useRef<HTMLButtonElement>(null);
  // null: cerrado · desde: la caja de la miniatura · abierto: ya en el centro
  const [capa, setCapa] = useState<{ desde: Caja; abierto: boolean } | null>(null);

  // persigue al cursor con el seguidor amortiguado del kit
  useEffect(() => {
    const el = raiz.current;
    if (!el || reduced || !follow) return;
    const sx = seguidorRaf(4, (v) => el.style.setProperty("--fv-x", `${v.toFixed(2)}px`));
    const sy = seguidorRaf(4, (v) => el.style.setProperty("--fv-y", `${v.toFixed(2)}px`));
    const mover = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / innerWidth, dy = (e.clientY - (r.top + r.height / 2)) / innerHeight;
      sx.set(Math.max(-1, Math.min(1, dx * 2)) * follow);
      sy.set(Math.max(-1, Math.min(1, dy * 2)) * follow);
    };
    addEventListener("pointermove", mover, { passive: true });
    return () => {
      removeEventListener("pointermove", mover);
      sx.stop();
      sy.stop();
    };
  }, [reduced, follow]);

  const abrir = () => {
    const r = boton.current!.getBoundingClientRect();
    setCapa({ desde: { x: r.left, y: r.top, w: r.width, h: r.height }, abierto: reduced });
  };
  const volver = useCallback(() => {
    if (reduced) return setCapa(null);
    setCapa((c) => (c ? { ...c, abierto: false } : c));
  }, [reduced]);

  // al montar la capa: el clip sigue donde iba la miniatura y viaja al centro en el fotograma siguiente
  useEffect(() => {
    if (!capa) return;
    if (grande.current && mini.current && !fullSrc) grande.current.currentTime = mini.current.currentTime;
    if (capa.abierto) return;
    let id = requestAnimationFrame(() => (id = requestAnimationFrame(() => setCapa((c) => (c && !c.abierto ? { ...c, abierto: true } : c)))));
    return () => cancelAnimationFrame(id);
    // solo al abrir (desde cambia)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [capa?.desde]);
  useEffect(() => {
    if (!capa?.abierto) return;
    cerrar.current?.focus();
    grande.current?.play().catch(() => {});
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && volver();
    addEventListener("keydown", tecla);
    return () => removeEventListener("keydown", tecla);
  }, [capa?.abierto, volver]);

  // al volver, la capa se desmonta cuando acaba el viaje
  const finViaje = () => {
    if (capa && !capa.abierto) {
      setCapa(null);
      boton.current?.focus();
    }
  };

  const d = capa?.desde;
  return (
    <div ref={raiz} className={`ui-fvid ${reduced ? "is-still" : ""} ${className}`.trim()} style={{ ...style, "--fv-w": width, "--fv-ar": ratio, "--fv-tilt": `${tilt}deg` } as CSSProperties}>
      <button ref={boton} type="button" className="ui-fvid__mini" onClick={abrir} aria-label={title} aria-haspopup="dialog" style={{ visibility: capa ? "hidden" : undefined }}>
        <video ref={mini} src={src} poster={poster} muted loop playsInline autoPlay preload="metadata" aria-hidden />
        <span className="ui-fvid__play" aria-hidden>
          <svg viewBox="0 0 24 24">
            <path d="M8.5 5.8v12.4a.6.6 0 0 0 .9.5l9.8-6.2a.6.6 0 0 0 0-1L9.4 5.3a.6.6 0 0 0-.9.5Z" />
          </svg>
        </span>
        {(label || caption) && (
          <span className="ui-fvid__label" aria-hidden>
            <span>
              <i />
              {label}
            </span>
            {caption && <span>{caption}</span>}
          </span>
        )}
      </button>
      {capa &&
        d &&
        createPortal(
        <div className={`ui-fvid__layer ${capa.abierto ? "is-open" : ""}`} style={{ "--fv-ar": ratio, "--fv-k": proporcion(ratio) } as CSSProperties} role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.target === e.currentTarget && volver()}>
          <div className="ui-fvid__full" style={{ "--x0": `${d.x}px`, "--y0": `${d.y}px`, "--w0": `${d.w}px`, "--h0": `${d.h}px` } as CSSProperties} onTransitionEnd={(e) => e.target === e.currentTarget && e.propertyName === "width" && finViaje()}>
            <video ref={grande} src={fullSrc || src} poster={poster} playsInline loop controls={capa.abierto} />
          </div>
          <button ref={cerrar} type="button" className="ui-fvid__close" onClick={volver} aria-label="Cerrar">
            ×
          </button>
        </div>,
          document.body,
        )}
    </div>
  );
}
