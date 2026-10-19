"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { whenIntroDone } from "@/lib/motion/intro";

export type ImageRevealProps = {
  src: string;
  /** texto alternativo (vacío = decorativa) */
  alt?: string;
  /** relación de aspecto «ancho / alto» fija: reserva el hueco y evita saltos de maquetación */
  ratio?: string;
  /** lado desde el que se abre la máscara */
  from?: "bottom" | "top" | "left" | "right" | "center";
  /** la imagen arranca ampliada y se asienta mientras se abre */
  zoom?: number;
  duration?: number;
  delay?: number;
  once?: boolean;
  className?: string;
};

const CLIP: Record<NonNullable<ImageRevealProps["from"]>, string> = {
  bottom: "inset(100% 0 0 0)",
  top: "inset(0 0 100% 0)",
  left: "inset(0 100% 0 0)",
  right: "inset(0 0 0 100%)",
  center: "inset(50% 50% 50% 50%)",
};

/**
 * Imagen que se descubre con una máscara (`clip-path`) mientras la propia imagen se asienta de una ampliación a su tamaño.
 * Espera al `Preloader` si lo hay. Reserva su hueco con `ratio`, carga diferida y sin JS o con `prefers-reduced-motion` se
 * ve ya abierta. El estado cerrado viene en el HTML del servidor (sin parpadeo).
 */
export default function ImageReveal({ src, alt = "", ratio = "4 / 5", from = "bottom", zoom = 1.25, duration = 1.2, delay = 0, once = true, className = "" }: ImageRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let io: IntersectionObserver | undefined;
    const cancel = whenIntroDone(() => {
      io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            el.setAttribute("data-in", "");
            if (once) io?.disconnect();
          } else if (!once) el.removeAttribute("data-in");
        },
        { threshold: 0.2 },
      );
      io.observe(el);
    });
    return () => {
      cancel();
      io?.disconnect();
    };
  }, [once]);
  return (
    <div
      ref={ref}
      data-armed=""
      className={`ui-imgr ${className}`.trim()}
      style={{ "--imgr-ratio": ratio, "--imgr-clip": CLIP[from], "--imgr-zoom": zoom, "--imgr-dur": `${duration}s`, "--imgr-delay": `${delay}s` } as CSSProperties}
    >
      {/* el recorte va en un hijo: Chrome tiene en cuenta el clip-path del propio elemento observado y un contenedor cerrado nunca «entraría» */}
      <div className="ui-imgr__clip">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="ui-imgr__img" src={src} alt={alt} loading="lazy" decoding="async" />
      </div>
    </div>
  );
}
