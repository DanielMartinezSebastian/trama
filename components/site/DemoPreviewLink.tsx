"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ComponentProps } from "react";
import { createPortal } from "react-dom";
import { SITE_STYLE } from "./theme";

type Props = Omit<ComponentProps<typeof Link>, "href"> & { href: string; previewTitle: string };
type Position = { left: number; top: number; width: number };

/** Carga una sola página al detenerse sobre un enlace; salir destruye su iframe y sus animaciones. */
export default function DemoPreviewLink({ href, previewTitle, children, ...props }: Props) {
  const [position, setPosition] = useState<Position | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const close = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setPosition(null);
  };

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  useEffect(() => {
    if (!position) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [position]);

  const open = (x: number, y: number) => {
    close();
    const width = Math.min(360, window.innerWidth - 32);
    const height = width * 0.625 + 38;
    const left = x + 24 + width <= window.innerWidth - 16 ? x + 24 : x - width - 24;
    const next = {
      width,
      left: Math.max(16, Math.min(left, window.innerWidth - width - 16)),
      top: Math.max(16, Math.min(y - height / 2, window.innerHeight - height - 16)),
    };
    timer.current = setTimeout(() => {
      setReady(false);
      setFailed(false);
      setPosition(next);
    }, 240);
  };

  return (
    <>
      <Link
        {...props}
        href={href}
        prefetch={false}
        onPointerEnter={(event) => {
          props.onPointerEnter?.(event);
          if (event.pointerType === "mouse" && window.matchMedia("(hover: hover) and (pointer: fine)").matches) open(event.clientX, event.clientY);
        }}
        onPointerLeave={(event) => { props.onPointerLeave?.(event); close(); }}
        onFocus={(event) => {
          props.onFocus?.(event);
          if (event.currentTarget.matches(":focus-visible")) {
            const rect = event.currentTarget.getBoundingClientRect();
            open(rect.right - 24, rect.bottom);
          }
        }}
        onBlur={(event) => { props.onBlur?.(event); close(); }}
        onClick={(event) => { props.onClick?.(event); close(); }}
      >
        {children}
      </Link>
      {position && createPortal(
        <div className="tr-demo-preview" style={{ ...SITE_STYLE, left: position.left, top: position.top, width: position.width }} aria-hidden="true">
          <div className="tr-demo-preview__viewport" style={{ height: position.width * 0.625 }}>
            {!ready && <span className="tr-demo-preview__status">{failed ? "Abre la demo para verla" : "Cargando vista previa…"}</span>}
            <iframe
              src={href}
              title={`Vista previa de ${previewTitle}`}
              tabIndex={-1}
              inert
              sandbox="allow-scripts allow-same-origin"
              allow="autoplay 'none'"
              className={ready ? "is-ready" : undefined}
              style={{ transform: `scale(${position.width / 1280})` }}
              onLoad={() => setReady(true)}
              onError={() => setFailed(true)}
            />
          </div>
          <div className="tr-demo-preview__caption"><span>{previewTitle}</span><span>↗</span></div>
        </div>,
        document.body,
      )}
    </>
  );
}
