"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { themeSnapshot } from "@/lib/ui/themeSnapshot";
import { vcls, type Variant } from "./variants";

export type LinkPreviewProps = {
  /** Destino del enlace y de la vista en vivo. La web debe permitir su inclusión en un iframe. */
  href: string;
  /** Texto del enlace cuando no se proporciona children. */
  label?: string;
  /** Pie de la miniatura; una cadena vacía lo oculta. */
  title?: string;
  mode?: "live" | "image";
  /** URL de la miniatura estática, usada con mode="image". */
  image?: string;
  /** Anchura máxima de la miniatura en píxeles; se ajusta a la ventana. */
  width?: number;
  /** Espera antes de cargar la miniatura, en milisegundos. */
  delay?: number;
  /** Resolución de la página en vivo y proporción de la miniatura. */
  viewportWidth?: number;
  viewportHeight?: number;
  variant?: Variant;
  loadingLabel?: string;
  errorLabel?: string;
  /** Enlace propio, incluido next/link. No se añade otra parada de tabulador. */
  children?: ReactNode;
  className?: string;
};

const OPEN_EVENT = "trama:link-preview-open";
type Placement = { left: number; top: number; width: number; height: number; theme: CSSProperties };

/** Miniatura decorativa bajo demanda, con el tema del disparador y sin capturar clics ni foco. */
export default function LinkPreview({
  href, label = "Ver página", title = "", mode = "live", image = "", width = 360, delay = 240,
  viewportWidth = 1280, viewportHeight = 800, variant = "outline",
  loadingLabel = "Cargando vista previa…", errorLabel = "Abre el enlace para ver la página",
  children, className = "",
}: LinkPreviewProps) {
  const root = useRef<HTMLSpanElement>(null);
  const [request, setRequest] = useState<{ x: number; y: number } | null>(null);
  const [placement, setPlacement] = useState<Placement | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const close = useCallback(() => { setRequest(null); setPlacement(null); }, []);
  const vw = Math.max(1, viewportWidth);
  const vh = Math.max(1, viewportHeight);

  useEffect(() => {
    if (!request || !root.current) return;
    // Cierra otra miniatura abierta mediante teclado o con su retardo pendiente.
    window.dispatchEvent(new Event(OPEN_EVENT));
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") close(); };
    window.addEventListener(OPEN_EVENT, close);
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    const timer = window.setTimeout(() => {
      if (!root.current) return;
      const captionHeight = title ? 38 : 0;
      const w = Math.max(1, Math.min(Math.max(1, width), window.innerWidth - 32, (window.innerHeight - 32 - captionHeight) * vw / vh));
      const h = w * vh / vw;
      const left = request.x + 24 + w <= window.innerWidth - 16 ? request.x + 24 : request.x - w - 24;
      setStatus(mode === "image" && !image ? "error" : "loading");
      setPlacement({
        width: w, height: h,
        left: Math.max(16, Math.min(left, window.innerWidth - w - 16)),
        top: Math.max(16, Math.min(request.y - (h + captionHeight) / 2, window.innerHeight - h - captionHeight - 16)),
        theme: themeSnapshot(root.current),
      });
    }, Math.max(0, delay));
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(OPEN_EVENT, close);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [request, close, width, delay, vw, vh, title, mode, image, href]);

  return (
    <>
      <span
        ref={root}
        className={`ui-link-preview ${className}`}
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse" && window.matchMedia("(hover: hover) and (pointer: fine)").matches) setRequest({ x: event.clientX, y: event.clientY });
        }}
        onPointerLeave={close}
        onFocus={(event) => {
          if (event.target.matches(":focus-visible")) {
            const rect = event.target.getBoundingClientRect();
            setRequest({ x: rect.right - 24, y: rect.bottom });
          }
        }}
        onBlur={close}
        onClick={close}
      >
        {children ?? <a href={href}>{label}</a>}
      </span>
      {placement && createPortal(
        <div
          className={`ui-link-preview__panel ${vcls(variant)} ui-surface`}
          style={{ ...placement.theme, left: placement.left, top: placement.top, width: placement.width }}
          aria-hidden="true"
        >
          <div className="ui-link-preview__viewport" style={{ height: placement.height }}>
            {status !== "ready" && <span className="ui-link-preview__status">{status === "error" ? errorLabel : loadingLabel}</span>}
            {mode === "image" ? image && (
              <img key={image} src={image} alt="" className={`ui-link-preview__image ${status === "ready" ? "is-ready" : ""}`} onLoad={() => setStatus("ready")} onError={() => setStatus("error")} />
            ) : (
              <iframe
                key={href} src={href} title={title || label} tabIndex={-1} inert
                sandbox="allow-scripts allow-same-origin" allow="autoplay 'none'"
                className={status === "ready" ? "is-ready" : undefined}
                style={{ width: vw, height: vh, transform: `scale(${placement.width / vw})` }}
                onLoad={() => setStatus("ready")} onError={() => setStatus("error")}
              />
            )}
          </div>
          {title && <div className="ui-link-preview__caption"><span>{title}</span><span>↗</span></div>}
        </div>, document.body,
      )}
    </>
  );
}
